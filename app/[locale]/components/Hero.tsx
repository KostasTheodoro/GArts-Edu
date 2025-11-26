import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HeroBlended() {
  const t = useTranslations("home");

  return (
    <section className="relative min-h-[70vh] sm:min-h-screen lg:min-h-[80vh] flex flex-col justify-between pt-16 pb-40 overflow-hidden">
      {/* Mobile & Tablet Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="lg:hidden absolute inset-0 w-full h-full object-cover "
      >
        <source
          src="/videos/hero/hero-animated-wallpaper-mobile.mp4"
          type="video/mp4"
        />
      </video>

      {/* Desktop Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden lg:block absolute inset-0 w-full h-full object-cover "
      >
        <source
          src="/videos/hero/hero-animated-wallpaper.mp4"
          type="video/mp4"
        />
      </video>

      {/* Blended Video - Both Mobile and Desktop */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
      >
        <source src="/videos/hero/hero-animated-1.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-neural-dark/30"></div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-widest md:tracking-[0.25em] [text-shadow:0_0_20px_rgba(255,255,255,0.8),0_0_40px_rgba(255,255,255,0.5)]">
          {t("hero.title")}
        </h1>
      </div>

      <div className="relative z-10 text-center px-4">
        <Link
          href="/bookings"
          className="inline-block bg-neural-dark text-primary font-bold px-12 py-4 rounded-full text-xl shadow-md hover:bg-primary hover:text-white border-4 border-primary transition-colors duration-200 uppercase"
        >
          {t("hero.button")}
        </Link>
      </div>
    </section>
  );
}
