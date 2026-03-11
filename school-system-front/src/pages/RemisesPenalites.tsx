import { useState } from "react";
import { motion } from "framer-motion";
import {
  Tag,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  MoreHorizontal,
  Check,
  Percent,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENCY } from "@/config/currency";
import { useAllStudents } from "@/hooks/useStudents";
import { useTypesFrais } from "@/hooks/useFinance";
import {
  useRemises,
  useCreateRemise,
  useUpdateRemise,
  useDeleteRemise,
  usePenalites,
  useCreatePenalite,
  useUpdatePenalite,
  useTogglePenalitePayee,
  useDeletePenalite,
} from "@/hooks/useRemisesPenalites";
import type { RemiseDTO, RemiseRequest, PenaliteDTO, PenaliteRequest } from "@/api/remises-penalites.api";

const ANNEE = "2025-2026";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

const TYPE_REMISE_LABELS: Record<string, string> = {
  FRATRIE: "Fratrie",
  BOURSE: "Bourse",
  PERSONNEL: "Personnel",
  ANTICIPATION: "Anticipation",
  COMMERCIAL: "Commercial",
};

const TYPE_REMISE_COLORS: Record<string, string> = {
  FRATRIE: "bg-blue-50 text-blue-700",
  BOURSE: "bg-emerald-50 text-emerald-700",
  PERSONNEL: "bg-purple-50 text-purple-700",
  ANTICIPATION: "bg-amber-50 text-amber-700",
  COMMERCIAL: "bg-teal-50 text-teal-700",
};

type TabKey = "remises" | "penalites";

