import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  Church,
  Home,
  LogOut,
  Sparkles,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

export type ModuloId =
  | "agenda"
  | "personas"
  | "familias"
  | "catequesis"
  | "sacramental"
  | "economico"
  | "celebraciones"
  | "parroquias"
  | "usuarios";

/**
 * Props de navegación del Sidebar: reproduce EXACTAMENTE la forma de
 * components/Sidebar.tsx del desarrollo real (callbacks `onAbrirX` provistos
 * por App.tsx, que cambia un estado `vista` en memoria — NO hay React
 * Router para moverse entre módulos en el sistema real, por lo que el
 * mockup ya tampoco lo usa). Los 5 módulos que sí existen en el sistema
 * real (Agenda, Personas, Celebraciones, Parroquias, Usuarios) reproducen
 * ese mismo contrato de props uno a uno.
 *
 * Familias, Catequesis, Sacramental y Económico NO tienen pantalla en el
 * desarrollo real todavía (en el Sidebar real aparecen sin `onClick`, como
 * elementos inertes). Este mockup SÍ los deja navegables porque ya fueron
 * diseñados y aprobados como anticipo visual de esos módulos — es la única
 * desviación deliberada respecto al Sidebar real.
 */
export interface SidebarNavProps {
  onNavegarAgenda: () => void;
  onAbrirPersonas: () => void;
  onAbrirFamilias: () => void;
  onAbrirCatequesis: () => void;
  onAbrirSacramental: () => void;
  onAbrirEconomico: () => void;
  onAbrirCelebraciones: () => void;
  onAbrirParroquias: () => void;
  onAbrirUsuarios: () => void;
}

interface ModuloItem {
  id: ModuloId;
  etiqueta: string;
  icono: ReactNode;
  onClick: () => void;
  visible: boolean;
}

interface Props extends SidebarNavProps {
  moduloActivo: ModuloId;
  /** Solo Administrador/Sacerdote/Párroco ven Parroquias y Usuarios (igual que en el Sidebar real). */
  esAdminOSacerdote: boolean;
  /** Contenido especifico del modulo activo (estadisticas, filtros de vista, etc.). */
  panelSuperior?: ReactNode;
  onCerrarSesion: () => void;
}

/**
 * Sidebar global, compartido por todos los modulos (equivalente 1:1 a
 * components/Sidebar.tsx del desarrollo real, incluida su forma de props).
 */
export function Sidebar({
  moduloActivo,
  esAdminOSacerdote,
  onNavegarAgenda,
  onAbrirPersonas,
  onAbrirFamilias,
  onAbrirCatequesis,
  onAbrirSacramental,
  onAbrirEconomico,
  onAbrirCelebraciones,
  onAbrirParroquias,
  onAbrirUsuarios,
  onCerrarSesion,
  panelSuperior,
}: Props) {
  const modulos: ModuloItem[] = [
    { id: "agenda" as const, etiqueta: "Agenda", icono: <CalendarDays size={16} />, onClick: onNavegarAgenda, visible: true },
    { id: "personas" as const, etiqueta: "Personas", icono: <Users size={16} />, onClick: onAbrirPersonas, visible: true },
    { id: "parroquias" as const, etiqueta: "Parroquias", icono: <Church size={16} />, onClick: onAbrirParroquias, visible: esAdminOSacerdote },
    { id: "usuarios" as const, etiqueta: "Usuarios", icono: <UserCog size={16} />, onClick: onAbrirUsuarios, visible: esAdminOSacerdote },
    { id: "familias" as const, etiqueta: "Familias", icono: <Home size={16} />, onClick: onAbrirFamilias, visible: true },
    { id: "catequesis" as const, etiqueta: "Catequesis", icono: <BookOpen size={16} />, onClick: onAbrirCatequesis, visible: true },
    { id: "sacramental" as const, etiqueta: "Sacramental", icono: <Church size={16} />, onClick: onAbrirSacramental, visible: true },
    { id: "economico" as const, etiqueta: "Económico", icono: <Wallet size={16} />, onClick: onAbrirEconomico, visible: true },
    { id: "celebraciones" as const, etiqueta: "Celebraciones", icono: <Sparkles size={16} />, onClick: onAbrirCelebraciones, visible: true },
  ].filter((m) => m.visible);

  return (
    <nav className="sidebar">
      {panelSuperior && <div className="sidebar__panel">{panelSuperior}</div>}

      <div className="sidebar__title">MÓDULOS</div>
      <div className="sidebar__list">
        {modulos.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`sidebar__item ${m.id === moduloActivo ? "sidebar__item--active" : ""}`}
            onClick={m.onClick}
          >
            {m.icono}
            {m.etiqueta}
          </button>
        ))}
      </div>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__logout" onClick={onCerrarSesion}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
