import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Clock,
  Award,
  BookOpen,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { MOCK_EVALUATIONS, MOCK_RESULTATS } from "@/data/evaluations";
import type { Evaluation } from "@/types/evaluation";
import { TYPES_EVALUATION, STATUTS_EVALUATION, MATIERES } from "@/types/evaluation";

const ITEMS_PER_PAGE = 8;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

const statutConfig: Record<string, { bg: string; text: string }> = {
  "Planifiée": { bg: "bg-blue-100", text: "text-blue-700" },
  "En cours": { bg: "bg-amber-100", text: "text-amber-700" },
  "Terminée": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Annulée": { bg: "bg-red-100", text: "text-red-700" },
};

const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

type TabKey = "overview" | "liste" | "resultats";

export default function Evaluations() {
  const loading = useSimulatedLoading(800);
  const [evaluations, setEvaluations] = useState(MOCK_EVALUATIONS);
  const [resultats] = useState(MOCK_RESULTATS);

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterMatiere, setFilterMatiere] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewEval, setViewEval] = useState<Evaluation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Evaluation | null>(null);

  // Stats
  const total = evaluations.length;
  const planifiees = evaluations.filter((e) => e.statut === "Planifiée").length;
  const terminees = evaluations.filter((e) => e.statut === "Terminée").length;
  const moyenneGenerale = useMemo(() => {
    if (resultats.length === 0) return 0;
    return +(resultats.reduce((sum, r) => sum + r.note, 0) / resultats.length).toFixed(1);
  }, [resultats]);

  const stats = [
    { label: "Total évaluations", value: total, icon: ClipboardCheck, bgLight: "bg-rose-50", textColor: "text-rose-700" },
    { label: "Planifiées", value: planifiees, icon: Calendar, bgLight: "bg-blue-50", textColor: "text-blue-700" },
    { label: "Terminées", value: terminees, icon: CheckCircle2, bgLight: "bg-emerald-50", textColor: "text-emerald-700" },
    { label: "Moyenne générale", value: `${moyenneGenerale}/20`, icon: Award, bgLight: "bg-purple-50", textColor: "text-purple-700" },
  ];

  // Charts data
  const barData = useMemo(() => {
    const byMatiere: Record<string, number> = {};
    for (const e of evaluations) {
      byMatiere[e.matiere] = (byMatiere[e.matiere] || 0) + 1;
    }
    return Object.entries(byMatiere).map(([matiere, count]) => ({ matiere: matiere.slice(0, 8), count }));
  }, [evaluations]);

  const pieData = useMemo(() => {
    return TYPES_EVALUATION.map((type) => ({
      name: type,
      value: evaluations.filter((e) => e.type === type).length,
    })).filter((d) => d.value > 0);
  }, [evaluations]);

  // Filtered list
  const filtered = useMemo(() => {
    return evaluations.filter((e) => {
      const matchSearch =
        search === "" ||
        e.titre.toLowerCase().includes(search.toLowerCase()) ||
        e.enseignant.toLowerCase().includes(search.toLowerCase()) ||
        e.matiere.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || e.type === filterType;
      const matchMatiere = filterMatiere === "all" || e.matiere === filterMatiere;
      const matchStatut = filterStatut === "all" || e.statut === filterStatut;
      return matchSearch && matchType && matchMatiere && matchStatut;
    });
  }, [evaluations, search, filterType, filterMatiere, filterStatut]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Results per evaluation
  const resultsByEval = useMemo(() => {
    const map: Record<number, { count: number; avg: number; min: number; max: number }> = {};
    for (const e of evaluations) {
      const eResults = resultats.filter((r) => r.evaluationId === e.id);
      if (eResults.length > 0) {
        const notes = eResults.map((r) => r.note);
        map[e.id] = {
          count: eResults.length,
          avg: +(notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1),
          min: Math.min(...notes),
          max: Math.max(...notes),
        };
      }
    }
    return map;
  }, [evaluations, resultats]);

  const hasFilters = search || filterType !== "all" || filterMatiere !== "all" || filterStatut !== "all";

  const resetFilters = () => {
    setSearch("");
    setFilterType("all");
    setFilterMatiere("all");
    setFilterStatut("all");
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setEvaluations((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    toast.success("Évaluation supprimée");
    setDeleteTarget(null);
  };

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { key: "liste", label: "Liste", icon: ClipboardCheck },
    { key: "resultats", label: "Résultats", icon: Award },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            Évaluations
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestion des contrôles, examens et résultats
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" className="gap-1.5 bg-gradient-primary shadow-btn" onClick={() => toast.info("Fonctionnalité de création à venir")}>
            <Plus className="h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex gap-1 rounded-xl bg-muted/50 p-1 w-fit flex-wrap"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-border/50 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgLight}`}>
              <stat.icon className={`h-4.5 w-4.5 ${stat.textColor}`} />
            </div>
            <p className="mt-2.5 font-heading text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══════ VUE D'ENSEMBLE ═══════ */}
      {activeTab === "overview" && (
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Évaluations par matière</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="matiere" className="text-xs" />
                <YAxis className="text-xs" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid var(--border)" }} />
                <Bar dataKey="count" name="Évaluations" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Répartition par type</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name.slice(0, 10)} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ═══════ LISTE ═══════ */}
      {activeTab === "liste" && (
        <>
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Rechercher par titre, enseignant, matière..." className="pl-9" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={filterType} onValueChange={(v) => { setFilterType(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[170px]"><Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {TYPES_EVALUATION.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterMatiere} onValueChange={(v) => { setFilterMatiere(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Matière" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {MATIERES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterStatut} onValueChange={(v) => { setFilterStatut(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {STATUTS_EVALUATION.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />Réinitialiser
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{filtered.length} évaluation{filtered.length !== 1 ? "s" : ""}</div>
          </motion.div>

          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground">Évaluation</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground hidden lg:table-cell">Classe</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground">Statut</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">
                      <ClipboardCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">Aucune évaluation trouvée</p>
                    </td></tr>
                  ) : paginated.map((e) => (
                    <tr key={e.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                            <ClipboardCheck className="h-4 w-4 text-rose-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground truncate max-w-[200px]">{e.titre}</p>
                            <p className="text-xs text-muted-foreground">{e.matiere} · {e.enseignant}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell"><Badge variant="outline" className="font-medium text-xs">{e.type}</Badge></td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.date}</div>
                        <div className="flex items-center gap-1 text-xs"><Clock className="h-3 w-3" />{e.heureDebut} - {e.heureFin}</div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{e.classe} ({e.niveau})</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statutConfig[e.statut]?.bg} ${statutConfig[e.statut]?.text}`}>
                          {e.statut}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600" onClick={() => setViewEval(e)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-600" onClick={() => toast.info("Modification à venir")}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => setDeleteTarget(e)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">Page {currentPage} sur {totalPages}</p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                    return <Button key={page} variant={page === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8 text-xs" onClick={() => setCurrentPage(page)}>{page}</Button>;
                  })}
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* ═══════ RÉSULTATS ═══════ */}
      {activeTab === "resultats" && (
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
          {evaluations.filter((e) => e.statut === "Terminée").map((e) => {
            const res = resultsByEval[e.id];
            return (
              <div key={e.id} className="rounded-xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50">
                      <Award className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{e.titre}</h3>
                      <p className="text-xs text-muted-foreground">{e.matiere} · {e.classe} · {e.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">{e.type} · Coeff. {e.coefficient}</Badge>
                </div>
                {res ? (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Copies</p>
                      <p className="font-heading text-lg font-bold flex items-center justify-center gap-1"><Users className="h-4 w-4 text-blue-500" />{res.count}</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Moyenne</p>
                      <p className="font-heading text-lg font-bold flex items-center justify-center gap-1"><TrendingUp className="h-4 w-4 text-purple-500" />{res.avg}/20</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Min</p>
                      <p className="font-heading text-lg font-bold text-red-600">{res.min}/20</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Max</p>
                      <p className="font-heading text-lg font-bold text-emerald-600">{res.max}/20</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg bg-muted/30 p-4 text-center text-xs text-muted-foreground">
                    Aucun résultat saisi pour cette évaluation
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewEval} onOpenChange={(open) => !open && setViewEval(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'évaluation</DialogTitle>
            <DialogDescription>Informations complètes</DialogDescription>
          </DialogHeader>
          {viewEval && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-50">
                  <ClipboardCheck className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="font-heading text-lg font-bold">{viewEval.titre}</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statutConfig[viewEval.statut]?.bg} ${statutConfig[viewEval.statut]?.text}`}>
                    {viewEval.statut}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Type</p><p className="font-medium">{viewEval.type}</p></div>
                <div><p className="text-xs text-muted-foreground">Matière</p><p className="font-medium">{viewEval.matiere}</p></div>
                <div><p className="text-xs text-muted-foreground">Classe</p><p className="font-medium">{viewEval.classe} ({viewEval.niveau})</p></div>
                <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{viewEval.date}</p></div>
                <div><p className="text-xs text-muted-foreground">Horaire</p><p className="font-medium">{viewEval.heureDebut} - {viewEval.heureFin}</p></div>
                <div><p className="text-xs text-muted-foreground">Coefficient</p><p className="font-medium">{viewEval.coefficient}</p></div>
                <div><p className="text-xs text-muted-foreground">Barème</p><p className="font-medium">{viewEval.bareme}</p></div>
                <div><p className="text-xs text-muted-foreground">Enseignant</p><p className="font-medium">{viewEval.enseignant}</p></div>
                <div><p className="text-xs text-muted-foreground">Salle</p><p className="font-medium">{viewEval.salle}</p></div>
                {viewEval.notes && <div className="col-span-2"><p className="text-xs text-muted-foreground">Notes</p><p className="font-medium">{viewEval.notes}</p></div>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Supprimer <span className="font-semibold text-foreground">{deleteTarget?.titre}</span> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
