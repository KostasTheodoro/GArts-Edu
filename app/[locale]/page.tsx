import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";
import MissionStatement from "./components/MissionStatement";
import HowWeThink from "./components/HowWeThink";

// Lazy load below-the-fold components to reduce initial bundle
const Manifesto = dynamic(() => import("./components/Manifesto"));
const TargetAudience = dynamic(() => import("./components/TargetAudience"));
const LearningPath = dynamic(() => import("./components/LearningPath"));
const ProgressionLevel = dynamic(() => import("./components/ProgressionLevel"));
const BeforeAfter = dynamic(() => import("./components/BeforeAfter"));
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
      canonical: `https://garts-edu.vercel.app/${locale}`,
      languages: {
        'en': 'https://garts-edu.vercel.app/en',
        'el': 'https://garts-edu.vercel.app/el',
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://garts-edu.vercel.app/${locale}`,
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
