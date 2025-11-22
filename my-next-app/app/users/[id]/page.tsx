"use client";

import { useParams, useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUser";
import { FaArrowLeft, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import { useMemo } from "react";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: allUsers, isLoading } = useUsers();

  const user = useMemo(() => {
    if (!allUsers) return null;
    return allUsers.find((u) => u.id === Number(userId));
  }, [allUsers, userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4"
            style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
          />
          <p style={{ color: "var(--muted)" }}>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: "var(--danger)" }}>
            User not found
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 text-white rounded-md transition-colors"
            style={{ backgroundColor: "var(--primary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary)")
            }
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
        style={{ border: "1px solid var(--border)" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--card)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <FaArrowLeft />
        Back to Users
      </button>

      {/* User Header */}
      <div
        className="rounded-lg p-8"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-full text-white flex items-center justify-center text-3xl font-bold"
            style={{ backgroundColor: "var(--avatar-bg)" }}
          >
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p style={{ color: "var(--muted)" }}>User ID: {user.id}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div
        className="rounded-lg p-6"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaEnvelope style={{ color: "var(--primary)" }} className="text-xl" />
            <div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Email
              </p>
              <a
                href={`mailto:${user.email}`}
                className="hover:underline"
                style={{ color: "var(--primary)" }}
              >
                {user.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaPhone style={{ color: "var(--primary)" }} className="text-xl" />
            <div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Phone
              </p>
              <a
                href={`tel:${user.phone}`}
                className="hover:underline"
                style={{ color: "var(--primary)" }}
              >
                {user.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div
        className="rounded-lg p-6"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        <div className="flex items-center gap-3">
          <FaBuilding style={{ color: "var(--primary)" }} className="text-xl" />
          <div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Company
            </p>
            <p className="font-medium">{user.company.name}</p>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div
        className="rounded-lg p-6"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-xl font-semibold mb-4">Address</h2>
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt style={{ color: "var(--primary)" }} className="text-xl mt-1" />
          <div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Location
            </p>
            <p className="font-medium">
              {user.address.street}
              <br />
              {user.address.city}, {user.address.zipcode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
