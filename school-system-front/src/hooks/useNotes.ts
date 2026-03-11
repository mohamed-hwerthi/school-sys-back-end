import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi, type NoteDTO, type NoteRequest, type MoyenneDTO } from "@/api/notes.api";

const NOTES_KEY = "notes";

export function useNotesByExamen(examenId: number, trimestre: number) {
  return useQuery<NoteDTO[]>({
    queryKey: [NOTES_KEY, "examen", examenId, trimestre],
    queryFn: () => notesApi.getByExamen(examenId, trimestre),
    enabled: examenId > 0 && trimestre > 0,
  });
}

export function useNotesByStudent(studentId: number, trimestre: number) {
  return useQuery<NoteDTO[]>({
    queryKey: [NOTES_KEY, "student", studentId, trimestre],
    queryFn: () => notesApi.getByStudent(studentId, trimestre),
    enabled: studentId > 0 && trimestre > 0,
  });
}

export function useMoyennes(classeId: number, trimestre: number) {
  return useQuery<MoyenneDTO[]>({
    queryKey: [NOTES_KEY, "moyennes", classeId, trimestre],
    queryFn: () => notesApi.getMoyennes(classeId, trimestre),
    enabled: classeId > 0 && trimestre > 0,
  });
}

export function useUpsertNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notes: NoteRequest[]) => notesApi.upsertBulk(notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: [NOTES_KEY] }),
  });
}
