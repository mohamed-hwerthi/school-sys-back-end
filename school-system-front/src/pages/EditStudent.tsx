import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Edit } from "lucide-react";
import { useStudent, useUpdateStudent } from "@/hooks/useStudents";
import { StudentForm } from "@/components/students/StudentForm";
import { StudentFormSkeleton } from "@/components/skeletons/StudentFormSkeleton";
import type { StudentFormValues } from "@/lib/student-schema";
import { toast } from "sonner";

export default function EditStudent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading } = useStudent(Number(id));
  const updateStudent = useUpdateStudent();

  if (isLoading) return <StudentFormSkeleton />;

  if (!student) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-medium text-foreground">Élève introuvable</p>
        <p className="text-sm text-muted-foreground mt-1">
          L'élève avec l'identifiant #{id} n'existe pas.
        </p>
        <button
          onClick={() => navigate("/dashboard/eleves")}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const handleSubmit = (data: StudentFormValues) => {
    updateStudent.mutate(
      { id: student.id, data },
      {
        onSuccess: () => {
          toast.success("Élève modifié avec succès");
          navigate("/dashboard/eleves");
        },
        onError: (err) => {
          toast.error(err.message || "Erreur lors de la modification");
        },
      }
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <button
          onClick={() => navigate("/dashboard")}
          className="hover:text-foreground transition-colors"
        >
          Tableau de bord
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button
          onClick={() => navigate("/dashboard/eleves")}
          className="hover:text-foreground transition-colors"
        >
          Élèves
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">Modifier</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
            <Edit className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              Modifier l'élève
            </h1>
            <p className="text-sm text-muted-foreground">
              {student.prenom} {student.nom} — {student.classe}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <StudentForm
          defaultValues={{
            nom: student.nom,
            prenom: student.prenom,
            nomAr: student.nomAr,
            prenomAr: student.prenomAr,
            niveau: student.niveau,
            classe: student.classe,
            sexe: student.sexe,
            dateNaissance: student.dateNaissance,
            lieuNaissance: student.lieuNaissance,
            adresse: student.adresse,
            matricule: student.matricule,
            statut: student.statut,
            estBloque: student.estBloque,
            nomParent: student.nomParent,
            prenomParent: student.prenomParent,
            telephoneParent: student.telephoneParent,
            emailParent: student.emailParent,
            notes: student.notes,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/dashboard/eleves")}
          submitLabel={updateStudent.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
        />
      </motion.div>
    </div>
  );
}
