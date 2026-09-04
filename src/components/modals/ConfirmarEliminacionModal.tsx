import { TriangleAlert } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { Celebracion } from "../../data/types";
import { formatFecha } from "../../utils/format";

interface Props {
  celebracion: Celebracion;
  onCancelar: () => void;
  onEliminar: () => void;
}

/**
 * Reproduce components/celebraciones/CelebracionEliminarDialog.tsx del
 * desarrollo real: mensaje compacto de una sola línea de resumen (antes el
 * mockup mostraba una tabla completa con Tipo/Fecha/Lugar/Celebrante/Estado).
 */
export function ConfirmarEliminacionModal({ celebracion, onCancelar, onEliminar }: Props) {
  return (
    <Modal
      titulo="¿Desea eliminar esta celebración?"
      icon={<TriangleAlert size={16} />}
      onClose={onCancelar}
      footer={
        <>
          <Button onClick={onCancelar}>Cancelar</Button>
          <Button variante="danger" onClick={onEliminar} autoFocus>Eliminar</Button>
        </>
      }
    >
      <p className="mt-0" style={{ fontSize: 13.5 }}>Esta acción no se puede deshacer.</p>
      <p className="muted small" style={{ background: "var(--marfil)", border: "1px solid var(--linea)", borderRadius: "var(--radio)", padding: "6px 10px" }}>
        {celebracion.tipo} · {formatFecha(celebracion.fecha)} · {celebracion.horaDesde} · {celebracion.lugar}
      </p>
    </Modal>
  );
}
