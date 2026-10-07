"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  images: string[];
  alt: string;
  fallbackEmoji?: string;
  autoMs?: number;
}

export default function ImageCarousel({ images, alt, fallbackEmoji, autoMs = 4000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + images.length) % images.length);
      setPaused(true);
    },
    [images.length]
  );

  const jump = useCallback((i: number) => {
    setIndex(i);
    setPaused(true);
  }, []);

  useEffect(() => {
    if (paused || images.length < 2) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, autoMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, images.length, autoMs]);

  if (images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-100 text-7xl">
        {fallbackEmoji ?? "🏡"}
      </div>
    );
  }

  return (
    <div className="group relative h-full w-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={src + i} className="relative h-full w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} - ${i + 1}`}
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="الصورة السابقة"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1.5 text-lg text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/70 max-md:opacity-100"
          >
            ›
          </button>
          <button
            type="button"
            aria-label="الصورة التالية"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1.5 text-lg text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/70 max-md:opacity-100"
          >
            ‹
          </button>
          <div className="absolute bottom-2 right-0 left-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`صورة ${i + 1}`}
                onClick={() => jump(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/90"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
