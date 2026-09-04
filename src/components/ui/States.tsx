import type { ReactNode } from "react";
import { Inbox, SearchX, TriangleAlert } from "lucide-react";
import { Button } from "./Button";

/* 10 - ESTADOS DEL SISTEMA (visuales) */

export function LoadingState({ mensaje = "Cargando celebraciones..." }: { mensaje?: string }) {
  return (
    <div className="state">
      <div className="spinner" />
      <div className="state__title">{mensaje}</div>
      <div className="state__desc">Consultando el servidor parroquial.</div>
    </div>
  );
}

export function TableSkeleton({ filas = 8 }: { filas?: number }) {
  return (
    <div className="table-wrap" aria-hidden>
      {Array.from({ length: filas }).map((_, i) => (
        <div className="skeleton-row" key={i} />
      ))}
    </div>
  );
}

export function EmptyState({
  titulo = "Sin registros",
  desc = "Todavía no hay celebraciones registradas en el sistema.",
  accion,
}: {
  titulo?: string;
  desc?: string;
  accion?: ReactNode;
}) {
  return (
    <div className="state">
      <div className="state__icon">
        <Inbox size={24} />
      </div>
      <div className="state__title">{titulo}</div>
      <div className="state__desc">{desc}</div>
      {accion}
    </div>
  );
}

export function NoResultsState({ onLimpiar }: { onLimpiar?: () => void }) {
  return (
    <div className="state">
      <div className="state__icon">
        <SearchX size={24} />
      </div>
      <div className="state__title">Sin resultados de búsqueda</div>
      <div className="state__desc">
        Ninguna celebración coincide con los filtros aplicados. Ajuste los criterios e intente de nuevo.
      </div>
      {onLimpiar && (
        <Button sm onClick={onLimpiar}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  onReintentar,
  mensaje = "No fue posible cargar la información desde el servidor parroquial.",
}: {
  onReintentar?: () => void;
  mensaje?: string;
}) {
  return (
    <div className="state state--error">
      <div className="state__icon">
        <TriangleAlert size={24} />
      </div>
      <div className="state__title">Se produjo un error</div>
      <div className="state__desc">{mensaje}</div>
      {onReintentar && (
        <Button sm onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
