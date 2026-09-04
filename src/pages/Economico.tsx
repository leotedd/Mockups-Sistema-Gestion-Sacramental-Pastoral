import { useEffect, useState } from "react";
import { useAppShell } from "../context/AppShellContext";
import { BookOpen, CalendarClock, LayoutGrid, ScrollText, Truck, Wallet } from "lucide-react";
import { Sidebar, type SidebarNavProps } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { MovimientosSeccion } from "../components/economico/MovimientosSeccion";
import { CuentasSeccion } from "../components/economico/CuentasSeccion";
import { ProveedoresSeccion } from "../components/economico/ProveedoresSeccion";
import { VencimientosSeccion } from "../components/economico/VencimientosSeccion";
import { BalanceSeccion } from "../components/economico/BalanceSeccion";

type Seccion = "movimientos" | "cuentas" | "proveedores" | "vencimientos" | "balance";

const SECCIONES: Array<{ id: Seccion; etiqueta: string; icono: JSX.Element }> = [
  { id: "movimientos", etiqueta: "Movimientos", icono: <ScrollText size={18} /> },
  { id: "cuentas", etiqueta: "Cuentas", icono: <LayoutGrid size={18} /> },
  { id: "proveedores", etiqueta: "Proveedores", icono: <Truck size={18} /> },
  { id: "vencimientos", etiqueta: "Vencimientos", icono: <CalendarClock size={18} /> },
  { id: "balance", etiqueta: "Balance", icono: <BookOpen size={18} /> },
];

interface Props extends SidebarNavProps {
  onCerrarSesion: () => void;
}

/**
 * Módulo Económico — construido desde cero. No existe mockup previo, diseño
 * de referencia ni pantalla desarrollada: se elaboró a partir del esquema de
 * base de datos (backend/prisma/schema.prisma, modelos ec*) y del catálogo
 * de reportes documentado (backend/prisma/tipo-de-reportes-sp.md, sección 5).
 * Usa exactamente el mismo shell (Ribbon/Sidebar/StatusBar) y los mismos
 * componentes (Modal, Field, Chip, ConfirmDialog, Pagination) que el resto
 * de módulos. Sus 5 secciones internas se alternan con estado local (no
 * rutas), igual que el resto del sistema real (que tampoco usa router).
 */
export function Economico({ onCerrarSesion, ...nav }: Props) {
  const { usuario, esAdmin } = useAppShell();
  const [seccion, setSeccion] = useState<Seccion>("movimientos");
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const [confirmarSalir, setConfirmarSalir] = useState(false);

  useEffect(() => {
    if (!mensajeEstado) return;
    const t = setTimeout(() => setMensajeEstado(null), 4000);
    return () => clearTimeout(t);
  }, [mensajeEstado]);

  const pestanas: RibbonPestanaConfig[] = [
    {
      id: "inicio", etiqueta: "Inicio",
      grupos: [{ etiqueta: "Secciones", botones: SECCIONES.map((s) => ({ etiqueta: s.etiqueta, icono: s.icono, onClick: () => setSeccion(s.id), activo: seccion === s.id })) }],
    },
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Económico y contabilidad parroquial" iconoModulo={<Wallet size={20} />} subtitulo="Parroquia Santa Cruz · Chiquimulilla" pestanas={pestanas} pestanaActiva="inicio" onCambiarPestana={() => {}} />

      <div className="app-body">
        <Sidebar
          {...nav}
          moduloActivo="economico"
          esAdminOSacerdote={esAdmin}
          onCerrarSesion={() => setConfirmarSalir(true)}
          panelSuperior={
            <>
              <div className="sidebar__panel-title">SECCIONES</div>
              <div className="sidebar__panel-body" style={{ padding: "6px 8px" }}>
                {SECCIONES.map((s) => (
                  <button key={s.id} className={`sidebar__item ${seccion === s.id ? "sidebar__item--active" : ""}`} style={{ marginBottom: 1 }} onClick={() => setSeccion(s.id)}>
                    {s.icono}{s.etiqueta}
                  </button>
                ))}
              </div>
            </>
          }
        />

        <main className="main">
          {seccion === "movimientos" && <MovimientosSeccion onMensaje={setMensajeEstado} />}
          {seccion === "cuentas" && <CuentasSeccion />}
          {seccion === "proveedores" && <ProveedoresSeccion onMensaje={setMensajeEstado} />}
          {seccion === "vencimientos" && <VencimientosSeccion onMensaje={setMensajeEstado} />}
          {seccion === "balance" && <BalanceSeccion />}
        </main>
      </div>

      <StatusBar contadorTexto="Módulo Económico" mensajeEstado={mensajeEstado} usuario={usuario} />

      {confirmarSalir && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={onCerrarSesion} onCancelar={() => setConfirmarSalir(false)} />
      )}
    </div>
  );
}
