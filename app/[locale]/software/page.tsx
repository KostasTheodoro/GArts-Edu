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
      imageAlt: "Blender 3D Software",
    },
    {
      key: "photoshop",
      imageAlt: "Adobe Photoshop",
    },
    {
      key: "premierePro",
      imageAlt: "Adobe Premiere Pro",
    },
    {
      key: "afterEffects",
      imageAlt: "Adobe After Effects",
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

        {/* Software Cards - Stacked Vertically */}
        <div className="max-w-2xl mx-auto space-y-6">
          {softwareList.map((software) => (
            <SoftwareCard
              key={software.key}
              title={t(`${software.key}.title`)}
              description={t(`${software.key}.description`)}
              imageUrl={`https://placehold.co/800x450/ff8500/white?text=${software.key}`}
              imageAlt={software.imageAlt}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
