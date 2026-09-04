import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  titulo: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  footerSplit?: boolean;
}

export function Modal({ titulo, icon, onClose, children, footer, wide, footerSplit }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className={`modal ${wide ? "modal--wide" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className="modal__head">
          <span className="modal__head-title">
            {icon}
            {titulo}
          </span>
          <button className="modal__close" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && (
          <div className={`modal__foot ${footerSplit ? "modal__foot--split" : ""}`}>{footer}</div>
        )}
      </div>
    </div>
  );
}
