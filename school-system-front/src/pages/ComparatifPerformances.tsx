import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  BarChart3,
  Crown,
  Medal,
  Users,
  Target,
  Award,
  TrendingDown,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useClasses } from "@/hooks/useClasses";
import { useNiveaux } from "@/hooks/useNiveaux";
import {
  useComparatifByNiveau,
  useComparatifEvolution,
} from "@/hooks/useBulletins";

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card/95 px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full me-1.5"
            style={{ backgroundColor: p.color }}
          />
          {p.name}:{" "}
          <span className="font-medium text-foreground">
            {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function ComparatifPerformances() {
  const { niveaux } = useNiveaux();
  const [selectedNiveau, setSelectedNiveau] = useState<number>(0);
  const { data: classes = [] } = useClasses(selectedNiveau || undefined);
  const [selectedClasse, setSelectedClasse] = useState<number>(0);
  const [tab, setTab] = useState("comparatif");

  const { data: comparatifData, isLoading: loadingComparatif } =
    useComparatifByNiveau(selectedNiveau);
  const { data: evolutionData, isLoading: loadingEvolution } =
    useComparatifEvolution(selectedClasse);

  const classBarData =
    comparatifData?.classesPerformance?.map((c) => ({
      name: c.classeName,
      moyenne: c.moyenneGenerale,
      tauxReussite: c.tauxReussite,
    })) || [];

  // KPIs at niveau level (across all classes)
  const niveauKpis = useMemo(() => {
    const list = comparatifData?.classesPerformance ?? [];
    if (list.length === 0) {
      return { totalClasses: 0, totalEleves: 0, moyenneNiveau: 0, tauxMoyen: 0, totalReussis: 0 };
    }
    const totalClasses = list.length;
    const totalEleves = list.reduce((s, c) => s + c.totalEleves, 0);
    const totalReussis = list.reduce((s, c) => s + c.reussis, 0);
    const moyenneNiveau = list.reduce((s, c) => s + c.moyenneGenerale * c.totalEleves, 0) / Math.max(1, totalEleves);
    const tauxMoyen = totalEleves > 0 ? (totalReussis / totalEleves) * 100 : 0;
    return {
      totalClasses,
      totalEleves,
      moyenneNiveau: Math.round(moyenneNiveau * 100) / 100,
      tauxMoyen: Math.round(tauxMoyen * 10) / 10,
      totalReussis,
    };
  }, [comparatifData]);

  // Top 3 classes (by moyenne)
  const top3Classes = useMemo(() => {
    return [...(comparatifData?.classesPerformance ?? [])]
      .sort((a, b) => b.moyenneGenerale - a.moyenneGenerale)
      .slice(0, 3);
  }, [comparatifData]);

  // Worst class (lowest moyenne)
  const worstClass = useMemo(() => {
    const list = comparatifData?.classesPerformance ?? [];
    if (list.length === 0) return null;
    return [...list].sort((a, b) => a.moyenneGenerale - b.moyenneGenerale)[0];
  }, [comparatifData]);

  const evolutionLineData =
    evolutionData?.evolution?.map((e) => ({
      name: `T${e.trimestre}`,
      moyenne: e.moyenneGenerale,
      tauxReussite: e.tauxReussite,
    })) || [];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-5 w-5 text-teal-600" />
          <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            Comparatif des performances
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Comparez les performances entre classes et suivez l'evolution
        </p>
      </motion.div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="comparatif" className="gap-1">
            <BarChart3 className="h-3.5 w-3.5" /> Comparatif classes
          </TabsTrigger>
          <TabsTrigger value="evolution" className="gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Evolution trimestrielle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comparatif" className="space-y-4 mt-4">
          <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
            <div className="max-w-xs">
              <Label>Niveau</Label>
              <Select
                value={selectedNiveau ? String(selectedNiveau) : ""}
                onValueChange={(v) => setSelectedNiveau(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {niveaux.map((n) => (
                    <SelectItem key={n.id} value={String(n.id)}>
                      {n.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedNiveau ? (
            <div className="text-center py-16">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                Selectionnez un niveau pour comparer les classes
              </p>
            </div>
          ) : loadingComparatif ? (
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
          ) : classBarData.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Aucune donnee disponible pour ce niveau
              </p>
            </div>
          ) : (
            <>
              {/* KPIs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-3"
              >
                {[
                  { label: "Classes", value: niveauKpis.totalClasses, icon: Users, accent: "text-foreground", chip: "bg-blue-100 text-blue-600" },
                  { label: "Total élèves", value: niveauKpis.totalEleves, icon: Users, accent: "text-foreground", chip: "bg-violet-100 text-violet-600" },
                  { label: "Moy. niveau", value: niveauKpis.moyenneNiveau.toFixed(2), icon: Target, accent: niveauKpis.moyenneNiveau >= 10 ? "text-emerald-600" : "text-red-500", chip: "bg-emerald-100 text-emerald-600" },
                  { label: "Taux moyen", value: `${niveauKpis.tauxMoyen.toFixed(1)}%`, icon: TrendingUp, accent: niveauKpis.tauxMoyen >= 50 ? "text-emerald-600" : "text-red-500", chip: "bg-amber-100 text-amber-600" },
                  { label: "Réussis", value: niveauKpis.totalReussis, icon: Award, accent: "text-foreground", chip: "bg-green-100 text-green-600" },
                ].map((k, i) => (
                  <motion.div
                    key={k.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className="rounded-xl border border-border/40 bg-card p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-tight">{k.label}</p>
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${k.chip}`}>
                        <k.icon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <p className={`font-heading text-xl font-bold tabular-nums ${k.accent}`}>{k.value}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Podium */}
              {top3Classes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Podium des classes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {top3Classes.map((c, idx) => {
                      const tones = [
                        { bg: "from-amber-50 to-amber-100/40", border: "border-amber-300", icon: <Crown className="h-5 w-5 text-amber-500" />, badge: "bg-amber-500" },
                        { bg: "from-slate-50 to-slate-100/40", border: "border-slate-300", icon: <Medal className="h-5 w-5 text-slate-400" />, badge: "bg-slate-400" },
                        { bg: "from-orange-50 to-orange-100/40", border: "border-orange-300", icon: <Medal className="h-5 w-5 text-amber-700" />, badge: "bg-amber-700" },
                      ];
                      const tone = tones[idx];
                      return (
                        <div key={c.classeId} className={`relative rounded-xl border ${tone.border} bg-gradient-to-br ${tone.bg} p-4`}>
                          <span className={`absolute top-2 end-2 inline-flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-bold ${tone.badge}`}>{idx + 1}</span>
                          <div className="flex items-center gap-2 mb-2">{tone.icon}<span className="text-xs uppercase tracking-wider text-muted-foreground">Rang {idx + 1}</span></div>
                          <p className="font-heading text-lg font-bold text-foreground mb-1">{c.classeName}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Moyenne</p>
                              <p className="font-bold text-emerald-700 text-base tabular-nums">{c.moyenneGenerale.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Taux</p>
                              <p className="font-bold text-blue-700 text-base tabular-nums">{c.tauxReussite.toFixed(1)}%</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {worstClass && top3Classes.length > 1 && worstClass.classeId !== top3Classes[0].classeId && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50/40 p-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Classe la plus en difficulté</p>
                        <p className="font-bold text-foreground">{worstClass.classeName} <span className="text-red-600 ms-2">{worstClass.moyenneGenerale.toFixed(2)} · {worstClass.tauxReussite.toFixed(1)}%</span></p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Combined visualization: horizontal bars per class (CSS-based, elegant) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-violet-500" />
                  Performance par classe
                  <span className="text-xs text-muted-foreground font-normal ms-auto">Moyenne /20 · Taux de réussite</span>
                </h3>
                <div className="space-y-4">
                  {[...(comparatifData?.classesPerformance ?? [])]
                    .sort((a, b) => b.moyenneGenerale - a.moyenneGenerale)
                    .map((c, idx) => {
                      const moyPct = (c.moyenneGenerale / 20) * 100;
                      const moyTone =
                        c.moyenneGenerale >= 14
                          ? "from-emerald-400 to-emerald-600"
                          : c.moyenneGenerale >= 10
                            ? "from-violet-400 to-violet-600"
                            : "from-orange-400 to-red-500";
                      const tauxTone =
                        c.tauxReussite >= 75
                          ? "from-emerald-400 to-emerald-600"
                          : c.tauxReussite >= 50
                            ? "from-amber-400 to-amber-600"
                            : "from-red-400 to-red-600";
                      return (
                        <div key={c.classeId} className="rounded-xl border border-border/30 bg-muted/20 p-3">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-violet-100 text-violet-700 text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="font-semibold text-foreground text-sm">{c.classeName}</span>
                              <span className="text-xs text-muted-foreground">· {c.totalEleves} élèves</span>
                            </div>
                            <div className="text-xs text-muted-foreground tabular-nums">
                              <span className="font-semibold text-foreground">{c.reussis}</span>/{c.totalEleves} réussis
                            </div>
                          </div>

                          {/* Moyenne /20 bar */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-20 shrink-0 text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Moyenne</span>
                            <div className="flex-1 h-7 rounded-md bg-card overflow-hidden relative shadow-inner">
                              <div
                                className={`h-full bg-gradient-to-r ${moyTone} rounded-md transition-all duration-700 ease-out`}
                                style={{ width: `${moyPct}%` }}
                              />
                              <span
                                className="absolute inset-y-0 flex items-center text-xs font-bold tabular-nums px-2"
                                style={{
                                  left: moyPct > 16 ? `calc(${moyPct}% - 48px)` : `${moyPct}%`,
                                  paddingLeft: moyPct > 16 ? 0 : 6,
                                  color: moyPct > 16 ? "white" : "hsl(var(--foreground))",
                                }}
                              >
                                {c.moyenneGenerale.toFixed(2)} / 20
                              </span>
                            </div>
                          </div>

                          {/* Taux % bar */}
                          <div className="flex items-center gap-3">
                            <span className="w-20 shrink-0 text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Réussite</span>
                            <div className="flex-1 h-7 rounded-md bg-card overflow-hidden relative shadow-inner">
                              <div
                                className={`h-full bg-gradient-to-r ${tauxTone} rounded-md transition-all duration-700 ease-out`}
                                style={{ width: `${c.tauxReussite}%` }}
                              />
                              <span
                                className="absolute inset-y-0 flex items-center text-xs font-bold tabular-nums px-2"
                                style={{
                                  left: c.tauxReussite > 12 ? `calc(${c.tauxReussite}% - 44px)` : `${c.tauxReussite}%`,
                                  paddingLeft: c.tauxReussite > 12 ? 0 : 6,
                                  color: c.tauxReussite > 12 ? "white" : "hsl(var(--foreground))",
                                }}
                              >
                                {c.tauxReussite.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                    Excellent (≥14 / ≥75%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
                    Moyen
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-red-400 to-red-600" />
                    Faible (&lt;10 / &lt;50%)
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-violet-500" />
                  Détail par classe
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 text-start">
                        <th className="pb-2 font-medium text-muted-foreground w-12 text-center">Rang</th>
                        <th className="pb-2 font-medium text-muted-foreground">Classe</th>
                        <th className="pb-2 font-medium text-muted-foreground text-center">Élèves</th>
                        <th className="pb-2 font-medium text-muted-foreground text-center">Moyenne</th>
                        <th className="pb-2 font-medium text-muted-foreground text-center">Réussis</th>
                        <th className="pb-2 font-medium text-muted-foreground">Taux de réussite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...(comparatifData?.classesPerformance ?? [])]
                        .sort((a, b) => b.moyenneGenerale - a.moyenneGenerale)
                        .map((c, idx) => {
                          const rankIcon = idx === 0 ? <Crown className="h-3.5 w-3.5 text-amber-500" /> : idx === 1 ? <Medal className="h-3.5 w-3.5 text-slate-400" /> : idx === 2 ? <Medal className="h-3.5 w-3.5 text-amber-700" /> : null;
                          const moyColor = c.moyenneGenerale >= 14 ? "text-emerald-600" : c.moyenneGenerale >= 10 ? "text-foreground" : "text-red-500";
                          const tauxColor = c.tauxReussite >= 75 ? "bg-emerald-500" : c.tauxReussite >= 50 ? "bg-amber-500" : "bg-red-500";
                          return (
                            <tr key={c.classeId} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                              <td className="py-3 text-center">
                                <div className="inline-flex items-center justify-center gap-1">
                                  <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                                  {rankIcon}
                                </div>
                              </td>
                              <td className="py-3 font-semibold text-foreground">{c.classeName}</td>
                              <td className="py-3 text-center text-muted-foreground tabular-nums">{c.totalEleves}</td>
                              <td className={`py-3 text-center font-bold tabular-nums ${moyColor}`}>{c.moyenneGenerale.toFixed(2)}</td>
                              <td className="py-3 text-center text-emerald-600 tabular-nums">{c.reussis}/{c.totalEleves}</td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden">
                                    <div className={`h-full ${tauxColor} transition-all`} style={{ width: `${c.tauxReussite}%` }} />
                                  </div>
                                  <span className={`text-xs font-semibold tabular-nums w-12 text-end ${c.tauxReussite >= 50 ? "text-emerald-600" : "text-red-500"}`}>{c.tauxReussite.toFixed(0)}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4 mt-4">
          <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Niveau</Label>
                <Select
                  value={selectedNiveau ? String(selectedNiveau) : ""}
                  onValueChange={(v) => {
                    setSelectedNiveau(Number(v));
                    setSelectedClasse(0);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {niveaux.map((n) => (
                      <SelectItem key={n.id} value={String(n.id)}>
                        {n.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Classe</Label>
                <Select
                  value={selectedClasse ? String(selectedClasse) : ""}
                  onValueChange={(v) => setSelectedClasse(Number(v))}
                  disabled={!selectedNiveau}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {!selectedClasse ? (
            <div className="text-center py-16">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                Selectionnez une classe pour voir l'evolution
              </p>
            </div>
          ) : loadingEvolution ? (
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
          ) : evolutionLineData.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Aucune donnee disponible
              </p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Evolution de la moyenne et du taux de reussite
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolutionLineData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(220 15% 93%)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "hsl(220 10% 55%)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      domain={[0, 20]}
                      tick={{ fontSize: 11, fill: "hsl(220 10% 55%)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "hsl(220 10% 55%)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="moyenne"
                      name="Moyenne"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{
                        r: 5,
                        fill: "#8b5cf6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tauxReussite"
                      name="Taux reussite (%)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{
                        r: 5,
                        fill: "#10b981",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Detail par trimestre
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 text-start">
                        <th className="pb-2 font-medium text-muted-foreground">
                          Trimestre
                        </th>
                        <th className="pb-2 font-medium text-muted-foreground text-center">
                          Eleves
                        </th>
                        <th className="pb-2 font-medium text-muted-foreground text-center">
                          Moyenne
                        </th>
                        <th className="pb-2 font-medium text-muted-foreground text-center">
                          Reussis
                        </th>
                        <th className="pb-2 font-medium text-muted-foreground text-center">
                          Taux
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {evolutionData?.evolution?.map((e) => (
                        <tr
                          key={e.trimestre}
                          className="border-b border-border/20"
                        >
                          <td className="py-2 font-medium">
                            Trimestre {e.trimestre}
                          </td>
                          <td className="py-2 text-center">
                            {e.totalEleves}
                          </td>
                          <td className="py-2 text-center font-semibold">
                            {e.moyenneGenerale.toFixed(2)}
                          </td>
                          <td className="py-2 text-center text-emerald-600">
                            {e.reussis}
                          </td>
                          <td className="py-2 text-center">
                            <span
                              className={`font-semibold ${
                                e.tauxReussite >= 50
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              }`}
                            >
                              {e.tauxReussite.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
