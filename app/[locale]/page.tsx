import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";
import MissionStatement from "./components/MissionStatement";
import HowWeThink from "./components/HowWeThink";
import Manifesto from "./components/Manifesto";
import TargetAudience from "./components/TargetAudience";
import LearningPath from "./components/LearningPath";
import BeforeAfter from "./components/BeforeAfter";
import ProgressionLevel from "./components/ProgressionLevel";

// Lazy load VideoMonitor since it's below the fold
const VideoMonitor = dynamic(() => import("./components/VideoMonitor"));

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
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'el': '/el',
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      type: 'website',
    },
  };
}

export default function HomePage() {
  return (
    <main className="w-full">
      <Hero />
      <MissionStatement />
      <HowWeThink />
      <Manifesto />
      <TargetAudience />
      <LearningPath />
      <ProgressionLevel />
      <BeforeAfter />
      <VideoMonitor />
    </main>
  );
}
