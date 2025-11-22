import { create } from "zustand";

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser;
}

export const useAuthStore = create<AuthState>(() => ({
  user: {
    id: 1,
    name: "Leanne Graham",
    email: "leanne@example.com",
  },
}));
