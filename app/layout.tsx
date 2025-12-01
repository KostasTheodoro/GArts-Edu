import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children
}: RootLayoutProps) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
