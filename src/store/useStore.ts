import { create } from "zustand";

interface UserState {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void;
}

interface UIState {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  notifications: any[];
  addNotification: (notification: any) => void;
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
