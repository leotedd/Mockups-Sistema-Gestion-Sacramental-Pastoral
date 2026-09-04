import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import { useApp, FECHA_SIMULADA } from "../context/AppContext";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/Field";
import { formatFecha, formatFechaTexto, parseISO, toISO } from "../utils/format";

export function VistaImpresionPage() {
  const navigate = useNavigate();
  const { celebraciones, setStatus } = useApp();

  const base = parseISO(FECHA_SIMULADA);
  const finMes = new Date(base.getFullYear(), base.getMonth() + 1, 0);

  const [desde, setDesde] = useState(toISO(new Date(base.getFullYear(), base.getMonth(), 1)));
  const [hasta, setHasta] = useState(toISO(finMes));

  const filas = useMemo(
    () =>
      celebraciones
        .filter((c) => c.fecha >= desde && c.fecha <= hasta && c.estado !== "Cancelada")
        .sort((a, b) =>
          a.fecha === b.fecha ? a.horaDesde.localeCompare(b.horaDesde) : a.fecha.localeCompare(b.fecha)
        ),
    [celebraciones, desde, hasta]
  );

  useEffect(() => {
    setStatus(filas.length, "celebraciones en el rango");
  }, [filas.length, setStatus]);

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">
            <Printer size={17} /> Vista de impresión
          </h1>
          <div className="page__subtitle">Programación de celebraciones · documento para imprimir</div>
        </div>
      </div>

      <div className="page__body">
        <div className="print-toolbar">
          <Button icon={<ArrowLeft size={14} />} onClick={() => navigate("/")}>
            Volver
          </Button>
          <TextField label="Desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          <TextField label="Hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <Button variante="primary" icon={<Printer size={14} />} onClick={() => window.print()}>
              Imprimir
            </Button>
          </div>
        </div>

        <div className="print-sheet">
          <div className="print-sheet__header">
            <div className="print-sheet__parish">Parroquia Santa Cruz</div>
            <div className="print-sheet__city">Chiquimulilla, Santa Rosa</div>
            <div className="print-sheet__doctitle">Programación de Celebraciones</div>
            <div className="print-sheet__range">
              Del {formatFechaTexto(desde)} al {formatFechaTexto(hasta)}
            </div>
          </div>

          {filas.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px 0" }}>
              No hay celebraciones programadas en el rango de fechas seleccionado.
            </p>
          ) : (
            <table className="print-grid">
              <thead>
                <tr>
                  <th style={{ width: 92 }}>Fecha</th>
                  <th style={{ width: 108 }}>Hora</th>
                  <th>Celebración</th>
                  <th>Lugar</th>
                  <th>Celebrante</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((c) => {
                  const principal = c.celebrantes.find((x) => x.principal) ?? c.celebrantes[0];
                  return (
                    <tr key={c.id}>
                      <td>{formatFecha(c.fecha)}</td>
                      <td>
                        {c.horaDesde}
                        {c.horaHasta ? ` - ${c.horaHasta}` : ""}
                      </td>
                      <td>{c.tipo}</td>
                      <td>{c.lugar}</td>
                      <td>{principal ? principal.nombre : "Por asignar"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="print-sheet__foot">
            <span>Secretaría parroquial · Sistema Integral de Gestión Sacramental y Pastoral</span>
            <span>Emitido: {formatFecha(FECHA_SIMULADA)} · {filas.length} celebraciones</span>
          </div>
        </div>
      </div>
    </div>
  );
}
