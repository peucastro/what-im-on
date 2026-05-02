import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding',
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
