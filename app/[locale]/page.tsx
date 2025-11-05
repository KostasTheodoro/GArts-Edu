import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "./components/Hero";
import HeroAnimated1 from "./components/HeroAnimated1";
import HeroAnimated2 from "./components/HeroAnimated2";
import HeroAnimated3 from "./components/HeroAnimated3";
import HeroBlended from "./components/HeroBlended";
import HeroBlended3 from "./components/HeroBlended3";
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
      <Hero />
      <HeroAnimated1 />
      <HeroAnimated2 />
      <HeroAnimated3 />
      <HeroBlended />
      <HeroBlended3 />
      <HowWeThink />
    </main>
  );
}
