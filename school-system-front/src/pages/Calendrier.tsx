import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  BookOpen,
  Megaphone,
  Sun,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnonces } from "@/hooks/useAnnonces";
import { useExamensRaw } from "@/hooks/useExamens";

/* ── Types ──────────────────────────────────────────────── */

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  label: string;
  type: "holiday" | "exam" | "annonce";
}

/* ── Tunisian school holidays 2025-2026 ─────────────────── */

const SCHOOL_HOLIDAYS: CalendarEvent[] = [
  // Rentree scolaire
  { date: "2025-09-15", label: "Rentree scolaire", type: "holiday" },
  // Vacances d'automne
  ...daysInRange("2025-10-27", "2025-11-02").map((d) => ({ date: d, label: "Vacances d'automne", type: "holiday" as const })),
  // Mouled (approximation)
  { date: "2025-09-05", label: "Mouled Ennabi", type: "holiday" },
  // Vacances de fin de 1er trimestre
  ...daysInRange("2025-12-22", "2026-01-04").map((d) => ({ date: d, label: "Vacances d'hiver", type: "holiday" as const })),
  // Revolution Day
  { date: "2026-01-14", label: "Fete de la Revolution", type: "holiday" },
  // Vacances de mi-annee (fin 2e trimestre)
  ...daysInRange("2026-03-16", "2026-03-22").map((d) => ({ date: d, label: "Vacances de printemps", type: "holiday" as const })),
  // Fete de l'independance
  { date: "2026-03-20", label: "Fete de l'Independance", type: "holiday" },
  // Jour des martyrs
  { date: "2026-04-09", label: "Journee des Martyrs", type: "holiday" },
  // Fete du travail
  { date: "2026-05-01", label: "Fete du Travail", type: "holiday" },
  // Fete de la Republique
  { date: "2026-07-25", label: "Fete de la Republique", type: "holiday" },
  // Fin annee scolaire
  { date: "2026-06-30", label: "Fin de l'annee scolaire", type: "holiday" },
  // Aid El-Fitr (approximation)
  ...daysInRange("2026-03-20", "2026-03-22").map((d) => ({ date: d, label: "Aid El-Fitr (approx.)", type: "holiday" as const })),
  // Aid El-Adha (approximation)
  ...daysInRange("2026-05-27", "2026-05-29").map((d) => ({ date: d, label: "Aid El-Adha (approx.)", type: "holiday" as const })),
];

/** Generate all dates between start and end (inclusive). */
function daysInRange(start: string, end: string): string[] {
  const result: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    result.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

/* ── Helpers ────────────────────────────────────────────── */

const MONTHS_FR = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** 0 = Mon, 6 = Sun */
function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // convert Sun=0 to Mon-based
}

