import type { ReactNode } from "react";
import {
  Briefcase,
  Calendar,
  CalendarDays,
  CalendarRange,
  FilePlus2,
  FolderOpen,
  HandHeart,
  List,
  RefreshCw,
  Sparkles,
  Sun,
  Trash2,
  UserPlus,
} from "lucide-react";
import type { ModoCelebraciones, VistaCalendarioCelebraciones, VistaCelebraciones } from "../../data/types";

interface Props {
  modo: ModoCelebraciones;
  vista: VistaCelebraciones;
  vistaCalendario: VistaCalendarioCelebraciones;
  celebracionSeleccionada: string | null;
  onAbrir: () => void;
  onNuevo: () => void;
  onEliminar: () => void;
  onActualizar: () => void;
  onCambiarVista: (v: VistaCelebraciones) => void;
  onCambiarVistaCalendario: (v: VistaCalendarioCelebraciones) => void;
  onHoy: () => void;
  onIrAListado: () => void;
  onAgregarCelebrante: () => void;
  onAgregarIntencion: () => void;
}

function RibbonButton({
  icono,
  etiqueta,
  onClick,
  disabled,
  activo,
}: {
  icono: ReactNode;
  etiqueta: string;
  onClick: () => void;
  disabled?: boolean;
  activo?: boolean;
}) {
  return (
    <button className={`rbtn ${activo ? "rbtn--active" : ""}`} onClick={onClick} disabled={disabled}>
      {icono}
      {etiqueta}
    </button>
  );
}

const VISTAS_CALENDARIO: Array<{ valor: VistaCalendarioCelebraciones; etiqueta: string; icono: ReactNode }> = [
  { valor: "dia", etiqueta: "Día", icono: <Calendar size={18} /> },
  { valor: "laboral", etiqueta: "Laboral", icono: <Briefcase size={18} /> },
  { valor: "semana", etiqueta: "Semana", icono: <CalendarDays size={18} /> },
  { valor: "mes", etiqueta: "Mes", icono: <CalendarRange size={18} /> },
];

/**
 * Ribbon EXCLUSIVO de Celebraciones: reproduce components/celebraciones/
 * CelebracionesRibbon.tsx del desarrollo real. A diferencia del ribbon
 * generico (Agenda, Personas, ...), aqui la pestaña NO es seleccionable por
 * el usuario: su etiqueta cambia sola segun el modo activo, y ya no existe
 * una pestaña "Impresión" (la impresión de Celebraciones todavía no está
 * implementada en el sistema real). El grupo "Otras acciones" del mockup
 * original se renombró a "Registro", y aparece un grupo adicional
 * "Organizar vista" + "Ir a" solo cuando la vista activa es Calendario.
 */
export function CelebracionesRibbon({
  modo,
  vista,
  vistaCalendario,
  celebracionSeleccionada,
  onAbrir,
  onNuevo,
  onEliminar,
  onActualizar,
  onCambiarVista,
  onCambiarVistaCalendario,
  onHoy,
  onIrAListado,
  onAgregarCelebrante,
  onAgregarIntencion,
}: Props) {
  const enContenidoPrincipal = modo === "listado";
  const enCalendario = enContenidoPrincipal && vista === "calendario";
  const etiquetaPestana =
    modo === "nuevo"
      ? "Nueva celebración"
      : modo === "editar"
        ? "Editar celebración"
        : modo === "detalle"
          ? "Detalle de celebración"
          : "Inicio";

  return (
    <header className="ribbon">
      <div className="topbar">
        <span className="topbar__brand">
          <Sparkles size={18} />
          Celebraciones parroquiales
        </span>
        <span className="topbar__parish">Parroquia Santa Cruz · Chiquimulilla</span>
      </div>

      <div className="ribbon__tabs">
        <span className="ribbon__tab ribbon__tab--active" style={{ cursor: "default" }}>
          {etiquetaPestana}
        </span>
      </div>

      <div className="ribbon__panels">
        <div className="ribbon-group">
          <div className="ribbon-group__actions">
            <RibbonButton icono={<FolderOpen size={18} />} etiqueta="Abrir" onClick={onAbrir} disabled={!enContenidoPrincipal || !celebracionSeleccionada} />
            <RibbonButton icono={<FilePlus2 size={18} />} etiqueta="Nuevo" onClick={onNuevo} />
            <RibbonButton icono={<Trash2 size={18} />} etiqueta="Eliminar" onClick={onEliminar} disabled={!enContenidoPrincipal || !celebracionSeleccionada} />
            <RibbonButton icono={<RefreshCw size={18} />} etiqueta="Actualizar" onClick={onActualizar} disabled={!enContenidoPrincipal} />
          </div>
          <div className="ribbon-group__label">Acciones</div>
        </div>

        <div className="ribbon-group">
          <div className="ribbon-group__actions">
            <RibbonButton icono={<List size={18} />} etiqueta="Listado" onClick={onIrAListado} activo={enContenidoPrincipal && vista === "listado"} />
            <RibbonButton icono={<CalendarRange size={18} />} etiqueta="Calendario" onClick={() => onCambiarVista("calendario")} activo={enCalendario} />
          </div>
          <div className="ribbon-group__label">Vistas</div>
        </div>

        {enCalendario && (
          <>
            <div className="ribbon-group">
              <div className="ribbon-group__actions">
                {VISTAS_CALENDARIO.map(({ valor, etiqueta, icono }) => (
                  <RibbonButton key={valor} icono={icono} etiqueta={etiqueta} onClick={() => onCambiarVistaCalendario(valor)} activo={vistaCalendario === valor} />
                ))}
              </div>
              <div className="ribbon-group__label">Organizar vista</div>
            </div>
            <div className="ribbon-group">
              <div className="ribbon-group__actions">
                <RibbonButton icono={<Sun size={18} />} etiqueta="Hoy" onClick={onHoy} />
              </div>
              <div className="ribbon-group__label">Ir a</div>
            </div>
          </>
        )}

        <div className="ribbon-group">
          <div className="ribbon-group__actions">
            <RibbonButton icono={<UserPlus size={18} />} etiqueta="Celebrante" onClick={onAgregarCelebrante} disabled={!enContenidoPrincipal || !celebracionSeleccionada} />
            <RibbonButton icono={<HandHeart size={18} />} etiqueta="Intención" onClick={onAgregarIntencion} disabled={!enContenidoPrincipal} />
          </div>
          <div className="ribbon-group__label">Registro</div>
        </div>
      </div>
    </header>
  );
}
