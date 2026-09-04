interface Props {
  pagina: number;
  totalPaginas: number;
  totalRegistros: number;
  porPagina: number;
  etiqueta?: string;
  onCambio: (p: number) => void;
}

/**
 * Paginacion "Anterior / Página X de Y / Siguiente", sin botones numerados.
 * Alineada con el patron real del sistema (Parroquias, Usuarios,
 * Celebraciones): antes el mockup mostraba botones 1,2,3...; el desarrollo
 * actual lo simplifico a este patron, igual en todos los modulos.
 */
export function Pagination({ pagina, totalPaginas, totalRegistros, porPagina, etiqueta = "registros", onCambio }: Props) {
  const desde = totalRegistros === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const hasta = Math.min(pagina * porPagina, totalRegistros);

  return (
    <div className="pagination">
      <span>
        Mostrando <strong>{desde}</strong> a <strong>{hasta}</strong> de{" "}
        <strong>{totalRegistros}</strong> {etiqueta}
      </span>
      <div className="pagination__pages">
        <button
          className="pagination__btn"
          disabled={pagina <= 1}
          onClick={() => onCambio(pagina - 1)}
        >
          Anterior
        </button>
        <span className="small" style={{ padding: "0 4px", fontWeight: 600, color: "var(--texto)" }}>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          className="pagination__btn"
          disabled={pagina >= totalPaginas}
          onClick={() => onCambio(pagina + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
