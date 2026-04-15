import { Inter } from "next/font/google";
import "./globals.css"; // O'zimizning animatsiyalar uchun
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Testify",
  description: "AI yordamida tezkor testlar...",
};

// themeColor uchun alohida viewport ochiladi:
export const viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        {/* MANA SHU LINK TAILWIND'NI 100% ISHLATIB BERADI 👇 */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.1.0/uicons-regular-rounded/css/uicons-regular-rounded.css' />
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