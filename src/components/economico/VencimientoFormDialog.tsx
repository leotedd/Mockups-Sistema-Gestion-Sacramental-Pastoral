import { useState } from "react";
import { CalendarClock, Save } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextField } from "../ui/Field";
import type { Vencimiento } from "../../data/economico";
import { FECHA_SIMULADA } from "../../context/AppShellContext";

interface Props {
  onCerrar: () => void;
  onGuardar: (v: Vencimiento) => void;
  nextId: () => string;
}

/** Diseñado a partir del modelo ecvencimiento del schema (cuentas por cobrar/pagar). */
export function VencimientoFormDialog({ onCerrar, onGuardar, nextId }: Props) {
  const [concepto, setConcepto] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [importe, setImporte] = useState("");
  const [esDebito, setEsDebito] = useState<"si" | "no">("si");
  const [error, setError] = useState<string | undefined>();

  const guardar = () => {
    if (!concepto.trim() || !fechaVencimiento || !importe) { setError("Complete concepto, fecha de vencimiento e importe."); return; }
    onGuardar({ id: nextId(), concepto: concepto.trim(), fechaIngreso: FECHA_SIMULADA, fechaVencimiento, importe: Number(importe), esDebito: esDebito === "si", cancelado: false });
  };

  return (
    <Modal titulo="Nuevo vencimiento" icon={<CalendarClock size={16} />} onClose={onCerrar} footer={<><Button onClick={onCerrar}>Cancelar</Button><Button variante="primary" icon={<Save size={14} />} onClick={guardar}>Guardar</Button></>}>
      <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <TextField label="Concepto" required className="col-span-2" value={concepto} error={error} onChange={(e) => setConcepto(e.target.value)} />
        <TextField label="Fecha de vencimiento" required type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
        <TextField label="Importe (Q)" required type="number" value={importe} onChange={(e) => setImporte(e.target.value)} />
        <SelectField label="Tipo" className="col-span-2" value={esDebito} onChange={(e) => setEsDebito(e.target.value as "si" | "no")}>
          <option value="si">Por pagar (débito)</option>
          <option value="no">Por cobrar</option>
        </SelectField>
      </div>
    </Modal>
  );
}
