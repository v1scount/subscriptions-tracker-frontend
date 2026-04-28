import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/src/lib/api";
import {
  CatalogEntry,
  CreateCatalogEntryInput,
  UpdateCatalogEntryInput,
} from "@/src/types/catalog";

export function useAdminCatalogEntries() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["admin-catalog"],
    queryFn: () =>
      apiFetch<CatalogEntry[]>("/admin/catalog", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }),
    enabled: !!session?.accessToken,
  });
}

export function useAdminCatalogEntry(id: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["admin-catalog", id],
    queryFn: () =>
      apiFetch<CatalogEntry>(`/admin/catalog/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }),
    enabled: !!session?.accessToken && !!id,
  });
}

export function useCreateAdminCatalogEntry() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCatalogEntryInput) =>
      apiFetch<CatalogEntry>("/admin/catalog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-catalog"] });
    },
  });
}

export function useUpdateAdminCatalogEntry() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCatalogEntryInput }) =>
      apiFetch<CatalogEntry>(`/admin/catalog/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-catalog"] });
      queryClient.invalidateQueries({ queryKey: ["admin-catalog", variables.id] });
    },
  });
}

export function useDeleteAdminCatalogEntry() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/admin/catalog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-catalog"] });
    },
  });
}
