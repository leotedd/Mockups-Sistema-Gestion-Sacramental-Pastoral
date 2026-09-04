import { CalendarX2 } from "lucide-react";
import type { Celebracion } from "../../data/types";
import { EstadoChip } from "../ui/EstadoChip";
import { Pagination } from "../ui/Pagination";
import { formatFecha } from "../../utils/format";

interface Props {
  celebraciones: Celebracion[];
  celebracionSeleccionada: string | null;
  onSeleccionar: (id: string) => void;
  onAbrir: (id: string) => void;
  pagina: number;
  paginas: number;
  totalResultados: number;
  onPagina: (p: number) => void;
}

const POR_PAGINA = 10;

/** Reproduce components/celebraciones/CelebracionesListado.tsx del desarrollo real. */
export function CelebracionesListado({ celebraciones, celebracionSeleccionada, onSeleccionar, onAbrir, pagina, paginas, totalResultados, onPagina }: Props) {
  if (totalResultados === 0) {
    return (
      <div className="state" style={{ border: "1px dashed var(--linea)", borderRadius: "var(--radio)" }}>
        <div className="state__icon">
          <CalendarX2 size={22} />
        </div>
        <div className="state__title">No se encontraron celebraciones con los filtros actuales.</div>
        <div className="state__desc">Ajuste la búsqueda o el rango de fechas para ver más resultados.</div>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table className="grid">
          <thead>
            <tr>
              <th style={{ width: 96 }}>Fecha</th>
              <th style={{ width: 66 }}>Hora</th>
              <th>Tipo de celebración</th>
              <th>Lugar</th>
              <th>Celebrante</th>
              <th style={{ width: 108 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {celebraciones.map((c) => {
              const seleccionada = c.id === celebracionSeleccionada;
              const principal = c.celebrantes.find((x) => x.principal) ?? c.celebrantes[0];
              return (
                <tr
                  key={c.id}
                  className={seleccionada ? "is-selected" : ""}
                  onClick={() => onSeleccionar(c.id)}
                  onDoubleClick={() => onAbrir(c.id)}
                >
                  <td className="nowrap">{formatFecha(c.fecha)}</td>
                  <td className="nowrap">{c.horaDesde}</td>
                  <td>{c.tipo}</td>
                  <td>{c.lugar}</td>
                  <td>
                    {principal ? principal.nombre : <span className="muted">Sin asignar</span>}
                    {c.celebrantes.length > 1 && <span className="muted small"> +{c.celebrantes.length - 1}</span>}
                  </td>
                  <td>
                    <EstadoChip estado={c.estado} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination pagina={pagina} totalPaginas={paginas} totalRegistros={totalResultados} porPagina={POR_PAGINA} etiqueta="celebraciones" onCambio={onPagina} />
    </>
  );
}

export { POR_PAGINA };
