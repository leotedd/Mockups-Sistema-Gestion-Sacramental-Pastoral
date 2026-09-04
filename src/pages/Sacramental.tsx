import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Church, FilePlus2, FolderOpen, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { REGISTROS_SEED, TIPOS_SACRAMENTO, type RegistroSacramental } from "../data/sacramental";
import { Sidebar } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { Chip } from "../components/ui/Chip";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { Banner } from "../components/ui/Banner";
import { RegistroFormDialog } from "../components/sacramental/RegistroFormDialog";
import { formatFecha } from "../utils/format";

type Dialogo = "formulario" | "confirmarEliminar" | "confirmarCerrarSesion" | null;
const POR_PAGINA = 10;

/** Módulo Sacramental — construido desde cero (solo existe el módulo de backend `modules/sacramentos`, sin pantalla propia todavía). */
export function Sacramental() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<RegistroSacramental[]>(REGISTROS_SEED);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [modoFormulario, setModoFormulario] = useState<"nuevo" | "ver" | "editar">("nuevo");
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const nextIdRef = useRef(800);
  const nextId = () => `sac-${++nextIdRef.current}`;

  const seleccionado = useMemo(() => registros.find((r) => r.id === seleccionadoId) ?? null, [registros, seleccionadoId]);
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return registros.filter((r) => {
      const texto = !q || r.persona.toLowerCase().includes(q) || (r.persona2 ?? "").toLowerCase().includes(q) || r.acta.includes(q);
      const tipo = filtroTipo === "Todos" || r.tipo === filtroTipo;
      return texto && tipo;
    });
  }, [registros, busqueda, filtroTipo]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const guardar = (r: RegistroSacramental) => {
    setRegistros((l) => (l.some((x) => x.id === r.id) ? l.map((x) => (x.id === r.id ? r : x)) : [r, ...l]));
    setSeleccionadoId(r.id);
    setDialogo(null);
    setExito(modoFormulario === "nuevo" ? "Registro sacramental creado correctamente." : "Registro actualizado correctamente.");
    setMensajeEstado(modoFormulario === "nuevo" ? "Registro creado." : "Registro actualizado.");
  };
  const eliminar = () => {
    if (!seleccionadoId) return;
    setRegistros((l) => l.filter((r) => r.id !== seleccionadoId));
    setSeleccionadoId(null);
    setDialogo(null);
    setMensajeEstado("Registro eliminado.");
  };

  const pestanas: RibbonPestanaConfig[] = [
    {
      id: "inicio", etiqueta: "Inicio",
      grupos: [{ etiqueta: "Acciones", botones: [
        { etiqueta: "Abrir", icono: <FolderOpen size={18} />, onClick: () => { setModoFormulario("ver"); setDialogo("formulario"); }, disabled: !seleccionado },
        { etiqueta: "Nuevo", icono: <FilePlus2 size={18} />, onClick: () => { setModoFormulario("nuevo"); setDialogo("formulario"); } },
        { etiqueta: "Editar", icono: <Pencil size={18} />, onClick: () => { setModoFormulario("editar"); setDialogo("formulario"); }, disabled: !seleccionado },
        { etiqueta: "Eliminar", icono: <Trash2 size={18} />, onClick: () => setDialogo("confirmarEliminar"), disabled: !seleccionado },
        { etiqueta: "Actualizar", icono: <RefreshCw size={18} />, onClick: () => setMensajeEstado("Listado sacramental actualizado.") },
      ]}],
    },
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Registro sacramental" iconoModulo={<Church size={20} />} subtitulo="Parroquia Santa Cruz · Chiquimulilla" pestanas={pestanas} pestanaActiva="inicio" onCambiarPestana={() => {}} />

      <div className="app-body">
        <Sidebar
          moduloActivo="sacramental"
          onCerrarSesion={() => setDialogo("confirmarCerrarSesion")}
          panelSuperior={
            <>
              <div className="sidebar__panel-title">SACRAMENTAL</div>
              <div className="sidebar__panel-body">
                {TIPOS_SACRAMENTO.map((t) => (
                  <div className="side-stat" key={t}><span>{t}</span><span className="tag-count">{registros.filter((r) => r.tipo === t).length}</span></div>
                ))}
              </div>
            </>
          }
        />

        <main className="main">
          <div className="page">
            <div className="page__head">
              <div>
                <h1 className="page__title">Listado de registros sacramentales</h1>
                <div className="page__subtitle">Bautismos, confirmaciones, eucaristía, matrimonios y exequias</div>
              </div>
            </div>
            <div className="page__body">
              <div className="filters">
                <div className="filters__grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
                  <div className="field"><label className="field__label">Buscar</label><input className="input" placeholder="Persona o número de acta..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
                  <div className="field">
                    <label className="field__label">Tipo de sacramento</label>
                    <select className="select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                      <option value="Todos">Todos</option>
                      {TIPOS_SACRAMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {exito && <Banner tipo="success" mensaje={exito} onCerrar={() => setExito(null)} />}

              <div className="table-wrap">
                <table className="grid">
                  <thead><tr><th style={{ width: 120 }}>Tipo</th><th>Persona</th><th>Libro</th><th style={{ width: 90 }}>Folio/Acta</th><th style={{ width: 100 }}>Fecha</th><th style={{ width: 90 }}>Estado</th></tr></thead>
                  <tbody>
                    {paginados.map((r) => (
                      <tr key={r.id} className={seleccionadoId === r.id ? "is-selected" : ""} onClick={() => setSeleccionadoId(r.id)} onDoubleClick={() => { setModoFormulario("ver"); setDialogo("formulario"); }}>
                        <td>{r.tipo}</td>
                        <td>{r.persona}{r.persona2 && <> &amp; {r.persona2}</>}</td>
                        <td className="small">{r.libroSacramental}</td>
                        <td className="nowrap">{r.folio} / {r.acta}</td>
                        <td className="nowrap">{r.fecha ? formatFecha(r.fecha) : "—"}</td>
                        <td><Chip tono={r.anulada ? "vencido" : r.esExterno ? "info" : "activo"}>{r.anulada ? "Anulada" : r.esExterno ? "Externo" : "Vigente"}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginados.length === 0 && <div className="empty-inline">No se encontraron registros con los criterios actuales.</div>}
              </div>
              <Pagination pagina={paginaActual} totalPaginas={totalPaginas} totalRegistros={filtrados.length} porPagina={POR_PAGINA} etiqueta="registros" onCambio={setPagina} />
            </div>
          </div>
        </main>
      </div>

      <StatusBar contadorTexto={`${filtrados.length} de ${registros.length} registros`} mensajeEstado={mensajeEstado} usuario="Secretaría parroquial" />

      {dialogo === "formulario" && <RegistroFormDialog modo={modoFormulario} registro={seleccionado} onCerrar={() => setDialogo(null)} onGuardar={guardar} nextId={nextId} />}
      {dialogo === "confirmarEliminar" && (
        <ConfirmDialog titulo="Eliminar registro" mensaje="Esta acción no se puede deshacer. ¿Deseas eliminar el registro sacramental seleccionado?" textoConfirmar="Eliminar" tono="alerta" onConfirmar={eliminar} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "confirmarCerrarSesion" && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={() => navigate("/agenda")} onCancelar={() => setDialogo(null)} />
      )}
    </div>
  );
}
