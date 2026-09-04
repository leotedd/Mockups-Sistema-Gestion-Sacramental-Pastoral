import type { ReactNode } from "react";
import { Printer } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { FECHA_SIMULADA } from "../../context/AppShellContext";
import { formatFechaLarga, capitalizar } from "../../utils/format";

interface Props {
  titulo: string;
  subtitulo?: string;
  encabezados: string[];
  filas: ReactNode[][];
  onImprimir: () => void;
  onCancelar: () => void;
}

/**
 * Vista previa de impresión GENÉRICA, reutilizada por Agenda y Personas
 * (equivalente a components/{PrintPreviewDialog,PersonasPrintPreviewDialog}.tsx
 * del desarrollo real: ambos módulos SÍ tienen impresión implementada).
 * Celebraciones NO usa este componente porque su impresión todavía está
 * pendiente en el sistema real (ver aviso en CelebracionDetalle).
 */
export function PrintPreviewDialog({ titulo, subtitulo, encabezados, filas, onImprimir, onCancelar }: Props) {
  return (
    <Modal
      titulo="Vista previa de impresión"
      icon={<Printer size={16} />}
      wide
      onClose={onCancelar}
      footer={
        <>
          <Button onClick={onCancelar}>Cerrar</Button>
          <Button variante="primary" icon={<Printer size={14} />} onClick={onImprimir}>Imprimir</Button>
        </>
      }
    >
      <div className="print-sheet" style={{ padding: "20px 22px" }}>
        <div className="print-sheet__header">
          <div className="print-sheet__parish">Parroquia Santa Cruz</div>
          <div className="print-sheet__city">Chiquimulilla, Santa Rosa</div>
          <div className="print-sheet__doctitle">{titulo}</div>
          {subtitulo && <div className="print-sheet__range">{subtitulo}</div>}
        </div>
        <table className="print-grid">
          <thead>
            <tr>{encabezados.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i}>{fila.map((celda, j) => <td key={j}>{celda}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <div className="print-sheet__foot">
          <span>Emitido: {capitalizar(formatFechaLarga(FECHA_SIMULADA))}</span>
          <span>Sistema Integral de Gestión Sacramental y Pastoral</span>
        </div>
      </div>
    </Modal>
  );
}
