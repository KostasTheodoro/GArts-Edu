import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AboutPageClient from '../components/AboutPageClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.about' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'en' ? 'https://garts.gr/about' : 'https://garts.gr/el/about',
      languages: {
        'en': 'https://garts.gr/about',
        'el': 'https://garts.gr/el/about',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: locale === 'en' ? 'https://garts.gr/about' : 'https://garts.gr/el/about',
      type: 'website',
    },
  };
}

export default function AboutPage() {
  return <AboutPageClient />;
}
