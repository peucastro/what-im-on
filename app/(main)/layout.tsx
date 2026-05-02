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
      <main className="mx-auto w-full flex-1">{children}</main>
    </>
  );
}
