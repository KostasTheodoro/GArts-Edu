"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LordIcon from "./LordIcon";

export default function TargetAudience() {
  const t = useTranslations("targetAudience");

  const audiences = [
    {
      id: "visual",
      icon: "/edit-icon.json",
      items: [
        "graphicDesigners",
        "motionArtists",
        "cgiEnthusiasts",
        "productJewelryDesigners",
        "architects",
      ],
    },
    {
      id: "storytellers",
      icon: "/camera-icon.json",
      items: [
        "photographers",
        "filmmakers",
        "youtubers",
        "influencers",
        "vloggers",
      ],
    },
    {
      id: "digital",
      icon: "/megaphone-icon.json",
      items: ["marketers", "advertisers", "contentCreators", "digitalPresence"],
    },
  ];

  return (
    <div className="w-full py-16 px-4 bg-neural-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {t("title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Three Columns */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {audiences.map((audience) => (
            <div key={audience.id}>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <LordIcon
                  src={audience.icon}
                  trigger="hover"
                  colors="primary:#ff8500,secondary:#ff8500"
                  size={80}
                />
              </div>

              {/* Category Title */}
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {t(`${audience.id}.title`)}
              </h3>

              {/* List Items */}
              <ul className="space-y-2 flex flex-col items-center">
                {audience.items.map((item) => (
                  <li key={item} className="text-gray-300">
                    {t(`${audience.id}.${item}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <Link
            href="/sessions"
            className="inline-block bg-primary text-neural-dark font-bold px-10 py-4 rounded-full text-lg shadow-md hover:bg-neural-dark
             hover:text-primary border-4 border-primary transition-colors duration-200"
          >
            {t("buttonSessions")}
          </Link>
        </div>
      </div>
    </div>
  );
}
