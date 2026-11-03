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
  storeNameAr: "دي سي سمارت — للأنظمة الأمنية والتحكم الذكي",
  storeNameEn: "DC Smart — Smart Security & Technology Solutions",
  taglineAr: "كاميرات مراقبة متطورة بدقة 4K و Full Color، أجهزة XVR/NVR، شبكات وحلول أمنية ذكية",
  taglineEn: "Advanced 4K & Full Color CCTV Surveillance, XVR/NVR Recording & Smart Security Solutions",
  whatsappPhone: "01281248731",
  hotline: "01008657085",
  secondaryPhone: "01007302685",
  googleMapsUrl: "https://maps.google.com/?q=Tanta,Gharbia,Egypt",
  addressAr: "طنطا — محافظة الغربية — جمهورية مصر العربية",
  addressEn: "Tanta, Gharbia Governorate, Egypt",
  workingHoursAr: "يومياً من 9:00 صباحاً حتى 11:00 مساءً",
  workingHoursEn: "Daily from 9:00 AM to 11:00 PM",
  instagramHandle: "dcsmart.cctv",
  announcementAr: "🛡️ ضمان عامين شامل استبدال فوري لكافة كاميرات المراقبة وأجهزة التسجيل + معاينة وتركيب احترافي",
  announcementEn: "🛡️ 2-Year Full Replacement Warranty on all CCTV Cameras & DVRs + Professional Installation",
  deliveryFee: 50.0,
  freeShippingThreshold: 5000.0,
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
