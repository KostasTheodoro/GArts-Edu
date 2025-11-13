"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { HiOutlineLightBulb } from "react-icons/hi";
import { PiBrainBold } from "react-icons/pi";
import { TbRefresh } from "react-icons/tb";
import { HiUserCircle } from "react-icons/hi2";
import { HiUserGroup } from "react-icons/hi";
import imgBase from "@/assets/images/Neural System IMG_1.jpg";
import imgA from "@/assets/images/Neural System IMG_1A.jpg";
import imgB from "@/assets/images/Neural System IMG_1B.jpg";
import imgC from "@/assets/images/Neural System IMG_1C.jpg";
import imgD from "@/assets/images/Neural System IMG_1D.jpg";
import imgE from "@/assets/images/Neural System IMG_1E.jpg";

export default function HowWeThink() {
  const [activeCircle, setActiveCircle] = useState<string | null>(null);
  const t = useTranslations("home.neuralSystem");

  const circles = [
    {
      id: "A",

      centerX: 403.2,
      centerY: 209.9,
      image: imgA,
      labelKey: "creativity",
      Icon: HiOutlineLightBulb,
    },
    {
      id: "B",

      centerX: 563.5,
      centerY: 327.9,
      image: imgB,
      labelKey: "learning",
      Icon: PiBrainBold,
    },
    {
      id: "C",

      centerX: 621.6,
      centerY: 487.4,
      image: imgC,
      labelKey: "practice",
      Icon: TbRefresh,
    },
    {
      id: "D",

      centerX: 588.8,
      centerY: 658.4,
      image: imgD,
      labelKey: "understanding",
      Icon: HiUserCircle,
    },
    {
      id: "E",

      centerX: 435.3,
      centerY: 791.4,
      image: imgE,
      labelKey: "community",
      Icon: HiUserGroup,
    },
  ];

  const circleDiameter = 85;
  const imageSize = 904;

  const getCirclePosition = (centerX: number, centerY: number) => {
    const radius = circleDiameter / 2;
    return {
      top: `${((centerY - radius) / imageSize) * 100}%`,
      left: `${((centerX - radius) / imageSize) * 100}%`,
      width: `${(circleDiameter / imageSize) * 100}%`,
      height: `${(circleDiameter / imageSize) * 100}%`,
    };
  };

  const currentImage =
    circles.find((c) => c.id === activeCircle)?.image || imgBase;

  return (
    <div className="w-full py-12  px-6 md:px-8 bg-neural-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-40 items-center">
          <div className="relative w-full aspect-square mx-auto lg:mx-0">
            <div className="hidden">
              <Image src={imgA} alt="" priority />
              <Image src={imgB} alt="" priority />
              <Image src={imgC} alt="" priority />
              <Image src={imgD} alt="" priority />
              <Image src={imgE} alt="" priority />
            </div>

            <Image
              src={currentImage}
              alt="Neural System - How We Think"
              fill
              className="object-contain transition-opacity duration-300"
              priority
            />

            {circles.map((circle) => {
              const position = getCirclePosition(
                circle.centerX,
                circle.centerY
              );
              return (
                <div
                  key={circle.id}
                  className="absolute rounded-full cursor-pointer z-10"
                  style={position}
                  onMouseEnter={() => setActiveCircle(circle.id)}
                  onMouseLeave={() => setActiveCircle(null)}
                  title={t(circle.labelKey)}
                />
              );
            })}

            {circles.map((circle) => {
              const isActive = activeCircle === circle.id;
              const IconComponent = circle.Icon;

              const iconTop = `${(circle.centerY / imageSize) * 100}%`;
              const iconLeft = `${(circle.centerX / imageSize) * 100}%`;

              return (
                <div
                  key={`icon-${circle.id}`}
                  className="absolute z-20 pointer-events-none"
                  style={{
                    top: iconTop,
                    left: iconLeft,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <IconComponent
                    className={`transition-all duration-200 text-lg sm:text-3xl ${
                      isActive
                        ? "text-primary scale-125 animate-pulse drop-shadow-[0_0_15px_rgba(255,133,0,0.9)]"
                        : "text-white"
                    }`}
                  />
                </div>
              );
            })}

            {circles.map((circle) => {
              const isActive = activeCircle === circle.id;

              const labelTop = `${(circle.centerY / imageSize) * 100}%`;
              const labelLeft = `${
                ((circle.centerX + circleDiameter / 2 + 20) / imageSize) * 100
              }%`;

              return (
                <div
                  key={`label-${circle.id}`}
                  className="absolute z-20 pointer-events-none"
                  style={{
                    top: labelTop,
                    left: labelLeft,
                    transform: "translateY(-50%)",
                  }}
                >
                  <span
                    className={`text-base md:text-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "text-primary scale-110 drop-shadow-[0_0_10px_rgba(255,133,0,0.6)]"
                        : "text-white"
                    }`}
                  >
                    {t(circle.labelKey)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {t("title")}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
            <p className="text-lg md:text-xl text-gray-300">
              {t("description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
