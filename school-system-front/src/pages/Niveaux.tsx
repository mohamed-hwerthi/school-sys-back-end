import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Plus, X, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNiveaux, useCreateNiveau, useAddClasse, useRemoveClasse } from "@/hooks/useNiveaux";
import { useAllStudents } from "@/hooks/useStudents";
import { NiveauxSkeleton } from "@/components/skeletons/NiveauxSkeleton";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

function NiveauCard({ niveauId, nom, sections, studentCount, index }: {
  niveauId: number;
  nom: string;
  sections: string[];
  studentCount: number;
  index: number;
}) {
  const [newSection, setNewSection] = useState("");
  const addClasse = useAddClasse();
  const removeClasse = useRemoveClasse();
  const prefix = nom.match(/^(\d+)/)?.[1] || "";

  const handleAdd = () => {
    const letter = newSection.toUpperCase().trim();
    if (!letter) return;
    if (letter.length !== 1 || !/^[A-Z]$/.test(letter)) {
      toast.error("Veuillez entrer une seule lettre (A-Z)");
      return;
    }
    if (sections.includes(letter)) {
      toast.error(`La section "${letter}" existe déjà`);
      return;
    }
    addClasse.mutate(
      { niveauId, letter },
      {
        onSuccess: () => {
          setNewSection("");
          toast.success(`Section "${prefix}${letter}" ajoutée`);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleRemove = (letter: string) => {
    removeClasse.mutate(
      { niveauId, letter },
      {
        onSuccess: () => toast.success(`Section "${prefix}${letter}" supprimée`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="rounded-xl border border-border/50 bg-card p-5 space-y-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">{nom}</h3>
        </div>
        <Badge variant="secondary" className="gap-1 text-xs">
          <Users className="h-3 w-3" />
          {studentCount}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {sections.length === 0 && (
          <span className="text-xs text-muted-foreground italic">Aucune section</span>
        )}
        {sections.map((letter) => (
          <Badge
            key={letter}
            variant="outline"
            className="gap-1 pl-2.5 pr-1 py-1 text-xs font-medium"
          >
            {prefix}{letter}
            <button
              onClick={() => handleRemove(letter)}
              className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Nouvelle section (ex: D)"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="h-9 text-sm"
          maxLength={1}
        />
        <Button size="sm" className="h-9 px-3" onClick={handleAdd} disabled={addClasse.isPending}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function Niveaux() {
  const { niveaux, isLoading } = useNiveaux();
  const createNiveau = useCreateNiveau();
  const { data: students = [] } = useAllStudents();
  const [newNiveauNom, setNewNiveauNom] = useState("");

  if (isLoading) return <NiveauxSkeleton />;

  const getStudentCount = (niveauNom: string) =>
    students.filter((s) => s.niveau === niveauNom).length;

  const handleAddNiveau = () => {
    const nom = newNiveauNom.trim();
    if (!nom) return;
    if (niveaux.some((n) => n.nom === nom)) {
      toast.error(`Le niveau "${nom}" existe déjà`);
      return;
    }
    createNiveau.mutate(nom, {
      onSuccess: () => {
        setNewNiveauNom("");
        toast.success(`Niveau "${nom}" ajouté`);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Gestion des niveaux</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les niveaux et leurs sections (classes A, B, C...)
          </p>
        </div>
      </div>

      {/* Add niveau */}
      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Nom du nouveau niveau (ex: 7ème année)"
          value={newNiveauNom}
          onChange={(e) => setNewNiveauNom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddNiveau()}
          className="h-9 text-sm"
        />
        <Button
          size="sm"
          className="h-9 gap-1.5 bg-gradient-primary shadow-btn"
          onClick={handleAddNiveau}
          disabled={createNiveau.isPending}
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {niveaux.map((niveau, i) => (
          <NiveauCard
            key={niveau.id}
            niveauId={niveau.id}
            nom={niveau.nom}
            sections={niveau.sections}
            studentCount={getStudentCount(niveau.nom)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
