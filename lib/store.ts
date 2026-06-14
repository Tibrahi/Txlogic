"use client";

import { create } from "zustand";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface AppState {
  user: User | null;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notificationCount: number;
  setUser: (user: User | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setNotificationCount: (count: number) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  sidebarOpen: false,
  sidebarCollapsed: false,
  notificationCount: 0,
  setUser: (user) => set({ user }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setNotificationCount: (notificationCount) => set({ notificationCount }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));