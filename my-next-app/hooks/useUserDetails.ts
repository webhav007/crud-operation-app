import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { User } from "@/types/user";

export function useUserDetail(userId: string) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const res = await api.get<User>(`/users/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
}
