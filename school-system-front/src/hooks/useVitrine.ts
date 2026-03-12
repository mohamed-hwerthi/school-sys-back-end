import { useQuery } from "@tanstack/react-query";
import { vitrinePublicApi } from "@/api/vitrine.api";

/**
 * Hook for public vitrine data (no auth).
 */
export function useVitrine(slug: string | undefined) {
  return useQuery({
    queryKey: ["vitrine", slug],
    queryFn: () => vitrinePublicApi.getFullVitrine(slug!),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 min cache for public data
  });
}

export function useVitrinePage(slug: string | undefined, pageSlug: string | undefined) {
  return useQuery({
    queryKey: ["vitrine", slug, "page", pageSlug],
    queryFn: () => vitrinePublicApi.getPage(slug!, pageSlug!),
    enabled: !!slug && !!pageSlug,
    staleTime: 10 * 60 * 1000,
  });
}
