"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import Image from "next/image";
import cgiPreview from "@/assets/images/cgi-preview.jpg";
import cgiRender from "@/assets/images/cgi-render.jpg";

export default function BeforeAfter() {
  const t = useTranslations("beforeAfter");
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      handleMove(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="w-full py-16 md:py-20 px-4 bg-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
            {t("title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-neural-dark max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative w-full max-w-4xl mx-auto aspect-video shadow-2xl cursor-ew-resize select-none touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <Image
              src={cgiPreview}
              alt={t("beforeAlt")}
              fill
              className="object-cover"
              draggable={false}
              priority
              placeholder="blur"
            />
          </div>

          <div
            className="absolute inset-0 rounded-lg overflow-hidden transition-none"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          >
            <Image
              src={cgiRender}
              alt={t("afterAlt")}
              fill
              className="object-cover"
              draggable={false}
              priority
              placeholder="blur"
            />
          </div>

          {sliderPosition <= 20 && (
            <div className="absolute top-4 right-4 bg-neural-dark/80 text-white px-4 py-2 rounded-md font-semibold z-10 pointer-events-none">
              {t("before")}
            </div>
          )}
          {sliderPosition >= 80 && (
            <div className="absolute top-4 left-4 bg-primary/90 text-white px-4 py-2 rounded-md font-semibold z-10 pointer-events-none">
              {t("after")}
            </div>
          )}

          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize pointer-events-none z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-5 bg-white"></div>
                <div className="w-0.5 h-5 bg-white"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-neural-dark/70">
          <p className="text-sm md:text-base">{t("instruction")}</p>
        </div>
      </div>
    </div>
  );
}
