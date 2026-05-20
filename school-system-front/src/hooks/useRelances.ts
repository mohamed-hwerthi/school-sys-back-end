import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { relancesApi, RelanceRequest, TypeRelance } from "@/api/relances.api";
import { notify } from "@/lib/toast";

const KEYS = {
  all: (annee: string) => ["relances", annee] as const,
  byStudent: (id: string, annee: string) => ["relances", "student", id, annee] as const,
  pending: (annee: string) => ["relances", "pending", annee] as const,
  stats: (annee: string) => ["relances", "stats", annee] as const,
};

export function useRelances(anneeScolaire = "2025-2026") {
  return useQuery({
    queryKey: KEYS.all(anneeScolaire),
    queryFn: () => relancesApi.getAll(anneeScolaire),
  });
}

export function useRelancesByStudent(studentId: string, anneeScolaire = "2025-2026") {
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
  return useMutation({
    mutationFn: (data: RelanceRequest) => relancesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      notify.success("Relance creee avec succes");
    },
    onError: () => notify.error("Erreur lors de la creation"),
  });
}

export function useGenerateRelances(anneeScolaire = "2025-2026") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (type: TypeRelance) => relancesApi.generate(anneeScolaire, type),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      notify.success(`${data.length} relance(s) generee(s)`);
    },
    onError: () => notify.error("Erreur lors de la generation"),
  });
}

export function useMarkRelanceEnvoyee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => relancesApi.markEnvoyee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      notify.success("Relance marquee comme envoyee");
    },
    onError: () => notify.error("Erreur"),
  });
}

export function useMarkRelanceEchouee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => relancesApi.markEchouee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      notify.success("Relance marquee comme echouee");
    },
    onError: () => notify.error("Erreur"),
  });
}

export function useDeleteRelance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => relancesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["relances"] });
      notify.success("Relance supprimee");
    },
    onError: () => notify.error("Erreur lors de la suppression"),
  });
}
