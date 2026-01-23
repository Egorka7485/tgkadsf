import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// GET /api/cart
export function useCart() {
  return useQuery({
    queryKey: [api.cart.list.path],
    queryFn: async () => {
      const res = await fetch(api.cart.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return api.cart.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/cart (Add item)
export function useAddToCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (channelId: number) => {
      const res = await fetch(api.cart.add.path, {
        method: api.cart.add.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId }),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add to cart");
      }
      return api.cart.add.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.list.path] });
      toast({
        title: "Added to cart",
        description: "Channel has been added to your selection",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// DELETE /api/cart/:id (Remove item)
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cart.remove.path, { id });
      const res = await fetch(url, { 
        method: api.cart.remove.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.list.path] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  });
}

// POST /api/cart/checkout
export function useCheckout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.cart.checkout.path, {
        method: api.cart.checkout.method,
        credentials: "include"
      });
      if (!res.ok) throw new Error("Checkout failed");
      return api.cart.checkout.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.list.path] });
      toast({
        title: "Order Successful!",
        description: "Your advertising campaign is being processed.",
        className: "bg-green-600 text-white border-none",
      });
    },
    onError: (error) => {
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
