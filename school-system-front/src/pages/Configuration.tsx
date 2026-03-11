import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  School,
  GraduationCap,
  Clock,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  RotateCcw,
  ChevronRight,
  Check,
  Globe,
  Calendar,
  Users,
  BookOpen,
} from "lucide-react";
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
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { CURRENCY } from "@/config/currency";
import { useNiveaux } from "@/hooks/useNiveaux";
import { useAllStudents } from "@/hooks/useStudents";
import { useSchoolSettings, useUpdateSchoolSettings } from "@/hooks/useSchoolSettings";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

type ConfigSection = "general" | "horaires" | "niveaux" | "notifications" | "securite" | "apparence" | "sauvegarde";

const sections: { key: ConfigSection; label: string; icon: React.ElementType; description: string }[] = [
  { key: "general", label: "Général", icon: School, description: "Informations générales et année scolaire" },
  { key: "horaires", label: "Horaires", icon: Clock, description: "Horaires de cours et récréations" },
  { key: "niveaux", label: "Niveaux & Classes", icon: GraduationCap, description: "Gestion des niveaux scolaires" },
  { key: "notifications", label: "Notifications", icon: Bell, description: "Paramètres des notifications" },
  { key: "securite", label: "Sécurité", icon: Shield, description: "Mots de passe et accès" },
  { key: "apparence", label: "Apparence", icon: Palette, description: "Thème et personnalisation" },
  { key: "sauvegarde", label: "Sauvegarde", icon: Database, description: "Sauvegarde et restauration" },
];

