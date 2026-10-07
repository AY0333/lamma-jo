"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  images: string[];
  alt: string;
  fallbackEmoji?: string;
  autoMs?: number;
  frameClass?: string;
}

export default function ImageCarousel({
  images,
  alt,
  fallbackEmoji,
  autoMs = 4000,
  frameClass = "aspect-video",
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const valid = images.filter((s) => !broken[s]);

  const go = useCallback(
    (e: React.MouseEvent, dir: 1 | -1) => {
      e.preventDefault();
      e.stopPropagation();
      if (valid.length < 2) return;
      setIndex((i) => (i + dir + valid.length) % valid.length);
      setPaused(true);
    },
    [valid.length]
  );

  const jump = useCallback(
    (e: React.MouseEvent, i: number) => {
      e.preventDefault();
      e.stopPropagation();
      setIndex(i);
      setPaused(true);
    },
    []
  );

  const markBroken = useCallback((src: string) => {
    setBroken((b) => {
      if (b[src]) return b;
      const next = { ...b, [src]: true };
      return next;
    });
    setIndex(0);
  }, []);

  useEffect(() => {
    if (paused || valid.length < 2) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % valid.length);
    }, autoMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, valid.length, autoMs]);

  if (valid.length === 0) {
    return (
      <div
        className={`flex ${frameClass} w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-100 text-6xl`}
      >
        {fallbackEmoji ?? "🏡"}
      </div>
    );
  }

  const safeIndex = index % valid.length;

  return (
    <div className={`group relative ${frameClass} w-full overflow-hidden bg-stone-100`}>
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${safeIndex * 100}%)` }}
      >
        {valid.map((src, i) => (
          <div key={src + i} className="relative h-full w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} - ${i + 1}`}
              className="h-full w-full object-contain"
              loading={i === 0 ? "eager" : "lazy"}
              onError={() => markBroken(src)}
            />
          </div>
        ))}
      </div>

      {valid.length > 1 && (
        <>
          <button
            type="button"
            aria-label="الصورة السابقة"
            onClick={(e) => go(e, -1)}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1.5 text-lg leading-none text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-black/70 focus:opacity-100 max-md:opacity-100"
          >
          →
          </button>
          <button
            type="button"
            aria-label="الصورة التالية"
            onClick={(e) => go(e, 1)}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1.5 text-lg leading-none text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-black/70 focus:opacity-100 max-md:opacity-100"
          >
          ←
          </button>
          <div
            className="absolute bottom-2 right-0 left-0 z-10 flex justify-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {valid.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`صورة ${i + 1}`}
                onClick={(e) => jump(e, i)}
                className={`h-2 rounded-full transition-all ${i === safeIndex ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/90"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

