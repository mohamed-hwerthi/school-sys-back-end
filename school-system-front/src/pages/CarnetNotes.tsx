import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  BookOpen,
  ClipboardCheck,
  PenLine,
  BarChart3,
  Award,
  FileText,
  MessageSquareText,
} from "lucide-react";
import DomainesTab from "@/components/carnet/DomainesTab";
import ModulesTab from "@/components/carnet/ModulesTab";
import ExamensTab from "@/components/carnet/ExamensTab";
import NotesTab from "@/components/carnet/NotesTab";
import MoyennesTab from "@/components/carnet/MoyennesTab";
import AppreciationsTab from "@/components/carnet/AppreciationsTab";
import CarnetsTab from "@/components/carnet/CarnetsTab";
import CertificatsTab from "@/components/carnet/CertificatsTab";

type TabKey = "domaines" | "modules" | "examens" | "notes" | "moyennes" | "appreciations" | "carnets" | "certificats";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "domaines", label: "Domaines", icon: Layers },
  { key: "modules", label: "Modules", icon: BookOpen },
  { key: "examens", label: "Examens", icon: ClipboardCheck },
  { key: "notes", label: "Saisie Notes", icon: PenLine },
  { key: "moyennes", label: "Moyennes", icon: BarChart3 },
  { key: "appreciations", label: "Appréciations", icon: MessageSquareText },
  { key: "carnets", label: "Carnets", icon: FileText },
  { key: "certificats", label: "Certificats", icon: Award },
];

export default function CarnetNotes() {
  const [activeTab, setActiveTab] = useState<TabKey>("domaines");

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
          Carnet des Notes
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gestion des modules, examens, notes et moyennes
        </p>
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

      {/* Tab Content */}
      {activeTab === "domaines" && <DomainesTab />}
      {activeTab === "modules" && <ModulesTab />}
      {activeTab === "examens" && <ExamensTab />}
      {activeTab === "notes" && <NotesTab />}
      {activeTab === "moyennes" && <MoyennesTab />}
      {activeTab === "appreciations" && <AppreciationsTab />}
      {activeTab === "carnets" && <CarnetsTab />}
      {activeTab === "certificats" && <CertificatsTab />}
    </div>
  );
}