export default function Configuration() {
  const loading = useSimulatedLoading(800);
  const { niveaux } = useNiveaux();
  const { data: students = [] } = useAllStudents();
  const { data: settings } = useSchoolSettings();
  const updateSettings = useUpdateSchoolSettings();
  const [activeSection, setActiveSection] = useState<ConfigSection>("general");

  // General settings (synced from DB)
  const [schoolName, setSchoolName] = useState("");
  const [schoolNameAr, setSchoolNameAr] = useState("");
  const [anneeScolaire, setAnneeScolaire] = useState("2025 / 2026");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [directeurName, setDirecteurName] = useState("");
  const [directeurNameAr, setDirecteurNameAr] = useState("");
  const [langue, setLangue] = useState("fr");
  const [fuseau, setFuseau] = useState("Africa/Tunis");
  const [devise, setDevise] = useState(CURRENCY);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Load settings from DB into local state
  if (settings && !settingsLoaded) {
    setSchoolName(settings.schoolName || "");
    setSchoolNameAr(settings.schoolNameAr || "");
    setAnneeScolaire(settings.anneeScolaire || "2025 / 2026");
    setAdresse(settings.adresse || "");
    setTelephone(settings.telephone || "");
    setDirecteurName(settings.directeurName || "");
    setDirecteurNameAr(settings.directeurNameAr || "");
    setSettingsLoaded(true);
  }

  // Horaires
  const [heureDebut, setHeureDebut] = useState("08:00");
  const [heureFin, setHeureFin] = useState("17:00");
  const [dureeSeance, setDureeSeance] = useState("60");
  const [dureeRecreation, setDureeRecreation] = useState("15");

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [rappelPaiement, setRappelPaiement] = useState("7");

  // Security
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [doubleAuth, setDoubleAuth] = useState(false);

  // Appearance
  const [theme, setTheme] = useState("light");
  const [couleurPrimaire, setCouleurPrimaire] = useState("#7c3aed");

  const handleSave = () => {
    updateSettings.mutate(
      {
        schoolName,
        schoolNameAr: schoolNameAr || null,
        anneeScolaire,
        adresse: adresse || null,
        telephone: telephone || null,
        directeurName: directeurName || null,
        directeurNameAr: directeurNameAr || null,
      },
      {
        onSuccess: () => toast.success("Configuration sauvegardée avec succès"),
        onError: () => toast.error("Erreur lors de la sauvegarde"),
      }
    );
  };

  const handleReset = () => {
    toast.info("Configuration réinitialisée aux valeurs par défaut");
  };

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
          <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">Configuration</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Paramètres généraux de l'établissement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button size="sm" className="gap-1.5 bg-gradient-primary shadow-btn" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-1 space-y-1">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all text-left ${
                activeSection === section.key
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <section.icon className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{section.label}</p>
              </div>
              {activeSection === section.key && <ChevronRight className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-3">
          {/* GÉNÉRAL */}
          {activeSection === "general" && (
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><School className="h-5 w-5 text-primary" />Paramètres généraux</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Configuration de base de l'établissement</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de l'école</label>
                  <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="École Primaire..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom en arabe</label>
                  <Input value={schoolNameAr} onChange={(e) => setSchoolNameAr(e.target.value)} placeholder="المدرسة الابتدائية..." dir="rtl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Année scolaire</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input value={anneeScolaire} onChange={(e) => setAnneeScolaire(e.target.value)} placeholder="2025 / 2026" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+216 XX XXX XXX" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Adresse</label>
                  <Input value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Rue, Ville, Code Postal" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Directeur(trice)</label>
                  <Input value={directeurName} onChange={(e) => setDirecteurName(e.target.value)} placeholder="Nom du directeur" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Directeur(trice) en arabe</label>
                  <Input value={directeurNameAr} onChange={(e) => setDirecteurNameAr(e.target.value)} placeholder="اسم المدير" dir="rtl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Langue</label>
                  <Select value={langue} onValueChange={setLangue}>
                    <SelectTrigger><Globe className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">Arabe</SelectItem>
                      <SelectItem value="en">Anglais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Devise</label>
                  <Select value={devise} onValueChange={setDevise}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TND">TND (Dinar Tunisien)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-lg bg-muted/40 p-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-500" /><span className="font-medium">{students.length}</span> <span className="text-muted-foreground">élèves</span></div>
                  <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-purple-500" /><span className="font-medium">{niveaux.length}</span> <span className="text-muted-foreground">niveaux</span></div>
                  <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-emerald-500" /><span className="font-medium">{niveaux.reduce((sum, n) => sum + n.sections.length, 0)}</span> <span className="text-muted-foreground">classes</span></div>
                </div>
              </div>
            </div>
          )}

          {/* HORAIRES */}
          {activeSection === "horaires" && (
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Horaires scolaires</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Définissez les créneaux horaires</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de début</label>
                  <Input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de fin</label>
                  <Input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée d'une séance (min)</label>
                  <Input type="number" value={dureeSeance} onChange={(e) => setDureeSeance(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée récréation (min)</label>
                  <Input type="number" value={dureeRecreation} onChange={(e) => setDureeRecreation(e.target.value)} />
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                <p className="font-medium mb-1">Aperçu des créneaux</p>
                <p className="text-xs">Avec les paramètres actuels : {Math.floor((parseInt(heureFin.split(":")[0]) * 60 + parseInt(heureFin.split(":")[1]) - parseInt(heureDebut.split(":")[0]) * 60 - parseInt(heureDebut.split(":")[1])) / (parseInt(dureeSeance) + parseInt(dureeRecreation)))} séances par jour</p>
              </div>
            </div>
          )}

          {/* NIVEAUX */}
          {activeSection === "niveaux" && (
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" />Niveaux & Classes</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Vue d'ensemble des niveaux scolaires</p>
              </div>
              <div className="space-y-3">
                {niveaux.map((niveau) => {
                  const count = students.filter((s) => s.niveau === niveau.nom).length;
                  return (
                    <div key={niveau.id} className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <GraduationCap className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{niveau.nom}</p>
                          <div className="flex gap-1 mt-0.5">
                            {niveau.sections.map((s) => (
                              <Badge key={s} variant="outline" className="text-xs px-1.5 py-0">{niveau.nom.match(/^(\d+)/)?.[1]}{s}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{count} élèves</Badge>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.location.href = "/dashboard/config/niveaux"}>
                <Settings className="h-4 w-4" />
                Gérer les niveaux
              </Button>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Notifications</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Paramètres des alertes et rappels</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Notifications par email", desc: "Recevoir les alertes par email", value: notifEmail, onChange: setNotifEmail },
                  { label: "Notifications SMS", desc: "Envoyer des SMS aux parents", value: notifSMS, onChange: setNotifSMS },
                  { label: "Notifications push", desc: "Notifications dans le navigateur", value: notifPush, onChange: setNotifPush },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => item.onChange(!item.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.value ? "bg-primary" : "bg-muted-foreground/30"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.value ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rappel paiement (jours avant échéance)</label>
                  <Select value={rappelPaiement} onValueChange={setRappelPaiement}>
                    <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 jours</SelectItem>
                      <SelectItem value="5">5 jours</SelectItem>
                      <SelectItem value="7">7 jours</SelectItem>
                      <SelectItem value="14">14 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* SÉCURITÉ */}
          {activeSection === "securite" && (
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Sécurité</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Paramètres de sécurité du système</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiration de session (minutes)</label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
                  <div>
                    <p className="font-medium text-sm">Authentification à deux facteurs</p>
                    <p className="text-xs text-muted-foreground">Ajouter une couche de sécurité supplémentaire</p>
                  </div>
                  <button
                    onClick={() => setDoubleAuth(!doubleAuth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${doubleAuth ? "bg-primary" : "bg-muted-foreground/30"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${doubleAuth ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-emerald-700">Système sécurisé</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Toutes les connexions sont chiffrées. Dernière vérification : aujourd'hui</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPARENCE */}
          {activeSection === "apparence" && (
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Apparence</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Personnalisation visuelle</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Thème</label>
                  <div className="flex gap-3">
                    {[
                      { value: "light", label: "Clair", bg: "bg-white border-2" },
                      { value: "dark", label: "Sombre", bg: "bg-gray-900 border-2" },
                      { value: "auto", label: "Auto", bg: "bg-gradient-to-r from-white to-gray-900 border-2" },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${theme === t.value ? "ring-2 ring-primary" : "hover:bg-muted/50"}`}
                      >
                        <div className={`h-12 w-16 rounded-md ${t.bg} ${theme === t.value ? "border-primary" : "border-border"}`} />
                        <span className="text-xs font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Couleur primaire</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={couleurPrimaire} onChange={(e) => setCouleurPrimaire(e.target.value)} className="h-10 w-10 rounded-lg cursor-pointer" />
                    <Input value={couleurPrimaire} onChange={(e) => setCouleurPrimaire(e.target.value)} className="w-32" />
                    <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: couleurPrimaire }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SAUVEGARDE */}
          {activeSection === "sauvegarde" && (
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><Database className="h-5 w-5 text-primary" />Sauvegarde & Restauration</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Gérer les sauvegardes de données</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Dernière sauvegarde</p>
                      <p className="text-xs text-muted-foreground mt-0.5">23 Février 2026 à 02:00</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Réussie</Badge>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Sauvegarde automatique</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Tous les jours à 02:00</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Sauvegarde manuelle lancée (simulation)")}>
                    <Database className="h-4 w-4" />
                    Sauvegarder maintenant
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info("Restauration à venir")}>
                    <RotateCcw className="h-4 w-4" />
                    Restaurer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
