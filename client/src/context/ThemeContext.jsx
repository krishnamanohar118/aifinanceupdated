import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved === "dark" || saved === "light" ? saved : "light";
    } catch {
      return "light";
    }
  });

  const applyTheme = useCallback((nextTheme) => {
    const validTheme = nextTheme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = validTheme;
    document.documentElement.setAttribute("data-theme", validTheme);
    document.documentElement.style.colorScheme = validTheme;
    try {
      localStorage.setItem("theme", validTheme);
    } catch {}
  }, []);

  const setTheme = useCallback(
    (nextTheme) => {
      setThemeState((current) => {
        const resolved =
          typeof nextTheme === "function" ? nextTheme(current) : nextTheme;
        const target = resolved === "dark" ? "dark" : "light";
        applyTheme(target);
        return target;
      });
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, [setTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Synchronize across multiple tabs or windows
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "theme" && (event.newValue === "light" || event.newValue === "dark")) {
        setThemeState(event.newValue);
        applyTheme(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applyTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
