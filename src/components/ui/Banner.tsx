import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type BannerTipo = "success" | "aviso" | "error";

interface Props {
  tipo: BannerTipo;
  mensaje: string;
  onCerrar: () => void;
}

const ICONO: Record<BannerTipo, JSX.Element> = {
  success: <CheckCircle2 size={15} />,
  aviso: <Info size={15} />,
  error: <AlertTriangle size={15} />,
};

/**
 * Mensaje de aviso/exito EN LINEA, arriba del contenido de la pagina.
 * Reemplaza el mecanismo de toasts flotantes del mockup original: el
 * desarrollo real (pages/Celebraciones.tsx) ya no usa notificaciones
 * flotantes, sino banners descartables dentro del area de contenido mas
 * un mensaje corto y transitorio en la barra de estado.
 */
export function Banner({ tipo, mensaje, onCerrar }: Props) {
  return (
    <div className={`banner banner--${tipo}`} role="status">
      {ICONO[tipo]}
      <span className="banner__msg">{mensaje}</span>
      <button className="banner__close" onClick={onCerrar} aria-label="Cerrar mensaje">
        <X size={13} />
      </button>
    </div>
  );
}
