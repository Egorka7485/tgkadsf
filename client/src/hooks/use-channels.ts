import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ChannelFilter } from "@shared/routes";
import { type InsertChannel } from "@shared/schema";

// GET /api/channels
export function useChannels(filters?: ChannelFilter) {
  return useQuery({
    queryKey: [api.channels.list.path, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
        if (filters.minSubs) params.append("minSubs", filters.minSubs.toString());
      }
      
      const url = `${api.channels.list.path}?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch channels");
      return api.channels.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/channels/:id
export function useChannel(id: number) {
  return useQuery({
    queryKey: [api.channels.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.channels.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch channel");
      return api.channels.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/channels (Admin)
export function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertChannel) => {
      const res = await fetch(api.channels.create.path, {
        method: api.channels.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create channel");
      }
      return api.channels.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.channels.list.path] });
    },
  });
}
