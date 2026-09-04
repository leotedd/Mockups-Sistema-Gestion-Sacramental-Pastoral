import type { ReactNode } from "react";

export interface RibbonBotonConfig {
  etiqueta: string;
  icono: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  activo?: boolean;
}

export interface RibbonGrupoConfig {
  etiqueta: string;
  botones: RibbonBotonConfig[];
}

export interface RibbonPestanaConfig {
  id: string;
  etiqueta: string;
  grupos: RibbonGrupoConfig[];
}

interface Props {
  tituloModulo: string;
  iconoModulo: ReactNode;
  subtitulo: string;
  pestanas: RibbonPestanaConfig[];
  pestanaActiva: string;
  onCambiarPestana: (id: string) => void;
}

/**
 * Ribbon generico, dirigido por configuracion (tabs + grupos de botones).
 * Reproduce components/Ribbon.tsx del desarrollo real, usado por Agenda,
 * Personas, Familias, Catequesis, Sacramental, Económico, Parroquias y
 * Usuarios. Sustituye la pareja TopBar+Ribbon del mockup original: en el
 * desarrollo actual la barra borgoña y la cinta de opciones son UN solo
 * encabezado. Celebraciones usa su propio ribbon (ver CelebracionesRibbon),
 * porque asi quedo implementado en el sistema real (pestaña dinamica en vez
 * de pestañas fijas seleccionables).
 */
export function Ribbon({ tituloModulo, iconoModulo, subtitulo, pestanas, pestanaActiva, onCambiarPestana }: Props) {
  const pestanaActual = pestanas.find((p) => p.id === pestanaActiva) ?? pestanas[0];
  const mostrarTabs = pestanas.length > 1;

  return (
    <header className="ribbon">
      <div className="topbar">
        <span className="topbar__brand">
          {iconoModulo}
          {tituloModulo}
        </span>
        <span className="topbar__parish">{subtitulo}</span>
      </div>

      {mostrarTabs && (
        <div className="ribbon__tabs">
          {pestanas.map((p) => (
            <button
              key={p.id}
              className={`ribbon__tab ${p.id === pestanaActiva ? "ribbon__tab--active" : ""}`}
              onClick={() => onCambiarPestana(p.id)}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>
      )}

      {pestanaActual && (
        <div className="ribbon__panels">
          {pestanaActual.grupos.map((grupo) => (
            <div className="ribbon-group" key={grupo.etiqueta}>
              <div className="ribbon-group__actions">
                {grupo.botones.map((b) => (
                  <button
                    key={b.etiqueta}
                    className={`rbtn ${b.activo ? "rbtn--active" : ""}`}
                    onClick={b.onClick}
                    disabled={b.disabled}
                  >
                    {b.icono}
                    {b.etiqueta}
                  </button>
                ))}
              </div>
              <div className="ribbon-group__label">{grupo.etiqueta}</div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