export default function RemisesPenalites() {
  const [activeTab, setActiveTab] = useState<TabKey>("remises");
  const { data: students = [] } = useAllStudents();
  const { data: typesFrais = [] } = useTypesFrais();
  const { data: remises = [], isLoading: loadingRemises } = useRemises(ANNEE);
  const { data: penalites = [], isLoading: loadingPenalites } = usePenalites(ANNEE);

  const createRemise = useCreateRemise();
  const updateRemise = useUpdateRemise();
  const deleteRemiseMut = useDeleteRemise();
  const createPenalite = useCreatePenalite();
  const updatePenalite = useUpdatePenalite();
  const togglePayee = useTogglePenalitePayee();
  const deletePenaliteMut = useDeletePenalite();

  const getStudent = (id: number) => students.find((s) => s.id === id);

  // ── Remise dialog state ──
  const [remiseDialogOpen, setRemiseDialogOpen] = useState(false);
  const [editRemise, setEditRemise] = useState<RemiseDTO | null>(null);
  const [deleteRemiseTarget, setDeleteRemiseTarget] = useState<RemiseDTO | null>(null);

  const emptyRemiseForm: RemiseRequest = {
    studentId: 0,
    typeFraisId: null,
    type: "FRATRIE",
    valeur: 0,
    estPourcentage: false,
    motif: "",
    anneeScolaire: ANNEE,
    active: true,
  };
  const [remiseForm, setRemiseForm] = useState<RemiseRequest>(emptyRemiseForm);

  const openAddRemise = () => {
    setRemiseForm(emptyRemiseForm);
    setEditRemise(null);
    setRemiseDialogOpen(true);
  };

  const openEditRemise = (r: RemiseDTO) => {
    setRemiseForm({
      studentId: r.studentId,
      typeFraisId: r.typeFraisId,
      type: r.type,
      valeur: r.valeur,
      estPourcentage: r.estPourcentage,
      motif: r.motif ?? "",
      anneeScolaire: r.anneeScolaire,
      active: r.active,
    });
    setEditRemise(r);
    setRemiseDialogOpen(true);
  };

  const handleSaveRemise = () => {
    if (!remiseForm.studentId || !remiseForm.valeur) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    if (editRemise) {
      updateRemise.mutate(
        { id: editRemise.id, data: remiseForm },
        {
          onSuccess: () => { toast.success("Remise modifiee"); setRemiseDialogOpen(false); setEditRemise(null); },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createRemise.mutate(remiseForm, {
        onSuccess: () => { toast.success("Remise ajoutee"); setRemiseDialogOpen(false); },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDeleteRemise = () => {
    if (!deleteRemiseTarget) return;
    deleteRemiseMut.mutate(deleteRemiseTarget.id, {
      onSuccess: () => { toast.success("Remise supprimee"); setDeleteRemiseTarget(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  // ── Penalite dialog state ──
  const [penaliteDialogOpen, setPenaliteDialogOpen] = useState(false);
  const [editPenalite, setEditPenalite] = useState<PenaliteDTO | null>(null);
  const [deletePenaliteTarget, setDeletePenaliteTarget] = useState<PenaliteDTO | null>(null);

  const emptyPenaliteForm: PenaliteRequest = {
    studentId: 0,
    paiementId: null,
    montant: 0,
    motif: "",
    dateApplication: new Date().toISOString().split("T")[0],
    anneeScolaire: ANNEE,
    payee: false,
  };
  const [penaliteForm, setPenaliteForm] = useState<PenaliteRequest>(emptyPenaliteForm);

  const openAddPenalite = () => {
    setPenaliteForm(emptyPenaliteForm);
    setEditPenalite(null);
    setPenaliteDialogOpen(true);
  };

  const openEditPenalite = (p: PenaliteDTO) => {
    setPenaliteForm({
      studentId: p.studentId,
      paiementId: p.paiementId,
      montant: p.montant,
      motif: p.motif,
      dateApplication: p.dateApplication,
      anneeScolaire: p.anneeScolaire,
      payee: p.payee,
    });
    setEditPenalite(p);
    setPenaliteDialogOpen(true);
  };

  const handleSavePenalite = () => {
    if (!penaliteForm.studentId || !penaliteForm.montant || !penaliteForm.motif) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    if (editPenalite) {
      updatePenalite.mutate(
        { id: editPenalite.id, data: penaliteForm },
        {
          onSuccess: () => { toast.success("Penalite modifiee"); setPenaliteDialogOpen(false); setEditPenalite(null); },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createPenalite.mutate(penaliteForm, {
        onSuccess: () => { toast.success("Penalite ajoutee"); setPenaliteDialogOpen(false); },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDeletePenalite = () => {
    if (!deletePenaliteTarget) return;
    deletePenaliteMut.mutate(deletePenaliteTarget.id, {
      onSuccess: () => { toast.success("Penalite supprimee"); setDeletePenaliteTarget(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  // Stats
  const totalRemises = remises.filter((r) => r.active && !r.estPourcentage).reduce((s, r) => s + r.valeur, 0);
  const totalPenalites = penalites.reduce((s, p) => s + p.montant, 0);
  const penalitesImpayees = penalites.filter((p) => !p.payee).reduce((s, p) => s + p.montant, 0);

  const isLoading = loadingRemises || loadingPenalites;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Remises & Penalites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestion des reductions et frais de retard — {ANNEE}
          </p>
        </div>
        <Button
          className="bg-gradient-primary shadow-btn gap-2"
          onClick={activeTab === "remises" ? openAddRemise : openAddPenalite}
        >
          <Plus className="h-4 w-4" />
          {activeTab === "remises" ? "Nouvelle remise" : "Nouvelle penalite"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2.5"><Tag className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-xs text-emerald-600 font-medium">Remises actives</p>
              <p className="text-xl font-bold text-emerald-700">{remises.filter((r) => r.active).length}</p>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2.5"><Percent className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Total remises (fixe)</p>
              <p className="text-xl font-bold text-blue-700">{totalRemises.toLocaleString()} {CURRENCY}</p>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2.5"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="text-xs text-red-600 font-medium">Penalites impayees</p>
              <p className="text-xl font-bold text-red-700">{penalitesImpayees.toLocaleString()} {CURRENCY}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
        {([
          { key: "remises" as TabKey, label: "Remises", icon: Tag, count: remises.length },
          { key: "penalites" as TabKey, label: "Penalites", icon: AlertTriangle, count: penalites.length },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <Badge variant="secondary" className="text-[10px] ml-1">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {/* ── REMISES TAB ── */}
      {activeTab === "remises" && (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Eleve</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Type</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Frais concerne</th>
                  <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Valeur</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Motif</th>
                  <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Statut</th>
                  <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {remises.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Aucune remise enregistree</td></tr>
                ) : (
                  remises.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-medium">{r.studentFirstName} {r.studentLastName}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-xs ${TYPE_REMISE_COLORS[r.type] ?? ""}`}>
                          {TYPE_REMISE_LABELS[r.type] ?? r.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {r.typeFraisNom ?? "Tous les frais"}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-600 whitespace-nowrap">
                        -{r.valeur.toLocaleString()}{r.estPourcentage ? "%" : ` ${CURRENCY}`}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{r.motif || "—"}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={r.active ? "default" : "secondary"} className="text-[10px]">
                          {r.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditRemise(r)}>
                              <Edit className="h-3.5 w-3.5 mr-2" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteRemiseTarget(r)} className="text-destructive">
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PENALITES TAB ── */}
      {activeTab === "penalites" && (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Eleve</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Motif</th>
                  <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Montant</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Date</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Paiement lie</th>
                  <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Payee</th>
                  <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {penalites.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Aucune penalite enregistree</td></tr>
                ) : (
                  penalites.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-medium">{p.studentFirstName} {p.studentLastName}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{p.motif}</td>
                      <td className="py-3 px-4 text-right font-semibold text-red-600 whitespace-nowrap">
                        +{p.montant.toLocaleString()} {CURRENCY}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {new Date(p.dateApplication).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {p.paiementReference ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => togglePayee.mutate(p.id, {
                            onSuccess: () => toast.success(p.payee ? "Marquee comme impayee" : "Marquee comme payee"),
                          })}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
                            p.payee
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {p.payee ? <Check className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                          {p.payee ? "Payee" : "Impayee"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditPenalite(p)}>
                              <Edit className="h-3.5 w-3.5 mr-2" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletePenaliteTarget(p)} className="text-destructive">
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Remise Add/Edit Dialog ── */}
      <Dialog open={remiseDialogOpen} onOpenChange={setRemiseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editRemise ? "Modifier la remise" : "Nouvelle remise"}</DialogTitle>
            <DialogDescription>Appliquer une reduction a un eleve</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Eleve *</Label>
                <Select
                  value={remiseForm.studentId ? String(remiseForm.studentId) : ""}
                  onValueChange={(v) => setRemiseForm({ ...remiseForm, studentId: Number(v) })}
                >
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {students.filter((s) => s.statut === "Actif").map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.prenom} {s.nom} ({s.classe})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Select
                  value={remiseForm.type}
                  onValueChange={(v) => setRemiseForm({ ...remiseForm, type: v as RemiseRequest["type"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_REMISE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Frais concerne</Label>
                <Select
                  value={remiseForm.typeFraisId ? String(remiseForm.typeFraisId) : "all"}
                  onValueChange={(v) => setRemiseForm({ ...remiseForm, typeFraisId: v === "all" ? null : Number(v) })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les frais</SelectItem>
                    {typesFrais.map((tf) => (
                      <SelectItem key={tf.id} value={String(tf.id)}>{tf.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Valeur *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={remiseForm.valeur || ""}
                    onChange={(e) => setRemiseForm({ ...remiseForm, valeur: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {remiseForm.estPourcentage ? "%" : CURRENCY}
                  </span>
                </div>
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Checkbox
                  checked={remiseForm.estPourcentage ?? false}
                  onCheckedChange={(v) => setRemiseForm({ ...remiseForm, estPourcentage: !!v })}
                  id="estPourcentage"
                />
                <Label htmlFor="estPourcentage" className="cursor-pointer">En pourcentage</Label>
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Checkbox
                  checked={remiseForm.active ?? true}
                  onCheckedChange={(v) => setRemiseForm({ ...remiseForm, active: !!v })}
                  id="remiseActive"
                />
                <Label htmlFor="remiseActive" className="cursor-pointer">Active</Label>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Motif</Label>
                <Textarea
                  value={remiseForm.motif ?? ""}
                  onChange={(e) => setRemiseForm({ ...remiseForm, motif: e.target.value })}
                  rows={2}
                  placeholder="Raison de la remise..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button className="bg-gradient-primary shadow-btn" onClick={handleSaveRemise}
              disabled={createRemise.isPending || updateRemise.isPending}>
              {(createRemise.isPending || updateRemise.isPending) ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Penalite Add/Edit Dialog ── */}
      <Dialog open={penaliteDialogOpen} onOpenChange={setPenaliteDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editPenalite ? "Modifier la penalite" : "Nouvelle penalite"}</DialogTitle>
            <DialogDescription>Appliquer des frais de retard a un eleve</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Eleve *</Label>
                <Select
                  value={penaliteForm.studentId ? String(penaliteForm.studentId) : ""}
                  onValueChange={(v) => setPenaliteForm({ ...penaliteForm, studentId: Number(v) })}
                >
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {students.filter((s) => s.statut === "Actif").map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.prenom} {s.nom} ({s.classe})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Montant ({CURRENCY}) *</Label>
                <Input
                  type="number"
                  value={penaliteForm.montant || ""}
                  onChange={(e) => setPenaliteForm({ ...penaliteForm, montant: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Motif *</Label>
                <Input
                  value={penaliteForm.motif}
                  onChange={(e) => setPenaliteForm({ ...penaliteForm, motif: e.target.value })}
                  placeholder="Ex: Retard de paiement Octobre"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Date d'application</Label>
                <Input
                  type="date"
                  value={penaliteForm.dateApplication ?? ""}
                  onChange={(e) => setPenaliteForm({ ...penaliteForm, dateApplication: e.target.value })}
                />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Checkbox
                  checked={penaliteForm.payee ?? false}
                  onCheckedChange={(v) => setPenaliteForm({ ...penaliteForm, payee: !!v })}
                  id="penalitePayee"
                />
                <Label htmlFor="penalitePayee" className="cursor-pointer">Deja payee</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button className="bg-gradient-primary shadow-btn" onClick={handleSavePenalite}
              disabled={createPenalite.isPending || updatePenalite.isPending}>
              {(createPenalite.isPending || updatePenalite.isPending) ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Remise Confirm ── */}
      <Dialog open={!!deleteRemiseTarget} onOpenChange={() => setDeleteRemiseTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Supprimer la remise de {deleteRemiseTarget?.studentFirstName} {deleteRemiseTarget?.studentLastName} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive" onClick={handleDeleteRemise}
              disabled={deleteRemiseMut.isPending}>
              {deleteRemiseMut.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Penalite Confirm ── */}
      <Dialog open={!!deletePenaliteTarget} onOpenChange={() => setDeletePenaliteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Supprimer la penalite de {deletePenaliteTarget?.studentFirstName} {deletePenaliteTarget?.studentLastName} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive" onClick={handleDeletePenalite}
              disabled={deletePenaliteMut.isPending}>
              {deletePenaliteMut.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
