import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MapPin, Mail, Phone } from "lucide-react";
import ContactForm from "../components/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === 'en' ? 'https://garts.gr/contact' : 'https://garts.gr/el/contact',
      languages: {
        'en': 'https://garts.gr/contact',
        'el': 'https://garts.gr/el/contact',
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: locale === 'en' ? 'https://garts.gr/contact' : 'https://garts.gr/el/contact',
      type: 'website',
    },
  };
}

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
        <div className="flex flex-col pr-0 lg:pr-24">
          <h1 className="text-3xl font-extrabold tracking-tight text-neural-dark mb-2 text-center">
            {t("title")}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 mb-10"></div>
          <p className="text-base md:text-lg text-foreground/70 mb-10 leading-relaxed text-left">
            {t("description")}
          </p>

          <dl className="space-y-6 text-base md:text-lg">
            <div className="flex items-start gap-3">
              <MapPin
                className="h-6 w-6 text-primary mt-1 shrink-0"
                aria-hidden="true"
              />
              <span className="text-foreground">{t("info.address")}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone
                className="h-6 w-6 text-primary shrink-0"
                aria-hidden="true"
              />
              <a
                href={`tel:${t("info.phoneLink")}`}
                className="hover:text-primary text-foreground transition-colors"
              >
                {t("info.phone")}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail
                className="h-6 w-6 text-primary shrink-0"
                aria-hidden="true"
              />
              <a
                href={`mailto:${t("info.email")}`}
                className="hover:text-primary text-foreground transition-colors"
              >
                {t("info.email")}
              </a>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-center">
          <ContactForm />
        </div>
      </div>

      <section className="py-16 flex justify-center">
        <iframe
          src={t("info.mapUrl")}
          width="100%"
          height="400"
          style={{ border: 0, maxWidth: 800 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-xl shadow-lg border-2 border-primary"
          title={t("info.mapTitle")}
        />
      </section>
    </div>
  );
}
