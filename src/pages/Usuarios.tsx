import { useMemo, useRef, useState } from "react";
import { useAppShell } from "../context/AppShellContext";
import { Eye, Pencil, RefreshCw, Search, ShieldCheck, UserCheck, UserCog, UserPlus, UserX } from "lucide-react";
import { ROLES_SEED, USUARIOS_SEED, type Rol, type Usuario } from "../data/usuarios";
import { Sidebar, type SidebarNavProps } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { Chip } from "../components/ui/Chip";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { UsuarioFormDialog } from "../components/usuarios/UsuarioFormDialog";

type Dialogo = "formulario" | "confirmarEstado" | "confirmarCerrarSesion" | null;
const POR_PAGINA = 10;

interface Props extends SidebarNavProps {
  onCerrarSesion: () => void;
}

/** Módulo Usuarios — reproduce pages/Usuarios.tsx del desarrollo real (visible solo para Administrador/Sacerdote/Párroco). */
export function Usuarios({ onCerrarSesion, ...nav }: Props) {
  const { usuario, esAdmin } = useAppShell();
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_SEED);
  const [roles] = useState<Rol[]>(ROLES_SEED);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState<"Todos" | "Activos" | "Inactivos">("Todos");
  const [pagina, setPagina] = useState(1);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [modoFormulario, setModoFormulario] = useState<"nuevo" | "ver" | "editar">("nuevo");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(500);
  const nextId = () => `usr-${++nextIdRef.current}`;

  const seleccionado = useMemo(() => usuarios.find((u) => u.id === seleccionadoId) ?? null, [usuarios, seleccionadoId]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return usuarios.filter((u) => {
      const texto = !q || u.usuario.toLowerCase().includes(q) || u.nombre.toLowerCase().includes(q);
      const rol = filtroRol === "Todos" || u.roles.includes(filtroRol);
      const est = filtroEstado === "Todos" || (filtroEstado === "Activos" && u.activo) || (filtroEstado === "Inactivos" && !u.activo);
      return texto && rol && est;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const guardar = (u: Usuario) => {
    setUsuarios((l) => (l.some((x) => x.id === u.id) ? l.map((x) => (x.id === u.id ? u : x)) : [u, ...l]));
    setSeleccionadoId(u.id);
    setDialogo(null);
    setMensajeEstado(modoFormulario === "nuevo" ? `Usuario @${u.usuario} creado con éxito.` : "Usuario actualizado con éxito.");
  };
  const cambiarEstado = () => {
    if (!seleccionado) return;
    const nuevo = !seleccionado.activo;
    setUsuarios((l) => l.map((u) => (u.id === seleccionado.id ? { ...u, activo: nuevo } : u)));
    setDialogo(null);
    setMensajeEstado(`Usuario ${nuevo ? "activado" : "desactivado"} correctamente.`);
  };

  const pestanas: RibbonPestanaConfig[] = [
    {
      id: "inicio", etiqueta: "Inicio",
      grupos: [
        { etiqueta: "Operaciones", botones: [
          { etiqueta: "Nuevo", icono: <UserPlus size={20} />, onClick: () => { setModoFormulario("nuevo"); setDialogo("formulario"); } },
          { etiqueta: "Ver detalle", icono: <Eye size={20} />, onClick: () => { setModoFormulario("ver"); setDialogo("formulario"); }, disabled: !seleccionado },
          { etiqueta: "Editar", icono: <Pencil size={20} />, onClick: () => { setModoFormulario("editar"); setDialogo("formulario"); }, disabled: !seleccionado },
          { etiqueta: seleccionado?.activo ? "Desactivar" : "Activar", icono: seleccionado?.activo ? <UserX size={20} /> : <UserCheck size={20} />, onClick: () => setDialogo("confirmarEstado"), disabled: !seleccionado },
        ]},
        { etiqueta: "Vista y filtros", botones: [
          { etiqueta: "Refrescar", icono: <RefreshCw size={20} />, onClick: () => setMensajeEstado("Usuarios actualizados con éxito.") },
        ]},
      ],
    },
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Módulo de Administración de Usuarios" iconoModulo={<UserCog size={20} />} subtitulo="Parroquia Santa Cruz · Chiquimulilla" pestanas={pestanas} pestanaActiva="inicio" onCambiarPestana={() => {}} />

      <div className="app-body">
        <Sidebar
          {...nav}
          moduloActivo="usuarios"
          esAdminOSacerdote={esAdmin}
          onCerrarSesion={() => setDialogo("confirmarCerrarSesion")}
          panelSuperior={
            <>
              <div className="sidebar__panel-title">RESUMEN DE CUENTAS</div>
              <div className="sidebar__panel-body">
                <div className="side-stat"><span>Total</span><span className="tag-count">{usuarios.length}</span></div>
                <div className="side-stat"><span>Activos</span><span className="tag-count">{usuarios.filter((u) => u.activo).length}</span></div>
                <div className="side-stat side-stat--total"><span>Inactivos</span><span>{usuarios.filter((u) => !u.activo).length}</span></div>
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
                      <input ref={inputRef} className="input" style={{ paddingLeft: 26 }} placeholder="Usuario, nombre, cargo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field__label">Rol</label>
                    <select className="select" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                      <option value="Todos">Todos los roles</option>
                      {roles.map((r) => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field__label">Estado</label>
                    <select className="select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}>
                      <option value="Todos">Todos</option>
                      <option value="Activos">Solo activos</option>
                      <option value="Inactivos">Solo inactivos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-wrap">
                <table className="grid">
                  <thead><tr><th style={{ width: 40 }}>#</th><th>Usuario</th><th>Nombre completo</th><th>Descripción / cargo</th><th>Roles</th><th style={{ width: 90 }}>Estado</th></tr></thead>
                  <tbody>
                    {paginados.map((u, i) => (
                      <tr key={u.id} className={seleccionadoId === u.id ? "is-selected" : ""} onClick={() => setSeleccionadoId(u.id)} onDoubleClick={() => { setModoFormulario("ver"); setDialogo("formulario"); }}>
                        <td className="grid__num">{(paginaActual - 1) * POR_PAGINA + i + 1}</td>
                        <td><strong>@{u.usuario}</strong></td>
                        <td>{u.nombre || "—"}</td>
                        <td className="muted">{u.descripcion || "—"}</td>
                        <td>{u.roles.map((r) => <span key={r} className="badge-role"><ShieldCheck size={11} /> {r}</span>)}</td>
                        <td><Chip tono={u.activo ? "activo" : "inactivo"}>{u.activo ? "Activo" : "Inactivo"}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginados.length === 0 && <div className="empty-inline">No se encontraron usuarios con los criterios actuales.</div>}
              </div>
              <Pagination pagina={paginaActual} totalPaginas={totalPaginas} totalRegistros={filtrados.length} porPagina={POR_PAGINA} etiqueta="usuarios" onCambio={setPagina} />
            </div>
          </div>
        </main>
      </div>

      <StatusBar contadorTexto={`Total: ${filtrados.length} usuarios`} mensajeEstado={mensajeEstado} usuario={usuario} />

      {dialogo === "formulario" && <UsuarioFormDialog modo={modoFormulario} usuario={seleccionado} roles={roles} onCerrar={() => setDialogo(null)} onGuardar={guardar} nextId={nextId} />}
      {dialogo === "confirmarEstado" && (
        <ConfirmDialog titulo={seleccionado?.activo ? "Desactivar usuario" : "Activar usuario"} mensaje={seleccionado?.activo ? `¿Está seguro de desactivar a @${seleccionado?.usuario}? No podrá iniciar sesión en el sistema.` : `¿Desea activar a @${seleccionado?.usuario}?`} textoConfirmar={seleccionado?.activo ? "Sí, desactivar" : "Sí, activar"} tono={seleccionado?.activo ? "alerta" : "neutro"} onConfirmar={cambiarEstado} onCancelar={() => setDialogo(null)} />
      )}
      {dialogo === "confirmarCerrarSesion" && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={onCerrarSesion} onCancelar={() => setDialogo(null)} />
      )}
    </div>
  );
}
