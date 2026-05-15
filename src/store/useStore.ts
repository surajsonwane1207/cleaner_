import { create } from "zustand";

interface UserState {
  user: Record<string, unknown> | null;
  setUser: (user: Record<string, unknown>) => void;
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
