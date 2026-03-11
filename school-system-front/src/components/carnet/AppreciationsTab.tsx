import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Save, MessageSquare, GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNiveaux } from "@/hooks/useNiveaux";
import { useClasses } from "@/hooks/useClasses";
import { useDomaines } from "@/hooks/useDomaines";
import {
  useRecommandations,
  useUpsertRecommandations,
  useObservations,
  useUpsertObservations,
} from "@/hooks/useAppreciations";
import { studentsApi } from "@/api/students.api";
import type { RecommandationRequest, ObservationRequest } from "@/api/appreciations.api";

const TRIMESTRES = [
  { value: 1, label: "Trimestre 1" },
  { value: 2, label: "Trimestre 2" },
  { value: 3, label: "Trimestre 3" },
];

const CERTIFICAT_OPTIONS = [
  { value: "", label: "— Aucun —" },
  { value: "شهادة شرف الدرجة الأولى", label: "شهادة شرف الدرجة الأولى (≥18)" },
  { value: "شهادة شرف", label: "شهادة شرف (≥16)" },
  { value: "شهادة شكر", label: "شهادة شكر (≥14)" },
  { value: "شهادة تشجيع", label: "شهادة تشجيع (≥12)" },
];

const RECO_SUGGESTIONS = [
  "نتائج ممتازة واصل يا بطل",
  "نتائج جيدة",
  "نتائج مقبولة يمكن بذل مجهود أكبر",
  "نتائج ضعيفة يجب بذل مجهود أكبر",
];

type ViewMode = "recommandations" | "observations";

interface LocalReco {
  studentId: number;
  studentName: string;
  texte: string;
}

interface LocalObs {
  studentId: number;
  studentName: string;
  comportement: string;
  certificatType: string;
}

