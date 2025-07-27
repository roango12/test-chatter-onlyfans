import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Test de Sélection Chatter OnlyFans",
  description: "Évaluez vos compétences clés pour le succès en tant que chatter OnlyFans",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-stone-100 text-gray-800`}>
        {children}
      </body>
    </html>
  );
}