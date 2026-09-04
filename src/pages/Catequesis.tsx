import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, FilePlus2, FolderOpen, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { AULAS_SEED, CURSOS_SEED, TIPOS_CURSO, type Curso } from "../data/catequesis";
import { Sidebar } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { Banner } from "../components/ui/Banner";
import { CursoFormDialog } from "../components/catequesis/CursoFormDialog";
import { formatFecha } from "../utils/format";

type Dialogo = "formulario" | "confirmarEliminar" | "confirmarCerrarSesion" | null;
const POR_PAGINA = 10;

/** Módulo Catequesis — construido desde cero (servicio preparado en el frontend real, sin pantalla propia todavía). */
export function Catequesis() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>(CURSOS_SEED);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [modoFormulario, setModoFormulario] = useState<"nuevo" | "ver" | "editar">("nuevo");
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const nextIdRef = useRef(700);
  const nextId = () => `cur-${++nextIdRef.current}`;

  const seleccionado = useMemo(() => cursos.find((c) => c.id === seleccionadoId) ?? null, [cursos, seleccionadoId]);
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return cursos.filter((c) => {
      const texto = !q || c.ciclo.toLowerCase().includes(q) || c.tipoCurso.toLowerCase().includes(q);
      const tipo = filtroTipo === "Todos" || c.tipoCurso === filtroTipo;
      return texto && tipo;
    });
  }, [cursos, busqueda, filtroTipo]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const guardar = (c: Curso) => {
    setCursos((l) => (l.some((x) => x.id === c.id) ? l.map((x) => (x.id === c.id ? c : x)) : [c, ...l]));
    setSeleccionadoId(c.id);
    setDialogo(null);
    setExito(modoFormulario === "nuevo" ? "Curso de catequesis registrado correctamente." : "Curso actualizado correctamente.");
    setMensajeEstado(modoFormulario === "nuevo" ? "Curso registrado." : "Curso actualizado.");
  };
  const eliminar = () => {
    if (!seleccionadoId) return;
    setCursos((l) => l.filter((c) => c.id !== seleccionadoId));
    setSeleccionadoId(null);
    setDialogo(null);
    setMensajeEstado("Curso eliminado.");
  };

  const pestanas: RibbonPestanaConfig[] = [
    {
      id: "inicio", etiqueta: "Inicio",
      grupos: [{ etiqueta: "Acciones", botones: [
        { etiqueta: "Abrir", icono: <FolderOpen size={18} />, onClick: () => { setModoFormulario("ver"); setDialogo("formulario"); }, disabled: !seleccionado },
        { etiqueta: "Nuevo", icono: <FilePlus2 size={18} />, onClick: () => { setModoFormulario("nuevo"); setDialogo("formulario"); } },
        { etiqueta: "Editar", icono: <Pencil size={18} />, onClick: () => { setModoFormulario("editar"); setDialogo("formulario"); }, disabled: !seleccionado },
        { etiqueta: "Eliminar", icono: <Trash2 size={18} />, onClick: () => setDialogo("confirmarEliminar"), disabled: !seleccionado },
        { etiqueta: "Actualizar", icono: <RefreshCw size={18} />, onClick: () => setMensajeEstado("Listado de cursos actualizado.") },
      ]}],
    },
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Catequesis parroquial" iconoModulo={<BookOpen size={20} />} subtitulo="Parroquia Santa Cruz · Chiquimulilla" pestanas={pestanas} pestanaActiva="inicio" onCambiarPestana={() => {}} />

      <div className="app-body">
        <Sidebar
          moduloActivo="catequesis"
          onCerrarSesion={() => setDialogo("confirmarCerrarSesion")}
          panelSuperior={
            <>
              <div className="sidebar__panel-title">CATEQUESIS</div>
              <div className="sidebar__panel-body">
                <div className="side-stat"><span>Cursos activos</span><span className="tag-count">{cursos.length}</span></div>
                <div className="side-stat side-stat--total"><span>Aulas disponibles</span><span>{AULAS_SEED.length}</span></div>
              </div>
            </>
          }
        />

        <main className="main">
          <div className="page">
            <div className="page__head">
              <div>
                <h1 className="page__title">Listado de cursos de catequesis</h1>
                <div className="page__subtitle">Cursos, participantes y clases registradas</div>
              </div>
            </div>
            <div className="page__body">
              <div className="filters">
                <div className="filters__grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
                  <div className="field"><label className="field__label">Buscar</label><input className="input" placeholder="Ciclo o tipo de curso..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
                  <div className="field">
                    <label className="field__label">Tipo de curso</label>
                    <select className="select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                      <option value="Todos">Todos</option>
                      {TIPOS_CURSO.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {exito && <Banner tipo="success" mensaje={exito} onCerrar={() => setExito(null)} />}

              <div className="table-wrap">
                <table className="grid">
                  <thead><tr><th>Tipo de curso</th><th>Ciclo</th><th>Periodo</th><th>Aula</th><th style={{ width: 110 }}>Participantes</th><th style={{ width: 80 }}>Clases</th></tr></thead>
                  <tbody>
                    {paginados.map((c) => (
                      <tr key={c.id} className={seleccionadoId === c.id ? "is-selected" : ""} onClick={() => setSeleccionadoId(c.id)} onDoubleClick={() => { setModoFormulario("ver"); setDialogo("formulario"); }}>
                        <td><strong>{c.tipoCurso}</strong></td>
                        <td>{c.ciclo}</td>
                        <td className="nowrap">{c.periodoDesde ? formatFecha(c.periodoDesde) : "—"} – {c.periodoHasta ? formatFecha(c.periodoHasta) : "—"}</td>
                        <td>{c.aulaPrincipal}</td>
                        <td className="grid__num">{c.participantes.length}</td>
                        <td className="grid__num">{c.clases.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginados.length === 0 && <div className="empty-inline">No se encontraron cursos con los criterios actuales.</div>}
              </div>
              <Pagination pagina={paginaActual} totalPaginas={totalPaginas} totalRegistros={filtrados.length} porPagina={POR_PAGINA} etiqueta="cursos" onCambio={setPagina} />
            </div>
          </div>
        </main>
      </div>

      <StatusBar contadorTexto={`${filtrados.length} de ${cursos.length} cursos`} mensajeEstado={mensajeEstado} usuario="Secretaría parroquial" />

      {dialogo === "formulario" && <CursoFormDialog modo={modoFormulario} curso={seleccionado} onCerrar={() => setDialogo(null)} onGuardar={guardar} nextId={nextId} />}
      {dialogo === "confirmarEliminar" && (
        <ConfirmDialog titulo="Eliminar curso" mensaje="Esta acción no se puede deshacer. ¿Deseas eliminar el curso seleccionado?" textoConfirmar="Eliminar" tono="alerta" onConfirmar={eliminar} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "confirmarCerrarSesion" && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={() => navigate("/agenda")} onCancelar={() => setDialogo(null)} />
      )}
    </div>
  );
}
