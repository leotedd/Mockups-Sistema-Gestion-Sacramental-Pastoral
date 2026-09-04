import { useState } from "react";
import { Home, Plus, Save, Trash2, UserPlus } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextField } from "../ui/Field";
import { TIPOS_RESIDENCIA, TIPOS_UNION, TIPOS_INTEGRANTE, type Familia, type IntegranteFamilia, type TipoIntegrante, type TipoResidencia, type TipoUnion } from "../../data/familias";

interface Props {
  modo: "nuevo" | "ver" | "editar";
  familia: Familia | null;
  onCerrar: () => void;
  onGuardar: (f: Familia) => void;
  nextId: () => string;
}

/** Diseñado a partir de backend/src/modules/familias/dto/familia.dto.ts (CrearFamiliaDto, IntegranteFamiliaInputDto). Sin pantalla real que reproducir todavía. */
export function FamiliaFormDialog({ modo, familia, onCerrar, onGuardar, nextId }: Props) {
  const soloLectura = modo === "ver";
  const [nombre, setNombre] = useState(familia?.nombre ?? "");
  const [tipoResidencia, setTipoResidencia] = useState<TipoResidencia>(familia?.tipoResidencia ?? "No especifica");
  const [padre, setPadre] = useState(familia?.padre ?? "");
  const [madre, setMadre] = useState(familia?.madre ?? "");
  const [tipoUnion, setTipoUnion] = useState<TipoUnion>(familia?.tipoUnion ?? "No especifica");
  const [fechaUnion, setFechaUnion] = useState(familia?.fechaUnion ?? "");
  const [domicilio, setDomicilio] = useState(familia?.domicilio ?? "");
  const [localidad, setLocalidad] = useState(familia?.localidad ?? "Chiquimulilla");
  const [telefono, setTelefono] = useState(familia?.telefono ?? "");
  const [radioParroquial, setRadioParroquial] = useState(familia?.perteneceRadioParroquial ?? true);
  const [integrantes, setIntegrantes] = useState<IntegranteFamilia[]>(familia?.integrantes ?? []);
  const [nombreIntegrante, setNombreIntegrante] = useState("");
  const [tipoIntegrante, setTipoIntegrante] = useState<TipoIntegrante>("Hijo(a)");
  const [errores, setErrores] = useState<{ nombre?: string }>({});

  const agregarIntegrante = () => {
    if (!nombreIntegrante.trim()) return;
    setIntegrantes((l) => [...l, { personaId: `tmp-${Date.now()}`, nombre: nombreIntegrante.trim(), tipo: tipoIntegrante }]);
    setNombreIntegrante("");
  };
  const quitarIntegrante = (id: string) => setIntegrantes((l) => l.filter((x) => x.personaId !== id));

  const guardar = () => {
    if (!nombre.trim()) { setErrores({ nombre: "Ingrese el nombre de la familia." }); return; }
    onGuardar({ id: familia?.id ?? nextId(), nombre: nombre.trim(), tipoResidencia, padre: padre || undefined, madre: madre || undefined, tipoUnion, fechaUnion: fechaUnion || undefined, domicilio, localidad, telefono, perteneceRadioParroquial: radioParroquial, integrantes });
  };

  const titulo = modo === "nuevo" ? "Nueva familia" : modo === "editar" ? "Editar familia" : "Ficha familiar";

  return (
    <Modal
      titulo={titulo}
      icon={<Home size={16} />}
      wide
      onClose={onCerrar}
      footer={soloLectura ? <Button onClick={onCerrar}>Cerrar</Button> : <><Button onClick={onCerrar}>Cancelar</Button><Button variante="primary" icon={<Save size={14} />} onClick={guardar}>Guardar</Button></>}
    >
      <div className="form-grid">
        <TextField label="Nombre de la familia" required disabled={soloLectura} className="col-span-3" value={nombre} error={errores.nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Familia Recinos Ovalle" />
        <TextField label="Padre" disabled={soloLectura} value={padre} onChange={(e) => setPadre(e.target.value)} />
        <TextField label="Madre" disabled={soloLectura} value={madre} onChange={(e) => setMadre(e.target.value)} />
        <SelectField label="Tipo de unión" disabled={soloLectura} value={tipoUnion} onChange={(e) => setTipoUnion(e.target.value as TipoUnion)}>
          {TIPOS_UNION.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
        <TextField label="Fecha de unión" type="date" disabled={soloLectura} value={fechaUnion} onChange={(e) => setFechaUnion(e.target.value)} />
        <SelectField label="Tipo de residencia" disabled={soloLectura} value={tipoResidencia} onChange={(e) => setTipoResidencia(e.target.value as TipoResidencia)}>
          {TIPOS_RESIDENCIA.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
        <TextField label="Teléfono" disabled={soloLectura} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <TextField label="Domicilio" disabled={soloLectura} className="col-span-2" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
        <TextField label="Localidad" disabled={soloLectura} value={localidad} onChange={(e) => setLocalidad(e.target.value)} />
        <label className="field col-span-3" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input type="checkbox" disabled={soloLectura} checked={radioParroquial} onChange={(e) => setRadioParroquial(e.target.checked)} />
          <span className="field__label" style={{ margin: 0 }}>Pertenece al radio parroquial</span>
        </label>
      </div>

      <section className="form-section" style={{ marginTop: 6 }}>
        <div className="form-section__head"><UserPlus size={14} /> INTEGRANTES</div>
        <div className="form-section__body">
          {!soloLectura && (
            <div className="btn-row" style={{ marginBottom: 10 }}>
              <input className="input" style={{ maxWidth: 260 }} placeholder="Nombre del integrante" value={nombreIntegrante} onChange={(e) => setNombreIntegrante(e.target.value)} />
              <select className="select" style={{ maxWidth: 180 }} value={tipoIntegrante} onChange={(e) => setTipoIntegrante(e.target.value as TipoIntegrante)}>
                {TIPOS_INTEGRANTE.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <Button sm icon={<Plus size={14} />} onClick={agregarIntegrante}>Agregar</Button>
            </div>
          )}
          {integrantes.length === 0 ? (
            <div className="empty-inline">Sin integrantes registrados.</div>
          ) : (
            <div className="table-wrap">
              <table className="grid">
                <thead><tr><th>Nombre</th><th style={{ width: 160 }}>Parentesco</th>{!soloLectura && <th className="grid__col-actions">Acciones</th>}</tr></thead>
                <tbody>
                  {integrantes.map((i) => (
                    <tr key={i.personaId}>
                      <td>{i.nombre}</td>
                      <td>{i.tipo}</td>
                      {!soloLectura && <td className="grid__col-actions"><button className="link-btn" onClick={() => quitarIntegrante(i.personaId)}><Trash2 size={13} /> Quitar</button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </Modal>
  );
}
