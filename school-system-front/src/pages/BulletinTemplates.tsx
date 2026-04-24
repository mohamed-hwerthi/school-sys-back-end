import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { validate, type FormErrors } from "@/lib/validate";
import { z } from "zod";

const bulletinTemplateSchema = z.object({
  nom: z.string().trim().min(2, "Nom requis (min 2 caractères)"),
  footerText: z.string().optional(),
});
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  Palette,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { notify } from "@/lib/toast";
import {
  useBulletinTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useActivateTemplate,
  useDeleteTemplate,
} from "@/hooks/useBulletins";
import type { BulletinTemplateDTO } from "@/api/bulletins.api";

const emptyTemplate: BulletinTemplateDTO = {
  nom: "",
  logoUrl: "",
  nomEcoleFr: "",
  nomEcoleAr: "",
  adresse: "",
  telephone: "",
  email: "",
  headerColor: "#1e3a5f",
  showLogo: true,
  showPhotoEleve: false,
  showAppreciation: true,
  showRang: true,
  footerText: "",
};

export default function BulletinTemplates() {
  const { data: templates = [], isLoading } = useBulletinTemplates();
  const createMut = useCreateTemplate();
  const updateMut = useUpdateTemplate();
  const activateMut = useActivateTemplate();
  const deleteMut = useDeleteTemplate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<BulletinTemplateDTO>(emptyTemplate);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const openCreate = () => {
    setForm({ ...emptyTemplate });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (t: BulletinTemplateDTO) => {
    setForm({ ...t });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const result = validate(bulletinTemplateSchema, form);
    if (!result.ok) { setFormErrors(result.errors); return; }
    setFormErrors({});
    try {
      if (isEditing && form.id) {
        await updateMut.mutateAsync({ id: form.id, dto: form });
        notify.success("Template mis a jour");
      } else {
        await createMut.mutateAsync(form);
        notify.success("Template cree");
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setFormErrors({ _root: e.response?.data?.message ?? "Erreur lors de la sauvegarde" });
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await activateMut.mutateAsync(id);
      notify.success("Template active");
    } catch {
      notify.error("Erreur lors de l'activation");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMut.mutateAsync(deleteId);
      notify.success("Template supprime");
    } catch (err: unknown) {
      notify.error(err instanceof Error ? err.message : "Erreur");
    }
    setDeleteId(null);
  };

  const set = (key: keyof BulletinTemplateDTO, val: unknown) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 animate-pulse space-y-4">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="h-5 w-5 text-indigo-600" />
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              Templates Bulletin
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Personnalisez l'apparence de vos bulletins scolaires
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Nouveau template
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md ${
              t.actif
                ? "border-emerald-300 ring-2 ring-emerald-100"
                : "border-border/40"
            }`}
          >
            {t.actif && (
              <Badge className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                Actif
              </Badge>
            )}
            <div
              className="h-2 rounded-full mb-4 w-full"
              style={{ backgroundColor: t.headerColor || "#1e3a5f" }}
            />
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {t.nom}
            </h3>
            {t.nomEcoleFr && (
              <p className="text-sm text-muted-foreground mb-1">
                {t.nomEcoleFr}
              </p>
            )}
            {t.nomEcoleAr && (
              <p
                className="text-sm text-muted-foreground mb-3 text-right"
                dir="rtl"
              >
                {t.nomEcoleAr}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              {(
                [
                  ["showLogo", "Logo"],
                  ["showRang", "Rang"],
                  ["showAppreciation", "Appreciation"],
                  ["showPhotoEleve", "Photo"],
                ] as const
              ).map(([k, label]) => (
                <span
                  key={k}
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  {t[k] ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                  {label}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEdit(t)}
                className="gap-1"
              >
                <Pencil className="h-3 w-3" /> Modifier
              </Button>
              {!t.actif && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleActivate(t.id!)}
                    className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    <CheckCircle className="h-3 w-3" /> Activer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(t.id!)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            Aucun template. Creez-en un pour commencer.
          </p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier le template" : "Nouveau template"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formErrors._root && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{formErrors._root}</div>
            )}
            <div>
              <Label>Nom du template *</Label>
              <Input
                value={form.nom}
                onChange={(e) => set("nom", e.target.value)}
                placeholder="Ex: Template officiel"
                aria-invalid={!!formErrors.nom}
                className={formErrors.nom ? "border-red-500" : ""}
              />
              {formErrors.nom && <p className="text-xs text-red-600">{formErrors.nom}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nom ecole (FR)</Label>
                <Input
                  value={form.nomEcoleFr || ""}
                  onChange={(e) => set("nomEcoleFr", e.target.value)}
                />
              </div>
              <div>
                <Label>Nom ecole (AR)</Label>
                <Input
                  value={form.nomEcoleAr || ""}
                  onChange={(e) => set("nomEcoleAr", e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>
            <div>
              <Label>URL du logo</Label>
              <Input
                value={form.logoUrl || ""}
                onChange={(e) => set("logoUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input
                value={form.adresse || ""}
                onChange={(e) => set("adresse", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Telephone</Label>
                <Input
                  value={form.telephone || ""}
                  onChange={(e) => set("telephone", e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={form.email || ""}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Couleur en-tete</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.headerColor || "#1e3a5f"}
                  onChange={(e) => set("headerColor", e.target.value)}
                  className="h-9 w-14 rounded border cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">
                  {form.headerColor}
                </span>
              </div>
            </div>
            <div className="space-y-3 border-t pt-3">
              <h4 className="text-sm font-medium text-foreground">
                Options d'affichage
              </h4>
              {(
                [
                  ["showLogo", "Afficher le logo", true],
                  ["showPhotoEleve", "Afficher la photo de l'eleve", false],
                  ["showAppreciation", "Afficher les appreciations", true],
                  ["showRang", "Afficher le rang", true],
                ] as const
              ).map(([key, label, defaultVal]) => (
                <div
                  key={key}
                  className="flex items-center justify-between"
                >
                  <Label>{label}</Label>
                  <Switch
                    checked={form[key] ?? defaultVal}
                    onCheckedChange={(v) => set(key, v)}
                  />
                </div>
              ))}
            </div>
            <div>
              <Label>Texte du pied de page</Label>
              <Textarea
                value={form.footerText || ""}
                onChange={(e) => set("footerText", e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMut.isPending || updateMut.isPending}
            >
              {createMut.isPending || updateMut.isPending
                ? "Enregistrement..."
                : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le template ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
