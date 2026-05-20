import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { storage } from "@/utils/storage";
import type { School } from "@/types/school";

const SCHOOL_KEY = "selectedSchool";

interface SchoolContextType {
  school: School | null;
  isLoading: boolean;
  selectSchool: (school: School) => Promise<void>;
  clearSchool: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | null>(null);

/**
 * Holds the school selected before login. Persisted so the app reopens
 * straight on the login screen of the last-used school.
 */
export function SchoolProvider({ children }: { children: ReactNode }) {
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the previously selected school on startup
  useEffect(() => {
    (async () => {
      try {
        const stored = await storage.getItem(SCHOOL_KEY);
        if (stored) setSchool(JSON.parse(stored) as School);
      } catch {
        /* corrupted value — fall back to the school picker */
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const selectSchool = useCallback(async (next: School) => {
    await storage.setItem(SCHOOL_KEY, JSON.stringify(next));
    setSchool(next);
  }, []);

  const clearSchool = useCallback(async () => {
    await storage.deleteItem(SCHOOL_KEY);
    setSchool(null);
  }, []);

  return (
    <SchoolContext.Provider value={{ school, isLoading, selectSchool, clearSchool }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error("useSchool must be used within SchoolProvider");
  return ctx;
}
