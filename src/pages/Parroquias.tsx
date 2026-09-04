import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Church, Eye, Pencil, Plus, RefreshCw, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { OBISPADOS_SEED, PARROQUIAS_SEED, type Obispado, type Parroquia } from "../data/parroquias";
import { Sidebar } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { Chip } from "../components/ui/Chip";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { ParroquiaFormDialog } from "../components/parroquias/ParroquiaFormDialog";

type Dialogo = "formulario" | "confirmarEstado" | "confirmarCerrarSesion" | null;
const POR_PAGINA = 10;

/** Módulo Parroquias — reproduce pages/Parroquias.tsx del desarrollo real (visible solo para Administrador/Sacerdote/Párroco). */
export function Parroquias() {
  const navigate = useNavigate();
  const [parroquias, setParroquias] = useState<Parroquia[]>(PARROQUIAS_SEED);
  const [obispados] = useState<Obispado[]>(OBISPADOS_SEED);
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroObispado, setFiltroObispado] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState<"Todos" | "Activas" | "Inactivas">("Todos");
  const [pagina, setPagina] = useState(1);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [modoFormulario, setModoFormulario] = useState<"nuevo" | "ver" | "editar">("nuevo");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(400);
  const nextId = () => `par-${++nextIdRef.current}`;

  const seleccionada = useMemo(() => parroquias.find((p) => p.id === seleccionadaId) ?? null, [parroquias, seleccionadaId]);
  const mapaObispados = useMemo(() => new Map(obispados.map((o) => [o.id, o.nombre])), [obispados]);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return parroquias.filter((p) => {
      const texto = !q || p.nombre.toLowerCase().includes(q) || p.parroco.toLowerCase().includes(q) || p.municipio.toLowerCase().includes(q);
      const ob = filtroObispado === "Todos" || p.idObispado === filtroObispado;
      const est = filtroEstado === "Todos" || (filtroEstado === "Activas" && p.activo) || (filtroEstado === "Inactivas" && !p.activo);
      return texto && ob && est;
    });
  }, [parroquias, busqueda, filtroObispado, filtroEstado]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginadas = filtradas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const guardar = (p: Parroquia) => {
    setParroquias((l) => (l.some((x) => x.id === p.id) ? l.map((x) => (x.id === p.id ? p : x)) : [p, ...l]));
    setSeleccionadaId(p.id);
    setDialogo(null);
    setMensajeEstado(modoFormulario === "nuevo" ? `Parroquia "${p.nombre}" creada con éxito.` : "Parroquia actualizada con éxito.");
  };
  const cambiarEstado = () => {
    if (!seleccionada) return;
    const nuevo = !seleccionada.activo;
    setParroquias((l) => l.map((p) => (p.id === seleccionada.id ? { ...p, activo: nuevo } : p)));
    setDialogo(null);
    setMensajeEstado(`Parroquia ${nuevo ? "activada" : "inactivada"} correctamente.`);
  };

  const pestanas: RibbonPestanaConfig[] = [
    {
      id: "inicio", etiqueta: "Inicio",
      grupos: [
        { etiqueta: "Operaciones", botones: [
          { etiqueta: "Nueva", icono: <Plus size={20} />, onClick: () => { setModoFormulario("nuevo"); setDialogo("formulario"); } },
          { etiqueta: "Ver detalle", icono: <Eye size={20} />, onClick: () => { setModoFormulario("ver"); setDialogo("formulario"); }, disabled: !seleccionada },
          { etiqueta: "Editar", icono: <Pencil size={20} />, onClick: () => { setModoFormulario("editar"); setDialogo("formulario"); }, disabled: !seleccionada },
          { etiqueta: seleccionada?.activo ? "Inactivar" : "Activar", icono: seleccionada?.activo ? <ToggleLeft size={20} /> : <ToggleRight size={20} />, onClick: () => setDialogo("confirmarEstado"), disabled: !seleccionada },
        ]},
        { etiqueta: "Vista y filtros", botones: [
          { etiqueta: "Refrescar", icono: <RefreshCw size={20} />, onClick: () => setMensajeEstado("Parroquias actualizadas con éxito.") },
        ]},
      ],
    },
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Módulo de Parroquias y Sedes Pastorales" iconoModulo={<Church size={20} />} subtitulo="Diócesis de Santa Rosa de Lima" pestanas={pestanas} pestanaActiva="inicio" onCambiarPestana={() => {}} />

      <div className="app-body">
        <Sidebar
          moduloActivo="parroquias"
          onCerrarSesion={() => setDialogo("confirmarCerrarSesion")}
          panelSuperior={
            <>
              <div className="sidebar__panel-title">ESTADÍSTICAS PARROQUIALES</div>
              <div className="sidebar__panel-body">
                <div className="side-stat"><span>Total sedes</span><span className="tag-count">{parroquias.length}</span></div>
                <div className="side-stat"><span>Activas</span><span className="tag-count">{parroquias.filter((p) => p.activo).length}</span></div>
                <div className="side-stat"><span>Inactivas</span><span className="tag-count">{parroquias.filter((p) => !p.activo).length}</span></div>
                <div className="side-stat side-stat--total"><span>Diócesis</span><span>{obispados.length}</span></div>
              </div>
            </>
          }
        />

        <main className="main">
          <div className="page">
            <div className="page__body" style={{ paddingTop: 14 }}>
              <div className="filters">
                <div className="filters__grid" style={{ gridTemplateColumns: "1.6fr 1fr 1fr" }}>
                  <div className="field">
                    <label className="field__label">Buscar</label>
                    <div style={{ position: "relative" }}>
                      <Search size={14} style={{ position: "absolute", left: 8, top: 8, color: "var(--texto-3)" }} />
                      <input ref={inputRef} className="input" style={{ paddingLeft: 26 }} placeholder="Nombre, párroco, municipio, dirección..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field__label">Diócesis</label>
                    <select className="select" value={filtroObispado} onChange={(e) => setFiltroObispado(e.target.value)}>
                      <option value="Todos">Todas las diócesis</option>
                      {obispados.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field__label">Estado</label>
                    <select className="select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}>
                      <option value="Todos">Todas</option>
                      <option value="Activas">Solo activas</option>
                      <option value="Inactivas">Solo inactivas</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-wrap">
                <table className="grid">
                  <thead><tr><th style={{ width: 40 }}>#</th><th>Parroquia</th><th>Párroco / encargado</th><th>Municipio</th><th>Diócesis</th><th>Teléfono</th><th style={{ width: 90 }}>Estado</th></tr></thead>
                  <tbody>
                    {paginadas.map((p, i) => (
                      <tr key={p.id} className={seleccionadaId === p.id ? "is-selected" : ""} onClick={() => setSeleccionadaId(p.id)} onDoubleClick={() => { setModoFormulario("ver"); setDialogo("formulario"); }}>
                        <td className="grid__num">{(paginaActual - 1) * POR_PAGINA + i + 1}</td>
                        <td><strong>{p.nombre}</strong><div className="small muted">{p.direccion}</div></td>
                        <td>{p.parroco}</td>
                        <td>{p.municipio}</td>
                        <td>{mapaObispados.get(p.idObispado) ?? "—"}</td>
                        <td>{p.telefono || "—"}</td>
                        <td><Chip tono={p.activo ? "activo" : "inactivo"}>{p.activo ? "Activa" : "Inactiva"}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginadas.length === 0 && <div className="empty-inline">No se encontraron parroquias con los criterios actuales.</div>}
              </div>
              <Pagination pagina={paginaActual} totalPaginas={totalPaginas} totalRegistros={filtradas.length} porPagina={POR_PAGINA} etiqueta="parroquias" onCambio={setPagina} />
            </div>
          </div>
        </main>
      </div>

      <StatusBar contadorTexto={`Total: ${filtradas.length} parroquias`} mensajeEstado={mensajeEstado} usuario="Secretaría parroquial" />

      {dialogo === "formulario" && <ParroquiaFormDialog modo={modoFormulario} parroquia={seleccionada} obispados={obispados} onCerrar={() => setDialogo(null)} onGuardar={guardar} nextId={nextId} />}
      {dialogo === "confirmarEstado" && (
        <ConfirmDialog titulo={seleccionada?.activo ? "Inactivar parroquia" : "Activar parroquia"} mensaje={seleccionada?.activo ? `¿Está seguro de inactivar "${seleccionada?.nombre}"?` : `¿Desea activar "${seleccionada?.nombre}"?`} textoConfirmar={seleccionada?.activo ? "Sí, inactivar" : "Sí, activar"} tono={seleccionada?.activo ? "alerta" : "neutro"} onConfirmar={cambiarEstado} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "confirmarCerrarSesion" && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={() => navigate("/agenda")} onCancelar={() => setDialogo(null)} />
      )}
    </div>
  );
}
