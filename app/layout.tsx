import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { CartProvider } from "../context/CartContext";
import { StaffProvider } from "../context/StaffContext";
import { StoreSettingsProvider } from "../context/StoreSettingsContext";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "دي سي سمارت | DC Smart — كاميرات مراقبة وأنظمة أمنية وتحكم ذكي",
  description:
    "أنظمة المراقبة التلفزيونية CCTV، كاميرات داهوا وهيكفيجن ويوني آرك، أجهزة XVR و NVR، شبكات وحلول أمنية ذكية في طنطا وجميع المحافظات.",
  keywords: [
    "دي سي سمارت",
    "DC Smart",
    "كاميرات مراقبة",
    "داهوا",
    "هيكفيجن",
    "أنظمة أمنية",
    "CCTV",
    "Dahua",
    "Hikvision",
    "Uniarch",
    "طنطا",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/app-icon.png", type: "image/png" },
    ],
    apple: "/app-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen bg-[#07060a] text-[#f7f4ed] antialiased flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
        <LanguageProvider>
          <StoreSettingsProvider>
            <StaffProvider>
              <CartProvider>
                <Navbar />
                <CartDrawer />
                <main className="flex-1">{children}</main>
                <Footer />
              </CartProvider>
            </StaffProvider>
          </StoreSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
