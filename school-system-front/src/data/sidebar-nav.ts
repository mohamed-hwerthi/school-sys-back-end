import {
  Home,
  Users,
  UserCog,
  Calendar,
  ClipboardCheck,
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
  UserCheck,
  Clock,
  AlertTriangle,
  GraduationCap,
  Receipt,
  Briefcase,
  CalendarClock,
  ShieldCheck,
  Palette,
  Printer,
  TrendingUp,
  Activity,
  Megaphone,
  BellRing,
  ClipboardList,
  Library,
  Bus,
  UtensilsCrossed,
  PenTool,
  FileQuestion,
  UserPlus,
  Banknote,
  Award,
  FileDown,
  Plug,
  Target,
  Crown,
} from "lucide-react";

export type NavItem = {
  title: string;
  icon: React.ElementType;
  url: string;
  roles?: string[];
};

export type NavSection = {
  label: string;
  icon: React.ElementType;
  color: string;
  items: NavItem[];
  roles?: string[];
};

export const sidebarSections: NavSection[] = [
  {
    label: "Accueil",
    icon: Home,
    color: "text-blue-500",
    items: [
      { title: "Tableau de bord", icon: Home, url: "/dashboard" },
      { title: "Mon école", icon: School, url: "/dashboard/ecole", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
      { title: "Portail Parent", icon: GraduationCap, url: "/dashboard/portail-parent", roles: ["PARENT"] },
    ],
  },
  {
    label: "Scolarité",
    icon: Users,
    color: "text-emerald-500",
    items: [
      { title: "Élèves", icon: Users, url: "/dashboard/eleves", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT", "COMPTABLE"] },
      { title: "Inscriptions", icon: ClipboardList, url: "/dashboard/inscriptions", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
      { title: "Absences", icon: UserCheck, url: "/dashboard/absences", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Discipline", icon: AlertTriangle, url: "/dashboard/discipline", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Niveaux & Classes", icon: GraduationCap, url: "/dashboard/config/niveaux", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
    ],
  },
  {
    label: "Pédagogie",
    icon: BookOpen,
    color: "text-purple-500",
    items: [
      { title: "Emploi du temps", icon: Clock, url: "/dashboard/emploi-du-temps", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT", "PARENT"] },
      { title: "Salles", icon: Calendar, url: "/dashboard/emploi-salles", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
      { title: "Évaluations", icon: ClipboardCheck, url: "/dashboard/evaluations", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Devoirs", icon: PenTool, url: "/dashboard/devoirs", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Examens", icon: FileQuestion, url: "/dashboard/quiz", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Carnets de notes", icon: BookOpen, url: "/dashboard/carnets", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT", "PARENT"] },
      { title: "Année scolaire", icon: CalendarClock, url: "/dashboard/annee-scolaire", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
    ],
  },
  {
    label: "Bulletins",
    icon: Printer,
    color: "text-indigo-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"],
    items: [
      { title: "Templates", icon: Palette, url: "/dashboard/bulletin-templates" },
      { title: "Impression masse", icon: Printer, url: "/dashboard/bulletins-masse" },
      { title: "Stats réussite", icon: TrendingUp, url: "/dashboard/stats-reussite" },
      { title: "Comparatif", icon: Activity, url: "/dashboard/comparatif" },
    ],
  },
  {
    label: "Vie scolaire",
    icon: Library,
    color: "text-amber-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"],
    items: [
      { title: "Bibliothèque", icon: Library, url: "/dashboard/bibliotheque" },
      { title: "Transport", icon: Bus, url: "/dashboard/transport" },
      { title: "Cantine", icon: UtensilsCrossed, url: "/dashboard/cantine" },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    color: "text-teal-500",
    roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE", "DIRECTEUR"],
    items: [
      { title: "Paiements", icon: DollarSign, url: "/dashboard/finance", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Dépenses", icon: TrendingDown, url: "/dashboard/finance/depenses", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Trésorerie", icon: Wallet, url: "/dashboard/finance/tresorerie", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Caisse", icon: Vault, url: "/dashboard/finance/caisse", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Factures", icon: Receipt, url: "/dashboard/factures", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Remises", icon: BadgePercent, url: "/dashboard/finance/remises-penalites", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Relances", icon: Bell, url: "/dashboard/finance/relances", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Rapports", icon: BarChart3, url: "/dashboard/finance/rapports", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE", "DIRECTEUR"] },
    ],
  },
  {
    label: "Communication",
    icon: Megaphone,
    color: "text-rose-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"],
    items: [
      { title: "Annonces", icon: Megaphone, url: "/dashboard/annonces" },
      { title: "Notifications", icon: BellRing, url: "/dashboard/notifications" },
      { title: "Circulaires", icon: Newspaper, url: "/dashboard/circulaires", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
    ],
  },
  {
    label: "Enseignants & RH",
    icon: Briefcase,
    color: "text-cyan-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"],
    items: [
      { title: "Enseignants", icon: UserCog, url: "/dashboard/enseignants" },
      { title: "Contrats & Congés", icon: Briefcase, url: "/dashboard/contrats" },
      { title: "Pointage", icon: UserPlus, url: "/dashboard/rh/pointage" },
      { title: "Paie", icon: Banknote, url: "/dashboard/rh/paie" },
      { title: "Formations", icon: Award, url: "/dashboard/rh/formations" },
      { title: "Évaluations", icon: UserCog, url: "/dashboard/teacher-evaluations" },
    ],
  },
  {
    label: "Analytics",
    icon: Target,
    color: "text-violet-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"],
    items: [
      { title: "Dashboard", icon: Target, url: "/dashboard/analytics", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
      { title: "Suivi élève", icon: Users, url: "/dashboard/suivi-eleve" },
      { title: "Statistiques", icon: PieChart, url: "/dashboard/statistique", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
    ],
  },
  {
    label: "Documents",
    icon: FileText,
    color: "text-slate-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"],
    items: [
      { title: "Rapports", icon: FileText, url: "/dashboard/rapports" },
      { title: "Génération", icon: FileDown, url: "/dashboard/documents" },
      { title: "Vitrine web", icon: Eye, url: "/dashboard/vitrine" },
    ],
  },
  {
    label: "Administration",
    icon: Settings,
    color: "text-gray-500",
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      { title: "Utilisateurs", icon: ShieldCheck, url: "/dashboard/utilisateurs" },
      { title: "Configuration", icon: Settings, url: "/dashboard/configuration" },
      { title: "Intégrations", icon: Plug, url: "/dashboard/integrations" },
      { title: "Traçabilité", icon: Eye, url: "/dashboard/tracabilite" },
      { title: "Super Admin", icon: Crown, url: "/dashboard/super-admin", roles: ["SUPER_ADMIN"] },
    ],
  },
];
