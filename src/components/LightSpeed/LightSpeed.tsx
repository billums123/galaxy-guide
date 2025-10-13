interface LightSpeedProps {
  isActive: boolean;
}

/**
 * LightSpeed component - Hyperspace jump effect with radiating light streaks
 */
export function LightSpeed({ isActive }: LightSpeedProps) {
  if (!isActive) return null;

  return (
    <>
      {/* Light Speed Streaks - Full Screen */}
      <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden">
        {Array.from({ length: 300 }).map((_, i) => {
          const angle = (i * 360) / 300 + Math.random() * 2;
          const delay = Math.random() * 0.15;
          const width = 1 + Math.random() * 2;
          return (
            <div
              key={`streak-${i}`}
              className="absolute"
              style={{
                transform: `rotate(${angle}deg) translateZ(0)`,
                transformOrigin: 'center',
                width: '200vmax',
                height: '200vmax',
                willChange: 'transform',
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 bg-white"
                style={{
                  width: `${width}px`,
                  height: '0px',
                  transform: 'translate(-50%, -50%) translateZ(0)',
                  borderRadius: '1px',
                  animation: `lightSpeedStreak 1.4s ease-in ${delay}s forwards`,
                  filter: `blur(${width * 0.3}px)`,
                  willChange: 'height, opacity',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes lightSpeedStreak {
          0% {
            height: 50px;
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          40% {
            height: 80vmax;
            opacity: 1;
          }
          100% {
            height: 200vmax;
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

