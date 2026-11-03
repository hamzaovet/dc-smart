import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dcsmart.app",
  appName: "دي سي سمارت",
  webDir: "public",
  server: {
    url: "https://dc-smart.vercel.app",
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#080c14",
  },
};

export default config;
