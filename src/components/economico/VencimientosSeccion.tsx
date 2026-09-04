import { useMemo, useRef, useState } from "react";
import { CalendarPlus, Check } from "lucide-react";
import { VENCIMIENTOS_SEED, type Vencimiento } from "../../data/economico";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { Banner } from "../ui/Banner";
import { VencimientoFormDialog } from "./VencimientoFormDialog";
import { FECHA_SIMULADA } from "../../context/AppShellContext";
import { formatFecha } from "../../utils/format";

/** Sección "Vencimientos" — modelo ecvencimiento del schema (cuentas por cobrar/pagar con fecha límite). */
export function VencimientosSeccion({ onMensaje }: { onMensaje: (m: string) => void }) {
  const [vencimientos, setVencimientos] = useState<Vencimiento[]>(VENCIMIENTOS_SEED);
  const [filtro, setFiltro] = useState<"Todos" | "Pendientes" | "Vencidos" | "Cancelados">("Todos");
  const [dialogo, setDialogo] = useState(false);
  const [exito, setExito] = useState<string | null>(null);
  const nextIdRef = useRef(970);

  const filtrados = useMemo(() => {
    return vencimientos.filter((v) => {
      if (filtro === "Todos") return true;
      if (filtro === "Cancelados") return v.cancelado;
      if (filtro === "Vencidos") return !v.cancelado && v.fechaVencimiento < FECHA_SIMULADA;
      return !v.cancelado;
    });
  }, [vencimientos, filtro]);

  const marcarCancelado = (id: string) => {
    setVencimientos((l) => l.map((v) => (v.id === id ? { ...v, cancelado: true } : v)));
    onMensaje("Vencimiento marcado como cancelado.");
  };

  const estadoDe = (v: Vencimiento): { tono: "activo" | "pendiente" | "vencido"; texto: string } => {
    if (v.cancelado) return { tono: "activo", texto: "Cancelado" };
    if (v.fechaVencimiento < FECHA_SIMULADA) return { tono: "vencido", texto: "Vencido" };
    return { tono: "pendiente", texto: "Pendiente" };
  };

  return (
    <div className="page">
      <div className="page__head">
        <div><h1 className="page__title">Vencimientos</h1><div className="page__subtitle">Cuentas por cobrar y por pagar con fecha límite</div></div>
        <Button variante="primary" icon={<CalendarPlus size={14} />} onClick={() => setDialogo(true)}>Nuevo vencimiento</Button>
      </div>
      <div className="page__body">
        <div className="sub-nav">
          {(["Todos", "Pendientes", "Vencidos", "Cancelados"] as const).map((f) => (
            <button key={f} className={`sub-nav__btn ${filtro === f ? "sub-nav__btn--active" : ""}`} onClick={() => setFiltro(f)}>{f}</button>
          ))}
        </div>

        {exito && <Banner tipo="success" mensaje={exito} onCerrar={() => setExito(null)} />}

        <div className="table-wrap">
          <table className="grid">
            <thead><tr><th>Concepto</th><th style={{ width: 90 }}>Tipo</th><th style={{ width: 100 }}>Vence</th><th className="grid__num" style={{ width: 100 }}>Importe</th><th style={{ width: 100 }}>Estado</th><th className="grid__col-actions">Acciones</th></tr></thead>
            <tbody>
              {filtrados.map((v) => {
                const est = estadoDe(v);
                return (
                  <tr key={v.id}>
                    <td>{v.concepto}</td>
                    <td>{v.esDebito ? "Por pagar" : "Por cobrar"}</td>
                    <td className="nowrap">{formatFecha(v.fechaVencimiento)}</td>
                    <td className="grid__num">Q {v.importe.toFixed(2)}</td>
                    <td><Chip tono={est.tono}>{est.texto}</Chip></td>
                    <td className="grid__col-actions">
                      {!v.cancelado && <button className="link-btn" onClick={() => marcarCancelado(v.id)}><Check size={13} /> Marcar cancelado</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtrados.length === 0 && <div className="empty-inline">Sin vencimientos para este filtro.</div>}
        </div>
      </div>

      {dialogo && <VencimientoFormDialog onCerrar={() => setDialogo(false)} onGuardar={(v) => { setVencimientos((l) => [v, ...l]); setDialogo(false); setExito("Vencimiento registrado correctamente."); onMensaje("Vencimiento registrado."); }} nextId={() => `ven-${++nextIdRef.current}`} />}
    </div>
  );
}
