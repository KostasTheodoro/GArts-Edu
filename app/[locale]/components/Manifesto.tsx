"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { TbPencil, TbBook, TbTrendingUp } from "react-icons/tb";

export default function Manifesto() {
  const t = useTranslations("manifesto");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const emphasizeText = (text: string) => {
    const keywords = [
      "imagination",
      "create",
      "build",
      "proud",
      "differently",
      "life",
      "dive deep",
      "think",
      "learn",
      "grow",
      "theory",
      "practice",
      "curiosity",
      "confidence",
      "art",
      "emotion",
      "guidance",
      "feedback",
      "community",
      "fire",
      "movement",
      "passion",
      "purpose",
      "φαντασία",
      "δημιουργείτε",
      "χτίσετε",
      "περήφανοι",
      "διαφορετικά",
      "ζωή",
      "Βουτάμε βαθιά",
      "σκέφτεστε",
      "μαθαίνετε",
      "μεγαλώνετε",
      "θεωρία",
      "πράξη",
      "περιέργεια",
      "αυτοπεποίθηση",
      "τέχνη",
      "συναίσθημα",
      "καθοδήγηση",
      "ανατροφοδότηση",
      "κοινότητα",
      "φωτιά",
      "κίνημα",
      "πάθος",
      "σκοπό",
    ];

    let processedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
      processedText = processedText.replace(
        regex,
        '<span class="font-bold italic text-neural-dark animate-pulse-slow">$1</span>'
      );
    });

    return processedText;
  };

  const paragraphs = [
    [t("line1")],
    [t("line2"), t("line3")],
    [t("line4"), t("line5")],
    [t("line6"), t("line7"), t("line8")],
    [t("line9"), t("line10")],
    [t("line11"), t("line12"), t("line13")],
    [t("line14"), t("line15"), t("line16")],
    [t("line17"), t("line18"), t("line19")],
    [t("brand")],
  ];

  const taglineWords = [
    { text: t("tagline").split(".")[0], icon: TbPencil },
    { text: t("tagline").split(".")[1], icon: TbBook },
    { text: t("tagline").split(".")[2], icon: TbTrendingUp },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 px-4 bg-gray"
    >
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        <blockquote className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-8 border-primary relative">
          <div className="absolute top-4 left-4 text-6xl md:text-7xl text-primary/10 font-serif leading-none select-none">
            &ldquo;
          </div>

          <div className="space-y-6 relative z-10">
            {paragraphs.map((lines, index) => (
              <div
                key={index}
                className={`text-lg md:text-xl text-neutral-700 leading-relaxed transition-all ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDuration: "1500ms",
                  transitionDelay: `${index * 450}ms`,
                }}
              >
                {lines.map((line, lineIndex) => {
                  const isLastParagraph = index === paragraphs.length - 1;
                  const isBrand = isLastParagraph && lineIndex === 0;

                  return (
                    <div
                      key={lineIndex}
                      className={
                        isBrand
                          ? "text-2xl md:text-3xl font-bold text-neural-dark mt-8 mb-6"
                          : ""
                      }
                      dangerouslySetInnerHTML={{
                        __html: emphasizeText(line),
                      }}
                    />
                  );
                })}
              </div>
            ))}

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-8 pt-6 border-t-2 border-primary/20">
              {taglineWords.map((item, idx) => {
                const Icon = item.icon;
                const taglineDelay = paragraphs.length * 450 + idx * 400;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 transition-all duration-1000 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-8"
                    }`}
                    style={{
                      transitionDelay: `${taglineDelay}ms`,
                    }}
                  >
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    <span className="text-xl md:text-2xl font-semibold text-neural-dark uppercase tracking-widest">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </blockquote>
      </div>
    </section>
  );
}
