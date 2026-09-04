import { useState } from "react";
import { Save, UserRound } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextField } from "../ui/Field";
import { SEXOS, TIPOS_DOCUMENTO, type Persona, type Sexo, type TipoDocumento } from "../../data/personas";

interface Props {
  modo: "nuevo" | "ver" | "editar";
  persona: Persona | null;
  onCerrar: () => void;
  onGuardar: (p: Persona) => void;
  nextId: () => string;
}

/** Reproduce components/PersonaFormDialog.tsx del desarrollo real (modos nuevo/ver/editar en un mismo dialogo). */
export function PersonaFormDialog({ modo, persona, onCerrar, onGuardar, nextId }: Props) {
  const soloLectura = modo === "ver";
  const [nombres, setNombres] = useState(persona?.nombres ?? "");
  const [apellidos, setApellidos] = useState(persona?.apellidos ?? "");
  const [sexo, setSexo] = useState<Sexo>(persona?.sexo ?? "Femenino");
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>(persona?.tipoDocumento ?? "DPI");
  const [numeroDocumento, setNumeroDocumento] = useState(persona?.numeroDocumento ?? "");
  const [fechaNacimiento, setFechaNacimiento] = useState(persona?.fechaNacimiento ?? "");
  const [telefono, setTelefono] = useState(persona?.telefono ?? "");
  const [celular, setCelular] = useState(persona?.celular ?? "");
  const [direccion, setDireccion] = useState(persona?.direccion ?? "");
  const [localidad, setLocalidad] = useState(persona?.localidad ?? "Chiquimulilla");
  const [errores, setErrores] = useState<{ nombres?: string; apellidos?: string; numeroDocumento?: string }>({});

  const guardar = () => {
    const e: typeof errores = {};
    if (!nombres.trim()) e.nombres = "Ingrese los nombres.";
    if (!apellidos.trim()) e.apellidos = "Ingrese los apellidos.";
    if (!numeroDocumento.trim()) e.numeroDocumento = "Ingrese el número de documento.";
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    onGuardar({
      id: persona?.id ?? nextId(),
      nombres: nombres.trim(), apellidos: apellidos.trim(), sexo, tipoDocumento, numeroDocumento: numeroDocumento.trim(),
      fechaNacimiento, telefono, celular, direccion, localidad, estado: persona?.estado ?? "Activo",
    });
  };

  const titulo = modo === "nuevo" ? "Nueva persona" : modo === "editar" ? "Editar persona" : "Ficha de persona";

  return (
    <Modal
      titulo={titulo}
      icon={<UserRound size={16} />}
      wide
      onClose={onCerrar}
      footer={
        soloLectura ? (
          <Button onClick={onCerrar}>Cerrar</Button>
        ) : (
          <>
            <Button onClick={onCerrar}>Cancelar</Button>
            <Button variante="primary" icon={<Save size={14} />} onClick={guardar}>Guardar</Button>
          </>
        )
      }
    >
      <div className="form-grid">
        <TextField label="Nombres" required disabled={soloLectura} value={nombres} error={errores.nombres} onChange={(e) => setNombres(e.target.value)} />
        <TextField label="Apellidos" required disabled={soloLectura} className="col-span-2" value={apellidos} error={errores.apellidos} onChange={(e) => setApellidos(e.target.value)} />
        <SelectField label="Sexo" disabled={soloLectura} value={sexo} onChange={(e) => setSexo(e.target.value as Sexo)}>
          {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
        </SelectField>
        <SelectField label="Tipo de documento" disabled={soloLectura} value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}>
          {TIPOS_DOCUMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
        <TextField label="N.° de documento" required disabled={soloLectura} value={numeroDocumento} error={errores.numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} />
        <TextField label="Fecha de nacimiento" type="date" disabled={soloLectura} value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
        <TextField label="Teléfono" disabled={soloLectura} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <TextField label="Celular" disabled={soloLectura} value={celular} onChange={(e) => setCelular(e.target.value)} />
        <TextField label="Dirección" disabled={soloLectura} className="col-span-2" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <TextField label="Localidad" disabled={soloLectura} value={localidad} onChange={(e) => setLocalidad(e.target.value)} />
      </div>
    </Modal>
  );
}
