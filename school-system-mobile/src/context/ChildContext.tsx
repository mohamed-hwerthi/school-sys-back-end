import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { parentPortalApi } from "@/api/parent-portal.api";
import { useAuth } from "@/context/AuthContext";

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  classe: string;
  classeId: string;
  niveau: string;
  matricule: string;
  status: string;
}

interface ChildContextType {
  children: Child[];
  selectedChild: Child | null;
  selectChild: (child: Child) => void;
  isLoading: boolean;
  refetch: () => void;
}

const ChildContext = createContext<ChildContextType | null>(null);

export function ChildProvider({ children: childrenNode }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const { data: childrenData = [], isLoading, refetch } = useQuery({
    queryKey: ["children"],
    queryFn: parentPortalApi.getChildren,
    enabled: user?.role === "PARENT",
  });

  // Auto-select first child
  useEffect(() => {
    if (childrenData.length > 0 && !selectedChild) {
      setSelectedChild(childrenData[0]);
    }
  }, [childrenData]);

  return (
    <ChildContext.Provider value={{
      children: childrenData,
      selectedChild,
      selectChild: setSelectedChild,
      isLoading,
      refetch,
    }}>
      {childrenNode}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const ctx = useContext(ChildContext);
  if (!ctx) throw new Error("useChild must be used within ChildProvider");
  return ctx;
}
