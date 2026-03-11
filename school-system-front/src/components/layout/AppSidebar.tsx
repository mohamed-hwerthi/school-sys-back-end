import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { sidebarSections } from "@/data/sidebar-nav";

export function AppSidebar() {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(sidebarSections.map((s) => [s.label, true]))
  );

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (url: string) => {
    if (url === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* ── Header ── */}
      <SidebarHeader className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold shadow-md">
              E
            </div>
            <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="text-[15px] font-bold text-foreground">
                EcoleNet
              </span>
              <span className="text-[11px] text-muted-foreground">
                Gestion Scolaire
              </span>
            </div>
          </Link>
          <button
            onClick={toggleSidebar}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors group-data-[collapsible=icon]:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent className="px-3">
        {sidebarSections.map((section, idx) => (
          <Collapsible
            key={section.label}
            open={openSections[section.label]}
            onOpenChange={() => toggleSection(section.label)}
          >
            {idx > 0 && (
              <SidebarSeparator className="mx-0 my-1" />
            )}

            <SidebarGroup className="py-0">
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer select-none justify-between uppercase text-[11px] tracking-wider text-muted-foreground/70 hover:text-muted-foreground transition-colors group-data-[collapsible=icon]:hidden">
                  {section.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      openSections[section.label] ? "" : "-rotate-90"
                    }`}
                  />
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1">
                    {section.items.map((item) => {
                      const active = isActive(item.url);
                      return (
                        <SidebarMenuItem key={item.title}>
                          <Link
                            to={item.url}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                              active
                                ? "bg-white shadow-sm"
                                : "hover:bg-white/60"
                            }`}
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                            >
                              <item.icon
                                className={`h-4 w-4 ${item.iconColor}`}
                              />
                            </span>
                            <span
                              className={`flex-1 text-[14px] group-data-[collapsible=icon]:hidden ${
                                active
                                  ? "font-semibold text-foreground"
                                  : "text-muted-foreground font-medium"
                              }`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="px-4 py-3 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold shadow-sm">
            EA
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-[13px] font-semibold text-foreground">EcoleNet Admin</span>
            <span className="text-[11px] text-muted-foreground">v1.0.0</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
