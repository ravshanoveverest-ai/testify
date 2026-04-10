import { Inter } from "next/font/google";
import "./globals.css"; // O'zimizning animatsiyalar uchun
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Testify - Test Yaratish Platformasi",
  description: "O'z testlaringizni oson yarating va ishlashga bering",
  manifest: "/manifest.json", // <-- MANA SHU QATOR MUHIM! PWABuilder shuni qidiryapti
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        {/* MANA SHU LINK TAILWIND'NI 100% ISHLATIB BERADI 👇 */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar /> {/* Saytning tepadagi qismi */}
          <main className="flex-1 flex-grow">
            {children} {/* Sahifalar shu yerda ochiladi */}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}