import { CUENTAS_SEED, GRUPOS_SEED, RUBROS_SEED, SUBCUENTAS_SEED } from "../../data/economico";
import { Chip } from "../ui/Chip";

/** Sección "Catálogo de cuentas" — jerarquía ecRubro > ecGrupo > ecCuenta > ecSubcuenta del schema. Consulta de solo lectura en este mockup; el alta de cuentas seguiría el mismo patrón modal que el resto del sistema. */
export function CuentasSeccion() {
  const filas: Array<{ nivel: number; codigo: string; descripcion: string; activo?: boolean }> = [];
  for (const rubro of RUBROS_SEED) {
    filas.push({ nivel: 0, codigo: rubro.codigo, descripcion: rubro.descripcion });
    for (const grupo of GRUPOS_SEED.filter((g) => g.rubroId === rubro.id)) {
      filas.push({ nivel: 1, codigo: `${rubro.codigo}.${grupo.codigo}`, descripcion: grupo.descripcion });
      for (const cuenta of CUENTAS_SEED.filter((c) => c.grupoId === grupo.id)) {
        filas.push({ nivel: 2, codigo: `${grupo.codigo}.${cuenta.codigo}`, descripcion: cuenta.descripcion });
        for (const sub of SUBCUENTAS_SEED.filter((s) => s.cuentaId === cuenta.id)) {
          filas.push({ nivel: 3, codigo: `${cuenta.codigo}.${sub.codigo}`, descripcion: sub.descripcion, activo: sub.activo });
        }
      }
    }
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Catálogo de cuentas</h1>
          <div className="page__subtitle">Rubro → Grupo → Cuenta → Subcuenta</div>
        </div>
      </div>
      <div className="page__body">
        <div className="stub-note" style={{ marginBottom: 12 }}>
          Catálogo de consulta. El alta y edición de cuentas seguirá el mismo patrón de formulario modal que el resto del sistema una vez se incorpore al backend.
        </div>
        <div className="table-wrap">
          <table className="grid">
            <thead><tr><th style={{ width: 90 }}>Código</th><th>Descripción</th><th style={{ width: 100 }}>Estado</th></tr></thead>
            <tbody>
              {filas.map((f, i) => (
                <tr key={i} style={{ fontWeight: f.nivel <= 1 ? 700 : 400, background: f.nivel === 0 ? "var(--marfil)" : undefined }}>
                  <td className="nowrap">{f.codigo}</td>
                  <td style={{ paddingLeft: 12 + f.nivel * 18 }}>{f.descripcion}</td>
                  <td>{f.activo !== undefined && <Chip tono={f.activo ? "activo" : "inactivo"}>{f.activo ? "Activa" : "Inactiva"}</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
