import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nodeheus.com"),
  title: "nodeheus — the infrastructure of everything",
  description:
    "nodeheus is a global technology conglomerate operating across cloud, intelligence, silicon, robotics, finance, security, health, energy and space.",
  openGraph: {
    title: "nodeheus",
    description: "The infrastructure of everything.",
    url: "https://nodeheus.com",
    siteName: "nodeheus",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
