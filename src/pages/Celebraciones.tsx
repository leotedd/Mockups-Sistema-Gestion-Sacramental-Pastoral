import { useEffect, useMemo, useRef, useState } from "react";
import { CELEBRACIONES_SEED } from "../data/mockCelebraciones";
import { ESTADOS } from "../data/catalogos";
import type { Celebracion, CelebracionFiltro, ModoCelebraciones, VistaCalendarioCelebraciones, VistaCelebraciones, EstadoCelebracion, Celebrante } from "../data/types";
import { parseISO } from "../utils/format";
import { FECHA_SIMULADA, useAppShell } from "../context/AppShellContext";
import { Sidebar, type SidebarNavProps } from "../components/layout/Sidebar";
import { CelebracionesStatusBar } from "../components/celebraciones/CelebracionesStatusBar";
import { Banner } from "../components/ui/Banner";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { CelebracionesRibbon } from "../components/celebraciones/CelebracionesRibbon";
import { CelebracionesFiltros } from "../components/celebraciones/CelebracionesFiltros";
import { CelebracionesListado, POR_PAGINA } from "../components/celebraciones/CelebracionesListado";
import { CelebracionesCalendario } from "../components/celebraciones/CelebracionesCalendario";
import { CelebracionForm } from "../components/celebraciones/CelebracionForm";
import { CelebracionDetalle } from "../components/celebraciones/CelebracionDetalle";
import { ConfirmarEliminacionModal } from "../components/modals/ConfirmarEliminacionModal";
import { SeleccionarCelebranteModal } from "../components/modals/SeleccionarCelebranteModal";

const FILTRO_VACIO: CelebracionFiltro = { texto: "", desde: "", hasta: "", tipo: "", lugar: "", estado: "" };

function contarPorEstado(lista: Celebracion[]): Record<EstadoCelebracion, number> {
  const base = Object.fromEntries(ESTADOS.map((e) => [e, 0])) as Record<EstadoCelebracion, number>;
  for (const c of lista) base[c.estado] += 1;
  return base;
}

const PUNTO_ESTADO: Record<EstadoCelebracion, string> = {
  Programada: "#1f5f8b",
  Confirmada: "var(--dorado-borde)",
  Realizada: "#8fa88f",
  Cancelada: "var(--peligro-700)",
};

const AVISO_FASE_POSTERIOR = "Esta acción forma parte de una etapa posterior del módulo Celebraciones y aún no está disponible.";

/**
 * Modulo Celebraciones — reproduce EXCLUSIVAMENTE pages/Celebraciones.tsx del
 * desarrollo real: una sola ruta con estado interno (modo/vista), en vez de
 * las rutas separadas /nueva, /celebracion/:id/editar y /impresion del
 * mockup original. "Nuevo" abre un modal; "Editar" reemplaza el contenido
 * principal in-place; el Calendario es un alternador de vista, no una ruta;
 * la impresión y el registro rapido de intenciones desde el Ribbon siguen
 * pendientes en el sistema real, asi que aqui se muestran como tales.
 */
interface Props extends SidebarNavProps {
  onCerrarSesion: () => void;
}

