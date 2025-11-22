import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { User } from "@/types/user";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get<User[]>("/users");
      return res.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
