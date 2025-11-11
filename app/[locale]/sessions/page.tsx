import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import avatar1 from "@/assets/images/avatar-1.jpg";
import avatar2 from "@/assets/images/avatar-2.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.sessions" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SessionsPage() {
  const t = useTranslations("sessions");

  return (
    <div className="min-h-screen bg-gray py-16 px-4">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-neural-dark mb-2">
            {t("title")}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-xl text-foreground max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Online Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-30 p-8 md:p-12">
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
              {t("online.title")}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
            <div>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                {t("online.description")}
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                {t("online.groups")}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-88 h-88 rounded-2xl overflow-hidden">
                <Image
                  src={avatar1}
                  alt="Online Sessions"
                  fill
                  className="object-cover"
                  loading="lazy"
                  placeholder="blur"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/bookings"
              className="inline-block bg-neural-dark text-primary font-bold px-8 py-3 rounded-full text-lg shadow-md hover:bg-primary hover:text-white border-2 border-neural-dark hover:border-primary transition-colors duration-200"
            >
              {t("online.button")}
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-30 p-8 md:p-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
              {t("face2face.title")}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
            <div>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                {t("face2face.description")}
              </p>
              <ul className="space-y-3">
                {[
                  "benefit1",
                  "benefit2",
                  "benefit3",
                  "benefit4",
                  "benefit5",
                  "benefit6",
                  "benefit7",
                  "benefit8",
                ].map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <span className="text-primary text-xl mt-1">✓</span>
                    <span className="text-lg">{t(`face2face.${benefit}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative w-100 h-120 rounded-2xl overflow-hidden">
                <Image
                  src={avatar2}
                  alt="Face2Face Sessions"
                  fill
                  className="object-cover"
                  loading="lazy"
                  placeholder="blur"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/bookings"
              className="inline-block bg-neural-dark text-primary font-bold px-8 py-3 rounded-full text-lg shadow-md hover:bg-primary hover:text-white border-2 border-neural-dark hover:border-primary transition-colors duration-200"
            >
              {t("face2face.button")}
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/studio-interior-1.jpg"
              alt={t("studio.image1Alt")}
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/studio-interior-2.jpg"
              alt={t("studio.image2Alt")}
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
