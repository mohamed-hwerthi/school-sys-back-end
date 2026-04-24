import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Loader2,
  Users,
  BookOpen,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/lib/toast";
import { useClasses } from "@/hooks/useClasses";
import { useNiveaux } from "@/hooks/useNiveaux";
import { useSchool } from "@/hooks/useSchool";
import { useBulletinTemplates } from "@/hooks/useBulletins";
import { bulletinsApi, type BulletinDTO } from "@/api/bulletins.api";
import {
  generateBulletinPdf,
  generateBulletinsMassePdf,
} from "@/utils/generateBulletinPdf";

export default function BulletinsMasse() {
  const { niveaux } = useNiveaux();
  const { school } = useSchool();
  const { data: templates = [] } = useBulletinTemplates();
  const activeTemplate = templates.find((t) => t.actif) || null;
  const [selectedNiveau, setSelectedNiveau] = useState<number>(0);
  const { data: classes = [] } = useClasses(
    selectedNiveau || undefined
  );
  const [selectedClasse, setSelectedClasse] = useState<number>(0);
  const [selectedTrimestre, setSelectedTrimestre] = useState<number>(0);
  const [generating, setGenerating] = useState(false);
  const [bulletins, setBulletins] = useState<BulletinDTO[]>([]);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!selectedClasse || !selectedTrimestre) {
      notify.error("Veuillez selectionner une classe et un trimestre");
      return;
    }
    setGenerating(true);
    try {
      const data = await bulletinsApi.massGenerate(
        selectedClasse,
        selectedTrimestre
      );
      setBulletins(data);
      setGenerated(true);
      notify.success(`${data.length} bulletins generes`);
    } catch {
      notify.error("Erreur lors de la generation");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!bulletins.length) return;
    generateBulletinsMassePdf(bulletins, school, selectedTrimestre, activeTemplate);
    notify.success(`${bulletins.length} bulletins PDF telecharges`);
  };

  const handleDownloadSingle = (bulletin: BulletinDTO) => {
    generateBulletinPdf(bulletin, school, activeTemplate);
    notify.success(`Bulletin de ${bulletin.studentName} telecharge`);
  };

  const classeObj = classes.find((c) => c.id === selectedClasse);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-blue-600" />
          <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            Generation en masse
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generez tous les bulletins d'une classe en un clic
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Parametres de generation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Niveau</Label>
            <Select
              value={selectedNiveau ? String(selectedNiveau) : ""}
              onValueChange={(v) => {
                setSelectedNiveau(Number(v));
                setSelectedClasse(0);
                setGenerated(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un niveau" />
              </SelectTrigger>
              <SelectContent>
                {niveaux.map((n) => (
                  <SelectItem key={n.id} value={String(n.id)}>
                    {n.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Classe</Label>
            <Select
              value={selectedClasse ? String(selectedClasse) : ""}
              onValueChange={(v) => {
                setSelectedClasse(Number(v));
                setGenerated(false);
              }}
              disabled={!selectedNiveau}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une classe" />
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
          <div>
            <Label>Trimestre</Label>
            <Select
              value={selectedTrimestre ? String(selectedTrimestre) : ""}
              onValueChange={(v) => {
                setSelectedTrimestre(Number(v));
                setGenerated(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trimestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Trimestre 1</SelectItem>
                <SelectItem value="2">Trimestre 2</SelectItem>
                <SelectItem value="3">Trimestre 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedClasse || !selectedTrimestre}
            className="gap-2"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {generating ? "Generation..." : "Generer les bulletins"}
          </Button>
          {generated && bulletins.length > 0 && (
            <Button
              variant="outline"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" /> Telecharger tout
            </Button>
          )}
        </div>
      </motion.div>

      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Resultats ({bulletins.length} bulletins)
            </h2>
            {classeObj && (
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="h-3 w-3" /> {classeObj.fullName} -
                T{selectedTrimestre}
              </Badge>
            )}
          </div>
          {bulletins.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune note trouvee pour cette classe et ce trimestre.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left">
                    <th className="pb-2 font-medium text-muted-foreground">
                      #
                    </th>
                    <th className="pb-2 font-medium text-muted-foreground">
                      Eleve
                    </th>
                    <th className="pb-2 font-medium text-muted-foreground text-center">
                      Moyenne
                    </th>
                    <th className="pb-2 font-medium text-muted-foreground text-center">
                      Rang
                    </th>
                    <th className="pb-2 font-medium text-muted-foreground text-center">
                      Certificat
                    </th>
                    <th className="pb-2 font-medium text-muted-foreground text-center">
                      PDF
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bulletins.map((b, i) => (
                    <tr
                      key={b.studentId}
                      className="border-b border-border/20"
                    >
                      <td className="py-2 text-muted-foreground">
                        {i + 1}
                      </td>
                      <td className="py-2 font-medium text-foreground">
                        {b.studentName}
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`font-semibold ${
                            b.moyenneGenerale >= 10
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {b.moyenneGenerale.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 text-center text-muted-foreground">
                        {b.rang}/{b.totalEleves}
                      </td>
                      <td className="py-2 text-center">
                        {b.certificatType ? (
                          <Badge variant="secondary" className="text-xs">
                            {b.certificatType}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          onClick={() => handleDownloadSingle(b)}
                          title="Telecharger PDF"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
