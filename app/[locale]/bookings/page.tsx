import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.bookings" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function BookingsPage() {
  const t = useTranslations("bookings");

  return (
    <div className="min-h-screen bg-gray py-16 px-4">
      <main className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-neural-dark mb-2">
            {t("title")}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-xl text-foreground max-w-3xl mx-auto">
            {t("description")}
          </p>
        </div>
      </main>
    </div>
  );
}
