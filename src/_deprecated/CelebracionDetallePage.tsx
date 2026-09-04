import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Printer, ArrowLeft, Trash2, FileText, Users, HandHeart, Church } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/Button";
import { EstadoChip } from "../components/ui/EstadoChip";
import { ConfirmarEliminacionModal } from "../components/modals/ConfirmarEliminacionModal";
import { EmptyState } from "../components/ui/States";
import { formatFechaLarga, formatHorario } from "../utils/format";

export function CelebracionDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCelebracion, setSelectedId, eliminarCelebracion, notificar, setStatus } = useApp();
  const celebracion = id ? getCelebracion(id) : undefined;
  const [confirmar, setConfirmar] = useState(false);

  useEffect(() => {
    if (id) setSelectedId(id);
    setStatus(1, "celebración");
  }, [id, setSelectedId, setStatus]);

  if (!celebracion) {
    return (
      <div className="page">
        <div className="page__body">
          <EmptyState
            titulo="Celebración no encontrada"
            desc="La celebración solicitada no existe o fue eliminada."
            accion={
              <Button sm onClick={() => navigate("/")}>
                Volver al listado
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const eliminar = () => {
    eliminarCelebracion(celebracion.id);
    notificar("success", "Eliminación exitosa", "La celebración fue eliminada.");
    navigate("/");
  };

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">
            <FileText size={17} /> Detalle de celebración
          </h1>
          <div className="page__subtitle">Vista de solo lectura</div>
        </div>
        <div className="btn-row">
          <Button icon={<ArrowLeft size={14} />} onClick={() => navigate("/")}>
            Volver
          </Button>
          <Button icon={<Printer size={14} />} onClick={() => navigate("/impresion")}>
            Imprimir
          </Button>
          <Button icon={<Trash2 size={14} />} variante="danger" onClick={() => setConfirmar(true)}>
            Eliminar
          </Button>
          <Button
            icon={<Pencil size={14} />}
            variante="primary"
            onClick={() => navigate(`/celebracion/${celebracion.id}/editar`)}
          >
            Editar
          </Button>
        </div>
      </div>

      <div className="page__body">
        <section className="form-section">
          <div className="form-section__head">
            <Church size={14} /> INFORMACIÓN GENERAL
          </div>
          <div className="form-section__body">
            <div className="def-grid">
              <div className="def">
                <span className="def__k">Tipo de celebración</span>
                <span className="def__v">{celebracion.tipo}</span>
              </div>
              <div className="def">
                <span className="def__k">Estado</span>
                <span className="def__v">
                  <EstadoChip estado={celebracion.estado} />
                </span>
              </div>
              <div className="def">
                <span className="def__k">Fecha</span>
                <span className="def__v">{formatFechaLarga(celebracion.fecha)}</span>
              </div>
              <div className="def">
                <span className="def__k">Horario</span>
                <span className="def__v">
                  {formatHorario(celebracion.horaDesde, celebracion.horaHasta)}
                </span>
              </div>
              <div className="def">
                <span className="def__k">Lugar</span>
                <span className="def__v">{celebracion.lugar}</span>
              </div>
              <div className="def">
                <span className="def__k">Sacramentos asociados</span>
                <span className="def__v">
                  {celebracion.sacramentosAsociados.length > 0
                    ? celebracion.sacramentosAsociados.join(", ")
                    : "Ninguno"}
                </span>
              </div>
              <div className="def def--full">
                <span className="def__k">Observaciones</span>
                <span className="def__v">
                  {celebracion.observaciones || <span className="muted">Sin observaciones</span>}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <Users size={14} /> CELEBRANTES <span className="tag-count">{celebracion.celebrantes.length}</span>
          </div>
          <div className="form-section__body">
            {celebracion.celebrantes.length === 0 ? (
              <div className="empty-inline">Sin celebrantes asignados.</div>
            ) : (
              <div className="table-wrap">
                <table className="grid">
                  <thead>
                    <tr>
                      <th>Celebrante</th>
                      <th style={{ width: 200 }}>Tipo / rol</th>
                      <th style={{ width: 120 }}>Función</th>
                    </tr>
                  </thead>
                  <tbody>
                    {celebracion.celebrantes.map((c) => (
                      <tr key={c.personaId}>
                        <td>{c.nombre}</td>
                        <td>{c.rol}</td>
                        <td>{c.principal ? "Principal" : "Concelebrante"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <HandHeart size={14} /> INTENCIONES <span className="tag-count">{celebracion.intenciones.length}</span>
          </div>
          <div className="form-section__body">
            {celebracion.intenciones.length === 0 ? (
              <div className="empty-inline">No hay intenciones registradas.</div>
            ) : (
              <div className="table-wrap">
                <table className="grid">
                  <thead>
                    <tr>
                      <th style={{ width: 160 }}>Tipo</th>
                      <th>Intención / descripción</th>
                      <th style={{ width: 180 }}>Solicitante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {celebracion.intenciones.map((i) => (
                      <tr key={i.id}>
                        <td>{i.tipo}</td>
                        <td>
                          {i.descripcion}
                          {i.observaciones && (
                            <div className="small muted">Obs.: {i.observaciones}</div>
                          )}
                        </td>
                        <td>{i.solicitante ?? <span className="muted">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {confirmar && (
        <ConfirmarEliminacionModal
          celebracion={celebracion}
          onCancelar={() => setConfirmar(false)}
          onEliminar={eliminar}
        />
      )}
    </div>
  );
}
