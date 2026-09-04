import { useState } from "react";
import { HandHeart, Plus } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextField, TextAreaField } from "../ui/Field";
import { TIPOS_INTENCION } from "../../data/catalogos";
import type { Intencion } from "../../data/types";

interface Props {
  onCancelar: () => void;
  onAgregar: (intencion: Intencion) => void;
}

/* 06 - AGREGAR INTENCION */
export function AgregarIntencionModal({ onCancelar, onAgregar }: Props) {
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errores, setErrores] = useState<{ tipo?: string; descripcion?: string }>({});

  const agregar = () => {
    const e: typeof errores = {};
    if (!tipo) e.tipo = "Seleccione el tipo de intención.";
    if (!descripcion.trim()) e.descripcion = "Ingrese la intención o descripción.";
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    onAgregar({
      id: `int-${Date.now()}`,
      tipo: tipo as Intencion["tipo"],
      descripcion: descripcion.trim(),
      solicitante: solicitante.trim() || undefined,
      observaciones: observaciones.trim() || undefined,
    });
  };

  return (
    <Modal
      titulo="Agregar intención"
      icon={<HandHeart size={16} />}
      onClose={onCancelar}
      footer={
        <>
          <Button onClick={onCancelar}>Cancelar</Button>
          <Button variante="primary" icon={<Plus size={14} />} onClick={agregar}>
            Agregar
          </Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 11 }}>
        <SelectField
          label="Tipo de intención"
          required
          value={tipo}
          error={errores.tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">— Seleccione —</option>
          {TIPOS_INTENCION.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectField>

        <TextAreaField
          label="Intención / descripción"
          required
          value={descripcion}
          error={errores.descripcion}
          placeholder="Ej. Por el eterno descanso de..."
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <TextField
          label="Solicitante"
          value={solicitante}
          placeholder="Persona o familia que solicita la intención"
          onChange={(e) => setSolicitante(e.target.value)}
        />

        <TextAreaField
          label="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>
    </Modal>
  );
}
