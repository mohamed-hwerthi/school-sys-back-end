import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, GraduationCap, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import schoolHero from "@/assets/school-hero.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const Index = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-mesh overflow-hidden p-4 md:p-8">
      {/* Animated mesh orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, hsl(230 75% 57% / 0.2), transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed -bottom-40 -right-40 h-[600px] w-[600px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, hsl(260 70% 60% / 0.15), transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed top-1/4 right-1/3 h-72 w-72 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(160 70% 42% / 0.15), transparent 70%)" }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex w-full max-w-[1000px] overflow-hidden rounded-3xl border border-border/50 bg-card/80 glass shadow-card-xl"
      >
        {/* Left: Visual side */}
        <div className="relative hidden w-[52%] overflow-hidden lg:block">
          <div className="absolute inset-0 bg-gradient-primary opacity-[0.07]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative flex h-full flex-col items-center justify-center p-10">
            <motion.img
              src={schoolHero}
              alt="École primaire"
              className="w-full max-w-sm drop-shadow-xl"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm font-medium text-muted-foreground">
                Plateforme complète de gestion
              </p>
              <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
                Pour votre école primaire
              </h3>
            </motion.div>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex flex-wrap justify-center gap-2"
            >
              {["Élèves", "Notes", "Emploi du temps", "Présence"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="rounded-full border border-border/60 bg-card/60 glass px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right: Login Form */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center justify-center px-8 py-14 lg:w-[48%] lg:px-14"
        >
          {/* Logo */}
          <motion.div variants={item} className="mb-10 flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-btn">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
              <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
                <Sparkles className="h-2.5 w-2.5 text-accent-foreground" />
              </div>
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
                EcoleNet
              </h1>
              <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">
                GESTION SCOLAIRE
              </p>
            </div>
          </motion.div>

          <motion.div variants={item} className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Bon retour ! 👋
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Connectez-vous à votre espace
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex w-full max-w-[280px] items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-[280px] space-y-4">
            {/* Email */}
            <motion.div variants={item} className="relative">
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                E-mail
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${focused === "email" ? "text-primary" : "text-muted-foreground"}`} />
                <input
                  type="email"
                  placeholder="nom@ecole.fr"
                  value={email}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-primary focus:bg-card focus:outline-none focus:shadow-input-focus"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={item} className="relative">
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${focused === "pass" ? "text-primary" : "text-muted-foreground"}`} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-primary focus:bg-card focus:outline-none focus:shadow-input-focus"
                />
              </div>
            </motion.div>

            {/* Forgot password */}
            <motion.div variants={item} className="text-right">
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                Mot de passe oublié ?
              </a>
            </motion.div>

            {/* Submit */}
            <motion.div variants={item}>
              <motion.button
                whileHover={loading ? {} : { scale: 1.015, y: -1 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-btn transition-shadow hover:shadow-lg disabled:opacity-80"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider + stats */}
          <motion.div variants={item} className="mt-10 w-full max-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-medium text-muted-foreground">STATISTIQUES</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { value: "1.2K", label: "Élèves", color: "bg-primary/10 text-primary" },
                { value: "48", label: "Classes", color: "bg-accent/10 text-accent" },
                { value: "96", label: "Enseignants", color: "bg-primary/10 text-primary" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl ${stat.color} p-3 text-center`}>
                  <p className="font-heading text-base font-bold">{stat.value}</p>
                  <p className="text-[10px] font-medium opacity-70">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p variants={item} className="mt-8 text-[10px] text-muted-foreground">
            © 2026 EcoleNet — Tous droits réservés
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