export function Celebraciones({ onCerrarSesion, ...nav }: Props) {
  const { usuario, esAdmin } = useAppShell();
  const [celebraciones, setCelebraciones] = useState<Celebracion[]>(CELEBRACIONES_SEED);

  const [modo, setModo] = useState<ModoCelebraciones>("listado");
  const [vista, setVista] = useState<VistaCelebraciones>("listado");
  const [vistaCalendario, setVistaCalendario] = useState<VistaCalendarioCelebraciones>("semana");
  const [fechaCalendario, setFechaCalendario] = useState(() => parseISO(FECHA_SIMULADA));

  const [filtros, setFiltros] = useState<CelebracionFiltro>(FILTRO_VACIO);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);

  const [dialogoNuevo, setDialogoNuevo] = useState(false);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [dialogoCelebrante, setDialogoCelebrante] = useState(false);
  const [confirmarSalir, setConfirmarSalir] = useState(false);

  const [aviso, setAviso] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);

  const nextIdRef = useRef(1000);
  const nextId = () => `cel-${++nextIdRef.current}`;

  useEffect(() => {
    if (!mensajeEstado) return;
    const t = setTimeout(() => setMensajeEstado(null), 4000);
    return () => clearTimeout(t);
  }, [mensajeEstado]);
  useEffect(() => {
    if (!exito) return;
    const t = setTimeout(() => setExito(null), 6000);
    return () => clearTimeout(t);
  }, [exito]);
  useEffect(() => setPagina(1), [filtros]);

  const celebracionSeleccionada = celebraciones.find((c) => c.id === seleccionada) ?? null;
  const modoEfectivo: ModoCelebraciones = (modo === "detalle" || modo === "editar") && !celebracionSeleccionada ? "listado" : modo;

  const celebracionesFiltradas = useMemo(() => {
    const q = filtros.texto.trim().toLowerCase();
    return celebraciones
      .filter((c) => {
        if (q) {
          const blob = `${c.tipo} ${c.lugar} ${c.observaciones ?? ""} ${c.celebrantes.map((x) => x.nombre).join(" ")} ${c.intenciones.map((x) => x.descripcion).join(" ")}`.toLowerCase();
          if (!blob.includes(q)) return false;
        }
        if (filtros.tipo && c.tipo !== filtros.tipo) return false;
        if (filtros.lugar && c.lugar !== filtros.lugar) return false;
        if (filtros.estado && c.estado !== filtros.estado) return false;
        if (filtros.desde && c.fecha < filtros.desde) return false;
        if (filtros.hasta && c.fecha > filtros.hasta) return false;
        return true;
      })
      .sort((a, b) => {
        const f = parseISO(a.fecha).getTime() - parseISO(b.fecha).getTime();
        return f !== 0 ? f : a.horaDesde.localeCompare(b.horaDesde);
      });
  }, [celebraciones, filtros]);

  const paginas = Math.max(1, Math.ceil(celebracionesFiltradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, paginas);
  const celebracionesPagina = celebracionesFiltradas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
  const conteoPorEstado = useMemo(() => contarPorEstado(celebraciones), [celebraciones]);

  const notificarFasePosterior = (detalle?: string) => setAviso(detalle ? `${detalle} ${AVISO_FASE_POSTERIOR}` : AVISO_FASE_POSTERIOR);

  const handleActualizar = () => setMensajeEstado("Listado de celebraciones actualizado.");
  const irAListado = () => { setModo("listado"); setVista("listado"); setAviso(null); };
  const abrirDetalle = (id: string) => { setSeleccionada(id); setAviso(null); setExito(null); setModo("detalle"); };
  const abrirEdicion = (id: string) => { setSeleccionada(id); setAviso(null); setExito(null); setModo("editar"); };

  const handleGuardarNuevo = (c: Celebracion, opciones: { permanecer: boolean }) => {
    setCelebraciones((l) => [c, ...l]);
    setExito(`Celebración "${c.tipo}" del ${c.fecha} creada correctamente.`);
    setMensajeEstado("Celebración creada.");
    if (!opciones.permanecer) {
      setDialogoNuevo(false);
      setSeleccionada(c.id);
    }
  };

  const handleGuardarEdicion = (c: Celebracion) => {
    setCelebraciones((l) => l.map((x) => (x.id === c.id ? c : x)));
    setSeleccionada(c.id);
    setModo("detalle");
    setExito("Celebración actualizada correctamente.");
    setMensajeEstado("Celebración actualizada.");
  };

  const confirmarEliminar = () => {
    if (!seleccionada) return;
    setCelebraciones((l) => l.filter((c) => c.id !== seleccionada));
    setConfirmandoEliminar(false);
    setSeleccionada(null);
    setModo("listado");
    setVista("listado");
    setExito("Celebración eliminada correctamente.");
    setMensajeEstado("Celebración eliminada.");
  };

  const handleAsignarCelebrante = (c: Celebrante) => {
    if (!celebracionSeleccionada) return;
    setCelebraciones((l) => l.map((x) => (x.id === celebracionSeleccionada.id ? { ...x, celebrantes: [...x.celebrantes, c] } : x)));
    setDialogoCelebrante(false);
    setExito(`Celebrante "${c.nombre}" asignado correctamente.`);
    setMensajeEstado("Celebrante asignado.");
  };

  const detalleVisible = modoEfectivo === "detalle" && celebracionSeleccionada ? celebracionSeleccionada : null;
  const edicionVisible = modoEfectivo === "editar" && celebracionSeleccionada ? celebracionSeleccionada : null;

  const mensajes = (
    <>
      {exito && <Banner tipo="success" mensaje={exito} onCerrar={() => setExito(null)} />}
      {aviso && <Banner tipo="aviso" mensaje={aviso} onCerrar={() => setAviso(null)} />}
    </>
  );

  const panelSuperior = (
    <>
      <div className="sidebar__panel-title">CELEBRACIONES</div>
      <div className="sidebar__panel-body">
        {ESTADOS.map((estado) => (
          <div className="side-stat" key={estado}>
            <span className="side-stat__label">
              <span className="side-stat__dot" style={{ background: PUNTO_ESTADO[estado] }} />
              {estado}
            </span>
            <span className="tag-count">{conteoPorEstado[estado] ?? 0}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <CelebracionesRibbon
        modo={modoEfectivo}
        vista={vista}
        vistaCalendario={vistaCalendario}
        celebracionSeleccionada={seleccionada}
        onAbrir={() => seleccionada && abrirDetalle(seleccionada)}
        onNuevo={() => { setAviso(null); setExito(null); setDialogoNuevo(true); }}
        onEliminar={() => seleccionada && setConfirmandoEliminar(true)}
        onActualizar={handleActualizar}
        onCambiarVista={(v) => { setVista(v); setModo("listado"); setAviso(null); }}
        onCambiarVistaCalendario={setVistaCalendario}
        onHoy={() => setFechaCalendario(parseISO(FECHA_SIMULADA))}
        onIrAListado={irAListado}
        onAgregarCelebrante={() => { setAviso(null); setExito(null); setDialogoCelebrante(true); }}
        onAgregarIntencion={() => notificarFasePosterior("El registro rápido de intenciones está en preparación.")}
      />

      <div className="app-body">
        <Sidebar {...nav} moduloActivo="celebraciones" esAdminOSacerdote={esAdmin} panelSuperior={panelSuperior} onCerrarSesion={() => setConfirmarSalir(true)} />

        <main className="main" style={{ padding: edicionVisible || detalleVisible ? 0 : undefined }}>
          {edicionVisible ? (
            <CelebracionForm key={edicionVisible.id} celebracionInicial={edicionVisible} variante="pagina" nextId={nextId} onGuardar={(c) => handleGuardarEdicion(c)} onCancelar={() => setModo("detalle")} />
          ) : detalleVisible ? (
            <CelebracionDetalle
              celebracion={detalleVisible}
              onVolver={irAListado}
              onImprimir={() => notificarFasePosterior("La impresión del detalle está en preparación.")}
              onEliminar={() => setConfirmandoEliminar(true)}
              onEditar={() => abrirEdicion(detalleVisible.id)}
              onCerrarAviso={() => setAviso(null)}
            />
          ) : vista === "calendario" ? (
            <div className="page">
              <div className="page__head">
                <div>
                  <h1 className="page__title">Calendario de celebraciones</h1>
                  <div className="page__subtitle">Haga clic en una celebración para ver el detalle</div>
                </div>
              </div>
              <div className="page__body">
                {mensajes}
                <CelebracionesCalendario
                  celebraciones={celebracionesFiltradas}
                  fechaActual={fechaCalendario}
                  vista={vistaCalendario}
                  seleccionada={seleccionada}
                  onSeleccionar={setSeleccionada}
                  onAbrir={abrirDetalle}
                  onCambiarFecha={setFechaCalendario}
                />
              </div>
            </div>
          ) : (
            <div className="page">
              <div className="page__head">
                <div>
                  <h1 className="page__title">Listado de celebraciones</h1>
                  <div className="page__subtitle">Programación general de celebraciones de la Parroquia Santa Cruz</div>
                </div>
              </div>
              <div className="page__body">
                <CelebracionesFiltros filtros={filtros} resultados={celebracionesFiltradas.length} total={celebraciones.length} onCambiar={setFiltros} onLimpiar={() => { setFiltros(FILTRO_VACIO); setMensajeEstado("Filtros restablecidos."); }} />
                {mensajes}
                <CelebracionesListado
                  celebraciones={celebracionesPagina}
                  celebracionSeleccionada={seleccionada}
                  onSeleccionar={(id) => setSeleccionada((a) => (a === id ? null : id))}
                  onAbrir={abrirDetalle}
                  pagina={paginaActual}
                  paginas={paginas}
                  totalResultados={celebracionesFiltradas.length}
                  onPagina={setPagina}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      <CelebracionesStatusBar totalCelebraciones={celebraciones.length} resultadosVisibles={celebracionesFiltradas.length} mensajeEstado={mensajeEstado} usuario={usuario} />

      {dialogoNuevo && <CelebracionForm variante="modal" nextId={nextId} onGuardar={handleGuardarNuevo} onCancelar={() => setDialogoNuevo(false)} />}

      {confirmandoEliminar && celebracionSeleccionada && (
        <ConfirmarEliminacionModal celebracion={celebracionSeleccionada} onCancelar={() => setConfirmandoEliminar(false)} onEliminar={confirmarEliminar} />
      )}

      {dialogoCelebrante && celebracionSeleccionada && (
        <SeleccionarCelebranteModal yaSeleccionados={(celebracionSeleccionada.celebrantes ?? []).map((c) => c.personaId)} onCancelar={() => setDialogoCelebrante(false)} onSeleccionar={handleAsignarCelebrante} />
      )}

      {confirmarSalir && (
        <ConfirmDialog
          titulo="Cerrar sesión"
          mensaje="¿Deseas cerrar la sesión actual?"
          textoConfirmar="Cerrar sesión"
          tono="neutro"
          onCancelar={() => setConfirmarSalir(false)}
          onConfirmar={() => { setConfirmarSalir(false); onCerrarSesion(); }}
        />
      )}
    </div>
  );
}
