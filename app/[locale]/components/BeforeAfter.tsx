"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";

export default function BeforeAfter() {
  const t = useTranslations("beforeAfter");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="w-full py-16 md:py-20 px-4 bg-gray">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
            {t("title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-neural-dark max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Before/After Slider */}
        <div
          ref={containerRef}
          className="relative w-full max-w-4xl mx-auto aspect-video overflow-hidden rounded-lg shadow-2xl cursor-ew-resize select-none"
          onClick={handleClick}
        >
          {/* Before Image (Preview) - Full width */}
          <div className="absolute inset-0">
            <img
              src="/cgi-preview.jpg"
              alt={t("beforeAlt")}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute top-4 left-4 bg-neural-dark/80 text-white px-4 py-2 rounded-md font-semibold">
              {t("before")}
            </div>
          </div>

          {/* After Image (Render) - Clipped by slider position */}
          <div
            className="absolute inset-0 transition-none"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          >
            <img
              src="/cgi-render.png"
              alt={t("afterAlt")}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute top-4 right-4 bg-primary/90 text-white px-4 py-2 rounded-md font-semibold">
              {t("after")}
            </div>
          </div>

          {/* Slider Line and Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Drag Handle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="flex gap-1">
                <div className="w-0.5 h-6 bg-white"></div>
                <div className="w-0.5 h-6 bg-white"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 text-neural-dark/70">
          <p className="text-sm md:text-base">{t("instruction")}</p>
        </div>
      </div>
    </div>
  );
}
