import { createContext, useContext, useState, type ReactNode } from "react";

type CarnetSelection = {
  niveauId: number;
  classeId: number;
  trimestre: number;
  moduleId: number;
  examenId: number;
  setNiveauId: (id: number) => void;
  setClasseId: (id: number) => void;
  setTrimestre: (t: number) => void;
  setModuleId: (id: number) => void;
  setExamenId: (id: number) => void;
  goToTab: (tab: string) => void;
};

const CarnetSelectionCtx = createContext<CarnetSelection | null>(null);

export function CarnetSelectionProvider({
  children,
  goToTab,
}: {
  children: ReactNode;
  goToTab: (tab: string) => void;
}) {
  const [niveauId, setNiveauIdRaw] = useState<number>(0);
  const [classeId, setClasseIdRaw] = useState<number>(0);
  const [trimestre, setTrimestreRaw] = useState<number>(0);
  const [moduleId, setModuleIdRaw] = useState<number>(0);
  const [examenId, setExamenId] = useState<number>(0);

  // Cascading resets — changing a parent invalidates its children selections
  const setNiveauId = (id: number) => {
    setNiveauIdRaw(id);
    setClasseIdRaw(0);
    setModuleIdRaw(0);
    setExamenId(0);
  };
  const setClasseId = (id: number) => {
    setClasseIdRaw(id);
    setExamenId(0);
  };
  const setTrimestre = (t: number) => {
    setTrimestreRaw(t);
    setExamenId(0);
  };
  const setModuleId = (id: number) => {
    setModuleIdRaw(id);
    setExamenId(0);
  };

  return (
    <CarnetSelectionCtx.Provider
      value={{
        niveauId, classeId, trimestre, moduleId, examenId,
        setNiveauId, setClasseId, setTrimestre, setModuleId, setExamenId,
        goToTab,
      }}
    >
      {children}
    </CarnetSelectionCtx.Provider>
  );
}

export function useCarnetSelection(): CarnetSelection {
  const ctx = useContext(CarnetSelectionCtx);
  if (!ctx) throw new Error("useCarnetSelection must be used inside <CarnetSelectionProvider>");
  return ctx;
}
