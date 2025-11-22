import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Activity {
  id: string;
  type: "create" | "update" | "delete";
  userName: string;
  userId: number;
  timestamp: number;
  details?: string;
}

interface ActivityState {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      addActivity: (activity) =>
        set((state) => ({
          activities: [
            {
              ...activity,
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
            },
            ...state.activities,
          ].slice(0, 50),
        })),
      clearActivities: () => set({ activities: [] }),
    }),
    { name: "activity-store" }
  )
);
