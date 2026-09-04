import { useState } from "react";
import { Church, Save } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextField } from "../ui/Field";
import type { Obispado, Parroquia } from "../../data/parroquias";

interface Props {
  modo: "nuevo" | "ver" | "editar";
  parroquia: Parroquia | null;
  obispados: Obispado[];
  onCerrar: () => void;
  onGuardar: (p: Parroquia) => void;
  nextId: () => string;
}

/** Reproduce components/ParroquiaFormDialog.tsx del desarrollo real. */
export function ParroquiaFormDialog({ modo, parroquia, obispados, onCerrar, onGuardar, nextId }: Props) {
  const soloLectura = modo === "ver";
  const [nombre, setNombre] = useState(parroquia?.nombre ?? "");
  const [parroco, setParroco] = useState(parroquia?.parroco ?? "");
  const [municipio, setMunicipio] = useState(parroquia?.municipio ?? "");
  const [direccion, setDireccion] = useState(parroquia?.direccion ?? "");
  const [telefono, setTelefono] = useState(parroquia?.telefono ?? "");
  const [horario, setHorario] = useState(parroquia?.horarioAtencion ?? "");
  const [idObispado, setIdObispado] = useState(parroquia?.idObispado ?? obispados[0]?.id ?? "");
  const [errores, setErrores] = useState<{ nombre?: string; parroco?: string; municipio?: string }>({});

  // "El nombre, párroco y municipio son campos obligatorios." — igual que components/ParroquiaFormDialog.tsx real.
  const guardar = () => {
    const e: typeof errores = {};
    if (!nombre.trim()) e.nombre = "Ingrese el nombre de la parroquia.";
    if (!parroco.trim()) e.parroco = "Ingrese el párroco encargado.";
    if (!municipio.trim()) e.municipio = "Ingrese el municipio.";
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    onGuardar({ id: parroquia?.id ?? nextId(), nombre: nombre.trim(), parroco: parroco.trim(), municipio, direccion, telefono, horarioAtencion: horario, idObispado, activo: parroquia?.activo ?? true });
  };

  // Títulos alineados 1:1 con components/ParroquiaFormDialog.tsx del desarrollo real.
  const titulo = modo === "nuevo" ? "Registrar nueva parroquia" : modo === "editar" ? "Editar datos de parroquia" : "Detalle de la parroquia";

  return (
    <Modal
      titulo={titulo}
      icon={<Church size={16} />}
      wide
      onClose={onCerrar}
      footer={soloLectura ? <Button onClick={onCerrar}>Cerrar</Button> : <><Button onClick={onCerrar}>Cancelar</Button><Button variante="primary" icon={<Save size={14} />} onClick={guardar}>Guardar</Button></>}
    >
      <div className="form-grid">
        <TextField label="Nombre" required disabled={soloLectura} className="col-span-2" value={nombre} error={errores.nombre} onChange={(e) => setNombre(e.target.value)} />
        <TextField label="Párroco / encargado" required disabled={soloLectura} value={parroco} error={errores.parroco} onChange={(e) => setParroco(e.target.value)} />
        <TextField label="Municipio" required disabled={soloLectura} value={municipio} error={errores.municipio} onChange={(e) => setMunicipio(e.target.value)} />
        <TextField label="Dirección" disabled={soloLectura} className="col-span-2" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <TextField label="Teléfono" disabled={soloLectura} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <TextField label="Horario de atención" disabled={soloLectura} value={horario} onChange={(e) => setHorario(e.target.value)} />
        <SelectField label="Diócesis / obispado" disabled={soloLectura} value={idObispado} onChange={(e) => setIdObispado(e.target.value)}>
          {obispados.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}
        </SelectField>
      </div>
    </Modal>
  );
}
