import { useRef, useState } from "react";
import {
  Briefcase,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Eye,
  FilePlus2,
  FolderOpen,
  Printer,
  RefreshCw,
  Settings2,
  Sun,
  Trash2,
} from "lucide-react";
import { CITAS_SEED, type Cita, type VistaAgenda, PRIORIDADES } from "../data/agenda";
import { COLOR_PRIORIDAD } from "../data/agenda";
import { FECHA_SIMULADA, useAppShell } from "../context/AppShellContext";
import { capitalizar, formatFecha, nombreMesAnio, parseISO, toISO } from "../utils/format";
import { esMismoDia, esMismoMes, sumarDias } from "../utils/calendario";
import { Sidebar, type SidebarNavProps } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { MiniCalendar } from "../components/ui/MiniCalendar";
import { AgendaVista } from "../components/agenda/AgendaVista";
import { CitaFormDialog } from "../components/agenda/CitaFormDialog";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { PrintPreviewDialog } from "../components/ui/PrintPreviewDialog";
import { PageSetupDialog, type ConfiguracionImpresion } from "../components/ui/PageSetupDialog";

const ETIQUETA_VISTA: Record<VistaAgenda, string> = { dia: "Día", laboral: "Laboral", semana: "Semana", mes: "Mes" };

function inicioSemana(d: Date) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); return r; }
function tituloRango(vista: VistaAgenda, f: Date): string {
  if (vista === "dia") return capitalizar(formatFecha(toISO(f)));
  if (vista === "mes") return nombreMesAnio(f);
  const ini = vista === "laboral" ? (() => { const d = inicioSemana(f); d.setDate(d.getDate() + 1); return d; })() : inicioSemana(f);
  const fin = new Date(ini); fin.setDate(fin.getDate() + (vista === "laboral" ? 4 : 6));
  return `${formatFecha(toISO(ini))} – ${formatFecha(toISO(fin))}`;
}

type Dialogo = "cita" | "confirmarEliminar" | "confirmarCerrarSesion" | "vistaPrevia" | "configPagina" | null;

interface Props extends SidebarNavProps {
  onCerrarSesion: () => void;
}

/**
 * Módulo Agenda — reproduce pages/Agenda.tsx del desarrollo real (ribbon
 * genérico con pestañas Inicio/Impresión, sidebar con panel de calendarios
 * visibles, vistas Día/Laboral/Semana/Mes, impresión SÍ implementada). La
 * navegación entre módulos llega por props (`onAbrirX`), igual que en el
 * sistema real: App.tsx decide qué módulo mostrar con un estado en
 * memoria, no con rutas de navegador.
 */
