import { useState } from "react";
import { CalendarPlus, Save } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextAreaField, TextField } from "../ui/Field";
import { PRIORIDADES, RECORDATORIOS, type Cita, type Prioridad, type Recordatorio } from "../../data/agenda";

interface Props {
  cita: Cita | null;
  fechaSugerida?: string;
  guardando?: boolean;
  onGuardar: (c: Cita) => void;
  onCancelar: () => void;
  nextId: () => string;
}

/** Reproduce components/AppointmentDialog.tsx del desarrollo real. */
export function CitaFormDialog({ cita, fechaSugerida, guardando, onGuardar, onCancelar, nextId }: Props) {
  const edicion = Boolean(cita);
  const [asunto, setAsunto] = useState(cita?.asunto ?? "");
  const [lugar, setLugar] = useState(cita?.lugar ?? "");
  const [fecha, setFecha] = useState((cita?.inicio ?? fechaSugerida ?? "").slice(0, 10));
  const [horaDesde, setHoraDesde] = useState((cita?.inicio ?? "").slice(11, 16) || "08:00");
  const [horaHasta, setHoraHasta] = useState((cita?.fin ?? "").slice(11, 16) || "09:00");
  const [prioridad, setPrioridad] = useState<Prioridad>(cita?.prioridad ?? "Media");
  const [recordatorio, setRecordatorio] = useState<Recordatorio>(cita?.recordatorio ?? "15 min");
  const [observaciones, setObservaciones] = useState(cita?.observaciones ?? "");
  const [errores, setErrores] = useState<{ asunto?: string }>({});

  // Único campo obligatorio en components/AppointmentDialog.tsx del desarrollo real: el asunto.
  const guardar = () => {
    const e: typeof errores = {};
    if (!asunto.trim()) e.asunto = "Indique el asunto de la cita.";
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    onGuardar({
      id: edicion && cita ? cita.id : nextId(),
      asunto: asunto.trim(),
      lugar: lugar.trim(),
      inicio: `${fecha}T${horaDesde}`,
      fin: `${fecha}T${horaHasta}`,
      prioridad,
      recordatorio,
      observaciones: observaciones.trim(),
      cancelada: cita?.cancelada,
    });
  };

  return (
    <Modal
      titulo={edicion ? "Editar cita" : "Nueva cita"}
      icon={<CalendarPlus size={16} />}
      onClose={onCancelar}
      footer={
        <>
          <Button onClick={onCancelar} disabled={guardando}>Cancelar</Button>
          <Button variante="primary" icon={<Save size={14} />} onClick={guardar} disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="form-grid">
        <TextField label="Asunto" required className="col-span-3" value={asunto} error={errores.asunto} onChange={(e) => setAsunto(e.target.value)} />
        <TextField label="Lugar" className="col-span-2" value={lugar} onChange={(e) => setLugar(e.target.value)} />
        <TextField label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <TextField label="Hora desde" type="time" value={horaDesde} onChange={(e) => setHoraDesde(e.target.value)} />
        <TextField label="Hora hasta" type="time" value={horaHasta} onChange={(e) => setHoraHasta(e.target.value)} />
        <SelectField label="Prioridad" value={prioridad} onChange={(e) => setPrioridad(e.target.value as Prioridad)}>
          {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
        </SelectField>
        <SelectField label="Recordatorio" className="col-span-2" value={recordatorio} onChange={(e) => setRecordatorio(e.target.value as Recordatorio)}>
          {RECORDATORIOS.map((r) => <option key={r} value={r}>{r}</option>)}
        </SelectField>
        <TextAreaField label="Observaciones" className="col-span-3" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
      </div>
    </Modal>
  );
}
