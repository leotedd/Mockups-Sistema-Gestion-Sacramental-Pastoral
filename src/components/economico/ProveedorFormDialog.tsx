import { useState } from "react";
import { Save, Truck } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { TextField } from "../ui/Field";
import type { Proveedor } from "../../data/economico";

interface Props {
  proveedor: Proveedor | null;
  onCerrar: () => void;
  onGuardar: (p: Proveedor) => void;
  nextId: () => string;
}

/** Diseñado a partir del modelo ecproveedores del schema. */
export function ProveedorFormDialog({ proveedor, onCerrar, onGuardar, nextId }: Props) {
  const [descripcion, setDescripcion] = useState(proveedor?.descripcion ?? "");
  const [direccion, setDireccion] = useState(proveedor?.direccion ?? "");
  const [localidad, setLocalidad] = useState(proveedor?.localidad ?? "Chiquimulilla");
  const [telefono, setTelefono] = useState(proveedor?.telefono ?? "");
  const [email, setEmail] = useState(proveedor?.email ?? "");
  const [contacto, setContacto] = useState(proveedor?.contacto ?? "");
  const [error, setError] = useState<string | undefined>();

  const guardar = () => {
    if (!descripcion.trim()) { setError("Ingrese el nombre del proveedor."); return; }
    onGuardar({ id: proveedor?.id ?? nextId(), descripcion: descripcion.trim(), direccion, localidad, telefono, email, contacto });
  };

  return (
    <Modal titulo={proveedor ? "Editar proveedor" : "Nuevo proveedor"} icon={<Truck size={16} />} onClose={onCerrar} footer={<><Button onClick={onCerrar}>Cancelar</Button><Button variante="primary" icon={<Save size={14} />} onClick={guardar}>Guardar</Button></>}>
      <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <TextField label="Nombre / razón social" required className="col-span-2" value={descripcion} error={error} onChange={(e) => setDescripcion(e.target.value)} />
        <TextField label="Dirección" className="col-span-2" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <TextField label="Localidad" value={localidad} onChange={(e) => setLocalidad(e.target.value)} />
        <TextField label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <TextField label="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Persona de contacto" value={contacto} onChange={(e) => setContacto(e.target.value)} />
      </div>
    </Modal>
  );
}
