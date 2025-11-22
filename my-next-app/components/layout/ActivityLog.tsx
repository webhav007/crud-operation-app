"use client";

import { useActivityStore } from "@/store/activityStore";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityLog({ isOpen, onClose }: Props) {
  const activities = useActivityStore((s) => s.activities);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "create":
        return <FaPlus style={{ color: "var(--primary)" }} />;
      case "update":
        return <FaEdit style={{ color: "var(--primary)" }} />;
      case "delete":
        return <FaTrash style={{ color: "var(--danger)" }} />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-96 z-50 shadow-2xl overflow-y-auto"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 p-4 flex justify-between items-center"
          style={{
            backgroundColor: "var(--card)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h2 className="text-xl font-semibold">Activity Log</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:opacity-80"
            style={{ color: "var(--muted)" }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Activities */}
        <div className="p-4">
          {activities.length === 0 ? (
            <p className="text-center py-8" style={{ color: "var(--muted)" }}>
              No activities yet
            </p>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {activities.length} {activities.length === 1 ? "activity" : "activities"}
                </p>
              </div>

              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium capitalize">
                          {activity.type}d User
                        </p>
                        <p
                          className="text-sm mt-1 truncate"
                          style={{ color: "var(--muted)" }}
                        >
                          {activity.details}
                        </p>
                        <p
                          className="text-xs mt-2"
                          style={{ color: "var(--muted)" }}
                        >
                          {formatTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
