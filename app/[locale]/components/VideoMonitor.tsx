"use client";

import Image from "next/image";
import monitorImage from "@/assets/images/monitor.png";

export default function VideoMonitor() {
  return (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-gray-300 via-gray-200 to-gray-400 relative">
      {/* Vignette overlay - creates darkening from all sides */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)'
        }}
      ></div>

      <div className="max-w-[1600px] mx-auto relative z-20">
        <div className="relative w-full aspect-16/10">
          <Image
            src={monitorImage}
            alt="Monitor"
            fill
            className="object-contain z-10 pointer-events-none"
            priority
          />

          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="relative w-[45%] h-[40%] mt-[-11%]">
              <video
                className="w-full h-full object-cover rounded-sm"
                controls
                controlsList="nodownload"
                preload="metadata"
              >
                <source src="/home-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
