import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from "lucide-react";
import type { Teacher } from "@/types/teacher";
import { SPECIALITES, STATUTS_ENSEIGNANT } from "@/types/teacher";

type ImportRow = Omit<Teacher, "id" | "dateEmbauche">;

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (teachers: ImportRow[]) => void;
}

const COLUMN_MAP: Record<string, keyof ImportRow> = {
  prénom: "prenom",
  prenom: "prenom",
  nom: "nom",
  spécialité: "specialite",
  specialite: "specialite",
  spécialite: "specialite",
  matière: "specialite",
  matiere: "specialite",
  sexe: "sexe",
  "date de naissance": "dateNaissance",
  datenaissance: "dateNaissance",
  date_naissance: "dateNaissance",
  téléphone: "telephone",
  telephone: "telephone",
  tel: "telephone",
  email: "email",
  "e-mail": "email",
  statut: "statut",
};

function mapColumns(raw: Record<string, unknown>): Partial<ImportRow> {
  const mapped: Partial<ImportRow> = {};
  for (const [key, value] of Object.entries(raw)) {
    const normalized = key.toLowerCase().trim();
    const field = COLUMN_MAP[normalized];
    if (field && value != null) {
      mapped[field] = String(value) as never;
    }
  }
  return mapped;
}

function validateRow(row: Partial<ImportRow>): row is ImportRow {
  return Boolean(row.prenom && row.nom && row.specialite);
}

function normalizeRow(row: Partial<ImportRow>): ImportRow {
  return {
    prenom: row.prenom || "",
    nom: row.nom || "",
    specialite: SPECIALITES.includes(row.specialite || "") ? row.specialite! : "",
    sexe: row.sexe === "F" ? "F" : "M",
    dateNaissance: row.dateNaissance || "",
    telephone: row.telephone || "",
    email: row.email || "",
    statut: STATUTS_ENSEIGNANT.includes(row.statut as typeof STATUTS_ENSEIGNANT[number]) ? (row.statut as Teacher["statut"]) : "Actif",
  };
}

export function ExcelImportDialog({ open, onOpenChange, onImport }: ExcelImportDialogProps) {
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [parsedRows, setParsedRows] = useState<ImportRow[]>([]);
  const [invalidCount, setInvalidCount] = useState(0);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setStep("upload");
    setParsedRows([]);
    setInvalidCount(0);
    setFileName("");
  };

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const sheetName = wb.SheetNames[0];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[sheetName]);

      let invalid = 0;
      const valid: ImportRow[] = [];
      for (const raw of rawRows) {
        const mapped = mapColumns(raw);
        if (validateRow(mapped)) {
          valid.push(normalizeRow(mapped));
        } else {
          invalid++;
        }
      }
      setParsedRows(valid);
      setInvalidCount(invalid);
      setStep("preview");
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleConfirmImport = () => {
    onImport(parsedRows);
    onOpenChange(false);
    reset();
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            Importer depuis Excel
          </DialogTitle>
          <DialogDescription>
            {step === "upload"
              ? "Uploadez un fichier Excel (.xlsx, .xls) contenant les données des enseignants"
              : `${parsedRows.length} enseignant(s) prêt(s) à importer`}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium text-foreground mb-1">
              Glissez-déposez votre fichier ici
            </p>
            <p className="text-sm text-muted-foreground mb-4">ou</p>
            <label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
              />
              <Button type="button" variant="outline" className="cursor-pointer" asChild>
                <span>Parcourir les fichiers</span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-4">
              Colonnes attendues : Prénom, Nom, Spécialité, Sexe, Date de naissance, Téléphone, Email, Statut
            </p>
          </div>
        )}

        {step === "preview" && (
          <div className="flex-1 overflow-hidden flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                {parsedRows.length} valide(s)
              </span>
              {invalidCount > 0 && (
                <span className="flex items-center gap-1.5 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  {invalidCount} ignoré(s)
                </span>
              )}
              <span className="text-muted-foreground ml-auto text-xs">
                Fichier : {fileName}
              </span>
            </div>

            <div className="flex-1 overflow-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-left font-semibold text-muted-foreground">#</th>
                    <th className="py-2 px-3 text-left font-semibold text-muted-foreground">Prénom</th>
                    <th className="py-2 px-3 text-left font-semibold text-muted-foreground">Nom</th>
                    <th className="py-2 px-3 text-left font-semibold text-muted-foreground">Spécialité</th>
                    <th className="py-2 px-3 text-left font-semibold text-muted-foreground">Sexe</th>
                    <th className="py-2 px-3 text-left font-semibold text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 50).map((row, i) => (
                    <tr key={i} className="border-t border-border/50 hover:bg-muted/20">
                      <td className="py-1.5 px-3 text-muted-foreground">{i + 1}</td>
                      <td className="py-1.5 px-3">{row.prenom}</td>
                      <td className="py-1.5 px-3">{row.nom}</td>
                      <td className="py-1.5 px-3">{row.specialite}</td>
                      <td className="py-1.5 px-3">{row.sexe}</td>
                      <td className="py-1.5 px-3">{row.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 50 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  ... et {parsedRows.length - 50} de plus
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-2">
          {step === "preview" && (
            <Button variant="outline" onClick={reset} className="mr-auto gap-1.5">
              <X className="h-3.5 w-3.5" />
              Changer de fichier
            </Button>
          )}
          <Button variant="outline" onClick={() => handleClose(false)}>
            Annuler
          </Button>
          {step === "preview" && parsedRows.length > 0 && (
            <Button className="bg-gradient-primary shadow-btn" onClick={handleConfirmImport}>
              Importer {parsedRows.length} enseignant{parsedRows.length > 1 ? "s" : ""}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
