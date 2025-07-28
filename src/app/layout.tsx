import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import Layout from '@/components/Layout';
import './globals.css';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Nathan Buskirk | Portfolio',
  description: 'Nathan Buskirk | Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${rubik.className} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
