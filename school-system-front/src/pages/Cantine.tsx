import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { validate, type FormErrors } from "@/lib/validate";
import { menuSchema } from "@/lib/services-schemas";
import {
  UtensilsCrossed,
  CalendarDays,
  Users,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  DollarSign,
  Salad,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useMenus,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
  useAbonnementsCantine,
  useCreateAbonnement,
  useUpdateAbonnement,
  useDeactivateAbonnement,
  useDeleteAbonnement,
  usePointagesRepas,
  usePointerRepas,
  useCantineStats,
} from "@/hooks/useCantine";
import { useAllStudents } from "@/hooks/useStudents";
import type {
  Menu,
  CreateMenuRequest,
  AbonnementCantine,
  CreateAbonnementRequest,
  PointageRepas,
  TypeRegime,
  TypeAbonnement,
} from "@/types/cantine";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

const REGIME_COLORS: Record<string, string> = {
  STANDARD: "bg-blue-100 text-blue-700",
  VEGETARIEN: "bg-green-100 text-green-700",
  SANS_GLUTEN: "bg-yellow-100 text-yellow-700",
  HALAL: "bg-purple-100 text-purple-700",
};

const ABONNEMENT_COLORS: Record<string, string> = {
  JOURNALIER: "bg-gray-100 text-gray-700",
  HEBDOMADAIRE: "bg-blue-100 text-blue-700",
  MENSUEL: "bg-purple-100 text-purple-700",
  ANNUEL: "bg-emerald-100 text-emerald-700",
};

const JOURS_SEMAINE = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];

const ITEMS_PER_PAGE = 15;

export default function CantinePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
          Cantine Scolaire
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gerez les menus, abonnements et pointages de la cantine
        </p>
      </motion.div>

      <Tabs defaultValue="menus" className="space-y-4">
        <TabsList>
          <TabsTrigger value="menus" className="gap-1.5">
            <Salad className="h-4 w-4" /> Menus
          </TabsTrigger>
          <TabsTrigger value="abonnements" className="gap-1.5">
            <Users className="h-4 w-4" /> Abonnements
          </TabsTrigger>
          <TabsTrigger value="pointage" className="gap-1.5">
            <ClipboardCheck className="h-4 w-4" /> Pointage
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menus">
          <MenusTab />
        </TabsContent>
        <TabsContent value="abonnements">
          <AbonnementsTab />
        </TabsContent>
        <TabsContent value="pointage">
          <PointageTab />
        </TabsContent>
        <TabsContent value="statistiques">
          <CantineStatsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---- Menus Tab ----

