import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "what i'm on",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 sm:px-6 px-0 py-8">{children}</main>
    </>
  );
}
