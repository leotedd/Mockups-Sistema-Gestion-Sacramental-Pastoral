import { useState } from "react";
import { BookOpen, Plus, Save, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { SelectField, TextField } from "../ui/Field";
import {
  FORMAS_PAGO,
  ORIGENES_MOVIMIENTO,
  SUBCUENTAS_SEED,
  type DetalleMovimiento,
  type MovimientoRegistro,
} from "../../data/economico";

interface Props {
  modo: "nuevo" | "ver" | "editar";
  movimiento: MovimientoRegistro | null;
  onCerrar: () => void;
  onGuardar: (m: MovimientoRegistro) => void;
  nextId: () => string;
  nextNumero: () => number;
}

/** Diseñado a partir de eccabeceraregistro + ecdetalleregistro (backend/prisma/schema.prisma) y ecDiario (tipo-de-reportes-sp.md). Módulo Económico construido desde cero. */
export function MovimientoFormDialog({ modo, movimiento, onCerrar, onGuardar, nextId, nextNumero }: Props) {
  const soloLectura = modo === "ver";
  const [origenId, setOrigenId] = useState(movimiento?.origenId ?? ORIGENES_MOVIMIENTO[0].id);
  const [fecha, setFecha] = useState(movimiento?.fecha ?? "");
  const [descripcion, setDescripcion] = useState(movimiento?.descripcion ?? "");
  const [destinatario, setDestinatario] = useState(movimiento?.destinatario ?? "");
  const [detalle, setDetalle] = useState<DetalleMovimiento[]>(movimiento?.detalle ?? []);
  const [subcuentaId, setSubcuentaId] = useState(SUBCUENTAS_SEED[0].id);
  const [montoRenglon, setMontoRenglon] = useState("");
  const [ladoRenglon, setLadoRenglon] = useState<"debe" | "haber">("debe");
  const [formaPago, setFormaPago] = useState(FORMAS_PAGO[0]);
  const [errores, setErrores] = useState<{ fecha?: string; descripcion?: string }>({});

  const origen = ORIGENES_MOVIMIENTO.find((o) => o.id === origenId)!;

  const agregarRenglon = () => {
    const monto = Number(montoRenglon);
    if (!monto || monto <= 0) return;
    const sub = SUBCUENTAS_SEED.find((s) => s.id === subcuentaId)!;
    setDetalle((l) => [...l, { id: `tmp-${Date.now()}`, subcuentaId: sub.id, subcuenta: sub.descripcion, debe: ladoRenglon === "debe" ? monto : 0, haber: ladoRenglon === "haber" ? monto : 0, formaPago }]);
    setMontoRenglon("");
  };

  const totalDebe = detalle.reduce((s, d) => s + d.debe, 0);
  const totalHaber = detalle.reduce((s, d) => s + d.haber, 0);
  const balanceado = totalDebe === totalHaber && totalDebe > 0;

  const guardar = () => {
    const e: typeof errores = {};
    if (!fecha) e.fecha = "Indique la fecha del movimiento.";
    if (!descripcion.trim()) e.descripcion = "Ingrese una descripción.";
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    onGuardar({
      id: movimiento?.id ?? nextId(),
      numeroRegistro: movimiento?.numeroRegistro ?? nextNumero(),
      fecha, origenId, origen: origen.descripcion, tipo: origen.tipo, descripcion: descripcion.trim(), destinatario,
      periodoAnio: Number(fecha.slice(0, 4)) || new Date().getFullYear(), periodoMes: Number(fecha.slice(5, 7)) || 1,
      cerrado: movimiento?.cerrado ?? false, detalle,
    });
  };

  const titulo = modo === "nuevo" ? "Nuevo movimiento" : modo === "editar" ? "Editar movimiento" : "Detalle del movimiento";

  return (
    <Modal
      titulo={titulo}
      icon={<BookOpen size={16} />}
      wide
      onClose={onCerrar}
      footer={soloLectura ? <Button onClick={onCerrar}>Cerrar</Button> : <><Button onClick={onCerrar}>Cancelar</Button><Button variante="primary" icon={<Save size={14} />} onClick={guardar} disabled={!balanceado}>Guardar</Button></>}
    >
      <div className="form-grid">
        <SelectField label="Origen del movimiento" disabled={soloLectura} className="col-span-2" value={origenId} onChange={(e) => setOrigenId(e.target.value)}>
          {ORIGENES_MOVIMIENTO.map((o) => <option key={o.id} value={o.id}>{o.descripcion} ({o.tipo})</option>)}
        </SelectField>
        <TextField label="Fecha" required type="date" disabled={soloLectura} value={fecha} error={errores.fecha} onChange={(e) => setFecha(e.target.value)} />
        <TextField label="Descripción" required disabled={soloLectura} className="col-span-2" value={descripcion} error={errores.descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <TextField label="Destinatario / quién" disabled={soloLectura} value={destinatario} onChange={(e) => setDestinatario(e.target.value)} />
      </div>

      <section className="form-section" style={{ marginTop: 6 }}>
        <div className="form-section__head">DETALLE (DEBE / HABER)</div>
        <div className="form-section__body">
          {!soloLectura && (
            <div className="btn-row" style={{ marginBottom: 10, flexWrap: "wrap" }}>
              <select className="select" style={{ maxWidth: 220 }} value={subcuentaId} onChange={(e) => setSubcuentaId(e.target.value)}>
                {SUBCUENTAS_SEED.map((s) => <option key={s.id} value={s.id}>{s.codigo} · {s.descripcion}</option>)}
              </select>
              <select className="select" style={{ maxWidth: 110 }} value={ladoRenglon} onChange={(e) => setLadoRenglon(e.target.value as "debe" | "haber")}>
                <option value="debe">Debe</option><option value="haber">Haber</option>
              </select>
              <input className="input" style={{ maxWidth: 120 }} type="number" placeholder="Importe" value={montoRenglon} onChange={(e) => setMontoRenglon(e.target.value)} />
              <select className="select" style={{ maxWidth: 170 }} value={formaPago} onChange={(e) => setFormaPago(e.target.value)}>
                {FORMAS_PAGO.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <Button sm icon={<Plus size={14} />} onClick={agregarRenglon}>Agregar</Button>
            </div>
          )}
          {detalle.length === 0 ? <div className="empty-inline">Sin renglones registrados.</div> : (
            <div className="table-wrap">
              <table className="grid">
                <thead><tr><th>Subcuenta</th><th style={{ width: 130 }}>Forma de pago</th><th className="grid__num" style={{ width: 100 }}>Debe</th><th className="grid__num" style={{ width: 100 }}>Haber</th>{!soloLectura && <th className="grid__col-actions">Acciones</th>}</tr></thead>
                <tbody>
                  {detalle.map((d) => (
                    <tr key={d.id}>
                      <td>{d.subcuenta}</td><td>{d.formaPago}</td>
                      <td className="grid__num">{d.debe ? `Q ${d.debe.toFixed(2)}` : "—"}</td>
                      <td className="grid__num">{d.haber ? `Q ${d.haber.toFixed(2)}` : "—"}</td>
                      {!soloLectura && <td className="grid__col-actions"><button className="link-btn" onClick={() => setDetalle((l) => l.filter((x) => x.id !== d.id))}><Trash2 size={13} /> Quitar</button></td>}
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 700 }}>
                    <td colSpan={2}>Totales</td>
                    <td className="grid__num">Q {totalDebe.toFixed(2)}</td>
                    <td className="grid__num">Q {totalHaber.toFixed(2)}</td>
                    {!soloLectura && <td />}
                  </tr>
                </tbody>
              </table>
              {!balanceado && !soloLectura && <p className="field__error" style={{ marginTop: 6 }}>El total de Debe y Haber debe coincidir para poder guardar (partida doble).</p>}
            </div>
          )}
        </div>
      </section>
    </Modal>
  );
}