function MenusTab() {
  const { data: menus = [], isLoading } = useMenus();
  const createMutation = useCreateMenu();
  const updateMutation = useUpdateMenu();
  const deleteMutation = useDeleteMenu();

  const [showDialog, setShowDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null);
  const [filterRegime, setFilterRegime] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("");

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<CreateMenuRequest>({
    dateMenu: "",
    jourSemaine: "LUNDI",
    platPrincipal: "",
    entree: "",
    accompagnement: "",
    dessert: "",
    typeRegime: "STANDARD",
  });

  const filtered = useMemo(() => {
    let list = menus;
    if (filterRegime !== "all") {
      list = list.filter((m) => m.typeRegime === filterRegime);
    }
    if (selectedWeek) {
      list = list.filter((m) => m.semaine === Number(selectedWeek));
    }
    return list.sort((a, b) => a.dateMenu.localeCompare(b.dateMenu));
  }, [menus, filterRegime, selectedWeek]);

  // Group menus by day for the calendar-like view
  const menusByDay = useMemo(() => {
    const grouped: Record<string, Menu[]> = {};
    for (const menu of filtered) {
      const key = menu.dateMenu;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(menu);
    }
    return grouped;
  }, [filtered]);

  const openCreate = () => {
    setEditingMenu(null);
    setForm({ dateMenu: "", jourSemaine: "LUNDI", platPrincipal: "", entree: "", accompagnement: "", dessert: "", typeRegime: "STANDARD" });
    setShowDialog(true);
  };

  const openEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setForm({
      dateMenu: menu.dateMenu,
      jourSemaine: menu.jourSemaine,
      platPrincipal: menu.platPrincipal,
      entree: menu.entree || "",
      accompagnement: menu.accompagnement || "",
      dessert: menu.dessert || "",
      typeRegime: menu.typeRegime,
      semaine: menu.semaine || undefined,
      allergenes: menu.allergenes || [],
    });
    setShowDialog(true);
  };

  const handleSubmit = () => {
    const result = validate(menuSchema, form);
    if (!result.ok) { setFormErrors(result.errors); return; }
    setFormErrors({});
    const onError = (err: Error & { response?: { data?: { message?: string } } }) => setFormErrors({ _root: err.response?.data?.message ?? "Erreur" });
    if (editingMenu) {
      updateMutation.mutate({ id: editingMenu.id, data: form }, { onSuccess: () => setShowDialog(false), onError });
    } else {
      createMutation.mutate(form, { onSuccess: () => setShowDialog(false), onError });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  if (isLoading) {
    return (
      <div className="flex h-[30vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Select value={filterRegime} onValueChange={setFilterRegime}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Regime" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les regimes</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
              <SelectItem value="VEGETARIEN">Vegetarien</SelectItem>
              <SelectItem value="SANS_GLUTEN">Sans gluten</SelectItem>
              <SelectItem value="HALAL">Halal</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Semaine..."
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-[120px]"
          />
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" /> Nouveau menu
        </Button>
      </div>

      {/* Weekly calendar view */}
      {Object.keys(menusByDay).length === 0 ? (
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="rounded-xl border border-border/50 bg-card shadow-sm p-16 text-center">
          <Salad className="h-10 w-10 mx-auto mb-3 opacity-30 text-muted-foreground" />
          <p className="font-medium text-muted-foreground">Aucun menu</p>
          <p className="text-xs text-muted-foreground mt-1">Ajoutez des menus pour les visualiser ici</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(menusByDay).map(([date, dayMenus], i) => (
            <motion.div
              key={date}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden"
            >
              <div className="bg-muted/30 px-4 py-2 border-b border-border/50">
                <p className="font-semibold text-sm text-foreground">
                  {dayMenus[0]?.jourSemaine} - {date}
                </p>
              </div>
              {dayMenus.map((menu) => (
                <div key={menu.id} className="p-4 border-b border-border/50 last:border-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <Badge variant="outline" className={REGIME_COLORS[menu.typeRegime] || ""}>
                        {menu.typeRegime}
                      </Badge>
                      {menu.entree && (
                        <p className="text-xs text-muted-foreground"><span className="font-medium">Entree:</span> {menu.entree}</p>
                      )}
                      <p className="text-sm font-medium text-foreground">{menu.platPrincipal}</p>
                      {menu.accompagnement && (
                        <p className="text-xs text-muted-foreground"><span className="font-medium">Accomp:</span> {menu.accompagnement}</p>
                      )}
                      {menu.dessert && (
                        <p className="text-xs text-muted-foreground"><span className="font-medium">Dessert:</span> {menu.dessert}</p>
                      )}
                      {menu.allergenes && menu.allergenes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {menu.allergenes.map((a) => (
                            <Badge key={a} variant="outline" className="text-[10px] bg-red-50 text-red-600">{a}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(menu)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => setDeleteTarget(menu)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingMenu ? "Modifier le menu" : "Nouveau menu"}</DialogTitle>
            <DialogDescription>
              {editingMenu ? "Modifiez les details du menu" : "Ajoutez un nouveau menu a la cantine"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={form.dateMenu} onChange={(e) => setForm({ ...form, dateMenu: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Jour</Label>
                <Select value={form.jourSemaine} onValueChange={(v) => setForm({ ...form, jourSemaine: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOURS_SEMAINE.map((j) => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Entree</Label>
              <Input value={form.entree || ""} onChange={(e) => setForm({ ...form, entree: e.target.value })} placeholder="Salade verte" />
            </div>
            <div className="space-y-1.5">
              <Label>Plat principal *</Label>
              <Input value={form.platPrincipal} onChange={(e) => setForm({ ...form, platPrincipal: e.target.value })} placeholder="Poulet roti" />
            </div>
            <div className="space-y-1.5">
              <Label>Accompagnement</Label>
              <Input value={form.accompagnement || ""} onChange={(e) => setForm({ ...form, accompagnement: e.target.value })} placeholder="Riz" />
            </div>
            <div className="space-y-1.5">
              <Label>Dessert</Label>
              <Input value={form.dessert || ""} onChange={(e) => setForm({ ...form, dessert: e.target.value })} placeholder="Fruit de saison" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type de regime</Label>
                <Select value={form.typeRegime || "STANDARD"} onValueChange={(v) => setForm({ ...form, typeRegime: v as TypeRegime })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="VEGETARIEN">Vegetarien</SelectItem>
                    <SelectItem value="SANS_GLUTEN">Sans gluten</SelectItem>
                    <SelectItem value="HALAL">Halal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Semaine</Label>
                <Input type="number" value={form.semaine || ""} onChange={(e) => setForm({ ...form, semaine: e.target.value ? Number(e.target.value) : undefined })} placeholder="1-52" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={!form.platPrincipal.trim() || !form.dateMenu || createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) ? "Enregistrement..." : editingMenu ? "Modifier" : "Creer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Supprimer le menu du <span className="font-semibold text-foreground">{deleteTarget?.dateMenu}</span> ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Abonnements Tab ----

function AbonnementsTab() {
  const { data: abonnements = [], isLoading } = useAbonnementsCantine();
  const { data: students = [] } = useAllStudents();
  const studentNameById = useMemo(() => {
    const m = new Map<number, string>();
    students.forEach((s) => m.set(s.id, `${s.prenom} ${s.nom}`.trim()));
    return m;
  }, [students]);
  const studentLabel = (id: number) => studentNameById.get(id) || `#${id}`;

  const createMutation = useCreateAbonnement();
  const updateMutation = useUpdateAbonnement();
  const deactivateMutation = useDeactivateAbonnement();
  const deleteMutation = useDeleteAbonnement();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingAbonnement, setEditingAbonnement] = useState<AbonnementCantine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AbonnementCantine | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [form, setForm] = useState<CreateAbonnementRequest>({
    eleveId: 0,
    typeAbonnement: "MENSUEL",
    dateDebut: "",
    montant: 0,
    regime: "STANDARD",
  });

  const filtered = useMemo(() => {
    let list = abonnements;
    if (filterType !== "all") {
      list = list.filter((a) => a.typeAbonnement === filterType);
    }
    if (filterStatus !== "all") {
      list = list.filter((a) => (filterStatus === "actif" ? a.actif : !a.actif));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          studentLabel(a.eleveId).toLowerCase().includes(q) ||
          a.typeAbonnement.toLowerCase().includes(q)
      );
    }
    return list;
  }, [abonnements, search, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const openCreate = () => {
    setEditingAbonnement(null);
    setForm({ eleveId: 0, typeAbonnement: "MENSUEL", dateDebut: "", montant: 0, regime: "STANDARD" });
    setShowDialog(true);
  };

  const openEdit = (abonnement: AbonnementCantine) => {
    setEditingAbonnement(abonnement);
    setForm({
      eleveId: abonnement.eleveId,
      typeAbonnement: abonnement.typeAbonnement,
      dateDebut: abonnement.dateDebut,
      dateFin: abonnement.dateFin || undefined,
      montant: abonnement.montant,
      allergies: abonnement.allergies || undefined,
      regime: abonnement.regime || "STANDARD",
    });
    setShowDialog(true);
  };

  const handleSubmit = () => {
    if (editingAbonnement) {
      updateMutation.mutate({ id: editingAbonnement.id, data: form }, { onSuccess: () => setShowDialog(false) });
    } else {
      createMutation.mutate(form, { onSuccess: () => setShowDialog(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  if (isLoading) {
    return (
      <div className="flex h-[30vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }} placeholder="Rechercher..." className="ps-9" />
          </div>
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setCurrentPage(0); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="JOURNALIER">Journalier</SelectItem>
              <SelectItem value="HEBDOMADAIRE">Hebdomadaire</SelectItem>
              <SelectItem value="MENSUEL">Mensuel</SelectItem>
              <SelectItem value="ANNUEL">Annuel</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(0); }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <UserPlus className="h-4 w-4" /> Nouvel abonnement
        </Button>
      </div>

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground">Élève</th>
                <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground">Type</th>
                <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground hidden md:table-cell">Dates</th>
                <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground">Montant</th>
                <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground hidden lg:table-cell">Regime</th>
                <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="py-3 px-4 text-end text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Aucun abonnement</p>
                  </td>
                </tr>
              ) : (
                paginated.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{studentLabel(a.eleveId)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={ABONNEMENT_COLORS[a.typeAbonnement] || ""}>
                        {a.typeAbonnement}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                      {a.dateDebut}{a.dateFin ? ` - ${a.dateFin}` : ""}
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">{a.montant} TND</td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <Badge variant="outline" className={REGIME_COLORS[a.regime] || ""}>
                        {a.regime}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={a.actif ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                        {a.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {a.actif && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-orange-600"
                            onClick={() => deactivateMutation.mutate(a.id)}
                            disabled={deactivateMutation.isPending}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => setDeleteTarget(a)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">Page {currentPage + 1} sur {totalPages}</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 0} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAbonnement ? "Modifier l'abonnement" : "Nouvel abonnement"}</DialogTitle>
            <DialogDescription>
              {editingAbonnement ? "Modifiez les details de l'abonnement" : "Ajoutez un nouvel abonnement cantine"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Élève</Label>
              <Select
                value={form.eleveId ? String(form.eleveId) : ""}
                onValueChange={(v) => setForm({ ...form, eleveId: Number(v) })}
                disabled={!!editingAbonnement}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un élève" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {students.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.prenom} {s.nom}
                      {s.classe ? ` — ${s.classe}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type d'abonnement</Label>
                <Select value={form.typeAbonnement} onValueChange={(v) => setForm({ ...form, typeAbonnement: v as TypeAbonnement })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JOURNALIER">Journalier</SelectItem>
                    <SelectItem value="HEBDOMADAIRE">Hebdomadaire</SelectItem>
                    <SelectItem value="MENSUEL">Mensuel</SelectItem>
                    <SelectItem value="ANNUEL">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Montant (TND)</Label>
                <Input type="number" value={form.montant || ""} onChange={(e) => setForm({ ...form, montant: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date debut</Label>
                <Input type="date" value={form.dateDebut} onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Date fin</Label>
                <Input type="date" value={form.dateFin || ""} onChange={(e) => setForm({ ...form, dateFin: e.target.value || undefined })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Regime</Label>
                <Select value={form.regime || "STANDARD"} onValueChange={(v) => setForm({ ...form, regime: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="VEGETARIEN">Vegetarien</SelectItem>
                    <SelectItem value="SANS_GLUTEN">Sans gluten</SelectItem>
                    <SelectItem value="HALAL">Halal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Allergies</Label>
                <Input value={form.allergies || ""} onChange={(e) => setForm({ ...form, allergies: e.target.value || undefined })} placeholder="Arachides, lait..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={!form.eleveId || !form.dateDebut || createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) ? "Enregistrement..." : editingAbonnement ? "Modifier" : "Creer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Supprimer l'abonnement de l'élève <span className="font-semibold text-foreground">{deleteTarget ? studentLabel(deleteTarget.eleveId) : ""}</span> ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Pointage Tab ----

function PointageTab() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedType, setSelectedType] = useState("DEJEUNER");

  const { data: pointages = [], isLoading } = usePointagesRepas(selectedDate, selectedType);
  const { data: abonnementsActifs = [] } = useAbonnementsCantine();
  const { data: students = [] } = useAllStudents();
  const studentNameById = useMemo(() => {
    const m = new Map<number, string>();
    students.forEach((s) => m.set(s.id, `${s.prenom} ${s.nom}`.trim()));
    return m;
  }, [students]);
  const studentLabel = (id: number) => studentNameById.get(id) || `#${id}`;
  const pointerMutation = usePointerRepas();

  const [localPointages, setLocalPointages] = useState<Record<number, boolean>>({});

  // Initialize local pointages from fetched data
  const pointageMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    for (const p of pointages) {
      map[p.eleveId] = p.present;
    }
    return { ...map, ...localPointages };
  }, [pointages, localPointages]);

  // Get list of subscribed students
  const subscribedStudents = useMemo(() => {
    const seen = new Set<number>();
    return abonnementsActifs.filter((a) => {
      if (a.actif && !seen.has(a.eleveId)) {
        seen.add(a.eleveId);
        return true;
      }
      return false;
    });
  }, [abonnementsActifs]);

  const togglePresence = (eleveId: number) => {
    setLocalPointages((prev) => ({
      ...prev,
      [eleveId]: !(pointageMap[eleveId] ?? true),
    }));
  };

  const handleSavePointage = () => {
    const items = subscribedStudents.map((a) => ({
      eleveId: a.eleveId,
      present: pointageMap[a.eleveId] ?? true,
    }));
    pointerMutation.mutate({
      dateRepas: selectedDate,
      typeRepas: selectedType as "DEJEUNER",
      pointages: items,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => { setSelectedDate(e.target.value); setLocalPointages({}); }}
          className="w-[180px]"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PETIT_DEJEUNER">Petit dejeuner</SelectItem>
            <SelectItem value="DEJEUNER">Dejeuner</SelectItem>
            <SelectItem value="GOUTER">Gouter</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSavePointage} disabled={pointerMutation.isPending || subscribedStudents.length === 0} className="gap-1.5">
          <ClipboardCheck className="h-4 w-4" />
          {pointerMutation.isPending ? "Enregistrement..." : "Enregistrer le pointage"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : subscribedStudents.length === 0 ? (
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="rounded-xl border border-border/50 bg-card shadow-sm p-16 text-center">
          <ClipboardCheck className="h-10 w-10 mx-auto mb-3 opacity-30 text-muted-foreground" />
          <p className="font-medium text-muted-foreground">Aucun abonne actif</p>
          <p className="text-xs text-muted-foreground mt-1">Ajoutez des abonnements pour pouvoir faire le pointage</p>
        </motion.div>
      ) : (
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground">Élève</th>
                  <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground">Type abonnement</th>
                  <th className="py-3 px-4 text-start text-xs font-semibold text-muted-foreground hidden md:table-cell">Regime</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground">Present</th>
                </tr>
              </thead>
              <tbody>
                {subscribedStudents.map((a) => (
                  <tr key={a.eleveId} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{studentLabel(a.eleveId)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={ABONNEMENT_COLORS[a.typeAbonnement] || ""}>
                        {a.typeAbonnement}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge variant="outline" className={REGIME_COLORS[a.regime] || ""}>
                        {a.regime}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Checkbox
                        checked={pointageMap[a.eleveId] ?? true}
                        onCheckedChange={() => togglePresence(a.eleveId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            {subscribedStudents.length} eleve{subscribedStudents.length !== 1 ? "s" : ""} abonne{subscribedStudents.length !== 1 ? "s" : ""}
            {" - "}
            {Object.values(pointageMap).filter(Boolean).length} present{Object.values(pointageMap).filter(Boolean).length !== 1 ? "s" : ""}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ---- Stats Tab ----

function CantineStatsTab() {
  const { data: stats, isLoading } = useCantineStats();

  if (isLoading) {
    return (
      <div className="flex h-[30vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Abonnes",
      value: stats?.totalAbonnes ?? 0,
      icon: Users,
      color: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Repas Aujourd'hui",
      value: stats?.repasAujourdHui ?? 0,
      icon: UtensilsCrossed,
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      label: "Taux de Presence",
      value: `${(stats?.tauxPresence ?? 0).toFixed(1)}%`,
      icon: CheckCircle,
      color: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Revenus Mensuels",
      value: `${(stats?.revenuesMensuel ?? 0).toLocaleString()} TND`,
      icon: DollarSign,
      color: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, i) => (
        <motion.div
          key={stat.label}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-border/50 bg-card p-5 shadow-sm"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
            <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
          </div>
          <p className="mt-3 font-heading text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
