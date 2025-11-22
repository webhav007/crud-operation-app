"use client";

import { useAuthStore } from "@/store/authStore";
import { useActivityStore } from "@/store/activityStore";
import Avatar from "./Avatar";
import ThemeToggle from "./themeToggle";
import ActivityLog from "./ActivityLog";
import { useState } from "react";
import { FaHistory } from "react-icons/fa";


export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const activities = useActivityStore((s) => s.activities);
  const [showActivityLog, setShowActivityLog] = useState(false);

  return (
    <>
      <nav 
        className="w-full px-6 py-4 flex justify-between items-center"
        style={{ 
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--background)'
        }}
      >
        <h1 className="text-xl font-semibold">Jumbo Dashboard</h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Activity Log Button */}
          <button
            onClick={() => setShowActivityLog(true)}
            className="relative p-2 rounded-md transition-colors"
            style={{ border: "1px solid var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--card)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <FaHistory />
            {activities.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: "var(--danger)" }}
              >
                {activities.length > 9 ? "9+" : activities.length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <Avatar name={user.name} />
            <span>{user.name}</span>
          </div>
        </div>
      </nav>

      <ActivityLog isOpen={showActivityLog} onClose={() => setShowActivityLog(false)} />
    </>
  );
}
