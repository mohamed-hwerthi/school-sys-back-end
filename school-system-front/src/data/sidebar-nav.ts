import {
  Home,
  Users,
  UserCog,
  Calendar,
  ClipboardCheck,
  CalendarDays,
  FileText,
  Newspaper,
  BookOpen,
  Settings,
  DollarSign,
  TrendingDown,
  Wallet,
  Eye,
  PieChart,
  School,
  BadgePercent,
  Bell,
  BarChart3,
  Vault,
} from "lucide-react";

export type NavItem = {
  title: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  url: string;
};

export type NavSection = {
  label: string;
  collapsible: boolean;
  items: NavItem[];
};

export const sidebarSections: NavSection[] = [
  {
    label: "Principal",
    collapsible: true,
    items: [
      { title: "Général", icon: Home, iconBg: "bg-blue-100", iconColor: "text-blue-600", url: "/dashboard" },
      { title: "École", icon: School, iconBg: "bg-amber-100", iconColor: "text-amber-600", url: "/dashboard/ecole" },
      { title: "Élèves", icon: Users, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", url: "/dashboard/eleves" },
      { title: "Enseignants", icon: UserCog, iconBg: "bg-orange-100", iconColor: "text-orange-600", url: "/dashboard/enseignants" },
    ],
  },
  {
    label: "Planification",
    collapsible: true,
    items: [
      { title: "Emploi - Salles", icon: Calendar, iconBg: "bg-purple-100", iconColor: "text-purple-600", url: "/dashboard/emploi-salles" },
      { title: "Évaluations", icon: ClipboardCheck, iconBg: "bg-rose-100", iconColor: "text-rose-600", url: "/dashboard/evaluations" },
      { title: "Événements", icon: CalendarDays, iconBg: "bg-red-100", iconColor: "text-red-500", url: "/dashboard/evenements" },
    ],
  },
  {
    label: "Documents",
    collapsible: true,
    items: [
      { title: "Rapports", icon: FileText, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", url: "/dashboard/rapports" },
      { title: "Circulaires", icon: Newspaper, iconBg: "bg-lime-100", iconColor: "text-lime-600", url: "/dashboard/circulaires" },
      { title: "Carnets", icon: BookOpen, iconBg: "bg-slate-100", iconColor: "text-slate-600", url: "/dashboard/carnets" },
    ],
  },
  {
    label: "Administration",
    collapsible: true,
    items: [
      { title: "Configuration", icon: Settings, iconBg: "bg-amber-100", iconColor: "text-amber-600", url: "/dashboard/configuration" },
      { title: "Finance", icon: DollarSign, iconBg: "bg-teal-100", iconColor: "text-teal-600", url: "/dashboard/finance" },
      { title: "Dépenses", icon: TrendingDown, iconBg: "bg-red-100", iconColor: "text-red-600", url: "/dashboard/finance/depenses" },
      { title: "Trésorerie", icon: Wallet, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", url: "/dashboard/finance/tresorerie" },
      { title: "Remises & Pénalités", icon: BadgePercent, iconBg: "bg-orange-100", iconColor: "text-orange-600", url: "/dashboard/finance/remises-penalites" },
      { title: "Relances", icon: Bell, iconBg: "bg-cyan-100", iconColor: "text-cyan-600", url: "/dashboard/finance/relances" },
      { title: "Rapports Financiers", icon: BarChart3, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", url: "/dashboard/finance/rapports" },
      { title: "Caisse", icon: Vault, iconBg: "bg-pink-100", iconColor: "text-pink-600", url: "/dashboard/finance/caisse" },
      { title: "Traçabilité", icon: Eye, iconBg: "bg-violet-100", iconColor: "text-violet-600", url: "/dashboard/tracabilite" },
      { title: "Statistique", icon: PieChart, iconBg: "bg-fuchsia-100", iconColor: "text-fuchsia-600", url: "/dashboard/statistique" },
    ],
  },
];
