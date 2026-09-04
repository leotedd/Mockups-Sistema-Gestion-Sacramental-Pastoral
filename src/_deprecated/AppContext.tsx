import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Celebracion } from "../data/types";
import { CELEBRACIONES_SEED } from "../data/mockCelebraciones";

/* Fecha simulada del sistema (mockup). No se usa new Date() para mantener
   consistencia en capturas y demostraciones. */
export const FECHA_SIMULADA = "2026-09-01";

export type ToastTipo = "success" | "error" | "info";
export interface Toast {
  id: number;
  tipo: ToastTipo;
  titulo: string;
  mensaje?: string;
}

interface AppContextValue {
  celebraciones: Celebracion[];
  getCelebracion: (id: string) => Celebracion | undefined;
  crearCelebracion: (c: Celebracion) => void;
  actualizarCelebracion: (c: Celebracion) => void;
  eliminarCelebracion: (id: string) => void;

  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  toasts: Toast[];
  notificar: (tipo: ToastTipo, titulo: string, mensaje?: string) => void;
  cerrarToast: (id: number) => void;

  status: { registros: number; etiqueta: string };
  setStatus: (registros: number, etiqueta?: string) => void;

  nextId: () => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [celebraciones, setCelebraciones] = useState<Celebracion[]>(CELEBRACIONES_SEED);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [status, setStatusState] = useState<{ registros: number; etiqueta: string }>({
    registros: CELEBRACIONES_SEED.length,
    etiqueta: "celebraciones",
  });
  const counter = useRef(1000);

  const setStatus = useCallback((registros: number, etiqueta = "celebraciones") => {
    setStatusState({ registros, etiqueta });
  }, []);

  const nextId = useCallback(() => {
    counter.current += 1;
    return `cel-${counter.current}`;
  }, []);

  const cerrarToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notificar = useCallback(
    (tipo: ToastTipo, titulo: string, mensaje?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, tipo, titulo, mensaje }]);
      window.setTimeout(() => cerrarToast(id), 4200);
    },
    [cerrarToast]
  );

  const getCelebracion = useCallback(
    (id: string) => celebraciones.find((c) => c.id === id),
    [celebraciones]
  );

  const crearCelebracion = useCallback((c: Celebracion) => {
    setCelebraciones((list) => [c, ...list]);
  }, []);

  const actualizarCelebracion = useCallback((c: Celebracion) => {
    setCelebraciones((list) => list.map((x) => (x.id === c.id ? c : x)));
  }, []);

  const eliminarCelebracion = useCallback((id: string) => {
    setCelebraciones((list) => list.filter((x) => x.id !== id));
    setSelectedId((s) => (s === id ? null : s));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      celebraciones,
      getCelebracion,
      crearCelebracion,
      actualizarCelebracion,
      eliminarCelebracion,
      selectedId,
      setSelectedId,
      toasts,
      notificar,
      cerrarToast,
      status,
      setStatus,
      nextId,
    }),
    [
      celebraciones,
      getCelebracion,
      crearCelebracion,
      actualizarCelebracion,
      eliminarCelebracion,
      selectedId,
      toasts,
      notificar,
      cerrarToast,
      status,
      setStatus,
      nextId,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
