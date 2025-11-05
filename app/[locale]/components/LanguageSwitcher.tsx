'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales } from '@/i18n';
import { useTransition } from 'react';
import GB from 'country-flag-icons/react/3x2/GB';
import GR from 'country-flag-icons/react/3x2/GR';

const languageConfig = {
  en: { label: 'EN', Flag: GB },
  el: { label: 'GR', Flag: GR },
} as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((loc) => {
        const config = languageConfig[loc as keyof typeof languageConfig];
        const FlagComponent = config.Flag;

        return (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            disabled={isPending}
            className={`px-3 py-2 rounded-md font-semibold text-lg transition-colors flex items-center gap-2 ${
              locale === loc
                ? 'bg-primary text-neural-dark'
                : 'bg-white/10 text-white hover:bg-white/20'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FlagComponent className="w-6 h-5" />
            <span className="uppercase">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
