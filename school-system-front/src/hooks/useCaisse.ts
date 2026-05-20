import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { caisseApi, CaisseRequest, MouvementRequest } from "@/api/caisse.api";
import { notify } from "@/lib/toast";

const KEYS = {
  all: (annee: string) => ["caisse", annee] as const,
  ouverte: (annee: string) => ["caisse", "ouverte", annee] as const,
  mouvements: (id: string) => ["caisse", "mouvements", id] as const,
};

export function useCaisses(anneeScolaire = "2025-2026") {
  return useQuery({
    queryKey: KEYS.all(anneeScolaire),
    queryFn: () => caisseApi.getAll(anneeScolaire),
  });
}

export function useCaisseOuverte(anneeScolaire = "2025-2026") {
  return useQuery({
    queryKey: KEYS.ouverte(anneeScolaire),
    queryFn: () => caisseApi.getOuverte(anneeScolaire),
  });
}

export function useMouvements(caisseId: string) {
  return useQuery({
    queryKey: KEYS.mouvements(caisseId),
    queryFn: () => caisseApi.getMouvements(caisseId),
    enabled: !!caisseId,
  });
}

export function useOuvrirCaisse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CaisseRequest) => caisseApi.ouvrir(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caisse"] });
      notify.success("Caisse ouverte avec succes");
    },
    onError: (err: any) => notify.error(err?.response?.data?.message || "Erreur"),
  });
}

export function useFermerCaisse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fermePar }: { id: string; fermePar?: string }) => caisseApi.fermer(id, fermePar),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caisse"] });
      notify.success("Caisse fermee avec succes");
    },
    onError: (err: any) => notify.error(err?.response?.data?.message || "Erreur"),
  });
}

export function useAddMouvement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MouvementRequest) => caisseApi.addMouvement(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caisse"] });
      notify.success("Mouvement ajoute");
    },
    onError: (err: any) => notify.error(err?.response?.data?.message || "Erreur"),
  });
}

export function useDeleteMouvement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => caisseApi.deleteMouvement(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caisse"] });
      notify.success("Mouvement supprime");
    },
    onError: (err: any) => notify.error(err?.response?.data?.message || "Erreur"),
  });
}
