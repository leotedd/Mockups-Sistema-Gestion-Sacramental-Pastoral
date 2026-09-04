import { useState } from "react";
import { useAppShell } from "./context/AppShellContext";
import type { SidebarNavProps } from "./components/layout/Sidebar";
import { Login } from "./pages/Login";
import { Agenda } from "./pages/Agenda";
import { Personas } from "./pages/Personas";
import { Familias } from "./pages/Familias";
import { Catequesis } from "./pages/Catequesis";
import { Sacramental } from "./pages/Sacramental";
import { Economico } from "./pages/Economico";
import { Celebraciones } from "./pages/Celebraciones";
import { Parroquias } from "./pages/Parroquias";
import { Usuarios } from "./pages/Usuarios";

export type Vista =
  | "agenda"
  | "personas"
  | "familias"
  | "catequesis"
  | "sacramental"
  | "economico"
  | "celebraciones"
  | "parroquias"
  | "usuarios";

/**
 * Reproduce EXACTAMENTE la arquitectura de navegación de App.tsx del
 * desarrollo real: el sistema principal NO usa React Router para moverse
 * entre módulos — es un estado `vista` en memoria con un switch, y cada
 * página recibe las funciones `onAbrirX` como props para cambiarlo. El
 * mockup usaba antes rutas de React Router para esto (arquitectura
 * distinta a la real), lo que era la causa raíz del comportamiento
 * inconsistente al navegar entre módulos: dos mecanismos de navegación
 * conviviendo (historial del navegador + estado de React) podían quedar
 * desincronizados, sobre todo tras recargas en caliente (HMR) durante el
 * desarrollo. Al adoptar el mismo patrón que el sistema real ese problema
 * desaparece de raíz, porque solo hay UNA fuente de verdad (el estado
 * `vista`) y cada módulo se desmonta/monta de forma limpia en cada cambio.
 */
export default function App() {
  const { autenticado, esAdmin, cerrarSesion } = useAppShell();
  const [vista, setVista] = useState<Vista>("agenda");

  const handleCerrarSesion = () => {
    cerrarSesion();
    setVista("agenda");
  };

  const nav: SidebarNavProps = {
    onNavegarAgenda: () => setVista("agenda"),
    onAbrirPersonas: () => setVista("personas"),
    onAbrirFamilias: () => setVista("familias"),
    onAbrirCatequesis: () => setVista("catequesis"),
    onAbrirSacramental: () => setVista("sacramental"),
    onAbrirEconomico: () => setVista("economico"),
    onAbrirCelebraciones: () => setVista("celebraciones"),
    onAbrirParroquias: () => setVista("parroquias"),
    onAbrirUsuarios: () => setVista("usuarios"),
  };

  const renderVista = () => {
    // Igual que en el sistema real: si se intenta ver Parroquias o Usuarios
    // sin ser Administrador/Sacerdote/Párroco, se muestra Agenda en su lugar.
    if ((vista === "parroquias" || vista === "usuarios") && !esAdmin) {
      return <Agenda {...nav} onCerrarSesion={handleCerrarSesion} />;
    }

    switch (vista) {
      case "personas":
        return <Personas {...nav} onCerrarSesion={handleCerrarSesion} />;
      case "familias":
        return <Familias {...nav} onCerrarSesion={handleCerrarSesion} />;
      case "catequesis":
        return <Catequesis {...nav} onCerrarSesion={handleCerrarSesion} />;
      case "sacramental":
        return <Sacramental {...nav} onCerrarSesion={handleCerrarSesion} />;
      case "economico":
        return <Economico {...nav} onCerrarSesion={handleCerrarSesion} />;
      case "celebraciones":
        return <Celebraciones {...nav} onCerrarSesion={handleCerrarSesion} />;
      case "parroquias":
        return <Parroquias {...nav} onCerrarSesion={handleCerrarSesion} />;
      case "usuarios":
        return <Usuarios {...nav} onCerrarSesion={handleCerrarSesion} />;
      case "agenda":
      default:
        return <Agenda {...nav} onCerrarSesion={handleCerrarSesion} />;
    }
  };

  return autenticado ? renderVista() : <Login />;
}
