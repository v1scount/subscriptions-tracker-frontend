import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import { Subscription, CreateSubscriptionInput } from "@/src/types/subscription";
import { CatalogEntry } from "@/src/types/catalog";
import { CACHE_ONE_YEAR_SECONDS } from "next/dist/lib/constants";

export function useSubscriptions() {
  const { data: session } = useSession();
  const { lang } = useParams();

  return useQuery({
    queryKey: ["subscriptions", lang, session?.accessToken],
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
  const { data: session, status } = useSession();
  const { lang } = useParams();

  console.log('session', session)

  const isEnabled = !!session?.accessToken;

  console.log('[useCatalogEntries] Rendering', { 
    status, 
    hasToken: !!session?.accessToken, 
    isEnabled,
    lang 
  });

  return useQuery({
    queryKey: ["catalog", lang, session?.accessToken],
    queryFn: () => {
      console.log('[useCatalogEntries] queryFn triggered!');
      return apiFetch<CatalogEntry[]>("/subscriptions/catalog", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
    },
    enabled: isEnabled,
    staleTime: 0,
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
