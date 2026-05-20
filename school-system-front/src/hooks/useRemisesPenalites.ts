import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  remisesApi,
  penalitesApi,
  type RemiseDTO,
  type PenaliteDTO,
  type RemiseRequest,
  type PenaliteRequest,
} from "@/api/remises-penalites.api";

const REMISES_KEY = "remises";
const PENALITES_KEY = "penalites";
const DEFAULT_ANNEE = "2025-2026";

// ─── Remises ──────────────────────────────────────────

export function useRemises(anneeScolaire = DEFAULT_ANNEE) {
  return useQuery<RemiseDTO[]>({
    queryKey: [REMISES_KEY, anneeScolaire],
    queryFn: () => remisesApi.getAll(anneeScolaire),
  });
}

export function useRemisesByStudent(studentId: string, anneeScolaire = DEFAULT_ANNEE) {
  return useQuery<RemiseDTO[]>({
    queryKey: [REMISES_KEY, "student", studentId, anneeScolaire],
    queryFn: () => remisesApi.getByStudent(studentId, anneeScolaire),
    enabled: !!studentId,
  });
}

export function useCreateRemise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RemiseRequest) => remisesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REMISES_KEY] });
    },
  });
}

export function useUpdateRemise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RemiseRequest }) =>
      remisesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REMISES_KEY] });
    },
  });
}

export function useDeleteRemise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remisesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REMISES_KEY] });
    },
  });
}

// ─── Pénalités ────────────────────────────────────────

export function usePenalites(anneeScolaire = DEFAULT_ANNEE) {
  return useQuery<PenaliteDTO[]>({
    queryKey: [PENALITES_KEY, anneeScolaire],
    queryFn: () => penalitesApi.getAll(anneeScolaire),
  });
}

export function usePenalitesByStudent(studentId: string, anneeScolaire = DEFAULT_ANNEE) {
  return useQuery<PenaliteDTO[]>({
    queryKey: [PENALITES_KEY, "student", studentId, anneeScolaire],
    queryFn: () => penalitesApi.getByStudent(studentId, anneeScolaire),
    enabled: !!studentId,
  });
}

export function useCreatePenalite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PenaliteRequest) => penalitesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PENALITES_KEY] });
    },
  });
}

export function useUpdatePenalite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PenaliteRequest }) =>
      penalitesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PENALITES_KEY] });
    },
  });
}

export function useTogglePenalitePayee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => penalitesApi.togglePayee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PENALITES_KEY] });
    },
  });
}

export function useDeletePenalite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => penalitesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PENALITES_KEY] });
    },
  });
}
