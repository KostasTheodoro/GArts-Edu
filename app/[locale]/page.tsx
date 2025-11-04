import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HowWeThink from './components/HowWeThink';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center py-32 px-16">
      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="max-w-md text-lg leading-8 text-foreground/70">
          {t('description')}
        </p>
        {/* Example button with your color scheme */}
        <button className="mt-4 px-8 py-3 bg-black text-primary font-semibold rounded-lg hover:bg-primary hover:text-black transition-colors duration-200">
          Get Started
        </button>
      </div>

      {/* How We Think Section */}
      <section className="w-full mt-32 px-4">
        <HowWeThink />
      </section>
    </main>
  );
}
