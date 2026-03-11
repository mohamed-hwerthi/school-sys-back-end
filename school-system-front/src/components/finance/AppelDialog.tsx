import { useState } from "react";
import { toast } from "sonner";
import type { Student } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Phone } from "lucide-react";

interface AppelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function AppelDialog({ open, onOpenChange, student }: AppelDialogProps) {
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!student) return;
    // TODO: integrate with backend Communication API when available
    toast.success("Appel enregistré", {
      description: `Appel enregistré pour ${student.prenom} ${student.nom}`,
    });
    setNotes("");
    onOpenChange(false);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) setNotes("");
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Enregistrer un appel
          </DialogTitle>
          <DialogDescription>
            {student
              ? `Appel à ${student.prenomParent ?? ""} ${student.nomParent ?? student.nom} — ${
                  student.telephoneParent ?? student.telephone
                }`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {student && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="font-medium">
                Numéro parent : {student.telephoneParent}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Élève : {student.prenom} {student.nom} ({student.classe})
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="appel-notes">Notes de l'appel</Label>
            <Textarea
              id="appel-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Résumé de la conversation, engagements pris..."
              rows={5}
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            className="gap-1.5 bg-gradient-primary shadow-btn"
          >
            <Phone className="h-4 w-4" />
            Enregistrer l'appel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
