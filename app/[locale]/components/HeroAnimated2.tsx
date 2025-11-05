import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HeroAnimated2() {
  const t = useTranslations("home");

  return (
    <section className="relative min-h-[600px] flex flex-col justify-between pt-16 pb-40 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-animated-2.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-neural-dark/50"></div>

      <div className="relative z-10 text-center px-4">
        <h1
          className="text-6xl md:text-7xl font-bold text-white tracking-[0.25em]"
          style={{
            textShadow:
              "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)",
          }}
        >
          {t("hero.title")}
        </h1>
      </div>

      <div className="relative z-10 text-center px-4">
        <Link
          href="/session"
          className="inline-block bg-neural-dark text-primary font-bold px-12 py-4 rounded-full text-xl shadow-md hover:bg-primary hover:text-white border-2 border-primary transition-colors duration-200 uppercase"
        >
          {t("hero.button")}
        </Link>
      </div>
    </section>
  );
}
