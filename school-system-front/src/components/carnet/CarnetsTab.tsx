import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useCarnetSelection } from "./CarnetSelectionContext";
import {
  GraduationCap,
  Printer,
  Eye,
  FileText,
  Award,
  Search,
  X,
  Users,
  Target,
  Sigma,
  Minimize,
  Maximize,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  computeStats,
  KpiCard,
  DistributionChart,
  PassFailPie,
  MentionsBar,
  TopBottomLists,
  CertificatPie,
} from "./statsCharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNiveaux } from "@/hooks/useNiveaux";
import { useClasses } from "@/hooks/useClasses";
import { useBulletins } from "@/hooks/useBulletins";
import type { BulletinDTO } from "@/api/bulletins.api";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";
import BulletinPrint from "./BulletinPrint";

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

export default function CarnetsTab() {
  const { niveaux } = useNiveaux();
  const { niveauId, classeId, trimestre, setNiveauId, setClasseId, setTrimestre } = useCarnetSelection();
  const [version, setVersion] = useState("etatique");
  const [search, setSearch] = useState("");
  const [previewBulletin, setPreviewBulletin] = useState<BulletinDTO | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const { data: classes = [] } = useClasses(niveauId || undefined);
  const { data: bulletins = [], isLoading } = useBulletins(classeId, trimestre, version);
  const { data: settings } = useSchoolSettings();

  const filteredBulletins = useMemo(() => {
    if (!search.trim()) return bulletins;
    const q = search.toLowerCase().trim();
    return bulletins.filter(
      (b) =>
        b.studentName.toLowerCase().includes(q) ||
        (b.studentNameAr && b.studentNameAr.includes(search.trim()))
    );
  }, [bulletins, search]);

  // Class-wide moyennes générales for stats
  const moyenneValues = useMemo(() => bulletins.map((b) => b.moyenneGenerale), [bulletins]);
  const stats = useMemo(() => computeStats(moyenneValues), [moyenneValues]);
  const passCount = useMemo(() => moyenneValues.filter((v) => v >= 10).length, [moyenneValues]);
  const failCount = useMemo(() => moyenneValues.filter((v) => v < 10).length, [moyenneValues]);
  const studentsForRanking = useMemo(
    () => bulletins.map((b) => ({ name: b.studentName, value: b.moyenneGenerale })),
    [bulletins]
  );
  const certificatsCounts = useMemo(() => {
    const counts = new Map<string, number>();
    let aucun = 0;
    bulletins.forEach((b) => {
      if (b.certificatType) counts.set(b.certificatType, (counts.get(b.certificatType) ?? 0) + 1);
      else aucun++;
    });
    const arr = Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
    if (aucun > 0) arr.push({ type: "Sans certificat", count: aucun });
    return arr;
  }, [bulletins]);

  const handlePrintOne = (bulletin: BulletinDTO) => {
    setPreviewBulletin(bulletin);
    setTimeout(() => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      const content = document.getElementById(`bulletin-preview-content`);
      if (!content) return;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>Bulletin - ${bulletin.studentName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Amiri', serif; }
            @page { size: A4; margin: 0; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }, 100);
  };

  const handlePrintAll = () => {
    if (bulletins.length === 0) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const allRef = document.getElementById("bulletins-print-all");
    if (!allRef) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>Bulletins - Classe</title>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Amiri', serif; }
          @page { size: A4; margin: 0; }
          .bulletin-page { page-break-after: always; }
          .bulletin-page:last-child { page-break-after: avoid; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>${allRef.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

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
              <GraduationCap className="h-3.5 w-3.5 me-1.5 text-muted-foreground" />
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

          {bulletins.length > 0 && (
            <>
              <div className="relative flex-1 sm:max-w-xs sm:ms-auto">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un élève..."
                  className="ps-9 pe-9"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <Button
                onClick={handlePrintAll}
                size="sm"
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimer tout ({bulletins.length})
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Student List */}
      {classeId > 0 && trimestre > 0 && (
        <>
          {isLoading ? (
            <div className="rounded-xl border border-border/50 bg-card p-16 shadow-sm text-center text-muted-foreground">
              Chargement des bulletins...
            </div>
          ) : bulletins.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border/50 bg-card p-16 shadow-sm text-center text-muted-foreground"
            >
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun bulletin disponible</p>
              <p className="text-xs mt-1">
                Saisissez des notes pour générer les bulletins
              </p>
            </motion.div>
          ) : (
            <>
              {/* Class-wide stats panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="rounded-xl border border-border/50 bg-card p-4 shadow-sm space-y-3"
              >
                <p className="text-sm font-semibold text-foreground">Vue d'ensemble — moyennes générales de la classe</p>

                {/* KPI Row 1 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                  <KpiCard label="Effectif" value={stats.count} icon={Users} />
                  <KpiCard
                    label="Moy. classe"
                    value={stats.mean.toFixed(2)}
                    icon={Target}
                    color={stats.mean >= 10 ? "text-emerald-600" : "text-red-600"}
                  />
                  <KpiCard label="Médiane classe" value={stats.median.toFixed(2)} icon={Sigma} />
                  <KpiCard label="Note min" value={stats.min.toFixed(2)} icon={Minimize} color="text-red-600" />
                  <KpiCard label="Note max" value={stats.max.toFixed(2)} icon={Maximize} color="text-emerald-600" />
                </div>

                {/* KPI Row 2 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                  <KpiCard label="Quartiles Q1 / Q3" value={`${stats.q1.toFixed(1)} / ${stats.q3.toFixed(1)}`} icon={Sigma} />
                  <KpiCard label="Écart-type classe" value={stats.stddev.toFixed(2)} icon={Sigma} />
                  <KpiCard
                    label="% Réussite (≥10)"
                    value={`${stats.passRate}%`}
                    icon={TrendingUp}
                    color={stats.passRate >= 50 ? "text-emerald-600" : "text-red-600"}
                  />
                  <KpiCard
                    label="% Mention (≥14)"
                    value={`${stats.mentionRate}%`}
                    icon={Award}
                    color="text-blue-600"
                  />
                  <KpiCard label="% Échec" value={`${stats.failRate}%`} icon={XCircle} color="text-red-600" />
                </div>

                {/* Charts row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <DistributionChart values={moyenneValues} title="Distribution des moyennes" />
                  <PassFailPie pass={passCount} fail={failCount} />
                  <CertificatPie certificats={certificatsCounts} />
                </div>

                {/* Mentions */}
                <MentionsBar values={moyenneValues} />

                {/* Top / Bottom */}
                <TopBottomLists top={studentsForRanking} topCount={10} bottomCount={5} />
              </motion.div>

              {/* Student list */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden"
              >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground w-12">
                        Rang
                      </th>
                      <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground">
                        Élève
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-foreground">
                        Moyenne
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground">
                        Certificat
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground w-32">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBulletins.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                          Aucun élève ne correspond à "{search}"
                        </td>
                      </tr>
                    )}
                    {[...filteredBulletins]
                      .sort((a, b) => a.rang - b.rang)
                      .map((b) => (
                        <tr
                          key={b.studentId}
                          className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-3 px-4 text-center font-bold text-xs">
                            {b.rang}/{b.totalEleves}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground">
                              {b.studentName}
                            </div>
                            {b.studentNameAr && (
                              <div
                                className="text-xs text-muted-foreground"
                                dir="rtl"
                              >
                                {b.studentNameAr}
                              </div>
                            )}
                          </td>
                          <td
                            className={`py-3 px-4 text-center font-bold ${gradeColor(b.moyenneGenerale)}`}
                          >
                            {b.moyenneGenerale.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center" dir="rtl">
                            {b.certificatType ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                                <Award className="h-3 w-3" />
                                {b.certificatType}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewBulletin(b)}
                                className="h-7 gap-1 text-xs"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Aperçu
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePrintOne(b)}
                                className="h-7 gap-1 text-xs"
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              </motion.div>
            </>
          )}
        </>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewBulletin !== null}
        onOpenChange={(open) => !open && setPreviewBulletin(null)}
      >
        <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex flex-row items-center justify-between">
            <DialogTitle className="text-sm">
              Bulletin — {previewBulletin?.studentName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => previewBulletin && handlePrintOne(previewBulletin)}
                className="gap-1 text-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                Imprimer
              </Button>
            </div>
          </DialogHeader>
          <div className="p-4 flex justify-center" id="bulletin-preview-content" ref={printRef}>
            {previewBulletin && <BulletinPrint bulletin={previewBulletin} schoolName={settings?.schoolName} schoolNameAr={settings?.schoolNameAr ?? undefined} anneeScolaire={settings?.anneeScolaire} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden print-all container */}
      <div id="bulletins-print-all" className="hidden">
        {bulletins.map((b) => (
          <BulletinPrint key={b.studentId} bulletin={b} schoolName={settings?.schoolName} schoolNameAr={settings?.schoolNameAr ?? undefined} anneeScolaire={settings?.anneeScolaire} />
        ))}
      </div>
    </div>
  );
}
