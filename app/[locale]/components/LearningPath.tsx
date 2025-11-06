"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function LearningPath() {
  const t = useTranslations("learningPath");
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(0); // Default to first dot

  const steps = [
    "3dModeling",
    "digitalSculpting",
    "uvMapping",
    "texturing",
    "shading",
    "animationPrinciples",
    "rendering",
    "videoEditing",
    "postProcessing",
    "fileExploring",
  ];

  const handleDotClick = (index: number) => {
    setSelectedStep(selectedStep === index ? null : index);
  };

  const closeModal = () => {
    setSelectedStep(null);
  };

  const handleMouseLeave = () => {
    setHoveredStep(0);
  };

  return (
    <div className="w-full py-12 md:py-20 px-4 bg-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
            {t("title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="relative w-full py-12 md:py-20">
          <div className="relative flex justify-between items-center max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const isTop = index % 2 === 0;
              const isHovered = hoveredStep === index;
              const isSelected = selectedStep === index;
              const isLineGlowing = hoveredStep === index;

              return (
                <div
                  key={step}
                  className="relative flex flex-col items-center flex-1 cursor-pointer"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleDotClick(index)}
                >
                  {index > 0 && (
                    <div
                      className={`absolute top-1/2 right-1/2 -translate-y-1/2 h-0.5 md:h-1 w-full transition-all duration-300 ${
                        isLineGlowing
                          ? "bg-primary shadow-[0_0_10px_rgba(255,133,0,0.8)]"
                          : "bg-neural-dark"
                      }`}
                      style={{ zIndex: 1 }}
                    ></div>
                  )}

                  <div
                    className={`absolute whitespace-nowrap transition-opacity duration-300 ${
                      isTop
                        ? "bottom-full mb-4 md:mb-6"
                        : "top-full mt-4 md:mt-6"
                    } ${isHovered ? "opacity-100" : "opacity-0"}`}
                    style={{ zIndex: 20 }}
                  >
                    <p className="text-xs md:text-lg font-semibold text-neural-dark">
                      {t(`steps.${step}.title`)}
                    </p>
                  </div>

                  <div
                    className={`w-3 h-3 md:w-5 md:h-5 rounded-full transition-all duration-300 bg-neural-dark ${
                      isHovered || isSelected
                        ? "shadow-[0_0_0_2px_#ff8500,0_0_15px_rgba(255,133,0,0.8)] md:shadow-[0_0_0_3px_#ff8500,0_0_20px_rgba(255,133,0,0.8)]"
                        : "shadow-[0_0_0_1px_#1a1a1a] md:shadow-[0_0_0_2px_#1a1a1a]"
                    }`}
                    style={{ zIndex: 10 }}
                    aria-label={t(`steps.${step}.title`)}
                  />

                  {isSelected && (
                    <>
                      <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={closeModal}
                      />

                      <div
                        className={`fixed md:absolute ${
                          isTop
                            ? "md:top-full md:mt-8 lg:mt-12"
                            : "md:bottom-full md:mb-8 lg:mb-12"
                        } left-1/2 top-1/2 md:top-auto -translate-x-1/2 md:translate-y-0 -translate-y-1/2 bg-gray rounded-lg shadow-2xl p-5 md:p-6 w-[90%] max-w-sm md:w-80 z-50 border-4 border-primary`}
                      >
                        <button
                          onClick={closeModal}
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl leading-none"
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <h3 className="text-lg md:text-xl font-bold text-neural-dark mb-3">
                          {t(`steps.${step}.title`)}
                        </h3>
                        <p className="text-sm md:text-base text-neural-dark leading-relaxed">
                          {t(`steps.${step}.description`)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
