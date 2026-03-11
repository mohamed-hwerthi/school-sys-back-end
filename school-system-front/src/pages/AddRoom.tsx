import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { RoomForm } from "@/components/rooms/RoomForm";
import { StudentFormSkeleton } from "@/components/skeletons/StudentFormSkeleton";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import type { RoomFormValues } from "@/lib/room-schema";

export default function AddRoom() {
  const navigate = useNavigate();
  const { addRoom } = useRooms();
  const loading = useSimulatedLoading(800);

  if (loading) return <StudentFormSkeleton />;

  const handleSubmit = (data: RoomFormValues) => {
    addRoom({
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
        <span className="text-foreground font-medium">Ajouter</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-sm">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              Nouvelle Salle
            </h1>
            <p className="text-sm text-muted-foreground">
              Remplissez les informations pour ajouter une nouvelle salle
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
          onSubmit={handleSubmit}
          onCancel={() => navigate("/dashboard/emploi-salles")}
          submitLabel="Ajouter la salle"
        />
      </motion.div>
    </div>
  );
}
