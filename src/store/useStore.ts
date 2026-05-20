import { create } from "zustand";

export interface AppUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface UserState {
  user: AppUser | null;
  setUser: (user: AppUser) => void;
  logout: () => void;
}

interface UIState {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  notifications: Record<string, unknown>[];
  addNotification: (notification: Record<string, unknown>) => void;
}

export const useStore = create<UserState & UIState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  
  isSidebarOpen: false,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  notifications: [],
  addNotification: (notification) => 
    set((state) => ({ notifications: [...state.notifications, notification] })),
}));
