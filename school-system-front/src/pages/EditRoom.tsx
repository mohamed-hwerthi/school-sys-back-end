import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Edit } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { RoomForm } from "@/components/rooms/RoomForm";
import { StudentFormSkeleton } from "@/components/skeletons/StudentFormSkeleton";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import type { RoomFormValues } from "@/lib/room-schema";

export default function EditRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoom, updateRoom } = useRooms();
  const loading = useSimulatedLoading(800);

  const room = getRoom(Number(id));

  if (loading) return <StudentFormSkeleton />;

  if (!room) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-medium text-foreground">Salle introuvable</p>
        <p className="text-sm text-muted-foreground mt-1">
          La salle avec l'identifiant #{id} n'existe pas.
        </p>
        <button
          onClick={() => navigate("/dashboard/emploi-salles")}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const handleSubmit = (data: RoomFormValues) => {
    updateRoom(room.id, {
      nom: data.nom,
      type: data.type,
      capacite: data.capacite,
      etage: data.etage,
      equipements: data.equipements
        ? data.equipements.split(",").map((e) => e.trim()).filter(Boolean)
        : [],
      statut: data.statut,
    });
    navigate("/dashboard/emploi-salles");
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
          onClick={() => navigate("/dashboard/emploi-salles")}
          className="hover:text-foreground transition-colors"
        >
          Emploi - Salles
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
              Modifier la salle
            </h1>
            <p className="text-sm text-muted-foreground">
              {room.nom} — {room.type}
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
        <RoomForm
          defaultValues={{
            nom: room.nom,
            type: room.type,
            capacite: room.capacite,
            etage: room.etage,
            equipements: room.equipements.join(", "),
            statut: room.statut,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/dashboard/emploi-salles")}
          submitLabel="Enregistrer les modifications"
        />
      </motion.div>
    </div>
  );
}
