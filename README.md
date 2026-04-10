# $METHANE

Gas-as-a-Service infrastructure for the Fartcoin ecosystem. Turns idle creator fees into leveraged FART exposure via Lavarage.

**Site:** [methane.capital](https://www.methane.capital)

## Architecture

- **Next.js** — site + API routes
- **Lavarage** — spot leverage (real FART token purchases)
- **Pyth** — price oracle
- **Redis** — agent activity logging

## Environment Variables

```
LAVARAGE_API_KEY=...
NEXT_PUBLIC_RPC_URL=...
```

## License

MIT
