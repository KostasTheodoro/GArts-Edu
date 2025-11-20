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
              We're here for creators who believe that learning should be more than memorizing tools —{" "}
              <span className="font-semibold">it should be an adventure.</span>
            </p>

            <p className="text-center max-w-4xl mx-auto">
              For those who don't just want to learn <em>how</em> to design — but <em className="font-semibold">why</em> they create.
              Whether you're just starting out or already shaping your artistic path,{" "}
              <span className="font-bold text-primary">GArts Education</span> gives you the
              guidance, inspiration, and community you need to grow and rediscover what creativity truly means.
            </p>

            <p className="text-center max-w-4xl mx-auto">
              We blend <span className="font-semibold">Education</span> with{" "}
              <span className="font-semibold">Entertainment</span> to make every learning moment fun, practical, and meaningful.
              Because when you learn with joy, you don't just improve —{" "}
              <span className="font-semibold italic">you evolve.</span>
            </p>

            <div className="text-center max-w-4xl mx-auto py-6">
              <p className="font-semibold text-neural-dark text-xl">
                Join a community that turns passion into progress —<br />
                and imagination into reality.
              </p>
            </div>

            {/* Target Audiences */}
            <div className="pt-8 mt-8">
              <p className="font-semibold text-neural-dark mb-6 text-center text-xl">
                Our programs are designed for anyone who lives and breathes visual creativity.
              </p>

              <p className="mb-6 text-center max-w-4xl mx-auto">
                From <span className="font-semibold">graphic designers, motion artists, and photographers</span>, to{" "}
                <span className="font-semibold">architects, product designers, and filmmakers</span> — every creative mind finds a place here.
              </p>

              <p className="mb-6 text-center max-w-4xl mx-auto">
                We also welcome <span className="font-semibold">content creators, influencers, and digital marketers</span>{" "}
                who want to elevate their visual storytelling and build a stronger digital presence.
              </p>

              <p className="font-semibold text-neural-dark text-center max-w-4xl mx-auto">
                Whether you're shaping your first 3D scene or refining your creative voice,<br />
                <span className="text-primary text-xl">GArts Education</span> helps you turn imagination into impact.
              </p>
            </div>
          </div>

          {/* Who It's Designed For - 3 Column Grid */}
          <div className="mt-16">
            <h3 className="text-3xl md:text-4xl font-bold text-neural-dark mb-12 text-center">
              GArts Education is designed for:
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
                <h4 className="text-2xl font-bold text-neural-dark mb-4">Beginners</h4>
                <p className="text-foreground text-lg">
                  Who want to learn the fundamentals of 2D & 3D design in a creative, supportive way.
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
                <h4 className="text-2xl font-bold text-neural-dark mb-4">Self-taught Artists</h4>
                <p className="text-foreground text-lg">
                  Who need structure, guidance, and feedback to take the next step.
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
                <h4 className="text-2xl font-bold text-neural-dark mb-4">Professionals & Hobbyists</h4>
                <p className="text-foreground text-lg">
                  Seeking to expand their creative toolbox and refresh their inspiration.
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
