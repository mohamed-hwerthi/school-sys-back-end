/** Day labels indexed by the backend `jourSemaine` (0 = Lundi … 6 = Dimanche). */
export const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

/** Today's index in the `jourSemaine` convention (0 = Lundi). */
export function todayJourSemaine(): number {
  // JS getDay(): 0 = dimanche … 6 = samedi → shift so 0 = lundi.
  return (new Date().getDay() + 6) % 7;
}

/** Formats a backend time ("HH:mm:ss") as "HH:mm"; safe on null/short input. */
export function hhmm(time: string | null | undefined): string {
  return time && time.length >= 5 ? time.slice(0, 5) : "--:--";
}

/** Day label for a `jourSemaine` index, with a fallback for out-of-range values. */
export function dayLabel(jourSemaine: number): string {
  return DAY_NAMES[jourSemaine] ?? `Jour ${jourSemaine}`;
}

/** Formats a Date as a local "yyyy-MM-dd" string (no timezone shift). */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
