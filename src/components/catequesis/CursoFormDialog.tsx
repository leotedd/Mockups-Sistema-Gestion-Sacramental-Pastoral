import { useState } from "react";
import { BookOpen, CalendarPlus2, Plus, Save, Trash2, UserPlus } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextField } from "../ui/Field";
import { AULAS_SEED, TIPOS_CURSO, type Curso, type ParticipanteCurso, type ClaseCurso, type TipoCurso, type FuncionCatequesis } from "../../data/catequesis";

interface Props {
  modo: "nuevo" | "ver" | "editar";
  curso: Curso | null;
  onCerrar: () => void;
  onGuardar: (c: Curso) => void;
  nextId: () => string;
}

/** Diseñado a partir de backend/src/modules/catequesis/dto/*.dto.ts (CrearCursoDto, InscribirParticipanteDto, CrearClaseDto). Sin pantalla real que reproducir todavía. */
export function CursoFormDialog({ modo, curso, onCerrar, onGuardar, nextId }: Props) {
  const soloLectura = modo === "ver";
  const [tipoCurso, setTipoCurso] = useState<TipoCurso>(curso?.tipoCurso ?? "Primera Comunión");
  const [ciclo, setCiclo] = useState(curso?.ciclo ?? "2026-II");
  const [periodoDesde, setPeriodoDesde] = useState(curso?.periodoDesde ?? "");
  const [periodoHasta, setPeriodoHasta] = useState(curso?.periodoHasta ?? "");
  const [aulaPrincipal, setAulaPrincipal] = useState(curso?.aulaPrincipal ?? AULAS_SEED[0].descripcion);
  const [participantes, setParticipantes] = useState<ParticipanteCurso[]>(curso?.participantes ?? []);
  const [clases, setClases] = useState<ClaseCurso[]>(curso?.clases ?? []);
  const [nombreParticipante, setNombreParticipante] = useState("");
  const [funcion, setFuncion] = useState<FuncionCatequesis>("Catequisando");
  const [temaClase, setTemaClase] = useState("");
  const [fechaClase, setFechaClase] = useState("");

  const agregarParticipante = () => {
    if (!nombreParticipante.trim()) return;
    setParticipantes((l) => [...l, { personaId: `tmp-${Date.now()}`, nombre: nombreParticipante.trim(), funcion }]);
    setNombreParticipante("");
  };
  const agregarClase = () => {
    if (!temaClase.trim() || !fechaClase) return;
    setClases((l) => [...l, { id: `tmp-${Date.now()}`, fecha: fechaClase, aula: aulaPrincipal, tema: temaClase.trim() }]);
    setTemaClase(""); setFechaClase("");
  };

  const guardar = () => onGuardar({ id: curso?.id ?? nextId(), tipoCurso, ciclo, periodoDesde, periodoHasta, aulaPrincipal, participantes, clases });

  const titulo = modo === "nuevo" ? "Nuevo curso de catequesis" : modo === "editar" ? "Editar curso" : "Detalle del curso";

  return (
    <Modal
      titulo={titulo}
      icon={<BookOpen size={16} />}
      wide
      onClose={onCerrar}
      footer={soloLectura ? <Button onClick={onCerrar}>Cerrar</Button> : <><Button onClick={onCerrar}>Cancelar</Button><Button variante="primary" icon={<Save size={14} />} onClick={guardar}>Guardar</Button></>}
    >
      <div className="form-grid">
        <SelectField label="Tipo de curso" disabled={soloLectura} value={tipoCurso} onChange={(e) => setTipoCurso(e.target.value as TipoCurso)}>
          {TIPOS_CURSO.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
        <TextField label="Ciclo" disabled={soloLectura} value={ciclo} onChange={(e) => setCiclo(e.target.value)} />
        <SelectField label="Aula principal" disabled={soloLectura} value={aulaPrincipal} onChange={(e) => setAulaPrincipal(e.target.value)}>
          {AULAS_SEED.map((a) => <option key={a.id} value={a.descripcion}>{a.descripcion}</option>)}
        </SelectField>
        <TextField label="Periodo desde" type="date" disabled={soloLectura} value={periodoDesde} onChange={(e) => setPeriodoDesde(e.target.value)} />
        <TextField label="Periodo hasta" type="date" disabled={soloLectura} value={periodoHasta} onChange={(e) => setPeriodoHasta(e.target.value)} />
      </div>

      <section className="form-section" style={{ marginTop: 6 }}>
        <div className="form-section__head"><UserPlus size={14} /> PARTICIPANTES <span className="tag-count">{participantes.length}</span></div>
        <div className="form-section__body">
          {!soloLectura && (
            <div className="btn-row" style={{ marginBottom: 10 }}>
              <input className="input" style={{ maxWidth: 260 }} placeholder="Nombre del participante" value={nombreParticipante} onChange={(e) => setNombreParticipante(e.target.value)} />
              <select className="select" style={{ maxWidth: 160 }} value={funcion} onChange={(e) => setFuncion(e.target.value as FuncionCatequesis)}>
                <option value="Catequisando">Catequisando</option>
                <option value="Catequista">Catequista</option>
              </select>
              <Button sm icon={<Plus size={14} />} onClick={agregarParticipante}>Agregar</Button>
            </div>
          )}
          {participantes.length === 0 ? <div className="empty-inline">Sin participantes inscritos.</div> : (
            <div className="table-wrap">
              <table className="grid">
                <thead><tr><th>Nombre</th><th style={{ width: 140 }}>Función</th>{!soloLectura && <th className="grid__col-actions">Acciones</th>}</tr></thead>
                <tbody>
                  {participantes.map((p) => (
                    <tr key={p.personaId}>
                      <td>{p.nombre}</td><td>{p.funcion}</td>
                      {!soloLectura && <td className="grid__col-actions"><button className="link-btn" onClick={() => setParticipantes((l) => l.filter((x) => x.personaId !== p.personaId))}><Trash2 size={13} /> Quitar</button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="form-section">
        <div className="form-section__head"><CalendarPlus2 size={14} /> CLASES <span className="tag-count">{clases.length}</span></div>
        <div className="form-section__body">
          {!soloLectura && (
            <div className="btn-row" style={{ marginBottom: 10 }}>
              <input className="input" type="date" style={{ maxWidth: 160 }} value={fechaClase} onChange={(e) => setFechaClase(e.target.value)} />
              <input className="input" style={{ maxWidth: 280 }} placeholder="Tema de la clase" value={temaClase} onChange={(e) => setTemaClase(e.target.value)} />
              <Button sm icon={<Plus size={14} />} onClick={agregarClase}>Agregar</Button>
            </div>
          )}
          {clases.length === 0 ? <div className="empty-inline">Sin clases registradas.</div> : (
            <div className="table-wrap">
              <table className="grid">
                <thead><tr><th style={{ width: 100 }}>Fecha</th><th>Tema</th><th>Aula</th></tr></thead>
                <tbody>{clases.map((c) => <tr key={c.id}><td className="nowrap">{c.fecha}</td><td>{c.tema}</td><td>{c.aula}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </Modal>
  );
}
