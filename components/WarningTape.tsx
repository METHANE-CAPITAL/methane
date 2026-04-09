export default function WarningTape() {
  return (
    <div className="w-full h-1 bg-repeat-x" style={{
      background: `repeating-linear-gradient(
        -45deg,
        #FFD700,
        #FFD700 8px,
        #000 8px,
        #000 16px
      )`,
      opacity: 0.7,
    }} />
  );
}
