import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { Appearance } from "react-native";
import { storage } from "@/utils/storage";
import { LIGHT_COLORS, DARK_COLORS, type ColorPalette } from "@/constants/theme";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  /** The resolved scheme (always "light" or "dark", never "system"). */
  scheme: "light" | "dark";
  colors: ColorPalette;
  setMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
const STORAGE_KEY = "themeMode";

function resolveScheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  return Appearance.getColorScheme() === "dark" ? "dark" : "light";
}

/** Holds the currently selected colour scheme and exposes the resolved palette. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [scheme, setScheme] = useState<"light" | "dark">("light");

  // Restore the saved preference once on startup.
  useEffect(() => {
    (async () => {
      const stored = (await storage.getItem(STORAGE_KEY)) as ThemeMode | null;
      const initial: ThemeMode = stored === "dark" || stored === "system" || stored === "light" ? stored : "light";
      setModeState(initial);
      setScheme(resolveScheme(initial));
    })();
  }, []);

  // Follow OS changes when mode === "system".
  useEffect(() => {
    if (mode !== "system") return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, [mode]);

  const setMode = useCallback(async (next: ThemeMode) => {
    await storage.setItem(STORAGE_KEY, next);
    setModeState(next);
    setScheme(resolveScheme(next));
  }, []);

  const colors = scheme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ mode, scheme, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
