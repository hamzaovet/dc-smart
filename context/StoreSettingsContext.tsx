"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface StoreSettingsData {
  storeNameAr: string;
  storeNameEn: string;
  taglineAr: string;
  taglineEn: string;
  whatsappPhone: string;
  hotline: string;
  secondaryPhone?: string;
  googleMapsUrl?: string;
  addressAr: string;
  addressEn: string;
  workingHoursAr: string;
  workingHoursEn: string;
  instagramHandle: string;
  announcementAr: string;
  announcementEn: string;
  deliveryFee: number;
  freeShippingThreshold: number;
}

const defaultSettings: StoreSettingsData = {
  storeNameAr: "ميني بيك — متجر الهدايا والترندات اللطيفة",
  storeNameEn: "Mini Pick — Aesthetic Gifts & Lifestyle",
  taglineAr: "عالمكِ الوردي الأنيق لأجمل مكعبات النانو، البيدازلنج الكريستالي، والمنظمات الكيوت",
  taglineEn: "Your Aesthetic Pink World for Nano Blocks, Bedazzling & Cute Stationery",
  whatsappPhone: "01050757837",
  hotline: "01050757837",
  secondaryPhone: "01069819381",
  googleMapsUrl: "https://maps.google.com/?q=Tanta,Gharbia,Egypt",
  addressAr: "طنطا — محافظة الغربية — جمهورية مصر العربية",
  addressEn: "Tanta, Gharbia Governorate, Egypt",
  workingHoursAr: "يومياً من 11 صباحاً حتى 11 مساءً",
  workingHoursEn: "Daily from 11:00 AM to 11:00 PM",
  instagramHandle: "minipick.eg",
  announcementAr: "✨ شحن مجاني لكافة محافظات مصر للطلبات فوق 500 ج.م + هدايا ستيكرات كيوت مجانية مع كل أوردر ✨",
  announcementEn: "✨ Free express shipping across Egypt on orders over 500 EGP + free cute stickers with every order ✨",
  deliveryFee: 45.0,
  freeShippingThreshold: 500.0,
};

interface StoreSettingsContextType {
  settings: StoreSettingsData;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<StoreSettingsData>) => Promise<boolean>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
  updateSettings: async () => false,
});

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({
            ...defaultSettings,
            ...data.settings,
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch store settings:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Partial<StoreSettingsData>): Promise<boolean> => {
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({
            ...defaultSettings,
            ...data.settings,
          });
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error("Failed to update store settings:", e);
      return false;
    }
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
