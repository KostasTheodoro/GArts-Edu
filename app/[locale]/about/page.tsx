import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import aboutImage1 from '@/assets/images/about-1.jpg';
import aboutImage2 from '@/assets/images/about-2.jpg';
import LordIcon from '../components/LordIcon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.about' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://garts.gr/${locale}/about`,
      languages: {
        'en': 'https://garts.gr/en/about',
        'el': 'https://garts.gr/el/about',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://garts.gr/${locale}/about`,
      type: 'website',
    },
  };
}

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-gray py-16 px-4">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-neural-dark mb-2">
            {t('title')}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* About Content with Image */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-24">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph1')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph2')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph3')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph4')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph5')}
            </p>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('content.paragraph6')}
            </p>

            {/* Tagline */}
            <div className="pt-6 mt-6">
              <p className="text-xl md:text-2xl font-bold text-primary">
                {t('content.tagline')}
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src={aboutImage1}
              alt="About Me"
              fill
              className="object-cover"
              loading="lazy"
              placeholder="blur"
            />
          </div>
        </div>

        {/* My Vision Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <LordIcon
                src="https://cdn.lordicon.com/vfczflna.json"
                trigger="hover"
                colors="primary:#000000,secondary:#ff8500"
                size={120}
              />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
              {t('vision.title')}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-foreground leading-relaxed text-center">
              {t('vision.content')}
            </p>
          </div>
        </div>

        {/* Second Image */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={aboutImage2}
              alt="My Vision"
              fill
              className="object-cover"
              loading="lazy"
              placeholder="blur"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
