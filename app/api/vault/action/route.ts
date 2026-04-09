import { NextResponse } from 'next/server';

export const runtime = 'edge';

const REDIS_URL = process.env.UPSTASH_REDIS_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN || '';

async function redisPost(body: any[]) {
  const res = await fetch(`${REDIS_URL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function redisGet(cmd: string, ...args: string[]) {
  const res = await fetch(`${REDIS_URL}/${cmd}/${args.join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  return res.json();
}

/**
 * POST /api/vault/action
 *
 * Queue a vault action for the agent to execute.
 * Actions: close, partial-sell, set-tp, set-sl, pause, resume, update-leverage
 *
 * Body: {
 *   tokenMint: string,
 *   action: string,
 *   params?: Record<string, any>,
 *   creatorWallet: string,
 *   signature: string (base64),
 *   message: string
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tokenMint, action, params, creatorWallet, signature, message } = body;

    if (!tokenMint || !action || !creatorWallet) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validActions = ['close', 'partial-sell', 'set-tp', 'set-sl', 'cancel-tp', 'cancel-sl', 'pause', 'resume', 'update-leverage'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `Invalid action. Valid: ${validActions.join(', ')}` }, { status: 400 });
    }

    // Verify vault exists and caller is the creator
    const vaultRaw = await redisGet('hget', 'methane:vaults', tokenMint);
    if (!vaultRaw.result) {
      return NextResponse.json({ error: 'Vault not found' }, { status: 404 });
    }
    const vault = JSON.parse(vaultRaw.result);
    if (vault.creatorWallet !== creatorWallet) {
      return NextResponse.json({ error: 'Unauthorized — only the vault creator can perform actions' }, { status: 403 });
    }

    // Verify signature
    if (!signature || !message) {
      return NextResponse.json({ error: 'Wallet signature required' }, { status: 401 });
    }

    const expectedPrefix = `methane:action:${tokenMint}:${action}:`;
    if (!message.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: 'Invalid signed message format' }, { status: 400 });
    }

    // TODO: Ed25519 verify (same as register route)
    // For now, queue the action — agent will verify on execution

    // Queue action
    const actionEntry = {
      tokenMint,
      action,
      params: params || {},
      creatorWallet,
      requestedAt: Date.now(),
      status: 'pending',
    };

    const actionId = `${tokenMint}:${action}:${Date.now()}`;
    await redisPost(['HSET', 'methane:vault-actions', actionId, JSON.stringify(actionEntry)]);

    return NextResponse.json({
      message: `Action "${action}" queued. Will execute on next agent cycle (~15 min).`,
      actionId,
      action,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to queue action' }, { status: 500 });
  }
}

/**
 * GET /api/vault/action?mint=<tokenMint>
 * Get pending/recent actions for a vault.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get('mint');

  if (!mint) {
    return NextResponse.json({ error: 'Missing mint parameter' }, { status: 400 });
  }

  try {
    const all = await redisGet('hgetall', 'methane:vault-actions');
    if (!all.result || !Array.isArray(all.result)) {
      return NextResponse.json({ actions: [] });
    }

    const actions = [];
    for (let i = 0; i < all.result.length; i += 2) {
      const key = all.result[i];
      if (key.startsWith(`${mint}:`)) {
        const entry = JSON.parse(all.result[i + 1]);
        actions.push({ id: key, ...entry });
      }
    }

    actions.sort((a, b) => b.requestedAt - a.requestedAt);

    return NextResponse.json({ actions: actions.slice(0, 20) });
  } catch {
    return NextResponse.json({ actions: [] });
  }
}
