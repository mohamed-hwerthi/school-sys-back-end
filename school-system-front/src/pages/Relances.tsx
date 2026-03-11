import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Send,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Trash2,
  MoreHorizontal,
  Zap,
  Mail,
  MessageSquare,
  FileText,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CURRENCY } from "@/config/currency";
import { useAllStudents } from "@/hooks/useStudents";
import {
  useRelances,
  useRelanceStats,
  useCreateRelance,
  useGenerateRelances,
  useMarkRelanceEnvoyee,
  useMarkRelanceEchouee,
  useDeleteRelance,
} from "@/hooks/useRelances";
import type { RelanceDTO, RelanceRequest, TypeRelance, StatutRelance } from "@/api/relances.api";

const TYPE_LABELS: Record<TypeRelance, string> = {
  EMAIL: "Email",
  SMS: "SMS",
  COURRIER: "Courrier",
};

const TYPE_ICONS: Record<TypeRelance, typeof Mail> = {
  EMAIL: Mail,
  SMS: MessageSquare,
  COURRIER: FileText,
};

const STATUT_CONFIG: Record<StatutRelance, { label: string; color: string; icon: typeof Clock }> = {
  EN_ATTENTE: { label: "En attente", color: "bg-amber-100 text-amber-700", icon: Clock },
  ENVOYEE: { label: "Envoyee", color: "bg-green-100 text-green-700", icon: CheckCircle },
  ECHOUEE: { label: "Echouee", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function Relances() {
  const [tab, setTab] = useState("toutes");
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showView, setShowView] = useState<RelanceDTO | null>(null);
  const [showDelete, setShowDelete] = useState<RelanceDTO | null>(null);

  // Create form state
  const [form, setForm] = useState<RelanceRequest>({
    studentId: 0,
    type: "EMAIL",
    message: "",
    destinataire: "",
    anneeScolaire: "2025-2026",
  });
  const [generateType, setGenerateType] = useState<TypeRelance>("EMAIL");

  const { data: relances = [], isLoading } = useRelances();
  const { data: stats } = useRelanceStats();
  const { data: students = [] } = useAllStudents();
  const createRelance = useCreateRelance();
  const generateRelances = useGenerateRelances();
  const markEnvoyee = useMarkRelanceEnvoyee();
  const markEchouee = useMarkRelanceEchouee();
  const deleteRelance = useDeleteRelance();

  // Filtered list
  const filtered = relances.filter((r) => {
    const matchSearch =
      !search ||
      `${r.studentFirstName} ${r.studentLastName}`.toLowerCase().includes(search.toLowerCase()) ||
      r.destinataire.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "all" || r.statut === filterStatut;
    const matchType = filterType === "all" || r.type === filterType;

    if (tab === "en-attente") return matchSearch && r.statut === "EN_ATTENTE" && matchType;
    if (tab === "envoyees") return matchSearch && r.statut === "ENVOYEE" && matchType;
    if (tab === "echouees") return matchSearch && r.statut === "ECHOUEE" && matchType;
    return matchSearch && matchStatut && matchType;
  });

  const handleCreate = () => {
    if (!form.studentId || !form.message) return;
    createRelance.mutate(form, {
      onSuccess: () => {
        setShowCreate(false);
        setForm({ studentId: 0, type: "EMAIL", message: "", destinataire: "", anneeScolaire: "2025-2026" });
      },
    });
  };

  const handleGenerate = () => {
    generateRelances.mutate(generateType, {
      onSuccess: () => setShowGenerate(false),
    });
  };

  const statsCards = [
    {
      title: "Total Relances",
      value: stats?.total ?? 0,
      icon: Bell,
      bg: "from-blue-500 to-blue-600",
    },
    {
      title: "En Attente",
      value: stats?.enAttente ?? 0,
      icon: Clock,
      bg: "from-amber-500 to-amber-600",
    },
    {
      title: "Envoyees",
      value: stats?.envoyees ?? 0,
      icon: Send,
      bg: "from-green-500 to-green-600",
    },
    {
      title: "Echouees",
      value: stats?.echouees ?? 0,
      icon: AlertTriangle,
      bg: "from-red-500 to-red-600",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relances</h1>
          <p className="text-sm text-gray-500">Gestion des relances de paiement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGenerate(true)}>
            <Zap className="mr-2 h-4 w-4" />
            Generer auto
          </Button>
          <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-blue-600 to-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle relance
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl bg-gradient-to-br ${c.bg} p-5 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">{c.title}</p>
                <p className="mt-1 text-3xl font-bold">{c.value}</p>
              </div>
              <c.icon className="h-10 w-10 text-white/30" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Rechercher par eleve ou destinataire..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-72"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
            <SelectItem value="COURRIER">Courrier</SelectItem>
          </SelectContent>
        </Select>
        {tab === "toutes" && (
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="EN_ATTENTE">En attente</SelectItem>
              <SelectItem value="ENVOYEE">Envoyee</SelectItem>
              <SelectItem value="ECHOUEE">Echouee</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Tabs & Table */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="toutes">Toutes ({relances.length})</TabsTrigger>
          <TabsTrigger value="en-attente">En attente ({relances.filter((r) => r.statut === "EN_ATTENTE").length})</TabsTrigger>
          <TabsTrigger value="envoyees">Envoyees ({relances.filter((r) => r.statut === "ENVOYEE").length})</TabsTrigger>
          <TabsTrigger value="echouees">Echouees ({relances.filter((r) => r.statut === "ECHOUEE").length})</TabsTrigger>
        </TabsList>

        {["toutes", "en-attente", "envoyees", "echouees"].map((t) => (
          <TabsContent key={t} value={t}>
            <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Eleve</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Destinataire</th>
                    <th className="px-4 py-3">Montant</th>
                    <th className="px-4 py-3">N°</th>
                    <th className="px-4 py-3">Date prevue</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                        Chargement...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                        Aucune relance trouvee
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => {
                      const cfg = STATUT_CONFIG[r.statut];
                      const TypeIcon = TYPE_ICONS[r.type];
                      return (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium">
                            {r.studentFirstName} {r.studentLastName}
                            {r.studentClasse && (
                              <span className="ml-2 text-xs text-gray-400">({r.studentClasse})</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <TypeIcon className="h-3.5 w-3.5 text-gray-500" />
                              {TYPE_LABELS[r.type]}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">
                            {r.destinataire}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {r.montantDu != null ? `${Number(r.montantDu).toFixed(2)} ${CURRENCY}` : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">N°{r.numeroRelance}</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{r.datePrevue}</td>
                          <td className="px-4 py-3">
                            <Badge className={`${cfg.color} border-0`}>
                              <cfg.icon className="mr-1 h-3 w-3" />
                              {cfg.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowView(r)}>
                                  <Eye className="mr-2 h-4 w-4" /> Voir
                                </DropdownMenuItem>
                                {r.statut === "EN_ATTENTE" && (
                                  <>
                                    <DropdownMenuItem onClick={() => markEnvoyee.mutate(r.id)}>
                                      <Send className="mr-2 h-4 w-4" /> Marquer envoyee
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => markEchouee.mutate(r.id)}>
                                      <XCircle className="mr-2 h-4 w-4" /> Marquer echouee
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setShowDelete(r)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* ─── Create Dialog ─── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle relance</DialogTitle>
            <DialogDescription>Creer une relance manuelle pour un eleve</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Eleve *</Label>
              <Select
                value={form.studentId ? String(form.studentId) : ""}
                onValueChange={(v) => setForm({ ...form, studentId: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner un eleve" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.firstName} {s.lastName} {s.classe ? `(${s.classe})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TypeRelance })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="COURRIER">Courrier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Montant du ({CURRENCY})</Label>
                <Input
                  type="number"
                  value={form.montantDu ?? ""}
                  onChange={(e) => setForm({ ...form, montantDu: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
            <div>
              <Label>Destinataire</Label>
              <Input
                placeholder="Auto-rempli si vide"
                value={form.destinataire ?? ""}
                onChange={(e) => setForm({ ...form, destinataire: e.target.value })}
              />
            </div>
            <div>
              <Label>Message *</Label>
              <Textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Corps du message de relance..."
              />
            </div>
            <div>
              <Label>Date prevue</Label>
              <Input
                type="date"
                value={form.datePrevue ?? ""}
                onChange={(e) => setForm({ ...form, datePrevue: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              onClick={handleCreate}
              disabled={!form.studentId || !form.message || createRelance.isPending}
              className="bg-gradient-to-r from-blue-600 to-blue-700"
            >
              Creer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Generate Dialog ─── */}
      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generer des relances automatiques</DialogTitle>
            <DialogDescription>
              Genere une relance pour chaque paiement en retard ou en attente qui n'a pas encore de relance en cours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type de relance</Label>
              <Select value={generateType} onValueChange={(v) => setGenerateType(v as TypeRelance)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="COURRIER">Courrier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              Les relances seront creees avec le statut "En attente". Vous pourrez ensuite les marquer comme envoyees.
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              onClick={handleGenerate}
              disabled={generateRelances.isPending}
              className="bg-gradient-to-r from-amber-500 to-amber-600"
            >
              <Zap className="mr-2 h-4 w-4" />
              Generer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── View Dialog ─── */}
      <Dialog open={!!showView} onOpenChange={() => setShowView(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Details de la relance</DialogTitle>
            <DialogDescription>
              Relance N°{showView?.numeroRelance} - {showView?.studentFirstName} {showView?.studentLastName}
            </DialogDescription>
          </DialogHeader>
          {showView && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500">Eleve</p>
                  <p className="font-medium">{showView.studentFirstName} {showView.studentLastName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Classe</p>
                  <p className="font-medium">{showView.studentClasse || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium">{TYPE_LABELS[showView.type]}</p>
                </div>
                <div>
                  <p className="text-gray-500">Statut</p>
                  <Badge className={`${STATUT_CONFIG[showView.statut].color} border-0`}>
                    {STATUT_CONFIG[showView.statut].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-500">Destinataire</p>
                  <p className="font-medium">{showView.destinataire}</p>
                </div>
                <div>
                  <p className="text-gray-500">Montant du</p>
                  <p className="font-semibold">
                    {showView.montantDu != null ? `${Number(showView.montantDu).toFixed(2)} ${CURRENCY}` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Date prevue</p>
                  <p className="font-medium">{showView.datePrevue}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date d'envoi</p>
                  <p className="font-medium">{showView.dateEnvoi || "Non envoyee"}</p>
                </div>
                {showView.paiementReference && (
                  <div>
                    <p className="text-gray-500">Ref. paiement</p>
                    <p className="font-medium">{showView.paiementReference}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">N° relance</p>
                  <p className="font-medium">{showView.numeroRelance}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Message</p>
                <div className="rounded-lg bg-gray-50 p-3 text-gray-700 whitespace-pre-wrap">
                  {showView.message}
                </div>
              </div>
              {showView.statut === "EN_ATTENTE" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => { markEnvoyee.mutate(showView.id); setShowView(null); }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="mr-1 h-3.5 w-3.5" /> Marquer envoyee
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => { markEchouee.mutate(showView.id); setShowView(null); }}
                  >
                    <XCircle className="mr-1 h-3.5 w-3.5" /> Marquer echouee
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Delete Dialog ─── */}
      <Dialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la relance</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer cette relance pour {showDelete?.studentFirstName} {showDelete?.studentLastName} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (showDelete) deleteRelance.mutate(showDelete.id, { onSuccess: () => setShowDelete(null) });
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
