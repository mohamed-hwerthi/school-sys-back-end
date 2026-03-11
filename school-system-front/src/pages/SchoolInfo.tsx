import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schoolSchema, type SchoolFormValues } from "@/lib/school-schema";
import { useSchool } from "@/hooks/useSchool";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Save, Upload, ImageIcon } from "lucide-react";

function SchoolInfoSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-xl" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
          <div className="sm:col-span-2 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SchoolInfo() {
  const loading = useSimulatedLoading(800);
  const { school, updateSchool } = useSchool();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      nom: school.nom,
      nomAr: school.nomAr,
      logo: school.logo,
      adresse: school.adresse,
      ville: school.ville,
      villeAr: school.villeAr,
      telephone: school.telephone,
      email: school.email,
      siteWeb: school.siteWeb,
      directeur: school.directeur,
      anneeCreation: school.anneeCreation,
      description: school.description,
    },
  });

  const logoPreview = watch("logo");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setValue("logo", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: SchoolFormValues) => {
    updateSchool(data);
    toast.success("Informations de l'école enregistrées");
  };

  if (loading) return <SchoolInfoSkeleton />;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Informations de l'école
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les informations générales de votre établissement
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-gradient-primary shadow-btn gap-1.5"
        >
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
          {/* Logo section */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Logo de l'école
            </Label>
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Changer le logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG ou SVG. Max 2 Mo.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          </div>

          {/* Info fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="nom">Nom de l'école *</Label>
              <Input
                id="nom"
                {...register("nom")}
                placeholder="Nom de l'établissement"
              />
              {errors.nom && (
                <p className="text-xs text-destructive">
                  {errors.nom.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nomAr">اسم المدرسة (بالعربية)</Label>
              <Input
                id="nomAr"
                dir="rtl"
                {...register("nomAr")}
                placeholder="اسم المؤسسة بالعربية"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="directeur">Directeur</Label>
              <Input
                id="directeur"
                {...register("directeur")}
                placeholder="Nom du directeur"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                {...register("adresse")}
                placeholder="Adresse de l'école"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                {...register("ville")}
                placeholder="Ville"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="villeAr">المدينة (بالعربية)</Label>
              <Input
                id="villeAr"
                dir="rtl"
                {...register("villeAr")}
                placeholder="المدينة بالعربية"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                {...register("telephone")}
                placeholder="0522-XXXXXX"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="contact@ecole.ma"
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="siteWeb">Site web</Label>
              <Input
                id="siteWeb"
                {...register("siteWeb")}
                placeholder="www.ecole.ma"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="anneeCreation">Année de création</Label>
              <Input
                id="anneeCreation"
                {...register("anneeCreation")}
                placeholder="2005"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Description de l'établissement..."
                rows={3}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
