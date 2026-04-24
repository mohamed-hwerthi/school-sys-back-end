import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Save, PenLine, GraduationCap, Users, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { notify } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNiveaux } from "@/hooks/useNiveaux";
import { useClasses } from "@/hooks/useClasses";
import { useModules } from "@/hooks/useModules";
import { useExamensRaw } from "@/hooks/useExamens";
import { useNotesByExamen, useUpsertNotes } from "@/hooks/useNotes";
import { studentsApi } from "@/api/students.api";
import ExportButton from "@/components/ExportButton";
import type { NoteRequest } from "@/api/notes.api";

interface LocalNote {
  studentId: number;
  studentName: string;
  valeur: string;
  observation: string;
}

const TRIMESTRES = [
  { value: 1, label: "Trimestre 1", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: 2, label: "Trimestre 2", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: 3, label: "Trimestre 3", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

export default function NotesTab() {
  const { niveaux } = useNiveaux();

  // Selection state
  const [trimestre, setTrimestre] = useState<number>(0);
  const [niveauId, setNiveauId] = useState<number>(0);
  const [classeId, setClasseId] = useState<number>(0);
  const [moduleId, setModuleId] = useState<number>(0);
  const [examenId, setExamenId] = useState<number>(0);

  // Data queries
  const { data: classes = [] } = useClasses(niveauId || undefined);
  const { data: modules = [] } = useModules(niveauId || undefined);
  const { data: examens = [] } = useExamensRaw(
    moduleId || undefined,
    classeId || undefined
  );
  const { data: existingNotes = [] } = useNotesByExamen(
    examenId,
    trimestre
  );

  // Get students for selected classe
  const selectedClasse = classes.find((c) => c.id === classeId);
  const classeName = selectedClasse?.fullName ?? "";
  const { data: studentsPage } = useQuery({
    queryKey: ["students", "by-classe", classeName],
    queryFn: () => studentsApi.getAll({ classe: classeName, size: 200 }),
    enabled: !!classeName,
  });
  const students = studentsPage?.content ?? [];

  // Local notes state for editing
  const [localNotes, setLocalNotes] = useState<LocalNote[]>([]);
  const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set());
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const localNotesRef = useRef(localNotes);
  localNotesRef.current = localNotes;

  // Merge students with existing notes
  useEffect(() => {
    if (!examenId || !trimestre || students.length === 0) {
      setLocalNotes([]);
      setDirtyIds(new Set());
      setLastSavedAt(null);
      return;
    }

    const notesByStudent = new Map(
      existingNotes.map((n) => [n.studentId, n])
    );

    const merged: LocalNote[] = students.map((s) => {
      const existing = notesByStudent.get(s.id);
      return {
        studentId: s.id,
        studentName: `${s.prenom} ${s.nom}`,
        valeur: existing?.valeur != null ? String(existing.valeur) : "",
        observation: existing?.observation ?? "",
      };
    });

    setLocalNotes(merged);
    setDirtyIds(new Set());
  }, [students, existingNotes, examenId, trimestre]);

  const upsertNotes = useUpsertNotes();

  const isValidValeur = (v: string) => {
    if (v === "") return true;
    const n = Number(v.replace(",", "."));
    return !Number.isNaN(n) && n >= 0 && n <= 20;
  };

  const handleNoteChange = (studentId: number, field: "valeur" | "observation", value: string) => {
    setLocalNotes((prev) =>
      prev.map((n) =>
        n.studentId === studentId ? { ...n, [field]: value } : n
      )
    );
    setDirtyIds((prev) => {
      const next = new Set(prev);
      next.add(studentId);
      return next;
    });
  };

  // Auto-save dirty notes (debounced 800ms)
  useEffect(() => {
    if (dirtyIds.size === 0 || !examenId || !trimestre) return;
    const handle = setTimeout(() => {
      const dirty = localNotesRef.current.filter((n) => dirtyIds.has(n.studentId));
      const valid = dirty.filter((n) => n.valeur !== "" && isValidValeur(n.valeur));
      if (valid.length === 0) return;

      const payload: NoteRequest[] = valid.map((n) => ({
        studentId: n.studentId,
        examenId,
        trimestre,
        valeur: Number(n.valeur.replace(",", ".")),
        observation: n.observation || undefined,
      }));
      const savedIds = new Set(valid.map((n) => n.studentId));

      upsertNotes.mutate(payload, {
        onSuccess: () => {
          setLastSavedAt(Date.now());
          setDirtyIds((prev) => {
            const next = new Set(prev);
            savedIds.forEach((id) => next.delete(id));
            return next;
          });
        },
        onError: () => notify.error("Erreur lors de la sauvegarde automatique"),
      });
    }, 800);
    return () => clearTimeout(handle);
  }, [dirtyIds, localNotes, examenId, trimestre]);

  const focusCell = (rowIdx: number, col: "valeur" | "observation") => {
    if (rowIdx < 0 || rowIdx >= localNotes.length) return;
    const target = document.querySelector<HTMLInputElement>(
      `[data-row="${rowIdx}"][data-col="${col}"]`
    );
    target?.focus();
    target?.select();
  };

  const handleCellKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
    col: "valeur" | "observation"
  ) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      focusCell(idx + 1, col);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusCell(idx - 1, col);
    } else if (e.key === "ArrowRight" && col === "valeur" && (e.target as HTMLInputElement).selectionStart === (e.target as HTMLInputElement).value.length) {
      e.preventDefault();
      focusCell(idx, "observation");
    } else if (e.key === "ArrowLeft" && col === "observation" && (e.target as HTMLInputElement).selectionStart === 0) {
      e.preventDefault();
      focusCell(idx, "valeur");
    }
  };

  const handleSave = () => {
    const invalid = localNotes.find((n) => !isValidValeur(n.valeur));
    if (invalid) {
      notify.error("Les notes doivent etre entre 0 et 20");
      return;
    }
    const notesToSave: NoteRequest[] = localNotes
      .filter((n) => n.valeur !== "")
      .map((n) => ({
        studentId: n.studentId,
        examenId,
        trimestre,
        valeur: Number(n.valeur.replace(",", ".")),
        observation: n.observation || undefined,
      }));

    if (notesToSave.length === 0) {
      notify.error("Aucune note a sauvegarder");
      return;
    }

    upsertNotes.mutate(notesToSave, {
      onSuccess: () => {
        setLastSavedAt(Date.now());
        setDirtyIds(new Set());
        notify.success("Notes sauvegardees");
      },
      onError: () => notify.error("Erreur lors de la sauvegarde"),
    });
  };

  const filledCount = localNotes.filter((n) => n.valeur !== "").length;
  const selectedExamen = examens.find((e) => e.id === examenId);
  const saveStatus: "idle" | "dirty" | "saving" | "saved" =
    upsertNotes.isPending ? "saving"
    : dirtyIds.size > 0 ? "dirty"
    : lastSavedAt ? "saved"
    : "idle";

  return (
    <div className="space-y-4">
      {/* Trimestre Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
      >
        <p className="text-sm font-medium text-foreground mb-3">
          Sélectionnez un trimestre
        </p>
        <div className="flex gap-3">
          {TRIMESTRES.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTrimestre(t.value);
                setExamenId(0);
              }}
              className={`flex-1 rounded-xl border-2 p-4 text-center font-semibold transition-all ${
                trimestre === t.value
                  ? `${t.color} border-current shadow-sm`
                  : "border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      {trimestre > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Select
              value={niveauId ? String(niveauId) : ""}
              onValueChange={(v) => {
                setNiveauId(Number(v));
                setClasseId(0);
                setModuleId(0);
                setExamenId(0);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                {niveaux.map((n) => (
                  <SelectItem key={n.id} value={String(n.id)}>
                    {n.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={classeId ? String(classeId) : ""}
              onValueChange={(v) => {
                setClasseId(Number(v));
                setExamenId(0);
              }}
              disabled={!niveauId}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={moduleId ? String(moduleId) : ""}
              onValueChange={(v) => {
                setModuleId(Number(v));
                setExamenId(0);
              }}
              disabled={!niveauId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={examenId ? String(examenId) : ""}
              onValueChange={(v) => setExamenId(Number(v))}
              disabled={!classeId || !moduleId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Examen" />
              </SelectTrigger>
              <SelectContent>
                {examens.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      )}

      {/* Grade Entry Grid */}
      {examenId > 0 && trimestre > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          {/* Info bar */}
          <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <PenLine className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {selectedExamen?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedExamen?.moduleName} · {selectedExamen?.classeName} · Trimestre {trimestre}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {filledCount}/{localNotes.length} notes saisies
              </div>
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Sauvegarde...
                </span>
              )}
              {saveStatus === "dirty" && (
                <span className="flex items-center gap-1.5 text-xs text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Modifications non sauvegardees
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Sauvegarde
                </span>
              )}
              {classeId > 0 && trimestre > 0 && (
                <ExportButton
                  type="notes"
                  label="Exporter"
                  filters={{ classeId, trimestre }}
                />
              )}
              <Button
                size="sm"
                className="gap-1.5"
                onClick={handleSave}
                disabled={upsertNotes.isPending || filledCount === 0}
              >
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground w-8">
                      #
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground">
                      Élève
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground w-32">
                      Note /20
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground">
                      Observation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {localNotes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-16 text-center text-muted-foreground"
                      >
                        <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">
                          Aucun élève dans cette classe
                        </p>
                        <p className="text-xs mt-1">
                          Vérifiez que des élèves sont inscrits dans la classe{" "}
                          {classeName}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    localNotes.map((note, idx) => (
                      <tr
                        key={note.studentId}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-2 px-4 text-muted-foreground text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-4 font-medium text-foreground">
                          {note.studentName}
                        </td>
                        <td className="py-2 px-4">
                          <Input
                            type="number"
                            min={0}
                            max={20}
                            step={0.25}
                            value={note.valeur}
                            data-row={idx}
                            data-col="valeur"
                            onKeyDown={(e) => handleCellKey(e, idx, "valeur")}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) =>
                              handleNoteChange(
                                note.studentId,
                                "valeur",
                                e.target.value
                              )
                            }
                            aria-invalid={!isValidValeur(note.valeur)}
                            className={`w-24 mx-auto text-center ${!isValidValeur(note.valeur) ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            placeholder="—"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <Input
                            value={note.observation}
                            data-row={idx}
                            data-col="observation"
                            onKeyDown={(e) => handleCellKey(e, idx, "observation")}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) =>
                              handleNoteChange(
                                note.studentId,
                                "observation",
                                e.target.value
                              )
                            }
                            placeholder="Observation (optionnel)"
                            className="text-sm"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
