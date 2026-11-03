export type UserRole = "owner" | "manager" | "cashier" | "staff" | "accountant";

export interface RolePermissions {
  label: string;
  labelEn: string;
  badgeColor: string;
  defaultRoute: string;
  canViewOrders: boolean;
  canCreateOrder: boolean;
  canUpdateOrderStatus: boolean;
  canDeleteOrder: boolean;
  canViewMenu: boolean;
  canEditMenu: boolean;
  canViewInventory: boolean;
  canEditInventory: boolean;
  canViewExpenses: boolean;
  canAddExpense: boolean;
  canViewReports: boolean;
  canViewFinance: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  owner: {
    label: "المايسترو (المالك العام)",
    labelEn: "Owner / Maestro",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/40",
    defaultRoute: "/dashboard",
    canViewOrders: true,
    canCreateOrder: true,
    canUpdateOrderStatus: true,
    canDeleteOrder: true,
    canViewMenu: true,
    canEditMenu: true,
    canViewInventory: true,
    canEditInventory: true,
    canViewExpenses: true,
    canAddExpense: true,
    canViewReports: true,
    canViewFinance: true,
    canManageUsers: true,
    canManageSettings: true,
  },
  manager: {
    label: "مدير التشغيل العام",
    labelEn: "Operations Manager",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    defaultRoute: "/dashboard",
    canViewOrders: true,
    canCreateOrder: true,
    canUpdateOrderStatus: true,
    canDeleteOrder: false,
    canViewMenu: true,
    canEditMenu: true,
    canViewInventory: true,
    canEditInventory: true,
    canViewExpenses: true,
    canAddExpense: true,
    canViewReports: true,
    canViewFinance: false,
    canManageUsers: false,
    canManageSettings: false,
  },
  cashier: {
    label: "كاشير نقطة البيع (POS)",
    labelEn: "POS Cashier",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    defaultRoute: "/cashier",
    canViewOrders: true,
    canCreateOrder: true,
    canUpdateOrderStatus: true,
    canDeleteOrder: false,
    canViewMenu: true,
    canEditMenu: false,
    canViewInventory: false,
    canEditInventory: false,
    canViewExpenses: false,
    canAddExpense: true,
    canViewReports: false,
    canViewFinance: false,
    canManageUsers: false,
    canManageSettings: false,
  },
  staff: {
    label: "مسؤول المخازن والتركيبات",
    labelEn: "Perfume Lab & Stock",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    defaultRoute: "/inventory",
    canViewOrders: true,
    canCreateOrder: false,
    canUpdateOrderStatus: true,
    canDeleteOrder: false,
    canViewMenu: true,
    canEditMenu: false,
    canViewInventory: true,
    canEditInventory: true,
    canViewExpenses: false,
    canAddExpense: false,
    canViewReports: false,
    canViewFinance: false,
    canManageUsers: false,
    canManageSettings: false,
  },
  accountant: {
    label: "محاسب الخزينة والمصروفات",
    labelEn: "Accountant",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    defaultRoute: "/reports",
    canViewOrders: true,
    canCreateOrder: false,
    canUpdateOrderStatus: false,
    canDeleteOrder: false,
    canViewMenu: false,
    canEditMenu: false,
    canViewInventory: true,
    canEditInventory: false,
    canViewExpenses: true,
    canAddExpense: true,
    canViewReports: true,
    canViewFinance: true,
    canManageUsers: false,
    canManageSettings: false,
  },
};

export function getPermissions(role?: string): RolePermissions {
  if (!role) return ROLE_PERMISSIONS.manager;
  const normalized = role.toLowerCase() as UserRole;
  return ROLE_PERMISSIONS[normalized] || ROLE_PERMISSIONS.manager;
}