export function Agenda({ onCerrarSesion, ...nav }: Props) {
  const { usuario, esAdmin } = useAppShell();
  const [citas, setCitas] = useState<Cita[]>(CITAS_SEED);
  const [vista, setVista] = useState<VistaAgenda>("semana");
  const [fechaActual, setFechaActual] = useState(() => parseISO(FECHA_SIMULADA));
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const [officeEclesial, setOfficeEclesial] = useState(true);
  const [liturgico, setLiturgico] = useState(false);

  const [pestana, setPestana] = useState("inicio");
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [citaEnEdicion, setCitaEnEdicion] = useState<Cita | null>(null);
  const [config, setConfig] = useState<ConfiguracionImpresion>({ orientacion: "horizontal", sombreado: true });
  const nextIdRef = useRef(200);
  const nextId = () => `ag-${++nextIdRef.current}`;

  const citasVisibles = officeEclesial ? citas : [];

  const editar = (id: string) => { const c = citas.find((x) => x.id === id); if (c) { setCitaEnEdicion(c); setDialogo("cita"); } };
  const guardarCita = (c: Cita) => {
    setCitas((l) => (l.some((x) => x.id === c.id) ? l.map((x) => (x.id === c.id ? c : x)) : [c, ...l]));
    setDialogo(null);
    setMensajeEstado(citaEnEdicion ? "Cita actualizada." : "Cita creada.");
  };
  const eliminarCita = () => {
    if (!seleccionada) return;
    setCitas((l) => l.filter((c) => c.id !== seleccionada));
    setSeleccionada(null);
    setDialogo(null);
    setMensajeEstado("Cita eliminada.");
  };

  const pestanas: RibbonPestanaConfig[] = [
    {
      id: "inicio", etiqueta: "Inicio",
      grupos: [
        { etiqueta: "Acciones", botones: [
          { etiqueta: "Abrir", icono: <FolderOpen size={18} />, onClick: () => seleccionada && editar(seleccionada), disabled: !seleccionada },
          { etiqueta: "Nuevo", icono: <FilePlus2 size={18} />, onClick: () => { setCitaEnEdicion(null); setDialogo("cita"); } },
          { etiqueta: "Eliminar", icono: <Trash2 size={18} />, onClick: () => setDialogo("confirmarEliminar"), disabled: !seleccionada },
          { etiqueta: "Actualizar", icono: <RefreshCw size={18} />, onClick: () => setMensajeEstado("Agenda actualizada.") },
        ]},
        { etiqueta: "Organizar vista", botones: [
          { etiqueta: "Día", icono: <Calendar size={18} />, onClick: () => setVista("dia"), activo: vista === "dia" },
          { etiqueta: "Laboral", icono: <Briefcase size={18} />, onClick: () => setVista("laboral"), activo: vista === "laboral" },
          { etiqueta: "Semana", icono: <CalendarDays size={18} />, onClick: () => setVista("semana"), activo: vista === "semana" },
          { etiqueta: "Mes", icono: <CalendarRange size={18} />, onClick: () => setVista("mes"), activo: vista === "mes" },
        ]},
        { etiqueta: "Ir a", botones: [{ etiqueta: "Hoy", icono: <Sun size={18} />, onClick: () => setFechaActual(parseISO(FECHA_SIMULADA)) }] },
      ],
    },
    {
      id: "impresion", etiqueta: "Impresión",
      grupos: [{ etiqueta: "Impresión", botones: [
        { etiqueta: "Imprimir", icono: <Printer size={18} />, onClick: () => window.print() },
        { etiqueta: "Vista previa", icono: <Eye size={18} />, onClick: () => setDialogo("vistaPrevia") },
        { etiqueta: "Config. página", icono: <Settings2 size={18} />, onClick: () => setDialogo("configPagina") },
      ]}],
    },
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Agenda parroquial" iconoModulo={<CalendarCheck size={20} />} subtitulo="Parroquia Santa Cruz · Chiquimulilla" pestanas={pestanas} pestanaActiva={pestana} onCambiarPestana={setPestana} />

      <div className="app-body">
        <Sidebar
          {...nav}
          moduloActivo="agenda"
          esAdminOSacerdote={esAdmin}
          onCerrarSesion={() => setDialogo("confirmarCerrarSesion")}
          panelSuperior={
            <>
              <MiniCalendar
                fechaActual={fechaActual}
                estaResaltado={(dia) => {
                  if (vista === "dia") return esMismoDia(dia, fechaActual);
                  if (vista === "mes") return esMismoMes(dia, fechaActual);
                  const ini = inicioSemana(fechaActual);
                  const finSemana = sumarDias(ini, vista === "laboral" ? 4 : 6);
                  return dia.getTime() >= ini.getTime() && dia.getTime() <= finSemana.getTime();
                }}
                onSeleccionarDia={(dia) => { setFechaActual(dia); setVista("dia"); }}
              />
              <div className="sidebar__panel-title">AGENDA</div>
              <div className="sidebar__panel-body">
                <label className="side-stat" style={{ cursor: "pointer" }}>
                  <span className="side-stat__label"><span className="side-stat__dot" style={{ background: "var(--dorado)" }} />Office Eclesial</span>
                  <input type="checkbox" checked={officeEclesial} onChange={() => setOfficeEclesial((v) => !v)} />
                </label>
                <label className="side-stat" style={{ cursor: "pointer" }}>
                  <span className="side-stat__label"><span className="side-stat__dot" style={{ background: "var(--linea-fuerte)" }} />Calendario litúrgico</span>
                  <input type="checkbox" checked={liturgico} onChange={() => setLiturgico((v) => !v)} />
                </label>
              </div>
            </>
          }
        />

        <main className="main">
          <div className="page" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 130px)" }}>
            <div className="page__head">
              <div className="cal__nav">
                <button className="link-btn" onClick={() => { const d = new Date(fechaActual); if (vista === "dia") d.setDate(d.getDate() - 1); else if (vista === "mes") d.setMonth(d.getMonth() - 1); else d.setDate(d.getDate() - 7); setFechaActual(d); }}><ChevronLeft size={16} /></button>
                <h1 className="page__title" style={{ minWidth: 240 }}>{tituloRango(vista, fechaActual)}</h1>
                <button className="link-btn" onClick={() => { const d = new Date(fechaActual); if (vista === "dia") d.setDate(d.getDate() + 1); else if (vista === "mes") d.setMonth(d.getMonth() + 1); else d.setDate(d.getDate() + 7); setFechaActual(d); }}><ChevronRight size={16} /></button>
                <span className="tag-count">Vista: {ETIQUETA_VISTA[vista]}</span>
              </div>
              <div className="cal__legend" style={{ flexDirection: "row", gap: 12 }}>
                {PRIORIDADES.map((p) => (
                  <span key={p} className="cal__legend-item"><i className="cal__legend-dot" style={{ background: COLOR_PRIORIDAD[p], borderLeftColor: COLOR_PRIORIDAD[p] }} />{p}</span>
                ))}
              </div>
            </div>
            <div className="page__body" style={{ flex: 1 }}>
              <AgendaVista citas={citasVisibles} vista={vista} cursor={fechaActual} citaSeleccionadaId={seleccionada} onSeleccionar={setSeleccionada} onEditar={editar} />
            </div>
          </div>
        </main>
      </div>

      <StatusBar contadorTexto={`${citas.length} citas en la agenda`} mensajeEstado={mensajeEstado} usuario={usuario} />

      {dialogo === "cita" && <CitaFormDialog cita={citaEnEdicion} fechaSugerida={toISO(fechaActual)} onGuardar={guardarCita} onCancelar={() => setDialogo(null)} nextId={nextId} />}
      {dialogo === "confirmarEliminar" && (
        <ConfirmDialog titulo="Eliminar cita" mensaje="Esta acción no se puede deshacer. ¿Deseas eliminar la cita seleccionada?" textoConfirmar="Eliminar" tono="alerta" onConfirmar={eliminarCita} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "confirmarCerrarSesion" && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={onCerrarSesion} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "vistaPrevia" && (
        <PrintPreviewDialog
          titulo="Agenda parroquial"
          subtitulo={tituloRango(vista, fechaActual)}
          encabezados={["Fecha", "Hora", "Asunto", "Lugar", "Prioridad"]}
          filas={citasVisibles.map((c) => [formatFecha(c.inicio.slice(0, 10)), c.inicio.slice(11, 16), c.asunto, c.lugar, c.prioridad])}
          onImprimir={() => window.print()}
          onCancelar={() => setDialogo(null)}
        />
      )}
      {dialogo === "configPagina" && <PageSetupDialog configuracion={config} onGuardar={(c) => { setConfig(c); setDialogo(null); }} onCancelar={() => setDialogo(null)} />}
    </div>
  );
}
