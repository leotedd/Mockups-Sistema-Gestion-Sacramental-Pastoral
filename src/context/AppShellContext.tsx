import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/* Fecha simulada del sistema (mockup). No se usa new Date() para mantener
   consistencia en capturas y demostraciones. */
export const FECHA_SIMULADA = "2026-09-01";

/** Clave de almacenamiento local exclusiva de este mockup (no interfiere con
   el localStorage del proyecto real, que usa otras claves). */
const CLAVE_SESION = "mockup_parroquial_sesion";

/**
 * Contexto global minimo, compartido por TODOS los modulos.
 * Cada modulo maneja su propio estado de datos/formularios localmente
 * (igual que en el desarrollo real: cada pagina real consume su propio
 * servicio y guarda su estado con useState), tal como Agenda.tsx,
 * Personas.tsx, Parroquias.tsx, Usuarios.tsx y Celebraciones.tsx en el
 * proyecto principal. Aqui solo viven las cosas verdaderamente
 * transversales: fecha simulada, sesion ficticia (Login/Cerrar sesion),
 * usuario de la sesion y el rol activo (para demostrar la visibilidad
 * condicional de Parroquias/Usuarios que existe en el sidebar real: solo
 * Administrador/Sacerdote/Parroco las ven).
 *
 * La sesion es puramente visual: NO hay backend, NO hay JWT, NO hay
 * validacion real. Solo se guarda un nombre de usuario en localStorage para
 * que la sesion "ficticia" sobreviva a un refresco de pagina durante la
 * revision, igual de simple que el resto del mockup.
 */
interface AppShellContextValue {
  autenticado: boolean;
  usuario: string;
  esAdmin: boolean;
  setEsAdmin: (v: boolean) => void;
  iniciarSesion: (usuario: string) => void;
  cerrarSesion: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [esAdmin, setEsAdmin] = useState(true);
  const [usuario, setUsuario] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CLAVE_SESION);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (usuario) localStorage.setItem(CLAVE_SESION, usuario);
      else localStorage.removeItem(CLAVE_SESION);
    } catch {
      /* almacenamiento no disponible: la sesion simplemente no persiste entre recargas */
    }
  }, [usuario]);

  const value = useMemo<AppShellContextValue>(
    () => ({
      autenticado: usuario !== null,
      usuario: usuario ?? "",
      esAdmin,
      setEsAdmin,
      iniciarSesion: (nombre: string) => setUsuario(nombre),
      cerrarSesion: () => setUsuario(null),
    }),
    [usuario, esAdmin],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell(): AppShellContextValue {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell debe usarse dentro de <AppShellProvider>");
  return ctx;
}
