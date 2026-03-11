import { motion } from "framer-motion";
import {
  Users,
  UserCog,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  Activity,
  Sparkles,
  CircleDollarSign,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { CURRENCY } from "@/config/currency";

/* ── Data ────────────────────────────────────────────── */

const stats = [
  {
    label: "Total Élèves",
    value: "1,247",
    change: "+12%",
    icon: Users,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    ring: "ring-violet-100",
  },
  {
    label: "Enseignants",
    value: "96",
    change: "+3%",
    icon: UserCog,
    gradient: "from-sky-500 to-blue-600",
    bg: "bg-sky-50",
    ring: "ring-sky-100",
  },
  {
    label: "Taux de présence",
    value: "94.2%",
    change: "+1.8%",
    icon: UserCheck,
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
  {
    label: "Revenus",
    value: `248K ${CURRENCY}`,
    change: "+8%",
    icon: CircleDollarSign,
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    ring: "ring-amber-100",
  },
];

const attendanceData = [
  { jour: "Lun", présents: 1180, absents: 67 },
  { jour: "Mar", présents: 1195, absents: 52 },
  { jour: "Mer", présents: 1140, absents: 107 },
  { jour: "Jeu", présents: 1200, absents: 47 },
  { jour: "Ven", présents: 1170, absents: 77 },
];

const performanceData = [
  { mois: "Sep", moyenne: 12.5, max: 16.2, min: 8.1 },
  { mois: "Oct", moyenne: 13.1, max: 17.0, min: 8.5 },
  { mois: "Nov", moyenne: 12.8, max: 16.8, min: 7.9 },
  { mois: "Déc", moyenne: 13.4, max: 17.5, min: 9.0 },
  { mois: "Jan", moyenne: 14.0, max: 18.0, min: 9.2 },
  { mois: "Fév", moyenne: 13.7, max: 17.3, min: 8.8 },
];

const levelDistribution = [
  { name: "1ère année", value: 210, color: "#8b5cf6" },
  { name: "2ème année", value: 195, color: "#3b82f6" },
  { name: "3ème année", value: 220, color: "#06b6d4" },
  { name: "4ème année", value: 205, color: "#10b981" },
  { name: "5ème année", value: 198, color: "#f59e0b" },
  { name: "6ème année", value: 219, color: "#ef4444" },
];

const attendanceRadial = [
  { name: "Présents", value: 94.2, fill: "#10b981" },
];

const recentStudents = [
  { nom: "Amira Benali", classe: "3A", date: "18/02/2026", statut: "Inscrit", avatar: "AB" },
  { nom: "Youssef El Fassi", classe: "5B", date: "17/02/2026", statut: "Inscrit", avatar: "YE" },
  { nom: "Fatima Zahra Idrissi", classe: "1A", date: "16/02/2026", statut: "En attente", avatar: "FI" },
  { nom: "Omar Chakir", classe: "4C", date: "15/02/2026", statut: "Inscrit", avatar: "OC" },
  { nom: "Salma Tazi", classe: "2B", date: "14/02/2026", statut: "Inscrit", avatar: "ST" },
  { nom: "Amine Berrada", classe: "6A", date: "13/02/2026", statut: "En attente", avatar: "AB" },
];

const upcomingEvents = [
  { titre: "Conseil de classe - 3ème année", date: "22 Fév", heure: "14:00", color: "bg-violet-500" },
  { titre: "Réunion parents-enseignants", date: "25 Fév", heure: "17:00", color: "bg-blue-500" },
  { titre: "Examen trimestriel", date: "01 Mar", heure: "08:00", color: "bg-amber-500" },
  { titre: "Journée portes ouvertes", date: "05 Mar", heure: "09:00", color: "bg-emerald-500" },
];

const quickStats = [
  { label: "Absences aujourd'hui", value: "32", icon: AlertCircle, color: "text-red-500" },
  { label: "Nouveaux inscrits", value: "8", icon: UserCheck, color: "text-emerald-500" },
  { label: "Événements ce mois", value: "4", icon: Calendar, color: "text-blue-500" },
];

/* ── Animations ──────────────────────────────────────── */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Custom Tooltip ──────────────────────────────────── */

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card/95 glass px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ── Component ───────────────────────────────────────── */

export default function Dashboard() {
  const loading = useSimulatedLoading(800);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 md:p-8 text-white"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-12 h-48 w-48 rounded-full bg-white/5 blur-xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Tableau de bord</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">
              Bonjour, Administrateur
            </h1>
            <p className="mt-1.5 text-sm text-white/70 max-w-md">
              École Manarat Al Malika — Année scolaire 2025/2026
            </p>
          </div>
          <div className="flex gap-3">
            {quickStats.map((qs) => (
              <div key={qs.label} className="rounded-xl bg-white/10 glass px-4 py-3 text-center min-w-[90px]">
                <qs.icon className={`h-4 w-4 mx-auto mb-1 ${qs.color.replace("text-", "text-white/")}`} style={{ color: "rgba(255,255,255,0.85)" }} />
                <p className="font-heading text-lg font-bold">{qs.value}</p>
                <p className="text-[10px] text-white/60 leading-tight">{qs.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${stat.bg} opacity-60 transition-transform group-hover:scale-125`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-sm ring-4 ${stat.ring}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <p className="font-heading text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts Row 1 ── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Attendance Area Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-3 rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">Présence hebdomadaire</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Suivi quotidien des présences et absences</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Présents</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" />Absents</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceData} barGap={8} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 93%)" vertical={false} />
              <XAxis dataKey="jour" tick={{ fontSize: 12, fill: "hsl(220 10% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220 10% 55%)" }} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Bar dataKey="présents" fill="url(#greenGrad)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="absents" fill="url(#redGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Donut + Radial gauge */}
        <motion.div variants={fadeUp} className="lg:col-span-2 rounded-2xl border border-border/40 bg-card p-5 shadow-sm flex flex-col">
          <h3 className="font-heading text-sm font-semibold text-foreground">Répartition par niveau</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">1,247 élèves au total</p>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={levelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  strokeWidth={3}
                  stroke="hsl(0 0% 100%)"
                >
                  {levelDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-auto pt-3 border-t border-border/40">
            {levelDistribution.map((level) => (
              <div key={level.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded shrink-0" style={{ backgroundColor: level.color }} />
                  {level.name}
                </span>
                <span className="font-semibold text-foreground">{level.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Charts Row 2 ── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Performance Area */}
        <motion.div variants={fadeUp} className="lg:col-span-3 rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Moyenne générale
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Évolution sur le semestre</p>
            </div>
            <div className="rounded-lg bg-primary/10 px-3 py-1.5">
              <span className="font-heading text-lg font-bold text-primary">13.7</span>
              <span className="text-xs text-primary/70 ml-1">/20</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(230 75% 57%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(230 75% 57%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 93%)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "hsl(220 10% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[6, 20]} tick={{ fontSize: 11, fill: "hsl(220 10% 55%)" }} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="max" stroke="hsl(160 70% 50%)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="moyenne" stroke="hsl(230 75% 57%)" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ r: 4, fill: "hsl(230 75% 57%)", strokeWidth: 2, stroke: "#fff" }} />
              <Area type="monotone" dataKey="min" stroke="hsl(0 70% 60%)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Events */}
        <motion.div variants={fadeUp} className="lg:col-span-2 rounded-2xl border border-border/40 bg-card p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Événements à venir
            </h3>
            <span className="text-xs text-primary font-medium cursor-pointer hover:underline flex items-center gap-0.5">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="space-y-2.5 flex-1">
            {upcomingEvents.map((event) => (
              <div key={event.titre} className="flex gap-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors p-3 group cursor-pointer">
                <div className="flex flex-col items-center justify-center w-12 shrink-0">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase leading-tight">{event.date.split(" ")[1]}</span>
                  <span className="font-heading text-xl font-bold text-foreground leading-tight">{event.date.split(" ")[0]}</span>
                </div>
                <div className={`w-0.5 self-stretch rounded-full ${event.color}`} />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{event.titre}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3" />
                    {event.heure}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Attendance gauge */}
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-4">
            <ResponsiveContainer width={80} height={80}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" data={attendanceRadial} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(220 15% 93%)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div>
              <p className="font-heading text-xl font-bold text-foreground">94.2%</p>
              <p className="text-xs text-muted-foreground">Taux de présence global</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-border/40 bg-card shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">Dernières inscriptions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Les 6 derniers élèves inscrits</p>
          </div>
          <span className="text-xs text-primary font-medium cursor-pointer hover:underline flex items-center gap-0.5">
            Voir tous <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
        <div className="overflow-x-auto p-5 pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="py-3 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Élève</th>
                <th className="py-3 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Classe</th>
                <th className="py-3 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="py-3 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student, i) => (
                <tr
                  key={student.nom}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[11px] font-bold text-white shrink-0">
                        {student.avatar}
                      </div>
                      <span className="font-medium text-foreground">{student.nom}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {student.classe}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{student.date}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                        student.statut === "Inscrit"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${student.statut === "Inscrit" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {student.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
