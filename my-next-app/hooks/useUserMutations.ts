import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { User } from "@/types/user";
import { useActivityStore } from "@/store/activityStore";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const addActivity = useActivityStore((s) => s.addActivity);

  return useMutation({
    mutationFn: async (userId: number) => {
      await api.delete(`/users/${userId}`);
    },
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      // Find user for activity log
      const user = previousUsers?.find((u) => u.id === userId);

      // Optimistically update - remove user
      queryClient.setQueryData<User[]>(["users"], (old) => {
        if (!old) return old;
        return old.filter((u) => u.id !== userId);
      });

      // Log activity
      if (user) {
        addActivity({
          type: "delete",
          userName: user.name,
          userId: user.id,
          details: `Deleted user: ${user.name}`,
        });
      }

      return { previousUsers };
    },
    onError: (err, userId, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const addActivity = useActivityStore((s) => s.addActivity);

  return useMutation({
    mutationFn: async (user: User) => {
      const res = await api.put(`/users/${user.id}`, user);
      return res.data;
    },
    onMutate: async (updatedUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      // Optimistically update - replace user
      queryClient.setQueryData<User[]>(["users"], (old) => {
        if (!old) return old;
        return old.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      });

      // Log activity
      addActivity({
        type: "update",
        userName: updatedUser.name,
        userId: updatedUser.id,
        details: `Updated user: ${updatedUser.name}`,
      });

      return { previousUsers };
    },
    onError: (err, updatedUser, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const addActivity = useActivityStore((s) => s.addActivity);

  return useMutation({
    mutationFn: async (user: Omit<User, "id">) => {
      const res = await api.post("/users", user);
      return res.data;
    },
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      // Optimistically add new user with temp ID
      const tempId = Date.now();
      const fakeUser = { ...newUser, id: tempId } as User;
      
      queryClient.setQueryData<User[]>(["users"], (old) => {
        if (!old) return [fakeUser];
        return [...old, fakeUser];
      });

      // Log activity
      addActivity({
        type: "create",
        userName: newUser.name,
        userId: tempId,
        details: `Created user: ${newUser.name}`,
      });

      return { previousUsers, tempId };
    },
    onSuccess: (data, newUser, context) => {
      // Replace temp user with real API response
      if (context?.tempId) {
        queryClient.setQueryData<User[]>(["users"], (old) => {
          if (!old) return [data];
          return old.map((u) =>
            u.id === context.tempId ? { ...data, id: data.id || context.tempId } : u
          );
        });
      }
    },
    onError: (err, newUser, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
  });
}
