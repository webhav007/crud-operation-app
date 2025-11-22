import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  dark: boolean;
  toggleDark: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      dark: false,

      toggleDark: () =>
        set((state) => ({
          dark: !state.dark,
        })),
    }),
    {
      name: "theme-store",
    }
  )
);
