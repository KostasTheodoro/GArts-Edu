"use client";

import { useEffect, useRef, useState } from "react";

interface SoftwareCardProps {
  title: string;
  description: string;
  videoUrl: string;
  downloadUrl: string;
  reverse?: boolean;
}

export default function SoftwareCard({
  title,
  description,
  videoUrl,
  downloadUrl,
  reverse = false,
}: SoftwareCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            video.play();
            setHasPlayed(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    const handleVideoEnd = () => {
      video.pause();
    };

    video.addEventListener("ended", handleVideoEnd);

    return () => {
      observer.disconnect();
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [hasPlayed]);

  const paragraphs = description.split("\n\n").filter((p) => p.trim());

  return (
    <div className="bg-dark-gray rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-black mb-3">{title}</h3>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div
          className={`flex flex-col ${
            reverse ? "md:flex-row-reverse" : "md:flex-row"
          } gap-8 items-start`}
        >
          <div className="flex-1">
            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg text-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-auto rounded-lg"
              muted
              playsInline
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="w-full flex justify-center mt-16">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-primary font-bold px-8 py-3 rounded-full text-lg shadow-md hover:bg-primary hover:text-white border-2 border-black hover:border-primary transition-colors duration-200"
          >
            Download {title} here
          </a>
        </div>
      </div>
    </div>
  );
}
