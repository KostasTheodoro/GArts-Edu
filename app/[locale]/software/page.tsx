import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SoftwareCard from "../components/SoftwareCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.software" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SoftwarePage() {
  const t = useTranslations("software");

  const softwareList = [
    {
      key: "blender",
      videoUrl: "/animations/blender.mp4",
      downloadUrl: "https://www.blender.org/download/",
    },
    {
      key: "photoshop",
      videoUrl: "/animations/photoshop.mp4",
      downloadUrl: "https://www.adobe.com/products/photoshop.html",
    },
    {
      key: "premierePro",
      videoUrl: "/animations/premiere-pro.mp4",
      downloadUrl: "https://www.adobe.com/products/premiere.html",
    },
    {
      key: "afterEffects",
      videoUrl: "/animations/after-effects.mp4",
      downloadUrl: "https://www.adobe.com/products/aftereffects.html",
    },
  ];

  return (
    <div className="min-h-screen bg-gray py-16 px-4">
      <main className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-2">
            {t("title")}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-xl text-foreground max-w-3xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {softwareList.map((software, index) => (
            <SoftwareCard
              key={software.key}
              title={t(`${software.key}.title`)}
              description={t(`${software.key}.description`)}
              videoUrl={software.videoUrl}
              downloadUrl={software.downloadUrl}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
