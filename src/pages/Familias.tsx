import { useMemo, useRef, useState } from "react";
import { useAppShell } from "../context/AppShellContext";
import { FilePlus2, FolderOpen, Home, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { FAMILIAS_SEED, TIPOS_UNION, type Familia } from "../data/familias";
import { Sidebar, type SidebarNavProps } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { Chip } from "../components/ui/Chip";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { Banner } from "../components/ui/Banner";
import { FamiliaFormDialog } from "../components/familias/FamiliaFormDialog";

type Dialogo = "formulario" | "confirmarEliminar" | "confirmarCerrarSesion" | null;
const POR_PAGINA = 10;

/**
 * Módulo Familias — construido desde cero (sin pantalla desarrollada
 * todavía; el frontend real solo tiene el servicio preparado). Sigue la
 * misma línea visual y de navegación de los módulos ya desarrollados
 * (ribbon genérico, sidebar, dialogos), sin inventar procesos: los campos
 * provienen del DTO y del modelo `familia` del backend.
 */
interface Props extends SidebarNavProps {
  onCerrarSesion: () => void;
}

export function Familias({ onCerrarSesion, ...nav }: Props) {
  const { usuario, esAdmin } = useAppShell();
  const [familias, setFamilias] = useState<Familia[]>(FAMILIAS_SEED);
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroUnion, setFiltroUnion] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [modoFormulario, setModoFormulario] = useState<"nuevo" | "ver" | "editar">("nuevo");
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const nextIdRef = useRef(600);
  const nextId = () => `fam-${++nextIdRef.current}`;

  const seleccionada = useMemo(() => familias.find((f) => f.id === seleccionadaId) ?? null, [familias, seleccionadaId]);
  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return familias.filter((f) => {
      const texto = !q || f.nombre.toLowerCase().includes(q) || (f.padre ?? "").toLowerCase().includes(q) || (f.madre ?? "").toLowerCase().includes(q);
      const union = filtroUnion === "Todos" || f.tipoUnion === filtroUnion;
      return texto && union;
    });
  }, [familias, busqueda, filtroUnion]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginadas = filtradas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const guardar = (f: Familia) => {
    setFamilias((l) => (l.some((x) => x.id === f.id) ? l.map((x) => (x.id === f.id ? f : x)) : [f, ...l]));
    setSeleccionadaId(f.id);
    setDialogo(null);
    setExito(modoFormulario === "nuevo" ? `Familia "${f.nombre}" registrada correctamente.` : "Familia actualizada correctamente.");
    setMensajeEstado(modoFormulario === "nuevo" ? "Familia registrada." : "Familia actualizada.");
  };
  const eliminar = () => {
    if (!seleccionadaId) return;
    setFamilias((l) => l.filter((f) => f.id !== seleccionadaId));
    setSeleccionadaId(null);
    setDialogo(null);
    setMensajeEstado("Familia eliminada.");
  };

  const pestanas: RibbonPestanaConfig[] = [
    {
      id: "inicio", etiqueta: "Inicio",
      grupos: [{ etiqueta: "Acciones", botones: [
        { etiqueta: "Abrir", icono: <FolderOpen size={18} />, onClick: () => { setModoFormulario("ver"); setDialogo("formulario"); }, disabled: !seleccionada },
        { etiqueta: "Nuevo", icono: <FilePlus2 size={18} />, onClick: () => { setModoFormulario("nuevo"); setDialogo("formulario"); } },
        { etiqueta: "Editar", icono: <Pencil size={18} />, onClick: () => { setModoFormulario("editar"); setDialogo("formulario"); }, disabled: !seleccionada },
        { etiqueta: "Eliminar", icono: <Trash2 size={18} />, onClick: () => setDialogo("confirmarEliminar"), disabled: !seleccionada },
        { etiqueta: "Actualizar", icono: <RefreshCw size={18} />, onClick: () => setMensajeEstado("Listado de familias actualizado.") },
      ]}],
    },
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Familias parroquiales" iconoModulo={<Home size={20} />} subtitulo="Parroquia Santa Cruz · Chiquimulilla" pestanas={pestanas} pestanaActiva="inicio" onCambiarPestana={() => {}} />

      <div className="app-body">
        <Sidebar
          {...nav}
          moduloActivo="familias"
          esAdminOSacerdote={esAdmin}
          onCerrarSesion={() => setDialogo("confirmarCerrarSesion")}
          panelSuperior={
            <>
              <div className="sidebar__panel-title">FAMILIAS</div>
              <div className="sidebar__panel-body">
                <div className="side-stat"><span>Total registradas</span><span className="tag-count">{familias.length}</span></div>
                <div className="side-stat side-stat--total"><span>En radio parroquial</span><span>{familias.filter((f) => f.perteneceRadioParroquial).length}</span></div>
              </div>
            </>
          }
        />

        <main className="main">
          <div className="page">
            <div className="page__head">
              <div>
                <h1 className="page__title">Listado de familias</h1>
                <div className="page__subtitle">Grupos familiares registrados en la parroquia</div>
              </div>
            </div>
            <div className="page__body">
              <div className="filters">
                <div className="filters__grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
                  <div className="field">
                    <label className="field__label">Buscar</label>
                    <input className="input" placeholder="Nombre de familia, padre o madre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="field__label">Tipo de unión</label>
                    <select className="select" value={filtroUnion} onChange={(e) => setFiltroUnion(e.target.value)}>
                      <option value="Todos">Todos</option>
                      {TIPOS_UNION.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {exito && <Banner tipo="success" mensaje={exito} onCerrar={() => setExito(null)} />}

              <div className="table-wrap">
                <table className="grid">
                  <thead><tr><th>Familia</th><th>Tipo de unión</th><th>Domicilio</th><th>Teléfono</th><th style={{ width: 90 }}>Integrantes</th><th style={{ width: 120 }}>Radio parroquial</th></tr></thead>
                  <tbody>
                    {paginadas.map((f) => (
                      <tr key={f.id} className={seleccionadaId === f.id ? "is-selected" : ""} onClick={() => setSeleccionadaId(f.id)} onDoubleClick={() => { setModoFormulario("ver"); setDialogo("formulario"); }}>
                        <td><strong>{f.nombre}</strong></td>
                        <td>{f.tipoUnion}</td>
                        <td>{f.domicilio}, {f.localidad}</td>
                        <td>{f.telefono || "—"}</td>
                        <td className="grid__num">{f.integrantes.length}</td>
                        <td><Chip tono={f.perteneceRadioParroquial ? "activo" : "inactivo"}>{f.perteneceRadioParroquial ? "Sí" : "No"}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginadas.length === 0 && <div className="empty-inline">No se encontraron familias con los criterios actuales.</div>}
              </div>
              <Pagination pagina={paginaActual} totalPaginas={totalPaginas} totalRegistros={filtradas.length} porPagina={POR_PAGINA} etiqueta="familias" onCambio={setPagina} />
            </div>
          </div>
        </main>
      </div>

      <StatusBar contadorTexto={`${filtradas.length} de ${familias.length} familias`} mensajeEstado={mensajeEstado} usuario={usuario} />

      {dialogo === "formulario" && <FamiliaFormDialog modo={modoFormulario} familia={seleccionada} onCerrar={() => setDialogo(null)} onGuardar={guardar} nextId={nextId} />}
      {dialogo === "confirmarEliminar" && (
        <ConfirmDialog titulo="Eliminar familia" mensaje="Esta acción no se puede deshacer. ¿Deseas eliminar el grupo familiar seleccionado?" textoConfirmar="Eliminar" tono="alerta" onConfirmar={eliminar} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "confirmarCerrarSesion" && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={onCerrarSesion} onCancelar={() => setDialogo(null)} />
      )}
    </div>
  );
}
