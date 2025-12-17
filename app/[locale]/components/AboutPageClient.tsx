'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import aboutImage1 from '@/assets/images/about-1.jpg';
import aboutImage2 from '@/assets/images/about-2.jpg';
import LordIcon from './LordIcon';
import { useState, useRef } from 'react';

export default function AboutPageClient() {
  const t = useTranslations('about');
  const [isHovered, setIsHovered] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setVideoEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setVideoEnded(false);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <div className="min-h-screen bg-gray py-16 px-4">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-neural-dark mb-2">
            {t('title')}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* About Content with Image */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-24">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph1')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph2')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph3')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph4')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph5')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph6')}
            </p>

            {/* Tagline */}
            <div className="pt-6 mt-6">
              <p className="text-xl md:text-2xl font-bold text-primary">
                {t('content.tagline')}
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src={aboutImage1}
              alt="About Me"
              fill
              className="object-cover"
              loading="lazy"
              placeholder="blur"
            />
          </div>
        </div>

        {/* My Vision Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <LordIcon
                src="https://cdn.lordicon.com/vfczflna.json"
                trigger="hover"
                colors="primary:#000000,secondary:#ff8500"
                size={120}
              />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
              {t('vision.title')}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed">
              {t('vision.content')}
            </p>
          </div>
        </div>

        {/* Second Image with Hover Video */}
        <div className="max-w-4xl mx-auto">
          <div
            className="relative aspect-video overflow-hidden rounded-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Static Image */}
            <Image
              src={aboutImage2}
              alt="My Vision"
              fill
              className={`object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
              placeholder="blur"
            />

            {/* Video - Shows on hover, plays once, stays on end frame while hovering */}
            <video
              ref={videoRef}
              src="/videos/image-fold.mp4"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              playsInline
              onEnded={handleVideoEnd}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
