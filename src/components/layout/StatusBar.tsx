import { FECHA_SIMULADA } from "../../context/AppShellContext";
import { formatFechaLarga, capitalizar } from "../../utils/format";

interface Props {
  contadorTexto: string;
  mensajeEstado?: string | null;
  usuario: string;
}

/**
 * Barra de estado generica, reutilizada por todos los modulos (equivalente a
 * components/StatusBar.tsx del desarrollo real: fecha del sistema, contador
 * de registros, mensaje transitorio de la ultima accion, indicador de
 * conexion y usuario de la sesion).
 */
export function StatusBar({ contadorTexto, mensajeEstado, usuario }: Props) {
  return (
    <footer className="statusbar">
      <div className="statusbar__group">
        <span>Fecha del sistema: {capitalizar(formatFechaLarga(FECHA_SIMULADA))}</span>
        <span>{contadorTexto}</span>
      </div>
      <div className="statusbar__group">
        {mensajeEstado && <span style={{ color: "var(--dorado-claro)" }}>{mensajeEstado}</span>}
        <span>
          <i className="dot" /> Conectado al servidor parroquial
        </span>
        <span>{usuario}</span>
      </div>
    </footer>
  );
}
