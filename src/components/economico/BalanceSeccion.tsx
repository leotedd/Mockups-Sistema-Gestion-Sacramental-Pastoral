import { useMemo, useState } from "react";
import { MOVIMIENTOS_SEED, SUBCUENTAS_SEED } from "../../data/economico";

/** Sección "Balance / Saldos" — corresponde al reporte ecBalance documentado en tipo-de-reportes-sp.md (Balance contable anual: Debe/Haber/Saldo por cuenta), simplificado aquí a un resumen por subcuenta del año seleccionado. */
export function BalanceSeccion() {
  const aniosConMovimientos = Array.from(new Set(MOVIMIENTOS_SEED.map((m) => m.periodoAnio))).sort();
  const anios = aniosConMovimientos.length > 0 ? aniosConMovimientos : [2026];
  const [anio, setAnio] = useState(anios[anios.length - 1]);

  const filas = useMemo(() => {
    const acumulado = new Map<string, { debe: number; haber: number }>();
    for (const m of MOVIMIENTOS_SEED.filter((x) => x.periodoAnio === anio)) {
      for (const d of m.detalle) {
        const actual = acumulado.get(d.subcuenta) ?? { debe: 0, haber: 0 };
        actual.debe += d.debe;
        actual.haber += d.haber;
        acumulado.set(d.subcuenta, actual);
      }
    }
    return SUBCUENTAS_SEED.map((s) => {
      const v = acumulado.get(s.descripcion) ?? { debe: 0, haber: 0 };
      return { subcuenta: s.descripcion, codigo: s.codigo, debe: v.debe, haber: v.haber, saldo: v.debe - v.haber };
    }).filter((f) => f.debe > 0 || f.haber > 0);
  }, [anio]);

  const totalDebe = filas.reduce((s, f) => s + f.debe, 0);
  const totalHaber = filas.reduce((s, f) => s + f.haber, 0);

  return (
    <div className="page">
      <div className="page__head">
        <div><h1 className="page__title">Balance de cuentas</h1><div className="page__subtitle">Resumen de movimientos por subcuenta (equivalente al reporte "Balance contable anual")</div></div>
        <div className="field" style={{ minWidth: 140 }}>
          <label className="field__label">Ejercicio</label>
          <select className="select" value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
            {anios.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div className="page__body">
        <div className="kpi-row">
          <div className="kpi"><div className="kpi__label">Total Debe</div><div className="kpi__value">Q {totalDebe.toFixed(2)}</div></div>
          <div className="kpi"><div className="kpi__label">Total Haber</div><div className="kpi__value">Q {totalHaber.toFixed(2)}</div></div>
          <div className="kpi"><div className="kpi__label">Diferencia</div><div className="kpi__value">Q {(totalDebe - totalHaber).toFixed(2)}</div></div>
        </div>

        <div className="table-wrap">
          <table className="grid">
            <thead><tr><th style={{ width: 70 }}>Código</th><th>Subcuenta</th><th className="grid__num">Debe</th><th className="grid__num">Haber</th><th className="grid__num">Saldo</th></tr></thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.subcuenta}>
                  <td className="nowrap">{f.codigo}</td>
                  <td>{f.subcuenta}</td>
                  <td className="grid__num">Q {f.debe.toFixed(2)}</td>
                  <td className="grid__num">Q {f.haber.toFixed(2)}</td>
                  <td className="grid__num" style={{ fontWeight: 700 }}>Q {f.saldo.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filas.length === 0 && <div className="empty-inline">Sin movimientos registrados en el ejercicio {anio}.</div>}
        </div>
      </div>
    </div>
  );
}
