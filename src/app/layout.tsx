import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Manrope, Space_Grotesk } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "iGates LeadFlow | Admissions CRM",
  description: "Lead generation and admissions management system for iGates International Campus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,#e2e8f0_0%,#f8fafc_32%,#eef2ff_100%)] text-slate-950 antialiased">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 lg:p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}