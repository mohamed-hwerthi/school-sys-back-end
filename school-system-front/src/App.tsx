import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/queryClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import DashboardLayout from "./components/layout/DashboardLayout";
import { TeachersProvider } from "./hooks/useTeachers";
import { RoomsProvider } from "./hooks/useRooms";
import { MessagesProvider } from "./hooks/useMessages";
import { SchoolProvider } from "./hooks/useSchool";
import { Loader2 } from "lucide-react";

// Lazy loaded pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Students = lazy(() => import("./pages/Students"));
const AddStudent = lazy(() => import("./pages/AddStudent"));
const EditStudent = lazy(() => import("./pages/EditStudent"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const StudentMessages = lazy(() => import("./pages/StudentMessages"));
const Teachers = lazy(() => import("./pages/Teachers"));
const AddTeacher = lazy(() => import("./pages/AddTeacher"));
const EditTeacher = lazy(() => import("./pages/EditTeacher"));
const EmploiSalles = lazy(() => import("./pages/EmploiSalles"));
const AddRoom = lazy(() => import("./pages/AddRoom"));
const EditRoom = lazy(() => import("./pages/EditRoom"));
const Niveaux = lazy(() => import("./pages/Niveaux"));
const SchoolInfo = lazy(() => import("./pages/SchoolInfo"));
const FinancePaiement = lazy(() => import("./pages/FinancePaiement"));
const Evaluations = lazy(() => import("./pages/Evaluations"));
const CarnetNotes = lazy(() => import("./pages/CarnetNotes"));
const Rapports = lazy(() => import("./pages/Rapports"));
const Circulaires = lazy(() => import("./pages/Circulaires"));
const Configuration = lazy(() => import("./pages/Configuration"));
const Tracabilite = lazy(() => import("./pages/Tracabilite"));
const Statistiques = lazy(() => import("./pages/Statistiques"));
const Depenses = lazy(() => import("./pages/Depenses"));
const Tresorerie = lazy(() => import("./pages/Tresorerie"));
const RemisesPenalites = lazy(() => import("./pages/RemisesPenalites"));
const Relances = lazy(() => import("./pages/Relances"));
const RapportsFinanciers = lazy(() => import("./pages/RapportsFinanciers"));
const GestionCaisse = lazy(() => import("./pages/GestionCaisse"));

// New pages
const UsersPage = lazy(() => import("./pages/Users"));
const AbsencesPage = lazy(() => import("./pages/Absences"));
const EmploiDuTempsPage = lazy(() => import("./pages/EmploiDuTemps"));
const DisciplinePage = lazy(() => import("./pages/Discipline"));
const AnneeScolairePage = lazy(() => import("./pages/AnneeScolaire"));
const ContratsPage = lazy(() => import("./pages/Contrats"));
const FacturesPage = lazy(() => import("./pages/Factures"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VitrineSite = lazy(() => import("./pages/VitrineSite"));
const VitrineAdminPage = lazy(() => import("./pages/VitrineAdmin"));

const PageLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
            <Route path="/reset-password" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />
            <Route path="/forbidden" element={<Forbidden />} />
            {/* Public vitrine website */}
            <Route path="/vitrine/:slug" element={<Suspense fallback={<PageLoader />}><VitrineSite /></Suspense>} />
            <Route path="/vitrine/:slug/:pageSlug" element={<Suspense fallback={<PageLoader />}><VitrineSite /></Suspense>} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <SchoolProvider>
                    <MessagesProvider>
                      <TeachersProvider>
                        <RoomsProvider>
                          <DashboardLayout />
                        </RoomsProvider>
                      </TeachersProvider>
                    </MessagesProvider>
                  </SchoolProvider>
                </PrivateRoute>
              }
            >
              <Suspense fallback={<PageLoader />}>
                <Route index element={<Dashboard />} />

                {/* Élèves */}
                <Route path="eleves" element={<Students />} />
                <Route path="eleves/ajouter" element={<AddStudent />} />
                <Route path="eleves/modifier/:id" element={<EditStudent />} />
                <Route path="eleves/:id" element={<StudentProfile />} />
                <Route path="eleves/:id/messages" element={<StudentMessages />} />

                {/* Enseignants */}
                <Route path="enseignants" element={<Teachers />} />
                <Route path="enseignants/ajouter" element={<AddTeacher />} />
                <Route path="enseignants/modifier/:id" element={<EditTeacher />} />

                {/* Absences */}
                <Route path="absences" element={<AbsencesPage />} />

                {/* Emploi du temps */}
                <Route path="emploi-du-temps" element={<EmploiDuTempsPage />} />
                <Route path="emploi-salles" element={<EmploiSalles />} />
                <Route path="emploi-salles/ajouter" element={<AddRoom />} />
                <Route path="emploi-salles/modifier/:id" element={<EditRoom />} />

                {/* Configuration */}
                <Route path="config/niveaux" element={<Niveaux />} />
                <Route path="ecole" element={<SchoolInfo />} />

                {/* Finance */}
                <Route path="finance" element={<FinancePaiement />} />
                <Route path="finance/paiement" element={<FinancePaiement />} />
                <Route path="finance/depenses" element={<Depenses />} />
                <Route path="finance/tresorerie" element={<Tresorerie />} />
                <Route path="finance/remises-penalites" element={<RemisesPenalites />} />
                <Route path="finance/relances" element={<Relances />} />
                <Route path="finance/rapports" element={<RapportsFinanciers />} />
                <Route path="finance/caisse" element={<GestionCaisse />} />
                <Route path="factures" element={<FacturesPage />} />

                {/* Pédagogie */}
                <Route path="evaluations" element={<Evaluations />} />
                <Route path="carnets" element={<CarnetNotes />} />
                <Route path="annee-scolaire" element={<AnneeScolairePage />} />

                {/* Vie scolaire */}
                <Route path="discipline" element={<DisciplinePage />} />
                <Route path="contrats" element={<ContratsPage />} />

                {/* Documents */}
                <Route path="rapports" element={<Rapports />} />
                <Route path="circulaires" element={<Circulaires />} />

                {/* Vitrine */}
                <Route path="vitrine" element={<VitrineAdminPage />} />

                {/* Administration */}
                <Route path="utilisateurs" element={<UsersPage />} />
                <Route path="configuration" element={<Configuration />} />
                <Route path="tracabilite" element={<Tracabilite />} />
                <Route path="statistique" element={<Statistiques />} />

                <Route path="*" element={<Dashboard />} />
              </Suspense>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
