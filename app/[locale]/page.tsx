import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "./components/Hero";
import MissionStatement from "./components/MissionStatement";
import HowWeThink from "./components/HowWeThink";
import TargetAudience from "./components/TargetAudience";
import VideoMonitor from "./components/VideoMonitor";
import LearningPath from "./components/LearningPath";
import BeforeAfter from "./components/BeforeAfter";

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
      <MissionStatement />
      <HowWeThink />
      <TargetAudience />
      <LearningPath />
      <BeforeAfter />
      <VideoMonitor />
    </main>
  );
}
