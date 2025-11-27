"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      setIsVisible(window.scrollY > 1200);
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollUp}
          id="topButton"
          className="fixed z-50 p-3 bg-neural-dark border-2 border-primary rounded-full shadow-lg bottom-10 left-10 text-primary hover:bg-primary hover:text-white transition-all duration-300 animate-bounce hover:animate-none"
          aria-label="Scroll to top"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 19V5M5 12l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </>
  );
}
