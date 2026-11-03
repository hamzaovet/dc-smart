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
  title: "ميني بيك | Mini Pick — بوتيك الألعاب التركيبية والهدايا الترند والنيش",
  description:
    "أرقى العطور العالمية، التيسترات الأصلية المعتمدة وبدائل النيش الملكية. دقة وفخامة استثنائي مع خدمة الدفع عند الاستلام والتجربة قبل الدفع.",
  keywords: [
    "ميني بيك",
    "عطور",
    "بدائل نيش",
    "عطور شتوية",
    "تيسترات أصلية",
    "عطور فرنسية",
    "Mini Pick",
    "Perfumes Egypt",
    "Winter Fragrances",
  ],
  icons: {
    icon: "/app-icon.png",
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
      <body className="min-h-screen bg-[#07060a] text-[#f7f4ed] antialiased flex flex-col justify-between selection:bg-pink-500 selection:text-black">
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
