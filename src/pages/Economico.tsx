import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, CalendarClock, LayoutGrid, ScrollText, Truck, Wallet } from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { StatusBar } from "../components/layout/StatusBar";
import { Ribbon, type RibbonPestanaConfig } from "../components/layout/Ribbon";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { MovimientosSeccion } from "../components/economico/MovimientosSeccion";
import { CuentasSeccion } from "../components/economico/CuentasSeccion";
import { ProveedoresSeccion } from "../components/economico/ProveedoresSeccion";
import { VencimientosSeccion } from "../components/economico/VencimientosSeccion";
import { BalanceSeccion } from "../components/economico/BalanceSeccion";

const SECCIONES = [
  { ruta: "/economico", etiqueta: "Movimientos", icono: <ScrollText size={18} /> },
  { ruta: "/economico/cuentas", etiqueta: "Cuentas", icono: <LayoutGrid size={18} /> },
  { ruta: "/economico/proveedores", etiqueta: "Proveedores", icono: <Truck size={18} /> },
  { ruta: "/economico/vencimientos", etiqueta: "Vencimientos", icono: <CalendarClock size={18} /> },
  { ruta: "/economico/balance", etiqueta: "Balance", icono: <BookOpen size={18} /> },
];

/**
 * Módulo Económico — construido desde cero. No existe mockup previo, diseño
 * de referencia ni pantalla desarrollada: se elaboró a partir del esquema de
 * base de datos (backend/prisma/schema.prisma, modelos ec*) y del catálogo
 * de reportes documentado (backend/prisma/tipo-de-reportes-sp.md, sección 5).
 * Usa exactamente el mismo shell (Ribbon/Sidebar/StatusBar) y los mismos
 * componentes (Modal, Field, Chip, ConfirmDialog, Pagination) que el resto
 * de módulos, para que visualmente sea parte del mismo sistema.
 */
export function Economico() {
  const navigate = useNavigate();
  const location = useLocation();
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
      grupos: [{ etiqueta: "Secciones", botones: SECCIONES.map((s) => ({ etiqueta: s.etiqueta, icono: s.icono, onClick: () => navigate(s.ruta), activo: location.pathname === s.ruta })) }],
    },
  ];

  return (
    <div className="app-shell">
      <Ribbon tituloModulo="Económico y contabilidad parroquial" iconoModulo={<Wallet size={20} />} subtitulo="Parroquia Santa Cruz · Chiquimulilla" pestanas={pestanas} pestanaActiva="inicio" onCambiarPestana={() => {}} />

      <div className="app-body">
        <Sidebar
          moduloActivo="economico"
          onCerrarSesion={() => setConfirmarSalir(true)}
          panelSuperior={
            <>
              <div className="sidebar__panel-title">SECCIONES</div>
              <div className="sidebar__panel-body" style={{ padding: "6px 8px" }}>
                {SECCIONES.map((s) => (
                  <button key={s.ruta} className={`sidebar__item ${location.pathname === s.ruta ? "sidebar__item--active" : ""}`} style={{ marginBottom: 1 }} onClick={() => navigate(s.ruta)}>
                    {s.icono}{s.etiqueta}
                  </button>
                ))}
              </div>
            </>
          }
        />

        <main className="main">
          <Routes>
            <Route index element={<MovimientosSeccion onMensaje={setMensajeEstado} />} />
            <Route path="cuentas" element={<CuentasSeccion />} />
            <Route path="proveedores" element={<ProveedoresSeccion onMensaje={setMensajeEstado} />} />
            <Route path="vencimientos" element={<VencimientosSeccion onMensaje={setMensajeEstado} />} />
            <Route path="balance" element={<BalanceSeccion />} />
          </Routes>
        </main>
      </div>

      <StatusBar contadorTexto="Módulo Económico" mensajeEstado={mensajeEstado} usuario="Secretaría parroquial" />

      {confirmarSalir && (
        <ConfirmDialog titulo="Cerrar sesión" mensaje="¿Deseas cerrar la sesión actual?" textoConfirmar="Cerrar sesión" tono="neutro" onConfirmar={() => navigate("/agenda")} onCancelar={() => setConfirmarSalir(false)} />
      )}
    </div>
  );
}
