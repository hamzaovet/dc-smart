"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getPermissions, RolePermissions } from "@/lib/permissions";

export interface StaffUser {
  id: string;
  name: string;
  username: string;
  role: string;
  phone?: string | null;
  avatar?: string | null;
  isActive?: boolean;
}

interface StaffContextType {
  currentUser: StaffUser | null;
  setCurrentUser: (user: StaffUser | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  permissions: RolePermissions;
  loading: boolean;
  refreshUser: () => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("rovy_user");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("rovy_auth_change", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("rovy_auth_change", handleStorageChange);
    };
  }, []);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("rovy_user");
    window.dispatchEvent(new CustomEvent("rovy_auth_change"));
  };

  const handleSetUser = (user: StaffUser | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("rovy_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("rovy_user");
    }
    window.dispatchEvent(new CustomEvent("rovy_auth_change"));
  };

  const permissions = getPermissions(currentUser?.role);
  const isAuthenticated = !!currentUser;

  return (
    <StaffContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetUser,
        logout,
        isAuthenticated,
        permissions,
        loading,
        refreshUser: loadUser,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) {
    throw new Error("useStaff must be used within StaffProvider");
  }
  return ctx;
}
