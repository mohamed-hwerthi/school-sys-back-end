import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { relancesApi, RelanceRequest, TypeRelance } from "@/api/relances.api";
import { useToast } from "@/hooks/use-toast";

const KEYS = {
  all: (annee: string) => ["relances", annee] as const,
  byStudent: (id: number, annee: string) => ["relances", "student", id, annee] as const,
  pending: (annee: string) => ["relances", "pending", annee] as const,
  stats: (annee: string) => ["relances", "stats", annee] as const,
};

export function useRelances(anneeScolaire = "2025-2026") {
  return useQuery({
    queryKey: KEYS.all(anneeScolaire),
    queryFn: () => relancesApi.getAll(anneeScolaire),
  });
}

export function useRelancesByStudent(studentId: number, anneeScolaire = "2025-2026") {
  return useQuery({
    queryKey: KEYS.byStudent(studentId, anneeScolaire),
    queryFn: () => relancesApi.getByStudent(studentId, anneeScolaire),
    enabled: !!studentId,
  });
}

export function useRelancesPending(anneeScolaire = "2025-2026") {
  return useQuery({
    queryKey: KEYS.pending(anneeScolaire),
    queryFn: () => relancesApi.getPending(anneeScolaire),
  });
}

export function useRelanceStats(anneeScolaire = "2025-2026") {
  return useQuery({
    queryKey: KEYS.stats(anneeScolaire),
    queryFn: () => relancesApi.getStats(anneeScolaire),
  });
}

export function useCreateRelance(anneeScolaire = "2025-2026") {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: RelanceRequest) => relancesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      toast({ title: "Relance creee avec succes" });
    },
    onError: () => toast({ title: "Erreur lors de la creation", variant: "destructive" }),
  });
}

export function useGenerateRelances(anneeScolaire = "2025-2026") {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (type: TypeRelance) => relancesApi.generate(anneeScolaire, type),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      toast({ title: `${data.length} relance(s) generee(s)` });
    },
    onError: () => toast({ title: "Erreur lors de la generation", variant: "destructive" }),
  });
}

export function useMarkRelanceEnvoyee() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => relancesApi.markEnvoyee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      toast({ title: "Relance marquee comme envoyee" });
    },
    onError: () => toast({ title: "Erreur", variant: "destructive" }),
  });
}

export function useMarkRelanceEchouee() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => relancesApi.markEchouee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      toast({ title: "Relance marquee comme echouee" });
    },
    onError: () => toast({ title: "Erreur", variant: "destructive" }),
  });
}

export function useDeleteRelance() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => relancesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      toast({ title: "Relance supprimee" });
    },
    onError: () => toast({ title: "Erreur lors de la suppression", variant: "destructive" }),
  });
}
