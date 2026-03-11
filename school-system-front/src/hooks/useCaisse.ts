import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { caisseApi, CaisseRequest, MouvementRequest } from "@/api/caisse.api";
import { useToast } from "@/hooks/use-toast";

const KEYS = {
  all: (annee: string) => ["caisse", annee] as const,
  ouverte: (annee: string) => ["caisse", "ouverte", annee] as const,
  mouvements: (id: number) => ["caisse", "mouvements", id] as const,
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

export function useMouvements(caisseId: number) {
  return useQuery({
    queryKey: KEYS.mouvements(caisseId),
    queryFn: () => caisseApi.getMouvements(caisseId),
    enabled: !!caisseId,
  });
}

export function useOuvrirCaisse() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: CaisseRequest) => caisseApi.ouvrir(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caisse"] });
      toast({ title: "Caisse ouverte avec succes" });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.message || "Erreur", variant: "destructive" }),
  });
}

export function useFermerCaisse() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, fermePar }: { id: number; fermePar?: string }) => caisseApi.fermer(id, fermePar),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caisse"] });
      toast({ title: "Caisse fermee avec succes" });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.message || "Erreur", variant: "destructive" }),
  });
}

export function useAddMouvement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: MouvementRequest) => caisseApi.addMouvement(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caisse"] });
      toast({ title: "Mouvement ajoute" });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.message || "Erreur", variant: "destructive" }),
  });
}

export function useDeleteMouvement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => caisseApi.deleteMouvement(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caisse"] });
      toast({ title: "Mouvement supprime" });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.message || "Erreur", variant: "destructive" }),
  });
}
