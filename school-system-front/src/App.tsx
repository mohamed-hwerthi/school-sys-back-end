import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/queryClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import { TeachersProvider } from "./hooks/useTeachers";
import { RoomsProvider } from "./hooks/useRooms";
import { MessagesProvider } from "./hooks/useMessages";
import { SchoolProvider } from "./hooks/useSchool";
import Teachers from "./pages/Teachers";
import AddTeacher from "./pages/AddTeacher";
import EditTeacher from "./pages/EditTeacher";
import EmploiSalles from "./pages/EmploiSalles";
import AddRoom from "./pages/AddRoom";
import EditRoom from "./pages/EditRoom";
import Niveaux from "./pages/Niveaux";
import StudentProfile from "./pages/StudentProfile";
import StudentMessages from "./pages/StudentMessages";
import SchoolInfo from "./pages/SchoolInfo";
import FinancePaiement from "./pages/FinancePaiement";
import Evaluations from "./pages/Evaluations";
import CarnetNotes from "./pages/CarnetNotes";
import Rapports from "./pages/Rapports";
import Circulaires from "./pages/Circulaires";
import Configuration from "./pages/Configuration";
import Tracabilite from "./pages/Tracabilite";
import Statistiques from "./pages/Statistiques";
import Depenses from "./pages/Depenses";
import Tresorerie from "./pages/Tresorerie";
import RemisesPenalites from "./pages/RemisesPenalites";
import Relances from "./pages/Relances";
import RapportsFinanciers from "./pages/RapportsFinanciers";
import GestionCaisse from "./pages/GestionCaisse";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/dashboard"
            element={
              <SchoolProvider>
                <MessagesProvider>
                  <TeachersProvider>
                    <RoomsProvider>
                      <DashboardLayout />
                    </RoomsProvider>
                  </TeachersProvider>
                </MessagesProvider>
              </SchoolProvider>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="eleves" element={<Students />} />
            <Route path="eleves/ajouter" element={<AddStudent />} />
            <Route path="eleves/modifier/:id" element={<EditStudent />} />
            <Route path="eleves/:id" element={<StudentProfile />} />
            <Route path="eleves/:id/messages" element={<StudentMessages />} />
            <Route path="enseignants" element={<Teachers />} />
            <Route path="enseignants/ajouter" element={<AddTeacher />} />
            <Route path="enseignants/modifier/:id" element={<EditTeacher />} />
            <Route path="emploi-salles" element={<EmploiSalles />} />
            <Route path="emploi-salles/ajouter" element={<AddRoom />} />
            <Route path="emploi-salles/modifier/:id" element={<EditRoom />} />
            <Route path="config/niveaux" element={<Niveaux />} />
            <Route path="ecole" element={<SchoolInfo />} />
            <Route path="finance" element={<FinancePaiement />} />
            <Route path="finance/paiement" element={<FinancePaiement />} />
            <Route path="finance/depenses" element={<Depenses />} />
            <Route path="finance/tresorerie" element={<Tresorerie />} />
            <Route path="finance/remises-penalites" element={<RemisesPenalites />} />
            <Route path="finance/relances" element={<Relances />} />
            <Route path="finance/rapports" element={<RapportsFinanciers />} />
            <Route path="finance/caisse" element={<GestionCaisse />} />
            <Route path="evaluations" element={<Evaluations />} />
            <Route path="carnets" element={<CarnetNotes />} />
            <Route path="rapports" element={<Rapports />} />
            <Route path="circulaires" element={<Circulaires />} />
            <Route path="configuration" element={<Configuration />} />
            <Route path="tracabilite" element={<Tracabilite />} />
            <Route path="statistique" element={<Statistiques />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
