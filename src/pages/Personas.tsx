import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, FilePlus2, FolderOpen, Pencil, Printer, RefreshCw, Search, Settings2, UserRoundX, Users } from "lucide-react";
import { PERSONAS_SEED, SEXOS, TIPOS_DOCUMENTO, type Persona, type Sexo, type TipoDocumento } from "../data/personas";
import { Sidebar } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { Chip } from "../components/ui/Chip";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { PersonaFormDialog } from "../components/personas/PersonaFormDialog";
import { PrintPreviewDialog } from "../components/ui/PrintPreviewDialog";
import { PageSetupDialog, type ConfiguracionImpresion } from "../components/ui/PageSetupDialog";
import { formatFecha } from "../utils/format";

type Dialogo = "formulario" | "confirmarDesactivar" | "confirmarCerrarSesion" | "vistaPrevia" | "configPagina" | null;
const POR_PAGINA = 10;

/** Módulo Personas — reproduce pages/Personas.tsx del desarrollo real. */
export function Personas() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<Persona[]>(PERSONAS_SEED);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroSexo, setFiltroSexo] = useState<"Todos" | Sexo>("Todos");
  const [filtroDocumento, setFiltroDocumento] = useState<"Todos" | TipoDocumento>("Todos");
  const [pagina, setPagina] = useState(1);

  const [pestana, setPestana] = useState("inicio");
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [modoFormulario, setModoFormulario] = useState<"nuevo" | "ver" | "editar">("nuevo");
  const [config, setConfig] = useState<ConfiguracionImpresion>({ orientacion: "vertical", sombreado: true });
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(300);
  const nextId = () => `per-${++nextIdRef.current}`;

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return personas.filter((p) => {
      const texto = !q || `${p.nombres} ${p.apellidos}`.toLowerCase().includes(q) || p.numeroDocumento.toLowerCase().includes(q);
      const sexo = filtroSexo === "Todos" || p.sexo === filtroSexo;
      const doc = filtroDocumento === "Todos" || p.tipoDocumento === filtroDocumento;
      return texto && sexo && doc;
    });
  }, [personas, busqueda, filtroSexo, filtroDocumento]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginadas = filtradas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
  const actual = personas.find((p) => p.id === seleccionada) ?? null;
  const hayFiltros = busqueda.trim() !== "" || filtroSexo !== "Todos" || filtroDocumento !== "Todos";

  const guardar = (p: Persona) => {
    setPersonas((l) => (l.some((x) => x.id === p.id) ? l.map((x) => (x.id === p.id ? p : x)) : [p, ...l]));
    setSeleccionada(p.id);
    setDialogo(null);
    setMensajeEstado(modoFormulario === "nuevo" ? "Persona registrada." : "Persona actualizada.");
  };
  const desactivar = () => {
    if (!seleccionada) return;
    setPersonas((l) => l.map((p) => (p.id === seleccionada ? { ...p, estado: "Inactivo" } : p)));
    setDialogo(null);
    setMensajeEstado("Persona desactivada.");
  };

  const pestanas: RibbonPestanaConfig[] = [
    {
      id: "inicio", etiqueta: "Inicio",
      grupos: [
        { etiqueta: "Acciones", botones: [
          { etiqueta: "Abrir", icono: <FolderOpen size={18} />, onClick: () => { setModoFormulario("ver"); setDialogo("formulario"); }, disabled: !seleccionada },
          { etiqueta: "Nuevo", icono: <FilePlus2 size={18} />, onClick: () => { setModoFormulario("nuevo"); setDialogo("formulario"); } },
          { etiqueta: "Editar", icono: <Pencil size={18} />, onClick: () => { setModoFormulario("editar"); setDialogo("formulario"); }, disabled: !seleccionada },
          { etiqueta: "Desactivar", icono: <UserRoundX size={18} />, onClick: () => setDialogo("confirmarDesactivar"), disabled: !seleccionada || actual?.estado === "Inactivo" },
          { etiqueta: "Actualizar", icono: <RefreshCw size={18} />, onClick: () => setMensajeEstado("Padrón actualizado.") },
        ]},
        { etiqueta: "Consulta", botones: [
          { etiqueta: "Buscar", icono: <Search size={18} />, onClick: () => inputRef.current?.focus() },
        ]},
      ],
    },
    { id: "impresion", etiqueta: "Impresión", grupos: [{ etiqueta: "Impresión", botones: [
      { etiqueta: "Imprimir", icono: <Printer size={18} />, onClick: () => window.print() },
      { etiqueta: "Vista previa", icono: <Eye size={18} />, onClick: () => setDialogo("vistaPrevia") },
      { etiqueta: "Config. página", icono: <Settings2 size={18} />, onClick: () => setDialogo("configPagina") },
    ]}]},
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Padrón general de personas" iconoModulo={<Users size={20} />} subtitulo="Parroquia Santa Cruz · Chiquimulilla" pestanas={pestanas} pestanaActiva={pestana} onCambiarPestana={setPestana} />

      <div className="app-body">
        <Sidebar
          moduloActivo="personas"
          onCerrarSesion={() => setDialogo("confirmarCerrarSesion")}
          panelSuperior={
            <>
              <div className="sidebar__panel-title">PERSONAS</div>
              <div className="sidebar__panel-body">
                <div className="side-stat"><span>Total registradas</span><span className="tag-count">{personas.length}</span></div>
                <div className="side-stat"><span>Activas</span><span className="tag-count">{personas.filter((p) => p.estado === "Activo").length}</span></div>
                <div className="side-stat side-stat--total"><span>Inactivas</span><span>{personas.filter((p) => p.estado === "Inactivo").length}</span></div>
              </div>
            </>
          }
        />

        <main className="main">
          <div className="page">
            <div className="page__head">
              <div>
                <h1 className="page__title">Padrón general de personas</h1>
                <div className="page__subtitle">Administración de personas registradas en la parroquia</div>
              </div>
            </div>
            <div className="page__body">
              <div className="filters">
                <div className="filters__grid" style={{ gridTemplateColumns: "1.6fr 1fr 1fr" }}>
                  <div className="field">
                    <label className="field__label">Buscar</label>
                    <input ref={inputRef} className="input" placeholder="Nombre, apellido o documento..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="field__label">Sexo</label>
                    <select className="select" value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value as typeof filtroSexo)}>
                      <option value="Todos">Todos</option>
                      {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field__label">Tipo de documento</label>
                    <select className="select" value={filtroDocumento} onChange={(e) => setFiltroDocumento(e.target.value as typeof filtroDocumento)}>
                      <option value="Todos">Todos</option>
                      {TIPOS_DOCUMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                {hayFiltros && (
                  <div className="filters__actions">
                    <button className="btn" onClick={() => { setBusqueda(""); setFiltroSexo("Todos"); setFiltroDocumento("Todos"); }}>Limpiar filtros</button>
                  </div>
                )}
              </div>

              <div className="table-wrap">
                <table className="grid">
                  <thead><tr><th>Nombre completo</th><th style={{ width: 100 }}>Sexo</th><th>Documento</th><th>Fecha nac.</th><th>Contacto</th><th style={{ width: 100 }}>Estado</th></tr></thead>
                  <tbody>
                    {paginadas.map((p) => (
                      <tr key={p.id} className={seleccionada === p.id ? "is-selected" : ""} onClick={() => setSeleccionada(p.id)} onDoubleClick={() => { setModoFormulario("editar"); setDialogo("formulario"); }}>
                        <td>{p.nombres} {p.apellidos}</td>
                        <td>{p.sexo}</td>
                        <td>{p.tipoDocumento}: {p.numeroDocumento}</td>
                        <td className="nowrap">{p.fechaNacimiento ? formatFecha(p.fechaNacimiento) : "—"}</td>
                        <td>{p.celular || p.telefono || <span className="muted">—</span>}</td>
                        <td><Chip tono={p.estado === "Activo" ? "activo" : "inactivo"}>{p.estado}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginadas.length === 0 && <div className="empty-inline">No se encontraron personas con los criterios actuales.</div>}
              </div>
              <Pagination pagina={paginaActual} totalPaginas={totalPaginas} totalRegistros={filtradas.length} porPagina={POR_PAGINA} etiqueta="personas" onCambio={setPagina} />
            </div>
          </div>
        </main>
      </div>

      <StatusBar contadorTexto={filtradas.length === personas.length ? `${personas.length} personas registradas` : `${filtradas.length} de ${personas.length} personas registradas`} mensajeEstado={mensajeEstado} usuario="Secretaría parroquial" />

      {dialogo === "formulario" && <PersonaFormDialog modo={modoFormulario} persona={actual} onCerrar={() => setDialogo(null)} onGuardar={guardar} nextId={nextId} />}
      {dialogo === "confirmarDesactivar" && (
        <ConfirmDialog titulo="Desactivar persona" mensaje="La persona no aparecerá en los registros activos del padrón. ¿Deseas continuar?" textoConfirmar="Desactivar" tono="alerta" onConfirmar={desactivar} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "confirmarCerrarSesion" && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={() => navigate("/agenda")} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "vistaPrevia" && (
        <PrintPreviewDialog
          titulo="Padrón general de personas"
          subtitulo={`${filtradas.length} personas`}
          encabezados={["Nombre completo", "Sexo", "Documento", "Localidad", "Estado"]}
          filas={filtradas.map((p) => [`${p.nombres} ${p.apellidos}`, p.sexo, `${p.tipoDocumento} ${p.numeroDocumento}`, p.localidad, p.estado])}
          onImprimir={() => window.print()}
          onCancelar={() => setDialogo(null)}
        />
      )}
      {dialogo === "configPagina" && <PageSetupDialog configuracion={config} onGuardar={(c) => { setConfig(c); setDialogo(null); }} onCancelar={() => setDialogo(null)} />}
    </div>
  );
}
