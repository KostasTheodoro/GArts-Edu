import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL('https://garts-edu.vercel.app'),
    alternates: {
      canonical: `https://garts-edu.vercel.app/${locale}`,
      languages: {
        'en': 'https://garts-edu.vercel.app/en',
        'el': 'https://garts-edu.vercel.app/el',
      },
    },
    title: {
      default: 'GArts Education - Master Digital Arts & 3D Design',
      template: '%s | GArts Education'
    },
    description: 'Learn Blender 3D modeling, Photoshop, Premiere Pro, and After Effects from an experienced instructor. Online and face-to-face sessions in Athens, Greece. Transform your creativity into professional skills.',
    keywords: ['Blender courses', '3D modeling', 'Photoshop lessons', 'Premiere Pro', 'After Effects', 'digital arts education', 'Athens Greece', 'CGI training', 'video editing courses', 'graphic design lessons', 'online art classes'],
    authors: [{ name: 'GArts Education' }],
    creator: 'GArts Education',
    publisher: 'GArts Education',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'el_GR',
      alternateLocale: locale === 'en' ? ['el_GR'] : ['en_US'],
      url: `https://garts-edu.vercel.app/${locale}`,
      siteName: 'GArts Education',
      title: 'GArts Education - Master Digital Arts & 3D Design',
      description: 'Learn Blender 3D modeling, Photoshop, Premiere Pro, and After Effects from an experienced instructor. Online and face-to-face sessions in Athens, Greece.',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'GArts Education Logo',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GArts Education - Master Digital Arts & 3D Design',
      description: 'Learn Blender 3D modeling, Photoshop, Premiere Pro, and After Effects from an experienced instructor.',
      images: ['/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    appleWebApp: {
      title: "GArts Education",
      statusBarStyle: 'black-translucent',
      capable: true,
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preload" href="/videos/hero/hero-animated-wallpaper-mobile.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/videos/hero/hero-animated-1.mp4" as="video" type="video/mp4" />
        <link rel="dns-prefetch" href="https://cdn.lordicon.com" />
        <link rel="preconnect" href="https://cdn.lordicon.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="lazyOnload" />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
