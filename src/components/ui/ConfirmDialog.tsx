import { AlertTriangle, Trash2, Check } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface Props {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  tono?: "alerta" | "neutro";
  onConfirmar: () => void;
  onCancelar: () => void;
}

/**
 * Modal de confirmacion generico (equivalente a components/ConfirmDialog.tsx
 * del desarrollo real), usado por los modulos que no requieren un resumen
 * detallado del registro (Celebraciones conserva su propio modal bespoke,
 * ConfirmarEliminacionModal, igual que en el sistema real).
 */
export function ConfirmDialog({ titulo, mensaje, textoConfirmar = "Confirmar", tono = "alerta", onConfirmar, onCancelar }: Props) {
  return (
    <Modal
      titulo={titulo}
      icon={<AlertTriangle size={16} />}
      onClose={onCancelar}
      footer={
        <>
          <Button onClick={onCancelar}>Cancelar</Button>
          <Button
            variante={tono === "alerta" ? "danger" : "primary"}
            icon={tono === "alerta" ? <Trash2 size={14} /> : <Check size={14} />}
            onClick={onConfirmar}
            autoFocus
          >
            {textoConfirmar}
          </Button>
        </>
      }
    >
      <p className="mt-0" style={{ fontSize: 13.5 }}>
        {mensaje}
      </p>
    </Modal>
  );
}
