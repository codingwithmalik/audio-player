import React from 'react'

export default function EqBars ()  {
   /** Animated equalizer — 3 green bars */
  return (
    <div className="flex items-end gap-0.5 h-4" aria-label="Now playing">
      {[
        "animate-[eq1_0.9s_ease-in-out_infinite_alternate]",
        "animate-[eq2_0.9s_ease-in-out_infinite_alternate]",
        "animate-[eq3_0.9s_ease-in-out_infinite_alternate]",
      ].map((cls, i) => (
        <span
          key={i}
          className={`w-0.75 h-full bg-purple-600 rounded-sm origin-bottom ${cls}`}
        />
      ))}
      <style>{`
        @keyframes eq1{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
        @keyframes eq2{from{transform:scaleY(.7)}to{transform:scaleY(.2)}}
        @keyframes eq3{from{transform:scaleY(1)}to{transform:scaleY(.4)}}
      `}</style>
    </div>
  );
}
