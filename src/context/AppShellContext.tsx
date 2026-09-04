import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/* Fecha simulada del sistema (mockup). No se usa new Date() para mantener
   consistencia en capturas y demostraciones. */
export const FECHA_SIMULADA = "2026-09-01";

/**
 * Contexto global minimo, compartido por TODOS los modulos.
 * Cada modulo maneja su propio estado de datos/formularios localmente
 * (igual que en el desarrollo real: cada pagina real consume su propio
 * servicio y guarda su estado con useState), tal como Agenda.tsx,
 * Personas.tsx, Parroquias.tsx, Usuarios.tsx y Celebraciones.tsx en el
 * proyecto principal. Aqui solo viven las cosas verdaderamente
 * transversales: fecha simulada, usuario de la sesion y el rol activo
 * (para demostrar la visibilidad condicional de Parroquias/Usuarios que
 * existe en el sidebar real: solo Administrador/Sacerdote/Parroco las ven).
 */
interface AppShellContextValue {
  usuario: string;
  esAdmin: boolean;
  setEsAdmin: (v: boolean) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [esAdmin, setEsAdmin] = useState(true);

  const value = useMemo<AppShellContextValue>(
    () => ({ usuario: "Secretaría parroquial", esAdmin, setEsAdmin }),
    [esAdmin],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell(): AppShellContextValue {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell debe usarse dentro de <AppShellProvider>");
  return ctx;
}
