'use client';

interface WatermarkProps {
  sessionId: string;
}

export function Watermark({ sessionId }: WatermarkProps) {
  const timestamp = new Date().toLocaleString();
  const watermarkText = `Session: ${sessionId} • ${timestamp}`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 select-none"
      style={{
        background: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 200px,
          rgba(0, 0, 0, 0.02) 200px,
          rgba(0, 0, 0, 0.02) 400px
        )`,
      }}
    >
      <div className="relative h-full w-full">
        {/* Repeating watermark pattern */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-xs font-mono opacity-5 dark:opacity-10"
            style={{
              top: `${(i * 100) % 150}%`,
              left: `${(i * 250) % 120}%`,
              transform: 'rotate(-45deg)',
              whiteSpace: 'nowrap',
            }}
          >
            {watermarkText}
          </div>
        ))}
      </div>
    </div>
  );
}
