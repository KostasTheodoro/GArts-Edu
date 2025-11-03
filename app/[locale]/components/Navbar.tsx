"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/software", label: t("software") },
    { href: "/session", label: t("session") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];
  const mobileNavItems = [{ href: "/", label: t("home") }, ...navItems];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleMenu = () => {
    const next = !isMenuOpen;
    setIsMenuOpen(next);
    if (typeof document !== "undefined") {
      document.body.style.overflow = next ? "hidden" : "unset";
    }
  };

  return (
    <nav className="bg-black px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between lg:justify-start">
        <button
          onClick={toggleMenu}
          className="lg:hidden flex flex-col gap-1.5 p-2 z-50 relative order-first"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        <Link href="/" className="z-50 lg:order-first group">
          <Image
            src="/logo.png"
            alt="GArts Edu Logo"
            width={180}
            height={90}
            className="h-16 w-auto invert transition-all duration-200 group-hover:brightness-0 group-hover:saturate-100 group-hover:[filter:invert(55%)_sepia(89%)_saturate(2381%)_hue-rotate(360deg)_brightness(102%)_contrast(103%)]"
            priority
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-32 mx-auto">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-lg font-semibold transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-white hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[75vw] max-w-xs bg-black shadow-xl z-40 lg:hidden overflow-y-auto"
            >
              <ul className="flex flex-col gap-2 px-4 pt-20 pb-6">
                {mobileNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (typeof document !== "undefined")
                          document.body.style.overflow = "unset";
                      }}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-white hover:text-primary hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
