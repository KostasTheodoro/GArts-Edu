import { useTranslations } from "next-intl";

export default function MissionStatement() {
  const t = useTranslations("mission");

  return (
    <section className="relative w-full py-20 md:py-28 px-4 bg-gray overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neural-dark mb-3">
            {t("headline")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-center">
          <p className="text-xl md:text-2xl text-neural-dark leading-relaxed italic font-light">
            {t("intro")}
          </p>

          <div className="relative py-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-primary/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray px-8 text-primary text-2xl md:text-3xl font-bold tracking-wide">
                {t("ourMission")}
              </span>
            </div>
          </div>

          <div className="space-y-6 text-lg md:text-xl text-neural-dark/90 leading-relaxed max-w-4xl mx-auto">
            <p className="font-medium">{t("paragraph1")}</p>
            <p>
              {t("paragraph2.prefix")}{" "}
              <span className="text-primary font-bold text-xl md:text-2xl">{t("paragraph2.garts")}</span>
              {t("paragraph2.suffix")}
            </p>
            <p className="text-neural-dark font-bold text-xl md:text-2xl border-l-4 border-primary pl-6 py-2">
              {t("callToAction")}
            </p>
          </div>

          <div className="pt-10 space-y-5 max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-neural-dark/90 font-medium">{t("question")}</p>
            <p className="text-lg md:text-xl text-neural-dark/90">{t("answer")}</p>
            <div className="pt-6">
              <p className="text-2xl md:text-3xl text-neural-dark font-bold">
                {t("closing.prefix")}{" "}
                <span className="text-primary">{t("closing.garts")}</span>
                {t("closing.suffix")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
