import { Sparkles } from "lucide-react";

interface Props {
  totalCelebraciones: number;
  resultadosVisibles: number;
  mensajeEstado: string | null;
  usuario: string;
}

/**
 * Status bar EXCLUSIVA de Celebraciones — reproduce
 * components/celebraciones/CelebracionesStatusBar.tsx del desarrollo real:
 * a diferencia de la barra de estado genérica (usada en Agenda, Personas,
 * etc.), esta NO muestra la fecha del sistema ni el indicador de conexión;
 * solo el nombre del módulo, el contador de resultados y el mensaje
 * transitorio.
 */
export function CelebracionesStatusBar({ totalCelebraciones, resultadosVisibles, mensajeEstado, usuario }: Props) {
  return (
    <footer className="statusbar">
      <div className="statusbar__group">
        <span><Sparkles size={12} style={{ display: "inline", marginRight: 5, verticalAlign: -2 }} />Módulo de Celebraciones</span>
        <span>{resultadosVisibles} de {totalCelebraciones} celebraciones</span>
      </div>
      <div className="statusbar__group">
        {mensajeEstado && <span>{mensajeEstado}</span>}
        <span>{usuario}</span>
      </div>
    </footer>
  );
}
