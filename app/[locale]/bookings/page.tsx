import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BookingInterface from "../components/BookingInterface";

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
    alternates: {
      canonical: `https://garts.gr/${locale}/bookings`,
      languages: {
        'en': 'https://garts.gr/en/bookings',
        'el': 'https://garts.gr/el/bookings',
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://garts.gr/${locale}/bookings`,
      type: 'website',
    },
  };
}

export default function BookingsPage() {
  const t = useTranslations("bookings");

  return (
    <div className="min-h-screen bg-gray py-16 px-4">
      <main className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-neural-dark mb-2">
            {t("title")}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Who We're Here For Section */}
        <div className="max-w-6xl mx-auto mb-16">
          {/* Main Content */}
          <div className="space-y-6 text-foreground text-lg leading-relaxed mb-12">
            <p className="text-center max-w-4xl mx-auto">
              {t("whoWeAreFor.paragraph1")}
            </p>

            <p className="text-center max-w-4xl mx-auto">
              {t("whoWeAreFor.paragraph2")}
            </p>

            <p className="text-center max-w-4xl mx-auto">
              {t("whoWeAreFor.paragraph3")}
            </p>

            <div className="text-center max-w-4xl mx-auto py-6">
              <p className="font-semibold text-neural-dark text-xl">
                {t("whoWeAreFor.paragraph4")}
              </p>
            </div>

            {/* Target Audiences */}
            <div className="pt-8 mt-8">
              <p className="font-semibold text-neural-dark mb-6 text-center text-xl">
                {t("whoWeAreFor.paragraph5")}
              </p>

              <p className="mb-6 text-center max-w-4xl mx-auto">
                {t("whoWeAreFor.paragraph6")}
              </p>

              <p className="mb-6 text-center max-w-4xl mx-auto">
                {t("whoWeAreFor.paragraph7")}
              </p>

              <p className="font-semibold text-neural-dark text-center max-w-4xl mx-auto">
                {t("whoWeAreFor.paragraph8")}
              </p>
            </div>
          </div>

          {/* Who It's Designed For - 3 Column Grid */}
          <div className="mt-16">
            <h3 className="text-3xl md:text-4xl font-bold text-neural-dark mb-12 text-center">
              {t("whoWeAreFor.designedForTitle")}
            </h3>
            <div className="grid md:grid-cols-3 gap-12">
              {/* Beginners */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-neural-dark mb-4">{t("whoWeAreFor.beginners.title")}</h4>
                <p className="text-foreground text-lg">
                  {t("whoWeAreFor.beginners.description")}
                </p>
              </div>

              {/* Self-taught Artists */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-neural-dark mb-4">{t("whoWeAreFor.selfTaught.title")}</h4>
                <p className="text-foreground text-lg">
                  {t("whoWeAreFor.selfTaught.description")}
                </p>
              </div>

              {/* Professionals and Hobbyists */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-neural-dark mb-4">{t("whoWeAreFor.professionals.title")}</h4>
                <p className="text-foreground text-lg">
                  {t("whoWeAreFor.professionals.description")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="mt-16">
          <BookingInterface />
        </div>
      </main>
    </div>
  );
}
