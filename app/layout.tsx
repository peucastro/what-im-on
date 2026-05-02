import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Press_Start_2P } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { UserPreferences } from '@/utils/themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const pixelFont = Press_Start_2P({
  weight: '400',
  variable: '--font-pixel',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  let preferences: UserPreferences = {
    theme_id: 'default',
    border_radius: 'low',
    font_family: 'sans',
    pet_id: 'none',
  };

  if (user) {
    const { data } = await supabase
      .from('user_preferences')
      .select('theme_id, border_radius, font_family, pet_id')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      preferences = data as UserPreferences;
    }
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelFont.variable} h-full antialiased light`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider preferences={preferences}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
