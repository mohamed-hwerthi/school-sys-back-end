import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examensApi, mapExamenToEvaluation, type ExamenDTO, type ExamenRequest } from "@/api/examens.api";
import type { Evaluation } from "@/types/evaluation";

const EXAMENS_KEY = "examens";

/** Fetch raw ExamenDTO list. */
export function useExamensRaw(moduleId?: number, classeId?: number) {
  return useQuery<ExamenDTO[]>({
    queryKey: [EXAMENS_KEY, moduleId, classeId],
    queryFn: () => examensApi.getAll(moduleId, classeId),
  });
}

/** Fetch examens mapped to the frontend Evaluation type. */
export function useExamens(moduleId?: number, classeId?: number) {
  return useQuery<Evaluation[]>({
    queryKey: [EXAMENS_KEY, "mapped", moduleId, classeId],
    queryFn: async () => {
      const dtos = await examensApi.getAll(moduleId, classeId);
      return dtos.map(mapExamenToEvaluation);
    },
  });
}

export function useCreateExamen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ExamenRequest) => examensApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EXAMENS_KEY] }),
  });
}

export function useUpdateExamen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExamenRequest }) =>
      examensApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EXAMENS_KEY] }),
  });
}

export function useDeleteExamen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => examensApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EXAMENS_KEY] }),
  });
}

export function useDeleteExamensBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => examensApi.deleteBulk(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EXAMENS_KEY] }),
  });
}
