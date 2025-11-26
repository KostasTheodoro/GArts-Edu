"use client";

import Image from "next/image";
import monitorImage from "@/assets/images/monitor.png";
import { useRef, useState } from "react";

export default function VideoMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setShowPlayButton(true);
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };

  const handlePlay = () => {
    setShowPlayButton(false);
  };

  return (
    <div className="w-full py-8 md:py-16 px-2 md:px-4 bg-linear-to-b from-gray-300 via-gray-200 to-gray-400 relative">
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)",
        }}
      ></div>

      <div className="max-w-full md:max-w-[1600px] mx-auto relative z-20">
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
                ref={videoRef}
                className="w-full h-full object-cover rounded-sm"
                controls={!showPlayButton}
                controlsList="nodownload"
                preload="metadata"
                onEnded={handleVideoEnd}
                onPlay={handlePlay}
              >
                <source src="/videos/home/home-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {showPlayButton && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-sm z-30"
                  onClick={handlePlayClick}
                >
                  <div className="relative w-[25%] md:w-[20%] aspect-square rounded-full border-[3px] border-white flex items-center justify-center hover:bg-white/10 transition-all shadow-2xl">
                    <svg
                      className="w-[60%] h-[60%] text-white ml-[5%]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
