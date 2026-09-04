import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarRange,
  Church,
  Home,
  LogOut,
  Sparkles,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { useAppShell } from "../../context/AppShellContext";

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

interface ModuloItem {
  id: ModuloId;
  etiqueta: string;
  icono: ReactNode;
  ruta: string;
  soloAdmin?: boolean;
}

const MODULOS: ModuloItem[] = [
  { id: "agenda", etiqueta: "Agenda", icono: <CalendarRange size={16} />, ruta: "/agenda" },
  { id: "personas", etiqueta: "Personas", icono: <Users size={16} />, ruta: "/personas" },
  { id: "parroquias", etiqueta: "Parroquias", icono: <Church size={16} />, ruta: "/parroquias", soloAdmin: true },
  { id: "usuarios", etiqueta: "Usuarios", icono: <UserCog size={16} />, ruta: "/usuarios", soloAdmin: true },
  { id: "familias", etiqueta: "Familias", icono: <Home size={16} />, ruta: "/familias" },
  { id: "catequesis", etiqueta: "Catequesis", icono: <BookOpen size={16} />, ruta: "/catequesis" },
  { id: "sacramental", etiqueta: "Sacramental", icono: <Church size={16} />, ruta: "/sacramental" },
  { id: "economico", etiqueta: "Económico", icono: <Wallet size={16} />, ruta: "/economico" },
  { id: "celebraciones", etiqueta: "Celebraciones", icono: <Sparkles size={16} />, ruta: "/celebraciones" },
];

interface Props {
  moduloActivo: ModuloId;
  /** Contenido especifico del modulo activo (estadisticas, filtros de vista, etc.). */
  panelSuperior?: ReactNode;
  onCerrarSesion: () => void;
}

/**
 * Sidebar global, compartido por todos los modulos (equivalente a
 * components/Sidebar.tsx del desarrollo real). Diferencias frente al
 * mockup original: incluye Parroquias y Usuarios (visibles solo para
 * Administrador/Sacerdote/Párroco, igual que en el sistema real) y ya NO
 * incluye "Directorio" (nunca se desarrolló). El interruptor de rol de
 * abajo es solo una ayuda de este mockup para demostrar esa visibilidad
 * condicional.
 */
export function Sidebar({ moduloActivo, panelSuperior, onCerrarSesion }: Props) {
  const navigate = useNavigate();
  const { esAdmin, setEsAdmin } = useAppShell();

  const modulos = MODULOS.filter((m) => !m.soloAdmin || esAdmin);

  return (
    <nav className="sidebar">
      {panelSuperior && <div className="sidebar__panel">{panelSuperior}</div>}

      <div className="sidebar__title">MÓDULOS</div>
      <div className="sidebar__list">
        {modulos.map((m) => (
          <button
            key={m.id}
            className={`sidebar__item ${m.id === moduloActivo ? "sidebar__item--active" : ""}`}
            onClick={() => navigate(m.ruta)}
          >
            {m.icono}
            {m.etiqueta}
          </button>
        ))}
      </div>

      <div className="role-switch">
        <span>Ver como:</span>
        <select value={esAdmin ? "admin" : "estandar"} onChange={(e) => setEsAdmin(e.target.value === "admin")}>
          <option value="admin">Administrador/Sacerdote</option>
          <option value="estandar">Secretaría (estándar)</option>
        </select>
      </div>

      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={onCerrarSesion}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
