import { useMemo, useState } from "react";
import { Check, Search, UserPlus } from "lucide-react";
import { Modal } from "../ui/Modal";
import { PERSONAS_SEED } from "../../data/personas";
import type { Celebrante } from "../../data/types";

interface Props {
  yaSeleccionados: string[];
  onCancelar: () => void;
  onSeleccionar: (celebrante: Celebrante) => void;
}

/**
 * Reproduce components/celebraciones/SelectorCelebranteDialog.tsx del
 * desarrollo real: busca directamente en el padrón de Personas (`GET
 * /personas`), NO en un catálogo propio de "celebrantes" con rol. Se
 * muestra documento/localidad, no un cargo eclesiástico.
 */
export function SeleccionarCelebranteModal({ yaSeleccionados, onCancelar, onSeleccionar }: Props) {
  const [busqueda, setBusqueda] = useState("");

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return PERSONAS_SEED.filter(
      (p) =>
        !q ||
        `${p.nombres} ${p.apellidos}`.toLowerCase().includes(q) ||
        p.numeroDocumento.toLowerCase().includes(q),
    );
  }, [busqueda]);

  const seleccionar = (personaId: string) => {
    const persona = PERSONAS_SEED.find((p) => p.id === personaId);
    if (!persona) return;
    onSeleccionar({
      personaId: persona.id,
      nombre: `${persona.nombres} ${persona.apellidos}`,
      principal: yaSeleccionados.length === 0,
    });
  };

  return (
    <Modal titulo="Seleccionar celebrante" icon={<UserPlus size={16} />} wide onClose={onCancelar} footer={<button className="btn" onClick={onCancelar}>Cancelar</button>}>
      <div className="field" style={{ marginBottom: 12 }}>
        <label className="field__label">Buscar persona</label>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 8, top: 8, color: "var(--texto-3)" }} />
          <input
            className="input"
            style={{ paddingLeft: 26 }}
            placeholder="Buscar persona por nombre o documento..."
            value={busqueda}
            autoFocus
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {resultados.length === 0 ? (
        <div className="empty-inline">No se encontraron personas con ese criterio.</div>
      ) : (
        <div className="table-wrap">
          <table className="grid">
            <thead><tr><th>Nombre</th><th>Documento</th><th>Localidad</th><th className="grid__col-actions">Seleccionar</th></tr></thead>
            <tbody>
              {resultados.map((p) => {
                const yaAsignado = yaSeleccionados.includes(p.id);
                return (
                  <tr key={p.id}>
                    <td>{p.nombres} {p.apellidos}</td>
                    <td>{p.tipoDocumento}: {p.numeroDocumento}</td>
                    <td>{p.localidad}</td>
                    <td className="grid__col-actions">
                      <button className="btn btn--sm" disabled={yaAsignado} onClick={() => seleccionar(p.id)}>
                        {yaAsignado ? <><Check size={13} /> Asignado</> : "Seleccionar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
