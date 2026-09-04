import { ArrowLeft, Church, HandHeart, Pencil, Printer, Star, Trash2, Users } from "lucide-react";
import type { Celebracion } from "../../data/types";
import { Button } from "../ui/Button";
import { EstadoChip } from "../ui/EstadoChip";
import { formatFechaLarga, capitalizar } from "../../utils/format";

interface Props {
  celebracion: Celebracion;
  aviso?: string | null;
  onCerrarAviso: () => void;
  onVolver: () => void;
  onImprimir: () => void;
  onEliminar: () => void;
  onEditar: () => void;
}

const SIN_DATO = "—";

/**
 * Reproduce components/celebraciones/CelebracionDetalle.tsx del desarrollo
 * real: 7 campos en "Información general" (Tipo/Estado/Fecha/Lugar/Hora
 * desde/Hora hasta/Observaciones) — el mockup anterior mostraba un campo
 * "Sacramentos asociados" que no existe en el sistema real y combinaba
 * Hora desde/hasta en un solo campo "Horario".
 */
export function CelebracionDetalle({ celebracion, onVolver, onImprimir, onEliminar, onEditar }: Props) {
  return (
    <div className="page" style={{ borderRadius: 0, border: "none", boxShadow: "none" }}>
      <div className="page__head">
        <div>
          <h1 className="page__title">Detalle de celebración</h1>
          <div className="page__subtitle">Vista de solo lectura</div>
        </div>
        <div className="btn-row">
          <Button icon={<ArrowLeft size={14} />} onClick={onVolver}>Volver</Button>
          <Button icon={<Printer size={14} />} onClick={onImprimir}>Imprimir</Button>
          <Button icon={<Trash2 size={14} />} variante="danger" onClick={onEliminar}>Eliminar</Button>
          <Button icon={<Pencil size={14} />} variante="primary" onClick={onEditar}>Editar</Button>
        </div>
      </div>

      <div className="page__body">
        <section className="form-section">
          <div className="form-section__head"><Church size={14} /> 1. INFORMACIÓN GENERAL</div>
          <div className="form-section__body">
            <div className="def-grid">
              <div className="def"><span className="def__k">Tipo de celebración</span><span className="def__v">{celebracion.tipo}</span></div>
              <div className="def"><span className="def__k">Estado</span><span className="def__v"><EstadoChip estado={celebracion.estado} /></span></div>
              <div className="def"><span className="def__k">Fecha</span><span className="def__v">{capitalizar(formatFechaLarga(celebracion.fecha))}</span></div>
              <div className="def"><span className="def__k">Lugar</span><span className="def__v">{celebracion.lugar}</span></div>
              <div className="def"><span className="def__k">Hora desde</span><span className="def__v">{celebracion.horaDesde}</span></div>
              <div className="def"><span className="def__k">Hora hasta</span><span className="def__v">{celebracion.horaHasta || SIN_DATO}</span></div>
              <div className="def def--full"><span className="def__k">Observaciones</span><span className="def__v">{celebracion.observaciones || <span className="muted">{SIN_DATO}</span>}</span></div>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head"><Users size={14} /> CELEBRANTES</div>
          <div className="form-section__body">
            {celebracion.celebrantes.length === 0 ? (
              <div className="empty-inline">Sin celebrantes asignados.</div>
            ) : (
              <ul style={{ border: "1px solid var(--linea)", borderRadius: "var(--radio)", listStyle: "none", margin: 0, padding: 0 }}>
                {celebracion.celebrantes.map((c, i) => (
                  <li key={c.personaId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderTop: i > 0 ? "1px solid var(--linea-suave)" : undefined }}>
                    <span>{c.nombre}</span>
                    {c.principal && <span className="chip chip--confirmada"><Star size={11} /> Principal</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head"><HandHeart size={14} /> INTENCIONES</div>
          <div className="form-section__body">
            {celebracion.intenciones.length === 0 ? (
              <div className="empty-inline">Sin intenciones registradas.</div>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
                {celebracion.intenciones.map((i) => (
                  <li key={i.id} style={{ border: "1px solid var(--linea)", borderRadius: "var(--radio)", padding: "8px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span className="chip chip--confirmada">{i.tipo}</span>
                      <strong>{i.descripcion}</strong>
                    </div>
                    <div className="small muted" style={{ marginTop: 3 }}>
                      Solicitante: {i.solicitante || SIN_DATO}
                      {typeof i.importe === "number" && <> · Ofrenda: Q{i.importe.toFixed(2)}</>}
                      {" "}· Observaciones: {i.observaciones || SIN_DATO}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
