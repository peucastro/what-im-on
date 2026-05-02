import { Geist, Geist_Mono, Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});
export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: "what i'm on",
  description:
    "A personal space to showcase your current obsessions and crowdsource your next favorite thing. Share what you're into and get curated recommendations.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "what i'm on",
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased light`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
