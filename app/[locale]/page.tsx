import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroBlended from "./components/HeroBlended";
import HowWeThink from "./components/HowWeThink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function HomePage() {
  return (
    <main className="w-full">
      <HeroBlended />
      <HowWeThink />
    </main>
  );
}
