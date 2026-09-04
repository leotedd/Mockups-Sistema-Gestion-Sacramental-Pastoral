import { useState } from "react";
import { Church, MessageSquareWarning, Plus, Save, Trash2, UserPlus } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextAreaField, TextField } from "../ui/Field";
import { LIBROS_SEED, TIPOS_SACRAMENTO, type NotaMarginal, type ParticipanteSacramento, type RegistroSacramental, type RelacionSacramental, type TipoSacramento } from "../../data/sacramental";

interface Props {
  modo: "nuevo" | "ver" | "editar";
  registro: RegistroSacramental | null;
  onCerrar: () => void;
  onGuardar: (r: RegistroSacramental) => void;
  nextId: () => string;
}

/** Diseñado a partir de backend/src/modules/sacramentos/dto/*.dto.ts y los modelos sacramento/salibro/saparticipante/sanotamarginal del schema. Sin pantalla real que reproducir todavía. */
export function RegistroFormDialog({ modo, registro, onCerrar, onGuardar, nextId }: Props) {
  const soloLectura = modo === "ver";
  const [tipo, setTipo] = useState<TipoSacramento>(registro?.tipo ?? "Bautismo");
  const [persona, setPersona] = useState(registro?.persona ?? "");
  const [persona2, setPersona2] = useState(registro?.persona2 ?? "");
  const [libro, setLibro] = useState(registro?.libroSacramental ?? LIBROS_SEED[0]);
  const [anio, setAnio] = useState(registro?.anio ?? "2026");
  const [folio, setFolio] = useState(registro?.folio ?? "");
  const [acta, setActa] = useState(registro?.acta ?? "");
  const [fecha, setFecha] = useState(registro?.fecha ?? "");
  const [cumple, setCumple] = useState(registro?.cumpleDerechoCanonico ?? true);
  const [esExterno, setEsExterno] = useState(registro?.esExterno ?? false);
  const [observaciones, setObservaciones] = useState(registro?.observaciones ?? "");
  const [participantes, setParticipantes] = useState<ParticipanteSacramento[]>(registro?.participantes ?? []);
  const [notas] = useState<NotaMarginal[]>(registro?.notasMarginales ?? []);
  const [nombreParticipante, setNombreParticipante] = useState("");
  const [relacion, setRelacion] = useState<RelacionSacramental>("Padrino");
  const [errores, setErrores] = useState<{ persona?: string }>({});

  const agregarParticipante = () => {
    if (!nombreParticipante.trim()) return;
    setParticipantes((l) => [...l, { personaId: `tmp-${Date.now()}`, nombre: nombreParticipante.trim(), relacion }]);
    setNombreParticipante("");
  };

  const guardar = () => {
    if (!persona.trim()) { setErrores({ persona: "Ingrese la persona principal." }); return; }
    onGuardar({ id: registro?.id ?? nextId(), tipo, persona: persona.trim(), persona2: tipo === "Matrimonio" ? persona2.trim() || undefined : undefined, libroSacramental: libro, anio, folio, acta, fecha, cumpleDerechoCanonico: cumple, anulada: registro?.anulada ?? false, esExterno, observaciones, participantes, notasMarginales: notas });
  };

  const titulo = modo === "nuevo" ? "Nuevo registro sacramental" : modo === "editar" ? "Editar registro" : "Detalle del registro";

  return (
    <Modal
      titulo={titulo}
      icon={<Church size={16} />}
      wide
      onClose={onCerrar}
      footer={soloLectura ? <Button onClick={onCerrar}>Cerrar</Button> : <><Button onClick={onCerrar}>Cancelar</Button><Button variante="primary" icon={<Save size={14} />} onClick={guardar}>Guardar</Button></>}
    >
      <div className="form-grid">
        <SelectField label="Tipo de sacramento" disabled={soloLectura} value={tipo} onChange={(e) => setTipo(e.target.value as TipoSacramento)}>
          {TIPOS_SACRAMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
        <TextField label={tipo === "Matrimonio" ? "Contrayente 1" : tipo === "Exequias" ? "Difunto(a)" : "Persona"} required disabled={soloLectura} value={persona} error={errores.persona} onChange={(e) => setPersona(e.target.value)} />
        {tipo === "Matrimonio" && <TextField label="Contrayente 2" disabled={soloLectura} value={persona2} onChange={(e) => setPersona2(e.target.value)} />}
        <SelectField label="Libro sacramental" disabled={soloLectura} value={libro} onChange={(e) => setLibro(e.target.value)}>
          {LIBROS_SEED.map((l) => <option key={l} value={l}>{l}</option>)}
        </SelectField>
        <TextField label="Fecha" type="date" disabled={soloLectura} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <TextField label="Año" disabled={soloLectura} value={anio} onChange={(e) => setAnio(e.target.value)} />
        <TextField label="Folio" disabled={soloLectura} value={folio} onChange={(e) => setFolio(e.target.value)} />
        <TextField label="Acta" disabled={soloLectura} value={acta} onChange={(e) => setActa(e.target.value)} />
        <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input type="checkbox" disabled={soloLectura} checked={cumple} onChange={(e) => setCumple(e.target.checked)} />
          <span className="field__label" style={{ margin: 0 }}>Cumple derecho canónico</span>
        </label>
        <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input type="checkbox" disabled={soloLectura} checked={esExterno} onChange={(e) => setEsExterno(e.target.checked)} />
          <span className="field__label" style={{ margin: 0 }}>Registrado en otra parroquia (externo)</span>
        </label>
        <TextAreaField label="Observaciones" className="col-span-3" disabled={soloLectura} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
      </div>

      <section className="form-section" style={{ marginTop: 6 }}>
        <div className="form-section__head"><UserPlus size={14} /> PADRINOS / TESTIGOS <span className="tag-count">{participantes.length}</span></div>
        <div className="form-section__body">
          {!soloLectura && (
            <div className="btn-row" style={{ marginBottom: 10 }}>
              <input className="input" style={{ maxWidth: 260 }} placeholder="Nombre" value={nombreParticipante} onChange={(e) => setNombreParticipante(e.target.value)} />
              <select className="select" style={{ maxWidth: 160 }} value={relacion} onChange={(e) => setRelacion(e.target.value as RelacionSacramental)}>
                <option value="Padrino">Padrino</option><option value="Madrina">Madrina</option><option value="Testigo">Testigo</option>
              </select>
              <Button sm icon={<Plus size={14} />} onClick={agregarParticipante}>Agregar</Button>
            </div>
          )}
          {participantes.length === 0 ? <div className="empty-inline">Sin padrinos ni testigos registrados.</div> : (
            <div className="table-wrap">
              <table className="grid">
                <thead><tr><th>Nombre</th><th style={{ width: 120 }}>Relación</th>{!soloLectura && <th className="grid__col-actions">Acciones</th>}</tr></thead>
                <tbody>{participantes.map((p) => (
                  <tr key={p.personaId}><td>{p.nombre}</td><td>{p.relacion}</td>
                    {!soloLectura && <td className="grid__col-actions"><button className="link-btn" onClick={() => setParticipantes((l) => l.filter((x) => x.personaId !== p.personaId))}><Trash2 size={13} /> Quitar</button></td>}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {notas.length > 0 && (
        <section className="form-section">
          <div className="form-section__head"><MessageSquareWarning size={14} /> NOTAS MARGINALES <span className="tag-count">{notas.length}</span></div>
          <div className="form-section__body">
            <div className="table-wrap">
              <table className="grid">
                <thead><tr><th style={{ width: 140 }}>Razón</th><th style={{ width: 100 }}>Fecha</th><th>Nota</th></tr></thead>
                <tbody>{notas.map((n) => <tr key={n.id}><td>{n.razon}</td><td className="nowrap">{n.fecha}</td><td>{n.nota}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </Modal>
  );
}
