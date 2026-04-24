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
  CalendarDays,
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
  titleKey: string;
  icon: React.ElementType;
  url: string;
  roles?: string[];
};

export type NavSection = {
  label: string;
  labelKey: string;
  icon: React.ElementType;
  color: string;
  items: NavItem[];
  roles?: string[];
};

export const sidebarSections: NavSection[] = [
  {
    label: "Accueil",
    labelKey: "nav.home",
    icon: Home,
    color: "text-blue-500",
    items: [
      { title: "Tableau de bord", titleKey: "nav.dashboard", icon: Home, url: "/dashboard" },
      { title: "Mon école", titleKey: "nav.mySchool", icon: School, url: "/dashboard/ecole", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
      { title: "Portail Parent", titleKey: "nav.parentPortal", icon: GraduationCap, url: "/dashboard/portail-parent", roles: ["PARENT"] },
    ],
  },
  {
    label: "Scolarité",
    labelKey: "nav.schooling",
    icon: Users,
    color: "text-emerald-500",
    items: [
      { title: "Élèves", titleKey: "nav.students", icon: Users, url: "/dashboard/eleves", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT", "COMPTABLE"] },
      { title: "Inscriptions", titleKey: "nav.inscriptions", icon: ClipboardList, url: "/dashboard/inscriptions", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
      { title: "Absences", titleKey: "nav.absences", icon: UserCheck, url: "/dashboard/absences", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Discipline", titleKey: "nav.discipline", icon: AlertTriangle, url: "/dashboard/discipline", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Calendrier", titleKey: "nav.calendar", icon: CalendarClock, url: "/dashboard/calendrier" },
      { title: "Niveaux & Classes", titleKey: "nav.levelsClasses", icon: GraduationCap, url: "/dashboard/config/niveaux", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
    ],
  },
  {
    label: "Pédagogie",
    labelKey: "nav.pedagogy",
    icon: BookOpen,
    color: "text-purple-500",
    items: [
      { title: "Emploi du temps", titleKey: "nav.schedule", icon: Clock, url: "/dashboard/emploi-du-temps", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT", "PARENT"] },
      { title: "Salles", titleKey: "nav.rooms", icon: Calendar, url: "/dashboard/emploi-salles", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
      { title: "Évaluations", titleKey: "nav.evaluations", icon: ClipboardCheck, url: "/dashboard/evaluations", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Devoirs", titleKey: "nav.homework", icon: PenTool, url: "/dashboard/devoirs", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Examens", titleKey: "nav.exams", icon: FileQuestion, url: "/dashboard/quiz", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"] },
      { title: "Carnets de notes", titleKey: "nav.gradeBooks", icon: BookOpen, url: "/dashboard/carnets", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT", "PARENT"] },
      { title: "Année scolaire", titleKey: "nav.schoolYear", icon: CalendarClock, url: "/dashboard/annee-scolaire", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
    ],
  },
  {
    label: "Bulletins",
    labelKey: "nav.bulletins",
    icon: Printer,
    color: "text-indigo-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"],
    items: [
      { title: "Templates", titleKey: "nav.templates", icon: Palette, url: "/dashboard/bulletin-templates" },
      { title: "Impression masse", titleKey: "nav.bulkPrint", icon: Printer, url: "/dashboard/bulletins-masse" },
      { title: "Stats réussite", titleKey: "nav.successStats", icon: TrendingUp, url: "/dashboard/stats-reussite" },
      { title: "Comparatif", titleKey: "nav.comparative", icon: Activity, url: "/dashboard/comparatif" },
    ],
  },
  {
    label: "Vie scolaire",
    labelKey: "nav.schoolLife",
    icon: Library,
    color: "text-amber-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"],
    items: [
      { title: "Bibliothèque", titleKey: "nav.library", icon: Library, url: "/dashboard/bibliotheque" },
      { title: "Transport", titleKey: "nav.transport", icon: Bus, url: "/dashboard/transport" },
      { title: "Cantine", titleKey: "nav.canteen", icon: UtensilsCrossed, url: "/dashboard/cantine" },
    ],
  },
  {
    label: "Finance",
    labelKey: "nav.finance",
    icon: DollarSign,
    color: "text-teal-500",
    roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE", "DIRECTEUR"],
    items: [
      { title: "Paiements", titleKey: "nav.payments", icon: DollarSign, url: "/dashboard/finance", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Dépenses", titleKey: "nav.expenses", icon: TrendingDown, url: "/dashboard/finance/depenses", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Trésorerie", titleKey: "nav.treasury", icon: Wallet, url: "/dashboard/finance/tresorerie", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Caisse", titleKey: "nav.cashRegister", icon: Vault, url: "/dashboard/finance/caisse", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Factures", titleKey: "nav.invoices", icon: Receipt, url: "/dashboard/factures", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Remises", titleKey: "nav.discounts", icon: BadgePercent, url: "/dashboard/finance/remises-penalites", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Relances", titleKey: "nav.reminders", icon: Bell, url: "/dashboard/finance/relances", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE"] },
      { title: "Rapports", titleKey: "nav.reports", icon: BarChart3, url: "/dashboard/finance/rapports", roles: ["SUPER_ADMIN", "ADMIN", "COMPTABLE", "DIRECTEUR"] },
    ],
  },
  {
    label: "Communication",
    labelKey: "nav.communication",
    icon: Megaphone,
    color: "text-rose-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"],
    items: [
      { title: "Annonces", titleKey: "nav.announcements", icon: Megaphone, url: "/dashboard/annonces" },
      { title: "Notifications", titleKey: "nav.notifications", icon: BellRing, url: "/dashboard/notifications" },
      { title: "Reunions", titleKey: "nav.meetings", icon: CalendarDays, url: "/dashboard/reunions" },
      { title: "Circulaires", titleKey: "nav.circulars", icon: Newspaper, url: "/dashboard/circulaires", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
    ],
  },
  {
    label: "Enseignants & RH",
    labelKey: "nav.teachersHR",
    icon: Briefcase,
    color: "text-cyan-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"],
    items: [
      { title: "Enseignants", titleKey: "nav.teachers", icon: UserCog, url: "/dashboard/enseignants" },
      { title: "Contrats & Congés", titleKey: "nav.contractsLeaves", icon: Briefcase, url: "/dashboard/contrats" },
      { title: "Pointage", titleKey: "nav.attendance", icon: UserPlus, url: "/dashboard/rh/pointage" },
      { title: "Paie", titleKey: "nav.payroll", icon: Banknote, url: "/dashboard/rh/paie" },
      { title: "Formations", titleKey: "nav.training", icon: Award, url: "/dashboard/rh/formations" },
      { title: "Évaluations", titleKey: "nav.teacherEvaluations", icon: UserCog, url: "/dashboard/teacher-evaluations" },
    ],
  },
  {
    label: "Analytics",
    labelKey: "nav.analytics",
    icon: Target,
    color: "text-violet-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR", "ENSEIGNANT"],
    items: [
      { title: "Dashboard", titleKey: "nav.analyticsDashboard", icon: Target, url: "/dashboard/analytics", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
      { title: "Suivi élève", titleKey: "nav.studentTracking", icon: Users, url: "/dashboard/suivi-eleve" },
      { title: "Statistiques", titleKey: "nav.statistics", icon: PieChart, url: "/dashboard/statistique", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"] },
    ],
  },
  {
    label: "Documents",
    labelKey: "nav.documents",
    icon: FileText,
    color: "text-slate-500",
    roles: ["SUPER_ADMIN", "ADMIN", "DIRECTEUR"],
    items: [
      { title: "Rapports", titleKey: "nav.reports", icon: FileText, url: "/dashboard/rapports" },
      { title: "Génération", titleKey: "nav.generation", icon: FileDown, url: "/dashboard/documents" },
      { title: "Vitrine web", titleKey: "nav.webShowcase", icon: Eye, url: "/dashboard/vitrine" },
    ],
  },
  {
    label: "Administration",
    labelKey: "nav.administration",
    icon: Settings,
    color: "text-gray-500",
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      { title: "Utilisateurs", titleKey: "nav.users", icon: ShieldCheck, url: "/dashboard/utilisateurs" },
      { title: "Configuration", titleKey: "nav.configuration", icon: Settings, url: "/dashboard/configuration" },
      { title: "Intégrations", titleKey: "nav.integrations", icon: Plug, url: "/dashboard/integrations" },
      { title: "Traçabilité", titleKey: "nav.traceability", icon: Eye, url: "/dashboard/tracabilite" },
      { title: "Super Admin", titleKey: "nav.superAdmin", icon: Crown, url: "/dashboard/super-admin", roles: ["SUPER_ADMIN"] },
    ],
  },
];