export default function AppreciationsTab() {
  const { niveaux } = useNiveaux();
  const [niveauId, setNiveauId] = useState<number>(0);
  const [classeId, setClasseId] = useState<number>(0);
  const [trimestre, setTrimestre] = useState<number>(0);
  const [domaineId, setDomaineId] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>("recommandations");

  const { data: classes = [] } = useClasses(niveauId || undefined);
  const { data: domaines = [] } = useDomaines(niveauId || undefined);

  // Get students for selected classe
  const selectedClasse = classes.find((c) => c.id === classeId);
  const classeName = selectedClasse?.fullName ?? "";
  const { data: studentsPage } = useQuery({
    queryKey: ["students", "by-classe", classeName],
    queryFn: () => studentsApi.getAll({ classe: classeName, size: 200 }),
    enabled: !!classeName,
  });
  const students = studentsPage?.content ?? [];
  const studentIds = useMemo(() => students.map((s) => s.id), [students]);

  // Recommendations & observations data
  const { data: existingRecos = [] } = useRecommandations(studentIds, trimestre);
  const { data: existingObs = [] } = useObservations(studentIds, trimestre);
  const upsertRecos = useUpsertRecommandations();
  const upsertObs = useUpsertObservations();

  // Local state for editing
  const [localRecos, setLocalRecos] = useState<LocalReco[]>([]);
  const [localObs, setLocalObs] = useState<LocalObs[]>([]);

  // Filter recommendations for selected domaine
  const filteredRecos = useMemo(
    () => existingRecos.filter((r) => r.domaineId === domaineId),
    [existingRecos, domaineId]
  );

  // Merge students + existing recommendations for selected domaine
  useEffect(() => {
    if (!domaineId || !trimestre || students.length === 0) {
      setLocalRecos([]);
      return;
    }
    const recoMap = new Map(filteredRecos.map((r) => [r.studentId, r]));
    setLocalRecos(
      students.map((s) => ({
        studentId: s.id,
        studentName: `${s.prenom} ${s.nom}`,
        texte: recoMap.get(s.id)?.texte ?? "",
      }))
    );
  }, [students, filteredRecos, domaineId, trimestre]);

  // Merge students + existing observations
  useEffect(() => {
    if (!trimestre || students.length === 0) {
      setLocalObs([]);
      return;
    }
    const obsMap = new Map(existingObs.map((o) => [o.studentId, o]));
    setLocalObs(
      students.map((s) => ({
        studentId: s.id,
        studentName: `${s.prenom} ${s.nom}`,
        comportement: obsMap.get(s.id)?.comportement ?? "",
        certificatType: obsMap.get(s.id)?.certificatType ?? "",
      }))
    );
  }, [students, existingObs, trimestre]);

  const handleRecoChange = (studentId: number, texte: string) => {
    setLocalRecos((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, texte } : r))
    );
  };

  const applyRecoSuggestion = (suggestion: string) => {
    setLocalRecos((prev) =>
      prev.map((r) => (r.texte ? r : { ...r, texte: suggestion }))
    );
  };

  const handleSaveRecos = () => {
    const items: RecommandationRequest[] = localRecos
      .filter((r) => r.texte)
      .map((r) => ({
        studentId: r.studentId,
        domaineId,
        trimestre,
        texte: r.texte,
      }));
    if (items.length === 0) {
      toast.error("Aucune recommandation à sauvegarder");
      return;
    }
    upsertRecos.mutate(items, {
      onSuccess: () => toast.success("Recommandations sauvegardées"),
      onError: () => toast.error("Erreur lors de la sauvegarde"),
    });
  };

  const handleObsChange = (
    studentId: number,
    field: "comportement" | "certificatType",
    value: string
  ) => {
    setLocalObs((prev) =>
      prev.map((o) =>
        o.studentId === studentId ? { ...o, [field]: value } : o
      )
    );
  };

  const handleSaveObs = () => {
    const items: ObservationRequest[] = localObs
      .filter((o) => o.comportement || o.certificatType)
      .map((o) => ({
        studentId: o.studentId,
        trimestre,
        comportement: o.comportement || undefined,
        certificatType: o.certificatType || undefined,
      }));
    if (items.length === 0) {
      toast.error("Aucune observation à sauvegarder");
      return;
    }
    upsertObs.mutate(items, {
      onSuccess: () => toast.success("Observations sauvegardées"),
      onError: () => toast.error("Erreur lors de la sauvegarde"),
    });
  };

  const ready = trimestre > 0 && classeId > 0 && students.length > 0;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
          <Select
            value={trimestre ? String(trimestre) : ""}
            onValueChange={(v) => setTrimestre(Number(v))}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trimestre" />
            </SelectTrigger>
            <SelectContent>
              {TRIMESTRES.map((t) => (
                <SelectItem key={t.value} value={String(t.value)}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={niveauId ? String(niveauId) : ""}
            onValueChange={(v) => {
              setNiveauId(Number(v));
              setClasseId(0);
              setDomaineId(0);
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
            onValueChange={(v) => setClasseId(Number(v))}
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
        </div>
      </motion.div>

      {/* Mode switch */}
      {ready && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex gap-1 rounded-xl bg-muted/50 p-1 w-fit"
        >
          <button
            onClick={() => setViewMode("recommandations")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === "recommandations"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recommandations par domaine
          </button>
          <button
            onClick={() => setViewMode("observations")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === "observations"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Observations & Certificats
          </button>
        </motion.div>
      )}

      {/* ═══ RECOMMANDATIONS MODE ═══ */}
      {ready && viewMode === "recommandations" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          {/* Domaine selector */}
          <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Domaine</Label>
              <Select
                value={domaineId ? String(domaineId) : ""}
                onValueChange={(v) => setDomaineId(Number(v))}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Sélectionner un domaine" />
                </SelectTrigger>
                <SelectContent>
                  {domaines.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {domaineId > 0 && (
              <>
                <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    Remplir les vides :
                  </span>
                  {RECO_SUGGESTIONS.map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => applyRecoSuggestion(s)}
                    >
                      {s.slice(0, 20)}...
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reco grid */}
          {domaineId > 0 && (
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground w-8">
                        #
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground w-48">
                        Élève
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground">
                        Recommandation (توصيات المدرس)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {localRecos.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-16 text-center text-muted-foreground"
                        >
                          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                          <p className="font-medium">
                            Aucun élève dans cette classe
                          </p>
                        </td>
                      </tr>
                    ) : (
                      localRecos.map((r, idx) => (
                        <tr
                          key={r.studentId}
                          className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-2 px-4 text-muted-foreground text-xs">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-4 font-medium text-foreground">
                            {r.studentName}
                          </td>
                          <td className="py-2 px-4">
                            <Input
                              value={r.texte}
                              onChange={(e) =>
                                handleRecoChange(r.studentId, e.target.value)
                              }
                              placeholder="Saisir la recommandation..."
                              dir="rtl"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {localRecos.length > 0 && (
                <div className="border-t border-border px-4 py-3 flex justify-end">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={handleSaveRecos}
                    disabled={upsertRecos.isPending}
                  >
                    <Save className="h-4 w-4" />
                    Sauvegarder les recommandations
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ═══ OBSERVATIONS MODE ═══ */}
      {ready && viewMode === "observations" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground w-8">
                      #
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground w-44">
                      Élève
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground">
                      Comportement (ملاحظات السلوك)
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground w-56">
                      Certificat (الشهادة)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {localObs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-16 text-center text-muted-foreground"
                      >
                        <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">
                          Aucun élève dans cette classe
                        </p>
                      </td>
                    </tr>
                  ) : (
                    localObs.map((o, idx) => (
                      <tr
                        key={o.studentId}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-2 px-4 text-muted-foreground text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-4 font-medium text-foreground">
                          {o.studentName}
                        </td>
                        <td className="py-2 px-4">
                          <Input
                            value={o.comportement}
                            onChange={(e) =>
                              handleObsChange(
                                o.studentId,
                                "comportement",
                                e.target.value
                              )
                            }
                            placeholder="Observation sur le comportement..."
                          />
                        </td>
                        <td className="py-2 px-4">
                          <Select
                            value={o.certificatType || ""}
                            onValueChange={(v) =>
                              handleObsChange(o.studentId, "certificatType", v)
                            }
                          >
                            <SelectTrigger className="text-xs">
                              <SelectValue placeholder="— Aucun —" />
                            </SelectTrigger>
                            <SelectContent>
                              {CERTIFICAT_OPTIONS.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {localObs.length > 0 && (
              <div className="border-t border-border px-4 py-3 flex justify-end">
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={handleSaveObs}
                  disabled={upsertObs.isPending}
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder les observations
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
