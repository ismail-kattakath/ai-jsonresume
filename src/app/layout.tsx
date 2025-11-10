import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ismail Kattakath - Principal Software Engineer & AI Research Scientist",
  description: "15+ years of software engineering expertise in AI/ML, full-stack development, and technical leadership. Specialized in machine learning, distributed systems, and scalable architectures.",
  keywords: "Principal Software Engineer, AI Research Scientist, Machine Learning, Full Stack Developer, AI/ML Expert, Software Architecture, Technical Leadership",
  authors: [{ name: "Ismail Kattakath" }],
  openGraph: {
    title: "Ismail Kattakath - Principal Software Engineer & AI Research Scientist",
    description: "15+ years of software engineering expertise in AI/ML, full-stack development, and technical leadership.",
    url: "https://ismail.kattakath.com",
    siteName: "Ismail Kattakath Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ismail Kattakath - Principal Software Engineer & AI Research Scientist",
    description: "15+ years of software engineering expertise in AI/ML, full-stack development, and technical leadership.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundImage: 'url(/images/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }}
      >
        {children}
      </body>
    </html>
  );
}
