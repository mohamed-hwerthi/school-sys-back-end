import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  GraduationCap,
  TrendingUp,
  Users,
  Award,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNiveaux } from "@/hooks/useNiveaux";
import { useClasses } from "@/hooks/useClasses";
import { useBulletins } from "@/hooks/useBulletins";
import type { BulletinDTO, BulletinDomaineDTO } from "@/api/bulletins.api";

const TRIMESTRES = [
  { value: 1, label: "Trimestre 1" },
  { value: 2, label: "Trimestre 2" },
  { value: 3, label: "Trimestre 3" },
];

const VERSIONS = [
  { value: "etatique", label: "Version Étatique" },
  { value: "prive", label: "Version Privée" },
];

function gradeColor(val: number) {
  if (val >= 16) return "text-emerald-600";
  if (val >= 14) return "text-green-600";
  if (val >= 10) return "text-foreground";
  if (val >= 8) return "text-orange-600";
  return "text-red-600";
}

function DomaineBlock({ domaine, bulletins }: { domaine: BulletinDomaineDTO; bulletins: BulletinDTO[] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="font-semibold text-sm text-foreground">{domaine.domaineName}</span>
        {domaine.domaineNameAr && (
          <span className="text-xs text-muted-foreground mr-auto" dir="rtl">
            {domaine.domaineNameAr}
          </span>
        )}
      </button>

      {expanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground w-8">#</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground">Élève</th>
                {domaine.modules.map((m) => (
                  <th key={m.moduleId} className="py-2 px-3 text-center text-xs font-semibold text-muted-foreground">
                    {m.moduleName}
                    <div className="text-[10px] font-normal text-muted-foreground/70">coeff {m.coeff}</div>
                  </th>
                ))}
                <th className="py-2 px-3 text-center text-xs font-semibold text-foreground bg-muted/30">
                  Moy. Domaine
                </th>
              </tr>
            </thead>
            <tbody>
              {bulletins.map((b, idx) => {
                const bDomaine = b.domaines.find((d) => d.domaineId === domaine.domaineId);
                return (
                  <tr key={b.studentId} className="border-b border-border/30 last:border-0 hover:bg-muted/10">
                    <td className="py-2 px-3 text-muted-foreground text-xs">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium text-foreground text-xs">{b.studentName}</td>
                    {domaine.modules.map((dm) => {
                      const bModule = bDomaine?.modules.find((m) => m.moduleId === dm.moduleId);
                      const val = bModule?.moyenneModule;
                      return (
                        <td key={dm.moduleId} className={`py-2 px-3 text-center text-xs ${val != null ? gradeColor(val) : ""}`}>
                          {val != null ? val.toFixed(2) : "—"}
                        </td>
                      );
                    })}
                    <td className={`py-2 px-3 text-center text-xs font-bold bg-muted/20 ${bDomaine ? gradeColor(bDomaine.moyenneDomaine) : ""}`}>
                      {bDomaine ? bDomaine.moyenneDomaine.toFixed(2) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Module stats row */}
            <tfoot>
              <tr className="border-t border-border bg-muted/10 text-[10px] text-muted-foreground">
                <td colSpan={2} className="py-1.5 px-3 font-semibold">Min / Max / Moy. Classe</td>
                {domaine.modules.map((dm) => {
                  // Get stats from first bulletin that has this module
                  const ref = bulletins.find((b) =>
                    b.domaines.find((d) => d.domaineId === domaine.domaineId)?.modules.find((m) => m.moduleId === dm.moduleId)
                  );
                  const refModule = ref?.domaines
                    .find((d) => d.domaineId === domaine.domaineId)
                    ?.modules.find((m) => m.moduleId === dm.moduleId);
                  return (
                    <td key={dm.moduleId} className="py-1.5 px-3 text-center">
                      {refModule
                        ? `${refModule.moduleMin.toFixed(1)} / ${refModule.moduleMax.toFixed(1)} / ${refModule.moduleClasseAvg.toFixed(1)}`
                        : "—"}
                    </td>
                  );
                })}
                <td className="py-1.5 px-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MoyennesTab() {
  const { niveaux } = useNiveaux();
  const [niveauId, setNiveauId] = useState<number>(0);
  const [classeId, setClasseId] = useState<number>(0);
  const [trimestre, setTrimestre] = useState<number>(0);
  const [version, setVersion] = useState("etatique");

  const { data: classes = [] } = useClasses(niveauId || undefined);
  const { data: bulletins = [], isLoading } = useBulletins(classeId, trimestre, version);

  // Collect all unique domaines from the first bulletin (structure is same for all)
  const allDomaines: BulletinDomaineDTO[] = bulletins.length > 0 ? bulletins[0].domaines : [];

  return (
    <div className="space-y-4">
      {/* Filters */}
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

          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VERSIONS.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Results */}
      {classeId > 0 && trimestre > 0 && (
        <>
          {isLoading ? (
            <div className="rounded-xl border border-border/50 bg-card p-16 shadow-sm text-center text-muted-foreground">
              Chargement...
            </div>
          ) : bulletins.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border/50 bg-card p-16 shadow-sm text-center text-muted-foreground"
            >
              <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucune moyenne disponible</p>
              <p className="text-xs mt-1">Saisissez des notes pour voir les moyennes</p>
            </motion.div>
          ) : (
            <>
              {/* Domain blocks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="space-y-3"
              >
                {allDomaines.map((d) => (
                  <DomaineBlock key={d.domaineId} domaine={d} bulletins={bulletins} />
                ))}
              </motion.div>

              {/* General summary table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground">Classement Général</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        <th className="py-2.5 px-4 text-center text-xs font-semibold text-muted-foreground w-12">Rang</th>
                        <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground">Élève</th>
                        {allDomaines.map((d) => (
                          <th key={d.domaineId} className="py-2.5 px-4 text-center text-xs font-semibold text-muted-foreground">
                            {d.domaineName}
                          </th>
                        ))}
                        <th className="py-2.5 px-4 text-center text-xs font-semibold text-foreground bg-muted/30">
                          Moy. Générale
                        </th>
                        <th className="py-2.5 px-4 text-center text-xs font-semibold text-muted-foreground">
                          Certificat
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...bulletins]
                        .sort((a, b) => a.rang - b.rang)
                        .map((b) => (
                          <tr key={b.studentId} className="border-b border-border/30 last:border-0 hover:bg-muted/10">
                            <td className="py-2.5 px-4 text-center font-bold text-xs">
                              {b.rang}/{b.totalEleves}
                            </td>
                            <td className="py-2.5 px-4 font-medium text-foreground text-xs">{b.studentName}</td>
                            {allDomaines.map((d) => {
                              const bd = b.domaines.find((bd) => bd.domaineId === d.domaineId);
                              return (
                                <td key={d.domaineId} className={`py-2.5 px-4 text-center text-xs ${bd ? gradeColor(bd.moyenneDomaine) : ""}`}>
                                  {bd ? bd.moyenneDomaine.toFixed(2) : "—"}
                                </td>
                              );
                            })}
                            <td className={`py-2.5 px-4 text-center font-bold text-xs bg-muted/20 ${gradeColor(b.moyenneGenerale)}`}>
                              {b.moyenneGenerale.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-4 text-center text-xs" dir="rtl">
                              {b.certificatType ? (
                                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                  <Award className="h-3 w-3" />
                                  {b.certificatType}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Class stats footer */}
                <div className="border-t border-border px-4 py-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {bulletins.length} élève{bulletins.length !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Moy. classe:{" "}
                    <span className="font-semibold text-foreground">
                      {bulletins[0]?.moyenneClasse.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    Min:{" "}
                    <span className="font-semibold text-red-600">
                      {bulletins[0]?.moyenneMin.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    Max:{" "}
                    <span className="font-semibold text-emerald-600">
                      {bulletins[0]?.moyenneMax.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </>
      )}
    </div>
  );
}
