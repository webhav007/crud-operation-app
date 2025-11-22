"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { User } from "@/types/user";

interface Props {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirm({
  user,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 w-[90vw] max-w-md shadow-lg"
          style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
        >
          <Dialog.Title className="text-xl font-semibold mb-4">
            Delete User
          </Dialog.Title>

          <Dialog.Description className="mb-6" style={{ color: "var(--muted)" }}>
            Are you sure you want to delete <strong>{user.name}</strong>? This
            action cannot be undone.
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-md"
              style={{ border: "1px solid var(--border)" }}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50"
              style={{ backgroundColor: "var(--danger)" }}
              onMouseEnter={(e) =>
                !isDeleting && (e.currentTarget.style.backgroundColor = "var(--danger-hover)")
              }
              onMouseLeave={(e) =>
                !isDeleting && (e.currentTarget.style.backgroundColor = "var(--danger)")
              }
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
