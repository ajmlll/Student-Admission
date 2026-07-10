import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'School Admission Management System',
  description: 'Manage admissions, student profiles, and exam scheduling seamlessly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-900 text-slate-100 antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
