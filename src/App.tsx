import { Navigate, Route, Routes } from "react-router-dom";
import { Agenda } from "./pages/Agenda";
import { Personas } from "./pages/Personas";
import { Familias } from "./pages/Familias";
import { Catequesis } from "./pages/Catequesis";
import { Sacramental } from "./pages/Sacramental";
import { Economico } from "./pages/Economico";
import { Celebraciones } from "./pages/Celebraciones";
import { Parroquias } from "./pages/Parroquias";
import { Usuarios } from "./pages/Usuarios";
import { EstadosPage } from "./pages/EstadosPage";

/**
 * Un modulo = una ruta (sin sub-rutas por accion CRUD): cada pagina maneja su
 * propio estado de dialogo/edicion internamente, igual que en el desarrollo
 * real (cada modulo real es una sola pantalla con dialogos, no una cascada
 * de rutas). El aterrizaje por defecto es Agenda, igual que `vista='agenda'`
 * en App.tsx del proyecto principal tras iniciar sesión.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/agenda" replace />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/personas" element={<Personas />} />
      <Route path="/familias" element={<Familias />} />
      <Route path="/catequesis" element={<Catequesis />} />
      <Route path="/sacramental" element={<Sacramental />} />
      <Route path="/economico/*" element={<Economico />} />
      <Route path="/celebraciones" element={<Celebraciones />} />
      <Route path="/parroquias" element={<Parroquias />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/estados" element={<EstadosPage />} />
      <Route path="*" element={<Navigate to="/agenda" replace />} />
    </Routes>
  );
}
