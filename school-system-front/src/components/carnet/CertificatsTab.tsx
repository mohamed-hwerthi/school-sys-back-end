import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Printer,
  Award,
  Eye,
} from "lucide-react";
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
import CertificatPrint from "./CertificatPrint";

const TRIMESTRES = [
  { value: 1, label: "Trimestre 1" },
  { value: 2, label: "Trimestre 2" },
  { value: 3, label: "Trimestre 3" },
];

const CERT_TYPES = [
  { value: "all", label: "Tous les certificats" },
  { value: "شهادة شرف الدرجة الأولى", label: "شهادة شرف الدرجة الأولى (≥18)" },
  { value: "شهادة شرف", label: "شهادة شرف (≥16)" },
  { value: "شهادة شكر", label: "شهادة شكر (≥14)" },
  { value: "شهادة تشجيع", label: "شهادة تشجيع (≥12)" },
];

function certBadgeColor(cert: string) {
  if (cert.includes("الأولى")) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  if (cert.includes("شرف")) return "bg-amber-100 text-amber-800 border-amber-300";
  if (cert.includes("شكر")) return "bg-blue-100 text-blue-800 border-blue-300";
  return "bg-green-100 text-green-800 border-green-300";
}

export default function CertificatsTab() {
  const { niveaux } = useNiveaux();
  const [niveauId, setNiveauId] = useState<number>(0);
  const [classeId, setClasseId] = useState<number>(0);
  const [trimestre, setTrimestre] = useState<number>(0);
  const [certFilter, setCertFilter] = useState("all");
  const [previewStudent, setPreviewStudent] = useState<BulletinDTO | null>(null);

  const { data: classes = [] } = useClasses(niveauId || undefined);
  const { data: bulletins = [], isLoading } = useBulletins(classeId, trimestre, "etatique");
  const { data: settings } = useSchoolSettings();

  // Filter students who have a certificate
  const studentsWithCert = bulletins.filter((b) => b.certificatType != null);
  const filtered =
    certFilter === "all"
      ? studentsWithCert
      : studentsWithCert.filter((b) => b.certificatType === certFilter);

  const handlePrintOne = (b: BulletinDTO) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const el = document.getElementById(`cert-print-${b.studentId}`);
    if (!el) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>Certificat - ${b.studentName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Amiri', serif; }
          @page { size: A5 landscape; margin: 0; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>${el.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  const handlePrintAll = () => {
    if (filtered.length === 0) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const el = document.getElementById("certs-print-all");
    if (!el) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>Certificats</title>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Amiri', serif; }
          @page { size: A5 landscape; margin: 0; }
          .cert-page { page-break-after: always; }
          .cert-page:last-child { page-break-after: avoid; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>${el.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
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

          <Select value={certFilter} onValueChange={setCertFilter}>
            <SelectTrigger className="w-[260px]">
              <Award className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CERT_TYPES.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filtered.length > 0 && (
            <Button
              onClick={handlePrintAll}
              size="sm"
              className="ml-auto gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimer tout ({filtered.length})
            </Button>
          )}
        </div>
      </motion.div>

      {/* Results */}
      {classeId > 0 && trimestre > 0 && (
        <>
          {isLoading ? (
            <div className="rounded-xl border border-border/50 bg-card p-16 shadow-sm text-center text-muted-foreground">
              Chargement...
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border/50 bg-card p-16 shadow-sm text-center text-muted-foreground"
            >
              <Award className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun certificat</p>
              <p className="text-xs mt-1">
                {studentsWithCert.length === 0
                  ? "Aucun élève n'a obtenu de certificat pour ce trimestre"
                  : "Aucun certificat ne correspond au filtre sélectionné"}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Stats summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.03 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {CERT_TYPES.filter((ct) => ct.value !== "all").map((ct) => {
                  const count = studentsWithCert.filter(
                    (b) => b.certificatType === ct.value
                  ).length;
                  return (
                    <div
                      key={ct.value}
                      className="rounded-lg border border-border/50 bg-card p-3 shadow-sm text-center"
                    >
                      <div className="text-2xl font-bold text-foreground">
                        {count}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5" dir="rtl">
                        {ct.value}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Student list */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 }}
                className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground w-12">
                        Rang
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground">
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
                    {[...filtered]
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
                              <div className="text-xs text-muted-foreground" dir="rtl">
                                {b.studentNameAr}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">
                            {b.moyenneGenerale.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center" dir="rtl">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${certBadgeColor(b.certificatType!)}`}
                            >
                              <Award className="h-3 w-3" />
                              {b.certificatType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewStudent(b)}
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
              </motion.div>
            </>
          )}
        </>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewStudent !== null}
        onOpenChange={(open) => !open && setPreviewStudent(null)}
      >
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex flex-row items-center justify-between">
            <DialogTitle className="text-sm">
              Certificat — {previewStudent?.studentName}
            </DialogTitle>
            <Button
              size="sm"
              onClick={() => previewStudent && handlePrintOne(previewStudent)}
              className="gap-1 text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimer
            </Button>
          </DialogHeader>
          <div className="p-4 flex justify-center">
            {previewStudent && (
              <div id={`cert-print-${previewStudent.studentId}`}>
                <CertificatPrint bulletin={previewStudent} schoolName={settings?.schoolName} schoolNameAr={settings?.schoolNameAr ?? undefined} anneeScolaire={settings?.anneeScolaire} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden containers for individual print */}
      {filtered.map((b) => (
        <div key={b.studentId} id={`cert-print-${b.studentId}`} className="hidden">
          <CertificatPrint bulletin={b} schoolName={settings?.schoolName} schoolNameAr={settings?.schoolNameAr ?? undefined} anneeScolaire={settings?.anneeScolaire} />
        </div>
      ))}

      {/* Hidden print-all container */}
      <div id="certs-print-all" className="hidden">
        {filtered.map((b) => (
          <CertificatPrint key={b.studentId} bulletin={b} />
        ))}
      </div>
    </div>
  );
}
