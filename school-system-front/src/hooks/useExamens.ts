import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examensApi, type ExamenDTO, type ExamenRequest } from "@/api/examens.api";

const EXAMENS_KEY = "examens";

/** Fetch raw ExamenDTO list. */
export function useExamensRaw(moduleId?: number, classeId?: number, trimestre?: number) {
  return useQuery<ExamenDTO[]>({
    queryKey: [EXAMENS_KEY, moduleId, classeId, trimestre],
    queryFn: () => examensApi.getAll(moduleId, classeId, trimestre),
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
