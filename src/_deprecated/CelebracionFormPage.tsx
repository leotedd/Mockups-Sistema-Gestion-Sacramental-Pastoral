import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  FilePlus2,
  X,
  UserPlus,
  HandHeart,
  Trash2,
  Star,
  ClipboardList,
  Users,
  CalendarPlus,
  TriangleAlert,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { escuchar } from "../utils/bus";
import { SelectField, TextField, TextAreaField } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { TIPOS_CELEBRACION, LUGARES, ESTADOS } from "../data/catalogos";
import type { Celebracion, Celebrante, EstadoCelebracion, Intencion } from "../data/types";
import { SeleccionarCelebranteModal } from "../components/modals/SeleccionarCelebranteModal";
import { AgregarIntencionModal } from "../components/modals/AgregarIntencionModal";

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

type Errores = Partial<Record<"tipo" | "fecha" | "horaDesde" | "lugar" | "horaHasta", string>>;

export function CelebracionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCelebracion, crearCelebracion, actualizarCelebracion, notificar, nextId, setStatus } =
    useApp();

  const edicion = Boolean(id);
  const original = id ? getCelebracion(id) : undefined;

  const [form, setForm] = useState<FormState>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [modal, setModal] = useState<null | "celebrante" | "intencion">(null);
  const [baseline, setBaseline] = useState<string>(() => JSON.stringify(VACIO));
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);

  const hayCambios = JSON.stringify(form) !== baseline;

  useEffect(() => {
    setStatus(edicion ? 1 : 0, edicion ? "celebración en edición" : "celebración nueva");
  }, [edicion, setStatus]);

  useEffect(() => {
    if (edicion && original) {
      const cargado: FormState = {
        tipo: original.tipo,
        fecha: original.fecha,
        horaDesde: original.horaDesde,
        horaHasta: original.horaHasta ?? "",
        lugar: original.lugar,
        estado: original.estado,
        observaciones: original.observaciones ?? "",
        celebrantes: original.celebrantes.map((c) => ({ ...c })),
        intenciones: original.intenciones.map((i) => ({ ...i })),
      };
      setForm(cargado);
      setBaseline(JSON.stringify(cargado));
    }
  }, [edicion, original]);

  useEffect(() => {
    const off1 = escuchar("ribbon:add-celebrante", () => setModal("celebrante"));
    const off2 = escuchar("ribbon:add-intencion", () => setModal("intencion"));
    return () => {
      off1();
      off2();
    };
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validar = (): boolean => {
    const e: Errores = {};
    if (!form.tipo) e.tipo = "Seleccione el tipo de celebración.";
    if (!form.fecha) e.fecha = "Indique la fecha.";
    if (!form.horaDesde) e.horaDesde = "Indique la hora de inicio.";
    if (!form.lugar) e.lugar = "Seleccione el lugar.";
    if (form.horaHasta && form.horaDesde && form.horaHasta <= form.horaDesde)
      e.horaHasta = "La hora final debe ser posterior a la hora de inicio.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const construir = (): Celebracion => ({
    id: edicion && original ? original.id : nextId(),
    tipo: form.tipo as Celebracion["tipo"],
    fecha: form.fecha,
    horaDesde: form.horaDesde,
    horaHasta: form.horaHasta || undefined,
    lugar: form.lugar,
    estado: form.estado,
    observaciones: form.observaciones.trim() || undefined,
    celebrantes: form.celebrantes,
    intenciones: form.intenciones,
    sacramentosAsociados: edicion && original ? original.sacramentosAsociados : [],
  });

  const guardar = (accion: "guardar" | "guardar-nuevo") => {
    if (!validar()) {
      notificar("error", "Revise el formulario", "Hay campos obligatorios sin completar.");
      return;
    }
    const c = construir();
    if (edicion) {
      actualizarCelebracion(c);
      notificar("success", "Actualización exitosa", "Los cambios de la celebración se guardaron correctamente.");
      navigate(`/celebracion/${c.id}`);
      return;
    }
    crearCelebracion(c);
    notificar("success", "Guardado exitoso", "La celebración se registró correctamente.");
    if (accion === "guardar-nuevo") {
      setForm(VACIO);
      setBaseline(JSON.stringify(VACIO));
      setErrores({});
      window.scrollTo({ top: 0 });
    } else {
      navigate("/");
    }
  };

  const salir = () => {
    if (edicion && original) navigate(`/celebracion/${original.id}`);
    else navigate("/");
  };

  const cancelar = () => {
    if (hayCambios) setConfirmarCancelar(true);
    else salir();
  };

  const agregarCelebrante = (c: Celebrante) => {
    setForm((f) => ({ ...f, celebrantes: [...f.celebrantes, c] }));
    setModal(null);
    notificar("info", "Celebrante agregado", c.nombre);
  };

  const quitarCelebrante = (personaId: string) => {
    setForm((f) => {
      const lista = f.celebrantes.filter((c) => c.personaId !== personaId);
      if (lista.length > 0 && !lista.some((c) => c.principal)) lista[0].principal = true;
      return { ...f, celebrantes: lista };
    });
  };

  const marcarPrincipal = (personaId: string) => {
    setForm((f) => ({
      ...f,
      celebrantes: f.celebrantes.map((c) => ({ ...c, principal: c.personaId === personaId })),
    }));
  };

  const agregarIntencion = (i: Intencion) => {
    setForm((f) => ({ ...f, intenciones: [...f.intenciones, i] }));
    setModal(null);
    notificar("info", "Intención agregada", i.tipo);
  };

  const quitarIntencion = (idInt: string) => {
    setForm((f) => ({ ...f, intenciones: f.intenciones.filter((i) => i.id !== idInt) }));
  };

  const yaSeleccionados = useMemo(
    () => form.celebrantes.map((c) => c.personaId),
    [form.celebrantes]
  );

  if (edicion && !original) {
    return (
      <div className="page">
        <div className="page__body">
          <div className="empty-inline">No se encontró la celebración solicitada.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">
            {edicion ? <Save size={17} /> : <CalendarPlus size={17} />}
            {edicion ? "Editar celebración" : "Nueva celebración"}
          </h1>
          <div className="page__subtitle">
            {edicion
              ? "Modifique los datos de la celebración y guarde los cambios."
              : "Complete los datos para registrar una nueva celebración en la programación parroquial."}
          </div>
        </div>
      </div>

      <div className="page__body">
        <div className="help-note">
          <ClipboardList size={15} />
          <span>
            Los campos marcados con <span style={{ color: "var(--peligro)" }}>*</span> son
            obligatorios. Use los botones <strong>Agregar celebrante</strong> y{" "}
            <strong>Agregar intención</strong> (aquí o en el Ribbon) para completar las secciones
            correspondientes.
          </span>
        </div>

        {/* DATOS GENERALES */}
        <section className="form-section">
          <div className="form-section__head">
            <CalendarPlus size={14} /> DATOS GENERALES
          </div>
          <div className="form-section__body">
            <div className="form-grid">
              <SelectField
                label="Tipo de celebración"
                required
                value={form.tipo}
                error={errores.tipo}
                onChange={(e) => set("tipo", e.target.value)}
              >
                <option value="">— Seleccione —</option>
                {TIPOS_CELEBRACION.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </SelectField>

              <TextField
                label="Fecha"
                required
                type="date"
                value={form.fecha}
                error={errores.fecha}
                onChange={(e) => set("fecha", e.target.value)}
              />

              <SelectField
                label="Estado"
                value={form.estado}
                onChange={(e) => set("estado", e.target.value as EstadoCelebracion)}
              >
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </SelectField>

              <TextField
                label="Hora desde"
                required
                type="time"
                value={form.horaDesde}
                error={errores.horaDesde}
                onChange={(e) => set("horaDesde", e.target.value)}
              />

              <TextField
                label="Hora hasta"
                type="time"
                value={form.horaHasta}
                error={errores.horaHasta}
                onChange={(e) => set("horaHasta", e.target.value)}
              />

              <SelectField
                label="Lugar"
                required
                value={form.lugar}
                error={errores.lugar}
                onChange={(e) => set("lugar", e.target.value)}
              >
                <option value="">— Seleccione —</option>
                {LUGARES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </SelectField>

              <TextAreaField
                label="Observaciones"
                className="col-span-3"
                value={form.observaciones}
                placeholder="Notas internas: preparativos, coro, logística, avisos..."
                onChange={(e) => set("observaciones", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CELEBRANTES */}
        <section className="form-section">
          <div className="form-section__head">
            <Users size={14} /> CELEBRANTES
          </div>
          <div className="form-section__body">
            <div className="section-toolbar">
              <span className="section-toolbar__hint">
                Puede agregar uno o varios celebrantes. El marcado con estrella es el celebrante
                principal.
              </span>
              <Button sm icon={<UserPlus size={14} />} onClick={() => setModal("celebrante")}>
                Agregar celebrante
              </Button>
            </div>

            {form.celebrantes.length === 0 ? (
              <div className="empty-inline">Todavía no se ha agregado ningún celebrante.</div>
            ) : (
              <div className="table-wrap">
                <table className="grid">
                  <thead>
                    <tr>
                      <th style={{ width: 46 }}>Principal</th>
                      <th>Celebrante</th>
                      <th>Tipo / rol</th>
                      <th className="grid__col-actions">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.celebrantes.map((c) => (
                      <tr key={c.personaId}>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="link-btn"
                            title="Marcar como principal"
                            onClick={() => marcarPrincipal(c.personaId)}
                            style={{ textDecoration: "none" }}
                          >
                            <Star
                              size={15}
                              fill={c.principal ? "var(--dorado)" : "none"}
                              color={c.principal ? "var(--dorado)" : "var(--texto-3)"}
                            />
                          </button>
                        </td>
                        <td>{c.nombre}</td>
                        <td>{c.rol}</td>
                        <td className="grid__col-actions">
                          <button className="link-btn" onClick={() => quitarCelebrante(c.personaId)}>
                            <Trash2 size={13} /> Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* INTENCIONES */}
        <section className="form-section">
          <div className="form-section__head">
            <HandHeart size={14} /> INTENCIONES
          </div>
          <div className="form-section__body">
            <div className="section-toolbar">
              <span className="section-toolbar__hint">
                Registre las intenciones solicitadas para esta celebración.
              </span>
              <Button sm icon={<HandHeart size={14} />} onClick={() => setModal("intencion")}>
                Agregar intención
              </Button>
            </div>

            {form.intenciones.length === 0 ? (
              <div className="empty-inline">No se han registrado intenciones.</div>
            ) : (
              <div className="table-wrap">
                <table className="grid">
                  <thead>
                    <tr>
                      <th style={{ width: 150 }}>Tipo de intención</th>
                      <th>Intención / descripción</th>
                      <th style={{ width: 170 }}>Solicitante</th>
                      <th className="grid__col-actions">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.intenciones.map((i) => (
                      <tr key={i.id}>
                        <td>{i.tipo}</td>
                        <td>
                          {i.descripcion}
                          {i.observaciones && (
                            <div className="small muted">Obs.: {i.observaciones}</div>
                          )}
                        </td>
                        <td>{i.solicitante ?? <span className="muted">—</span>}</td>
                        <td className="grid__col-actions">
                          <button className="link-btn" onClick={() => quitarIntencion(i.id)}>
                            <Trash2 size={13} /> Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ACCIONES */}
        <div className="btn-row" style={{ justifyContent: "space-between", marginTop: 4 }}>
          <span className="small muted">
            {hayCambios ? "Cambios sin guardar" : "Sin cambios pendientes"}
          </span>
          <div className="btn-row">
          <Button icon={<X size={14} />} onClick={cancelar}>
            Cancelar
          </Button>
          {!edicion && (
            <Button icon={<FilePlus2 size={14} />} onClick={() => guardar("guardar-nuevo")}>
              Guardar y nuevo
            </Button>
          )}
          <Button variante="primary" icon={<Save size={14} />} onClick={() => guardar("guardar")}>
            {edicion ? "Guardar cambios" : "Guardar"}
          </Button>
          </div>
        </div>
      </div>

      {confirmarCancelar && (
        <Modal
          titulo="Cambios sin guardar"
          icon={<TriangleAlert size={16} />}
          onClose={() => setConfirmarCancelar(false)}
          footer={
            <>
              <Button onClick={() => setConfirmarCancelar(false)}>Seguir editando</Button>
              <Button variante="danger" icon={<X size={14} />} onClick={salir}>
                Salir sin guardar
              </Button>
            </>
          }
        >
          <p className="mt-0" style={{ fontSize: 13.5 }}>
            <strong>
              Hay cambios sin guardar en {edicion ? "esta celebración" : "el formulario"}.
            </strong>
          </p>
          <p className="muted small">
            Si sale ahora se perderán las modificaciones realizadas. ¿Desea salir sin guardar?
          </p>
        </Modal>
      )}

      {modal === "celebrante" && (
        <SeleccionarCelebranteModal
          yaSeleccionados={yaSeleccionados}
          onCancelar={() => setModal(null)}
          onSeleccionar={agregarCelebrante}
        />
      )}
      {modal === "intencion" && (
        <AgregarIntencionModal onCancelar={() => setModal(null)} onAgregar={agregarIntencion} />
      )}
    </div>
  );
}
