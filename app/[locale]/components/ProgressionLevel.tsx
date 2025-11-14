"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";

export default function ProgressionLevel() {
  const t = useTranslations("progressionLevel");
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      id: "vertex",
      image: "/images/progression-level/Vertex.png",
      position: { bottom: "4%", left: "12%" },
    },
    {
      id: "edge",
      image: "/images/progression-level/Edge.png",
      position: { bottom: "26%", left: "30%" },
    },
    {
      id: "face",
      image: "/images/progression-level/Face.png",
      position: { bottom: "48%", left: "48%" },
    },
    {
      id: "mesh",
      image: "/images/progression-level/Mesh.png",
      position: { bottom: "70%", left: "66%" },
    },
  ];

  return (
    <div className="hidden md:block w-full py-12 md:py-20 px-4 bg-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
            {t("title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="relative w-full h-[500px] md:h-[550px] max-w-5xl mx-auto">
          <div className="absolute left-[10%] top-[3%] w-0.5 md:w-1 h-40 md:h-56 bg-neural-dark"></div>
          <div className="absolute left-[10%] top-[3%] w-40 md:w-56 h-0.5 md:h-1 bg-neural-dark"></div>

          <div className="absolute right-[10%] bottom-[3%] w-0.5 md:w-1 h-40 md:h-56 bg-neural-dark"></div>
          <div className="absolute right-[10%] bottom-[3%] w-40 md:w-56 h-0.5 md:h-1 bg-neural-dark"></div>

          {steps.map((step, index) => {
            const isHovered = hoveredStep === index;
            const nextStep = steps[index + 1];

            return (
              <div key={step.id}>
                <div
                  className="absolute transition-all duration-300 cursor-pointer"
                  style={{
                    bottom: step.position.bottom,
                    left: step.position.left,
                  }}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div className="relative">
                    {isHovered && (
                      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
                        <h3 className="text-base md:text-lg font-bold text-neural-dark">
                          {t(`steps.${step.id}.title`)}
                        </h3>
                      </div>
                    )}

                    <div
                      className={`relative bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 w-24 h-24 md:w-36 md:h-36 ${
                        isHovered
                          ? "shadow-[0_0_20px_rgba(255,133,0,0.8)] scale-110 border-2 border-primary"
                          : "border-2 border-neural-dark"
                      }`}
                    >
                      <div className="relative w-full h-full bg-white p-4">
                        <Image
                          src={step.image}
                          alt={t(`steps.${step.id}.title`)}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      {isHovered && (
                        <div className="absolute inset-0 bg-neural-dark/95 flex items-center justify-center p-3 md:p-4 transition-opacity duration-300">
                          <p className="text-white text-center text-[10px] md:text-xs leading-snug">
                            {t(`steps.${step.id}.description`)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {nextStep &&
                  hoveredStep !== index &&
                  hoveredStep !== index + 1 && (
                    <div
                      className="hidden md:block absolute transition-opacity duration-300 z-20"
                      style={{
                        bottom: `calc(${step.position.bottom} + 3rem)`,
                        left: `calc(${step.position.left} + 7rem)`,
                      }}
                    >
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        className={`${
                          isHovered ? "text-primary" : "text-neural-dark"
                        }`}
                        style={{ overflow: "visible" }}
                      >
                        <defs>
                          <marker
                            id={`arrow-indent-${index}`}
                            markerWidth="14"
                            markerHeight="14"
                            refX="11"
                            refY="7"
                            orient="auto"
                          >
                            <path
                              d="M2,2 L11,7 L2,12 L6,7 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </marker>
                        </defs>

                        <path
                          d="M 15,105 C 30,95 45,80 60,60 C 75,40 90,25 105,15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeDasharray="3 2"
                          markerEnd={`url(#arrow-indent-${index})`}
                          opacity="0.9"
                        />
                      </svg>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
