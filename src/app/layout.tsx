/* =============================================
   Pirmam Hospital - Root Layout
   Sets up RTL direction, Kurdish language, theme provider
   ============================================= */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

/* === Fonts === */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* === SEO & Meta Information === 
   EDIT: Update the title, description, and keywords below */
export const metadata: Metadata = {
  title: "نەخۆشخانەی پیرەمام | Pirmam Hospital",
  description:
    "نەخۆشخانەی پیرەمام - خزمەتگوزاری تەندروستی بەرز بۆ هەموو خەڵکی کوردستان. Pirmam Hospital - Premium Healthcare Services for all of Kurdistan.",
  keywords: [
    "نەخۆشخانەی پیرەمام",
    "Pirmam Hospital",
    "نەخۆشخانە",
    "تەندروستی",
    "کوردستان",
    "هەولێر",
    "Erbil",
    "Hospital",
    "Healthcare",
  ],
  authors: [{ name: "Pirmam Hospital" }],
  icons: {
    /* EDIT: Replace with hospital favicon path */
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* dir="rtl" for Kurdish Sorani right-to-left support */
    <html lang="ku" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
