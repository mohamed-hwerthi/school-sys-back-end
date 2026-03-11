import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  User,
  Globe,
  MessageSquare,
  Search,
  Bell,
  Maximize,
  Minimize,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useCallback } from "react";

const ROUTE_NAMES: Record<string, string> = {
  dashboard: "Tableau de bord",
  eleves: "Élèves",
  ajouter: "Ajouter",
  modifier: "Modifier",
  config: "Configuration",
  niveaux: "Niveaux",
  messages: "Messages",
};

function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => {
    const isId = /^\d+$/.test(seg);
    const label = isId ? `#${seg}` : (ROUTE_NAMES[seg] || seg);
    const path = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;

    return { label, path, isLast };
  });

  return (
    <nav className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <button
              onClick={() => navigate(crumb.path)}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 backdrop-blur-xl bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />

      <Breadcrumb />

      {/* Search Bar - Center */}
      <div className="hidden lg:flex items-center mx-auto">
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/60 transition-colors cursor-pointer w-64">
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1">Rechercher...</span>
          <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex gap-1.5 text-xs rounded-full h-8 px-3 hover:bg-muted/60 transition-all"
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="font-medium">FR</span>
        </Button>

        {/* SMS Badge */}
        <Badge
          variant="secondary"
          className="hidden md:flex gap-1.5 text-xs font-normal rounded-full px-3 py-1 bg-muted/50 hover:bg-muted/70 transition-colors"
        >
          <MessageSquare className="h-3 w-3" />
          4035 SMS
        </Badge>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full hover:bg-muted/60 transition-all"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-background">
            3
          </span>
        </Button>

        {/* Fullscreen Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-8 w-8 rounded-full hover:bg-muted/60 transition-all"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Maximize className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>

        {/* Separator */}
        <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2.5 pl-1.5 pr-3 rounded-full hover:bg-muted/60 transition-all"
            >
              <div className="relative">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-medium leading-none">Administrateur</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  Admin
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Administrateur</p>
                <p className="text-xs text-muted-foreground">admin@ecole.ma</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => navigate("/")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