const EVENT_COLORS: Record<CalendarEvent["type"], { dot: string; bg: string; text: string }> = {
  holiday: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  exam: { dot: "bg-red-500", bg: "bg-red-50", text: "text-red-700" },
  annonce: { dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
};

const EVENT_ICONS: Record<CalendarEvent["type"], React.ElementType> = {
  holiday: Sun,
  exam: BookOpen,
  annonce: Megaphone,
};

/* ── Component ──────────────────────────────────────────── */

export default function Calendrier() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // Fetch annonces and examens
  const { data: annonces = [] } = useAnnonces(false);
  const { data: examens = [] } = useExamensRaw();

  // Build events list
  const events = useMemo<CalendarEvent[]>(() => {
    const list: CalendarEvent[] = [...SCHOOL_HOLIDAYS];

    // Examens -- they may not have a date field, but the ExamenDTO has no date.
    // We'll show them generically for the current month if they exist.
    examens.forEach((ex) => {
      // ExamenDTO doesn't have a date field, so we skip date-based placement
      // but keep them in the sidebar list
    });

    // Annonces with datePublication
    annonces.forEach((a) => {
      if (a.datePublication) {
        const dateStr = a.datePublication.split("T")[0];
        list.push({
          date: dateStr,
          label: a.titre,
          type: "annonce",
        });
      }
    });

    return list;
  }, [annonces, examens]);

  // Group events by date for current month
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const existing = map.get(ev.date) ?? [];
      // Deduplicate by label
      if (!existing.some((e) => e.label === ev.label && e.type === ev.type)) {
        existing.push(ev);
      }
      map.set(ev.date, existing);
    }
    return map;
  }, [events]);

  // Calendar grid
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  // Selected day for detail
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) ?? [] : [];

  // Events for current month (for sidebar)
  const monthEvents = useMemo(() => {
    const prefix = `${year}-${pad(month + 1)}`;
    const result: CalendarEvent[] = [];
    const seen = new Set<string>();
    for (const ev of events) {
      if (ev.date.startsWith(prefix)) {
        const key = `${ev.date}|${ev.label}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(ev);
        }
      }
    }
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [events, year, month]);

  const navigate = (direction: number) => {
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDate(null);
  };

  const goToToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setSelectedDate(todayStr);
  };

  // Build grid cells
  const cells: Array<{ day: number | null; dateStr: string | null }> = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, dateStr: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: toDateStr(year, month, d) });
  }
  // Fill remaining cells to complete grid (up to 42 = 6 rows)
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, dateStr: null });
  }

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
          <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Calendrier Scolaire
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Annee scolaire 2025 / 2026 - Vacances, examens et evenements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Aujourd'hui
          </Button>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {(["holiday", "exam", "annonce"] as const).map((type) => {
          const Icon = EVENT_ICONS[type];
          const colors = EVENT_COLORS[type];
          const labels: Record<string, string> = {
            holiday: "Vacances / Jours feries",
            exam: "Examens",
            annonce: "Annonces / Evenements",
          };
          return (
            <span key={type} className={`flex items-center gap-1.5 rounded-md px-2 py-1 ${colors.bg} ${colors.text} font-medium`}>
              <Icon className="h-3.5 w-3.5" />
              {labels[type]}
            </span>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="lg:col-span-3 rounded-2xl border border-border/40 bg-card shadow-sm overflow-hidden"
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="font-heading text-lg font-bold text-foreground">
              {MONTHS_FR[month]} {year}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => navigate(1)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border/40">
            {DAYS_FR.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => {
              if (cell.day === null) {
                return <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-border/20 bg-muted/10" />;
              }
              const dateStr = cell.dateStr!;
              const dayEvents = eventsByDate.get(dateStr) ?? [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const hasHoliday = dayEvents.some((e) => e.type === "holiday");

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                  className={`min-h-[80px] border-b border-r border-border/20 p-1.5 text-left transition-colors relative group
                    ${isToday ? "bg-primary/5" : ""}
                    ${isSelected ? "bg-primary/10 ring-2 ring-primary/30 ring-inset" : ""}
                    ${hasHoliday && !isSelected ? "bg-amber-50/50" : ""}
                    hover:bg-muted/40
                  `}
                >
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                    ${isToday ? "bg-primary text-white" : "text-foreground"}
                  `}>
                    {cell.day}
                  </span>
                  {/* Event dots */}
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {/* Show unique type dots */}
                      {Array.from(new Set(dayEvents.map((e) => e.type))).map((type) => (
                        <span key={type} className={`h-1.5 w-1.5 rounded-full ${EVENT_COLORS[type].dot}`} />
                      ))}
                    </div>
                  )}
                  {/* First event label (truncated) on larger screens */}
                  {dayEvents.length > 0 && (
                    <p className="hidden md:block text-[10px] leading-tight text-muted-foreground truncate mt-0.5 max-w-full">
                      {dayEvents[0].label}
                    </p>
                  )}
                  {dayEvents.length > 1 && (
                    <span className="hidden md:block text-[9px] text-muted-foreground/60">
                      +{dayEvents.length - 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Sidebar — events for month or selected day */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* Selected day detail */}
          {selectedDate && (
            <div className="rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
              <h3 className="font-heading text-sm font-semibold text-foreground mb-3">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  Aucun evenement ce jour
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((ev, i) => {
                    const colors = EVENT_COLORS[ev.type];
                    const Icon = EVENT_ICONS[ev.type];
                    return (
                      <div key={`${ev.date}-${i}`} className={`flex items-start gap-2 rounded-lg p-2 ${colors.bg}`}>
                        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colors.text}`} />
                        <span className={`text-xs font-medium ${colors.text}`}>{ev.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Month events list */}
          <div className="rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
            <h3 className="font-heading text-sm font-semibold text-foreground mb-3">
              Evenements - {MONTHS_FR[month]}
            </h3>
            {monthEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">Aucun evenement ce mois</p>
            ) : (
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {monthEvents.map((ev, i) => {
                  const colors = EVENT_COLORS[ev.type];
                  const Icon = EVENT_ICONS[ev.type];
                  const dayNum = parseInt(ev.date.split("-")[2], 10);
                  return (
                    <button
                      key={`${ev.date}-${ev.label}-${i}`}
                      onClick={() => setSelectedDate(ev.date)}
                      className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted/40
                        ${ev.date === selectedDate ? "ring-1 ring-primary/30" : ""}
                      `}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                        <Icon className={`h-4 w-4 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{ev.label}</p>
                        <p className="text-[10px] text-muted-foreground">{dayNum} {MONTHS_FR[month]}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming exams */}
          {examens.length > 0 && (
            <div className="rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
              <h3 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-red-500" />
                Examens
              </h3>
              <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
                {examens.slice(0, 10).map((ex) => (
                  <div key={ex.id} className="flex items-center gap-2 rounded-lg bg-red-50 px-2.5 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-red-700 truncate">{ex.name}</p>
                      <p className="text-[10px] text-red-500/70">{ex.moduleName} - {ex.classeName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
