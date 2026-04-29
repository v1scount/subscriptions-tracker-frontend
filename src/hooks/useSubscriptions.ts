import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/src/lib/api";
import { Subscription, CreateSubscriptionInput } from "@/src/types/subscription";
import { CatalogEntry } from "@/src/types/catalog";

export function useSubscriptions() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () =>
      apiFetch<Subscription[]>("/subscriptions", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }),
    enabled: !!session?.accessToken,
  });
}

export function useCatalogEntries() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["catalog"],
    queryFn: () =>
      apiFetch<CatalogEntry[]>("/subscriptions/catalog", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }),
    enabled: !!session?.accessToken,
  });
}

export function useCreateSubscription() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionInput) =>
      apiFetch<Subscription>("/subscriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}
