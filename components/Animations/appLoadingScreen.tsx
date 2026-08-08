"use client";


export default function AppLoadingScreen() {
  return (
    <div className="fixed inset-0 z-999 flex flex-col items-center justify-center overflow-hidden bg-[#0a0118]">
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.45; transform: scale(0.92); }
          50% { opacity: 0.8; transform: scale(1.06); }
        }
        @keyframes waveBar {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerText {
          0% { background-position: -160% 0; }
          100% { background-position: 160% 0; }
        }
        .loading-glow { animation: glowPulse 2.4s ease-in-out infinite; }
        .loading-vinyl { animation: vinylSpin 6s linear infinite; }
        .loading-bar { animation: waveBar 1.1s ease-in-out infinite; transform-origin: center; }
        .loading-fade { animation: fadeUp 0.6s ease-out both; }
        .loading-shimmer {
          background-image: linear-gradient(
            100deg,
            rgba(255,255,255,0.55) 0%,
            rgba(255,255,255,0.55) 40%,
            rgba(216,180,254,1) 50%,
            rgba(255,255,255,0.55) 60%,
            rgba(255,255,255,0.55) 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmerText 2.6s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient depth — a flat black screen reads cheap, a soft glow doesn't */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/20 blur-[100px]" />
      </div>

      {/* Vinyl record */}
      <div className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
        <div className="loading-glow absolute inset-0 rounded-full bg-purple-500/40 blur-2xl" />

        <div
          className="loading-vinyl relative h-full w-full rounded-full shadow-[0_0_50px_rgba(168,85,247,0.35)]"
          style={{
            background:
              "repeating-radial-gradient(circle at center, #1a0a2e 0px, #1a0a2e 2px, #2c1447 3px, #2c1447 4px)",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-white/10" />

          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-700 shadow-inner sm:h-14 sm:w-14"></div>

          {/* Spindle hole */}
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70" />
        </div>
      </div>

      {/* Waveform — deliberately uneven heights + staggered durations so it reads organic, not metronomic */}
      <div
        className="loading-fade mt-8 flex h-6 items-end gap-1"
        style={{ animationDelay: "0.15s" }}
      >
        {[40, 70, 100, 60, 90, 50, 75].map((h, i) => (
          <span
            key={i}
            className="loading-bar w-1 rounded-full bg-linear-to-t from-purple-600 to-purple-300 sm:w-1.5"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 0.09}s`,
              animationDuration: `${0.9 + (i % 3) * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Wordmark — fade wrapper + shimmer inner element, kept separate since both
          set the `animation` property and would otherwise clobber one another */}
      <div className="loading-fade mt-5" style={{ animationDelay: "0.3s" }}>
        <p className="loading-shimmer text-lg font-bold tracking-[0.3em] sm:text-xl">
          AUDIOUS
        </p>
      </div>

      <p
        className="loading-fade mt-2 text-xs font-medium tracking-wide text-white/40 sm:text-sm"
        style={{ animationDelay: "0.45s" }}
      >
        Tuning things up
      </p>
    </div>
  );
}
