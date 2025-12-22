import { createContext, useContext, useEffect, useState } from "react";

// criação do contexto
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // estado inicial: busca no localStorage ou verifica preferência do sistema operacional
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // se não houver salvo, checa a preferência do dispositivo/sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // efeito para aplicar/remover a classe .dark no elemento raiz (html)
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // função para alternar o tema
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// hook personalizado para facilitar o uso nos componentes
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};