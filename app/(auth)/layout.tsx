import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "what i'm on",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
