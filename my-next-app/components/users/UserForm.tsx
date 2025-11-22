"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { User } from "@/types/user";
import { useState, useEffect } from "react";

interface Props {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: any) => void;
  isSubmitting: boolean;
}

export default function UserForm({
  user,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        companyName: user.company.name,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        companyName: "",
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      ...(user && { id: user.id }),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: {
        name: formData.companyName,
      },
      address: user?.address || {
        street: "N/A",
        city: "N/A",
        zipcode: "N/A",
      },
    };

    onSubmit(userData as any);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 w-[90vw] max-w-lg shadow-lg max-h-[85vh] overflow-y-auto"
          style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
        >
          <Dialog.Title className="text-xl font-semibold mb-4">
            {user ? "Edit User" : "Create User"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-md"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--foreground)",
                }}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 rounded-md"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--foreground)",
                }}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Phone</label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 rounded-md"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--foreground)",
                }}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Company</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-md"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--foreground)",
                }}
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 rounded-md"
                style={{ border: "1px solid var(--border)" }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50"
                style={{ backgroundColor: "var(--primary)" }}
                onMouseEnter={(e) =>
                  !isSubmitting && (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                }
                onMouseLeave={(e) =>
                  !isSubmitting && (e.currentTarget.style.backgroundColor = "var(--primary)")
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : user ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
