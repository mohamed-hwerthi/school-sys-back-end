import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { storage } from "@/utils/storage";
import { CURRENT_SCHOOL_YEAR } from "@/constants/schoolYear";

interface SchoolYearContextType {
  year: string;
  setYear: (year: string) => Promise<void>;
}

const SchoolYearContext = createContext<SchoolYearContextType | null>(null);
const STORAGE_KEY = "schoolYear";

/** Holds the currently selected school year. Persisted so it survives reloads. */
export function SchoolYearProvider({ children }: { children: ReactNode }) {
  const [year, setYearState] = useState<string>(CURRENT_SCHOOL_YEAR);

  useEffect(() => {
    (async () => {
      const stored = await storage.getItem(STORAGE_KEY);
      if (stored) setYearState(stored);
    })();
  }, []);

  const setYear = useCallback(async (next: string) => {
    await storage.setItem(STORAGE_KEY, next);
    setYearState(next);
  }, []);

  return (
    <SchoolYearContext.Provider value={{ year, setYear }}>
      {children}
    </SchoolYearContext.Provider>
  );
}

export function useSchoolYear() {
  const ctx = useContext(SchoolYearContext);
  if (!ctx) throw new Error("useSchoolYear must be used within SchoolYearProvider");
  return ctx;
}
