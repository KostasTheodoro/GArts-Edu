"use client";

import Image from "next/image";
import howWeThinkImage from "@/assets/images/how-we-think.png";
import { useState } from "react";

export default function HowWeThink() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const icons = [
    {
      id: "creativity",
      name: "Creativity",
      top: "16.75%",
      left: "23.5%",
      width: "5.6%",
      height: "8%",
    },
    {
      id: "learning",
      name: "Learning",
      top: "28.15%",
      left: "33.85%",
      width: "5.6%",
      height: "8%",
    },
    {
      id: "practice",
      name: "Practice",
      top: "43.4%",
      left: "37.7%",
      width: "5.6%",
      height: "8%",
    },
    {
      id: "understanding",
      name: "Understanding",
      top: "60.2%",
      left: "35.4%",
      width: "5.6%",
      height: "8%",
    },
    {
      id: "community",
      name: "Community",
      top: "73.65%",
      left: "25.6%",
      width: "5.6%",
      height: "8%",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative w-full">
        {/* Main Image */}
        <Image
          src={howWeThinkImage}
          alt="How We Think, How We Teach - GATE Education approach"
          className="w-full h-auto"
          priority
        />

        {/* Hover Areas for Each Icon */}
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="absolute rounded-full cursor-pointer transition-all duration-300"
            style={{
              top: icon.top,
              left: icon.left,
              width: icon.width,
              height: icon.height,
            }}
            onMouseEnter={() => setHoveredIcon(icon.id)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            {/* Border glow effect - glows the outline and creates a subtle brightening */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 ${
                hoveredIcon === icon.id
                  ? "ring-[5px] ring-cyan-400/70 shadow-[0_0_25px_rgba(34,211,238,1),0_0_50px_rgba(34,211,238,0.7),0_0_75px_rgba(34,211,238,0.4),inset_0_0_30px_rgba(34,211,238,0.5)]"
                  : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
