import { useQuery } from "@tanstack/react-query";
import { tresorerieApi, type TresorerieDTO } from "@/api/tresorerie.api";

const TRESORERIE_KEY = "tresorerie";

export function useTresorerie(anneeScolaire: string = "2025-2026") {
  return useQuery<TresorerieDTO>({
    queryKey: [TRESORERIE_KEY, anneeScolaire],
    queryFn: () => tresorerieApi.get(anneeScolaire),
    enabled: !!anneeScolaire,
  });
}
