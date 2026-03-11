import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import React from "react";
import type { SchoolInfo } from "@/types/school";
import { DEFAULT_SCHOOL_INFO } from "@/data/school";

interface SchoolContextValue {
  school: SchoolInfo;
  updateSchool: (data: Partial<SchoolInfo>) => void;
}

const SchoolContext = createContext<SchoolContextValue | null>(null);

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [school, setSchool] = useState<SchoolInfo>(DEFAULT_SCHOOL_INFO);

  const updateSchool = useCallback((data: Partial<SchoolInfo>) => {
    setSchool((prev) => ({ ...prev, ...data }));
  }, []);

  const value: SchoolContextValue = { school, updateSchool };

  return React.createElement(SchoolContext.Provider, { value }, children);
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return ctx;
}
