import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function ToastStack() {
  const { toasts, cerrarToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.tipo}`} role="status">
          {t.tipo === "success" && <CheckCircle2 size={17} />}
          {t.tipo === "error" && <XCircle size={17} />}
          {t.tipo === "info" && <Info size={17} />}
          <div style={{ flex: 1 }}>
            <div className="toast__title">{t.titulo}</div>
            {t.mensaje && <div className="toast__msg">{t.mensaje}</div>}
          </div>
          <button className="modal__close" style={{ color: "var(--texto-3)" }} onClick={() => cerrarToast(t.id)}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
