import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfiguracionImpresion {
  orientacion: "vertical" | "horizontal";
  sombreado: boolean;
}

interface Props {
  configuracion: ConfiguracionImpresion;
  onGuardar: (c: ConfiguracionImpresion) => void;
  onCancelar: () => void;
}

/** Reproduce components/{PageSetupDialog,PersonasPageSetupDialog}.tsx del desarrollo real. */
export function PageSetupDialog({ configuracion, onGuardar, onCancelar }: Props) {
  const [orientacion, setOrientacion] = useState(configuracion.orientacion);
  const [sombreado, setSombreado] = useState(configuracion.sombreado);

  return (
    <Modal
      titulo="Configuración de página"
      icon={<Settings2 size={16} />}
      onClose={onCancelar}
      footer={
        <>
          <Button onClick={onCancelar}>Cancelar</Button>
          <Button variante="primary" onClick={() => onGuardar({ orientacion, sombreado })}>Aplicar</Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 11 }}>
        <div className="field">
          <label className="field__label">Orientación de la hoja</label>
          <select className="select" value={orientacion} onChange={(e) => setOrientacion(e.target.value as "vertical" | "horizontal")}>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
        <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={sombreado} onChange={(e) => setSombreado(e.target.checked)} />
          <span className="field__label" style={{ margin: 0 }}>Incluir sombreado de filas alternas</span>
        </label>
      </div>
    </Modal>
  );
}
