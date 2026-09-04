import { useState } from "react";
import {
  CalendarPlus,
  ClipboardList,
  FilePlus2,
  HandHeart,
  Plus,
  Save,
  Star,
  Trash2,
  TriangleAlert,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { SelectField, TextAreaField, TextField } from "../ui/Field";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { TIPOS_CELEBRACION, LUGARES, ESTADOS, TIPOS_INTENCION } from "../../data/catalogos";
import type { Celebracion, Celebrante, EstadoCelebracion, Intencion, TipoIntencion } from "../../data/types";
import { SeleccionarCelebranteModal } from "../modals/SeleccionarCelebranteModal";

interface FormState {
  tipo: string;
  fecha: string;
  horaDesde: string;
  horaHasta: string;
  lugar: string;
  estado: EstadoCelebracion;
  observaciones: string;
  celebrantes: Celebrante[];
  intenciones: Intencion[];
}

const VACIO: FormState = {
  tipo: "",
  fecha: "",
  horaDesde: "",
  horaHasta: "",
  lugar: "",
  estado: "Programada",
  observaciones: "",
  celebrantes: [],
  intenciones: [],
};

const BORRADOR_INTENCION_VACIO = { tipo: "" as TipoIntencion | "", descripcion: "", solicitante: "", observaciones: "", importe: "" };

type Errores = Partial<Record<"tipo" | "fecha" | "horaDesde" | "lugar" | "horaHasta", string>>;

function aFormState(c?: Celebracion): FormState {
  if (!c) return VACIO;
  return {
    tipo: c.tipo,
    fecha: c.fecha,
    horaDesde: c.horaDesde,
    horaHasta: c.horaHasta ?? "",
    lugar: c.lugar,
    estado: c.estado,
    observaciones: c.observaciones ?? "",
    celebrantes: c.celebrantes.map((x) => ({ ...x })),
    intenciones: c.intenciones.map((x) => ({ ...x })),
  };
}

interface Props {
  celebracionInicial?: Celebracion;
  /** "modal": pantalla Nueva celebración (dialogo). "pagina": Editar celebración (reemplaza el contenido principal, sin navegar de ruta) — igual que en pages/Celebraciones.tsx del desarrollo real. */
  variante: "modal" | "pagina";
  guardando?: boolean;
  error?: string | null;
  onGuardar: (c: Celebracion, opciones: { permanecer: boolean }) => void;
  onCancelar: () => void;
  nextId: () => string;
}

/**
 * Formulario compartido de Nueva/Editar celebración. Reproduce
 * components/celebraciones/{CelebracionForm,CelebrantesCelebracion,
 * IntencionesCelebracion}.tsx del desarrollo real:
 * - Orden de "Datos generales": Tipo/Estado, Fecha/Lugar, Hora desde/Hora
 *   hasta, Observaciones (antes el mockup tenía otro orden).
 * - Celebrantes: se marca el principal con un radio (antes era una estrella
 *   clicable) y NO se les asocia ningún "rol" — se seleccionan del padrón
 *   de Personas real.
 * - Intenciones: mini-formulario EN LÍNEA con Tipo/Solicitante/Ofrenda(Q)/
 *   Descripción/Observaciones (antes abría un modal aparte).
 */
export function CelebracionForm({ celebracionInicial, variante, guardando, error, onGuardar, onCancelar, nextId }: Props) {
  const edicion = Boolean(celebracionInicial);
  const [form, setForm] = useState<FormState>(() => aFormState(celebracionInicial));
  const [errores, setErrores] = useState<Errores>({});
  const [modalCelebrante, setModalCelebrante] = useState(false);
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);
  const [baseline] = useState(() => JSON.stringify(aFormState(celebracionInicial)));

  const [borradorIntencion, setBorradorIntencion] = useState(BORRADOR_INTENCION_VACIO);
  const [avisoIntencion, setAvisoIntencion] = useState<string | null>(null);

  const hayCambios = JSON.stringify(form) !== baseline;
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const validar = (): boolean => {
    const e: Errores = {};
    if (!form.tipo) e.tipo = "Seleccione el tipo de celebración.";
    if (!form.fecha) e.fecha = "Indique la fecha.";
    if (!form.horaDesde) e.horaDesde = "Indique la hora de inicio.";
    if (!form.lugar) e.lugar = "Seleccione el lugar.";
    if (form.horaHasta && form.horaDesde && form.horaHasta <= form.horaDesde) e.horaHasta = "La hora final debe ser posterior a la hora de inicio.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = (permanecer: boolean) => {
    if (!validar()) return;
    const c: Celebracion = {
      id: edicion && celebracionInicial ? celebracionInicial.id : nextId(),
      tipo: form.tipo as Celebracion["tipo"],
      fecha: form.fecha,
      horaDesde: form.horaDesde,
      horaHasta: form.horaHasta || undefined,
      lugar: form.lugar,
      estado: form.estado,
      observaciones: form.observaciones.trim() || undefined,
      celebrantes: form.celebrantes,
      intenciones: form.intenciones,
    };
    onGuardar(c, { permanecer });
    if (permanecer) {
      setForm(VACIO);
      setErrores({});
    }
  };

  const cancelar = () => (hayCambios ? setConfirmarCancelar(true) : onCancelar());

  const agregarCelebrante = (c: Celebrante) => {
    setForm((f) => ({ ...f, celebrantes: [...f.celebrantes, c] }));
    setModalCelebrante(false);
  };
  const quitarCelebrante = (personaId: string) =>
    setForm((f) => {
      const lista = f.celebrantes.filter((c) => c.personaId !== personaId);
      if (lista.length > 0 && !lista.some((c) => c.principal)) lista[0].principal = true;
      return { ...f, celebrantes: lista };
    });
  const marcarPrincipal = (personaId: string) =>
    setForm((f) => ({ ...f, celebrantes: f.celebrantes.map((c) => ({ ...c, principal: c.personaId === personaId })) }));

  const agregarIntencion = () => {
    if (!borradorIntencion.tipo || !borradorIntencion.descripcion.trim()) {
      setAvisoIntencion("La intención necesita tipo y descripción.");
      return;
    }
    const importeNumero = borradorIntencion.importe.trim() ? Number(borradorIntencion.importe) : undefined;
    if (importeNumero !== undefined && (Number.isNaN(importeNumero) || importeNumero < 0)) {
      setAvisoIntencion("La ofrenda debe ser un número válido.");
      return;
    }
    const nueva: Intencion = {
      id: `int-${Date.now()}`,
      tipo: borradorIntencion.tipo,
      descripcion: borradorIntencion.descripcion.trim(),
      solicitante: borradorIntencion.solicitante.trim() || undefined,
      observaciones: borradorIntencion.observaciones.trim() || undefined,
      importe: importeNumero,
    };
    setForm((f) => ({ ...f, intenciones: [...f.intenciones, nueva] }));
    setBorradorIntencion(BORRADOR_INTENCION_VACIO);
    setAvisoIntencion(null);
  };
  const quitarIntencion = (idInt: string) => setForm((f) => ({ ...f, intenciones: f.intenciones.filter((i) => i.id !== idInt) }));

  const cuerpo = (
    <>
      {error && (
        <div className="stub-note" style={{ marginBottom: 12, borderColor: "var(--peligro)", color: "var(--peligro-700)" }}>
          <TriangleAlert size={14} /> {error}
        </div>
      )}

      <div className="help-note">
        <ClipboardList size={15} />
        <span>Los campos marcados con <span style={{ color: "var(--peligro)" }}>*</span> son obligatorios.</span>
      </div>

      <section className="form-section">
        <div className="form-section__head"><CalendarPlus size={14} /> 1. DATOS GENERALES</div>
        <div className="form-section__body">
          <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            <SelectField label="Tipo de celebración" required value={form.tipo} error={errores.tipo} onChange={(e) => set("tipo", e.target.value)}>
              <option value="">— Seleccione —</option>
              {TIPOS_CELEBRACION.map((t) => <option key={t} value={t}>{t}</option>)}
            </SelectField>
            <SelectField label="Estado" value={form.estado} onChange={(e) => set("estado", e.target.value as EstadoCelebracion)}>
              {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </SelectField>
            <TextField label="Fecha" required type="date" value={form.fecha} error={errores.fecha} onChange={(e) => set("fecha", e.target.value)} />
            <SelectField label="Lugar" required value={form.lugar} error={errores.lugar} onChange={(e) => set("lugar", e.target.value)}>
              <option value="">— Seleccione —</option>
              {LUGARES.map((l) => <option key={l} value={l}>{l}</option>)}
            </SelectField>
            <TextField label="Hora desde" required type="time" value={form.horaDesde} error={errores.horaDesde} onChange={(e) => set("horaDesde", e.target.value)} />
            <TextField label="Hora hasta" type="time" value={form.horaHasta} error={errores.horaHasta} onChange={(e) => set("horaHasta", e.target.value)} />
            <TextAreaField label="Observaciones" className="col-span-2" value={form.observaciones} placeholder="Notas internas: preparativos, coro, logística, avisos..." onChange={(e) => set("observaciones", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section__head"><Users size={14} /> 2. CELEBRANTES</div>
        <div className="form-section__body">
          <div className="section-toolbar">
            <span className="section-toolbar__hint">Se persisten en la celebración. El marcado como principal aparece en el listado.</span>
            <Button sm icon={<UserPlus size={14} />} onClick={() => setModalCelebrante(true)}>Agregar celebrante</Button>
          </div>
          {form.celebrantes.length === 0 ? (
            <div className="empty-inline">Aún no se han agregado celebrantes.</div>
          ) : (
            <ul style={{ border: "1px solid var(--linea)", borderRadius: "var(--radio)", listStyle: "none", margin: 0, padding: 0 }}>
              {form.celebrantes.map((c, i) => (
                <li key={c.personaId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 12px", borderTop: i > 0 ? "1px solid var(--linea-suave)" : undefined }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="radio" name="celebrante-principal" checked={c.principal} onChange={() => marcarPrincipal(c.personaId)} />
                    <span>{c.nombre}</span>
                    {c.principal && <span className="chip chip--confirmada"><Star size={11} /> Principal</span>}
                  </label>
                  <button className="link-btn" onClick={() => quitarCelebrante(c.personaId)}><Trash2 size={13} /> Quitar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="form-section">
        <div className="form-section__head"><HandHeart size={14} /> 3. INTENCIONES</div>
        <div className="form-section__body">
          <div className="filters" style={{ margin: "0 0 12px", background: "var(--marfil-2)" }}>
            <div className="filters__grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <SelectField label="Tipo de intención *" value={borradorIntencion.tipo} onChange={(e) => { setBorradorIntencion((b) => ({ ...b, tipo: e.target.value as TipoIntencion })); setAvisoIntencion(null); }}>
                <option value="">Selecciona…</option>
                {TIPOS_INTENCION.map((t) => <option key={t} value={t}>{t}</option>)}
              </SelectField>
              <TextField label="Solicitante" value={borradorIntencion.solicitante} placeholder="Nombre de quien solicita" onChange={(e) => setBorradorIntencion((b) => ({ ...b, solicitante: e.target.value }))} />
              <TextField label="Ofrenda (Q)" type="number" min={0} step="0.01" value={borradorIntencion.importe} placeholder="0.00" onChange={(e) => { setBorradorIntencion((b) => ({ ...b, importe: e.target.value })); setAvisoIntencion(null); }} />
              <TextField label="Intención / descripción *" className="col-span-1" value={borradorIntencion.descripcion} placeholder="Ej. Por el eterno descanso de…" onChange={(e) => { setBorradorIntencion((b) => ({ ...b, descripcion: e.target.value })); setAvisoIntencion(null); }} />
              <TextAreaField label="Observaciones" className="col-span-2" value={borradorIntencion.observaciones} onChange={(e) => setBorradorIntencion((b) => ({ ...b, observaciones: e.target.value }))} />
            </div>
            <div className="filters__actions">
              <Button sm icon={<Plus size={14} />} onClick={agregarIntencion}>Agregar intención</Button>
              {avisoIntencion && <span className="field__error">{avisoIntencion}</span>}
            </div>
          </div>

          {form.intenciones.length === 0 ? (
            <div className="empty-inline">No se han agregado intenciones. Puedes registrar una o varias antes de guardar.</div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
              {form.intenciones.map((i) => (
                <li key={i.id} style={{ border: "1px solid var(--linea)", borderRadius: "var(--radio)", padding: "8px 12px", display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="chip chip--confirmada">{i.tipo}</span>
                      <strong>{i.descripcion}</strong>
                    </div>
                    <div className="small muted" style={{ marginTop: 3 }}>
                      {i.solicitante && <>Solicita: {i.solicitante} · </>}
                      {typeof i.importe === "number" && <>Ofrenda: Q{i.importe.toFixed(2)} · </>}
                      {i.observaciones || ""}
                    </div>
                  </div>
                  <button className="link-btn" onClick={() => quitarIntencion(i.id)}><Trash2 size={13} /> Quitar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {modalCelebrante && (
        <SeleccionarCelebranteModal yaSeleccionados={form.celebrantes.map((c) => c.personaId)} onCancelar={() => setModalCelebrante(false)} onSeleccionar={agregarCelebrante} />
      )}

      {confirmarCancelar && (
        <Modal
          titulo="Cambios sin guardar"
          icon={<TriangleAlert size={16} />}
          onClose={() => setConfirmarCancelar(false)}
          footer={
            <>
              <Button onClick={() => setConfirmarCancelar(false)}>Seguir editando</Button>
              <Button variante="danger" icon={<X size={14} />} onClick={onCancelar}>Salir sin guardar</Button>
            </>
          }
        >
          <p className="mt-0" style={{ fontSize: 13.5 }}><strong>Hay cambios sin guardar.</strong></p>
          <p className="muted small">Si sale ahora se perderán las modificaciones realizadas.</p>
        </Modal>
      )}
    </>
  );

  if (variante === "modal") {
    return (
      <Modal
        titulo="Nueva celebración"
        icon={<CalendarPlus size={16} />}
        wide
        onClose={cancelar}
        footerSplit
        footer={
          <>
            <span className="small muted">{hayCambios ? "Cambios sin guardar" : "Sin cambios pendientes"}</span>
            <div className="btn-row">
              <Button icon={<X size={14} />} onClick={cancelar} disabled={guardando}>Cancelar</Button>
              <Button icon={<FilePlus2 size={14} />} onClick={() => guardar(true)} disabled={guardando}>Guardar y nuevo</Button>
              <Button variante="primary" icon={<Save size={14} />} onClick={() => guardar(false)} disabled={guardando}>
                {guardando ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </>
        }
      >
        {cuerpo}
      </Modal>
    );
  }

  return (
    <div className="page" style={{ borderRadius: 0, border: "none", boxShadow: "none" }}>
      <div className="page__head">
        <div>
          <h1 className="page__title"><Save size={17} /> Editar celebración</h1>
          <div className="page__subtitle">Modifique los datos de la celebración y guarde los cambios.</div>
        </div>
      </div>
      <div className="page__body">
        {cuerpo}
        <div className="btn-row" style={{ justifyContent: "space-between", marginTop: 4 }}>
          <span className="small muted">{hayCambios ? "Cambios sin guardar" : "Sin cambios pendientes"}</span>
          <div className="btn-row">
            <Button icon={<X size={14} />} onClick={cancelar} disabled={guardando}>Cancelar</Button>
            <Button variante="primary" icon={<Save size={14} />} onClick={() => guardar(false)} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
