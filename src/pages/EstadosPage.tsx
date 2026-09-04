import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Banner } from "../components/ui/Banner";
import { EmptyState, ErrorState, LoadingState, NoResultsState, TableSkeleton } from "../components/ui/States";

/**
 * Galería de estados del sistema — referencia visual interna, NO es un
 * módulo del sistema (por eso no aparece en el Sidebar). Se actualizó para
 * mostrar banners en línea en vez de toasts flotantes, alineado con el
 * patrón real de mensajes de éxito/aviso usado en pages/Celebraciones.tsx.
 */
export function EstadosPage() {
  const navigate = useNavigate();
  const [banner, setBanner] = useState<{ tipo: "success" | "aviso" | "error"; mensaje: string } | null>(null);

  const bloque = (titulo: string, children: ReactNode) => (
    <section className="form-section">
      <div className="form-section__head">{titulo}</div>
      <div className="form-section__body">{children}</div>
    </section>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--marfil-2)", padding: 20 }}>
      <div className="page" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="page__head">
          <div>
            <h1 className="page__title"><Info size={17} /> Galería de estados del sistema</h1>
            <div className="page__subtitle">Referencia visual de los estados que utilizan las pantallas del sistema</div>
          </div>
          <Button icon={<ArrowLeft size={14} />} onClick={() => navigate("/agenda")}>Volver</Button>
        </div>

        <div className="page__body">
          {banner && <Banner tipo={banner.tipo} mensaje={banner.mensaje} onCerrar={() => setBanner(null)} />}

          <div className="help-note">
            <Info size={15} />
            <span>Estos estados aparecen de forma natural durante el uso del sistema. Aquí se muestran juntos como especificación visual.</span>
          </div>

          {bloque("CARGANDO", <><LoadingState /><TableSkeleton filas={5} /></>)}
          {bloque("SIN REGISTROS", <EmptyState />)}
          {bloque("SIN RESULTADOS DE BÚSQUEDA", <NoResultsState onLimpiar={() => {}} />)}
          {bloque("ERROR", <ErrorState onReintentar={() => {}} />)}
          {bloque("MENSAJES EN LÍNEA (reemplazan a los toasts flotantes del mockup original)", (
            <div className="btn-row">
              <Button sm variante="primary" onClick={() => setBanner({ tipo: "success", mensaje: "Guardado exitoso: el registro se creó correctamente." })}>Probar "Éxito"</Button>
              <Button sm onClick={() => setBanner({ tipo: "aviso", mensaje: "Esta acción todavía no está disponible en el sistema." })}>Probar "Aviso"</Button>
              <Button sm variante="danger" onClick={() => setBanner({ tipo: "error", mensaje: "No fue posible conectar con el servidor parroquial." })}>Probar "Error"</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
