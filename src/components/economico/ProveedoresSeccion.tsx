import { useRef, useState } from "react";
import { FilePlus2, Pencil, Trash2 } from "lucide-react";
import { PROVEEDORES_SEED, type Proveedor } from "../../data/economico";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Banner } from "../ui/Banner";
import { ProveedorFormDialog } from "./ProveedorFormDialog";

type Dialogo = "formulario" | "confirmarEliminar" | null;

/** Sección "Proveedores" — modelo ecproveedores del schema. */
export function ProveedoresSeccion({ onMensaje }: { onMensaje: (m: string) => void }) {
  const [proveedores, setProveedores] = useState<Proveedor[]>(PROVEEDORES_SEED);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [exito, setExito] = useState<string | null>(null);
  const nextIdRef = useRef(950);

  const seleccionado = proveedores.find((p) => p.id === seleccionadoId) ?? null;

  const guardar = (p: Proveedor) => {
    setProveedores((l) => (l.some((x) => x.id === p.id) ? l.map((x) => (x.id === p.id ? p : x)) : [p, ...l]));
    setSeleccionadoId(p.id);
    setDialogo(null);
    setExito("Proveedor guardado correctamente.");
    onMensaje("Proveedor guardado.");
  };
  const eliminar = () => {
    if (!seleccionadoId) return;
    setProveedores((l) => l.filter((p) => p.id !== seleccionadoId));
    setSeleccionadoId(null);
    setDialogo(null);
    onMensaje("Proveedor eliminado.");
  };

  return (
    <div className="page">
      <div className="page__head">
        <div><h1 className="page__title">Proveedores</h1><div className="page__subtitle">Entidades a quienes se realizan pagos por bienes o servicios</div></div>
        <div className="btn-row">
          <Button icon={<Pencil size={14} />} disabled={!seleccionado} onClick={() => setDialogo("formulario")}>Editar</Button>
          <Button icon={<Trash2 size={14} />} variante="danger" disabled={!seleccionado} onClick={() => setDialogo("confirmarEliminar")}>Eliminar</Button>
          <Button variante="primary" icon={<FilePlus2 size={14} />} onClick={() => { setSeleccionadoId(null); setDialogo("formulario"); }}>Nuevo proveedor</Button>
        </div>
      </div>
      <div className="page__body">
        {exito && <Banner tipo="success" mensaje={exito} onCerrar={() => setExito(null)} />}
        <div className="table-wrap">
          <table className="grid">
            <thead><tr><th>Nombre</th><th>Dirección</th><th>Teléfono</th><th>Contacto</th></tr></thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id} className={seleccionadoId === p.id ? "is-selected" : ""} onClick={() => setSeleccionadoId(p.id)} onDoubleClick={() => setDialogo("formulario")}>
                  <td><strong>{p.descripcion}</strong></td>
                  <td>{p.direccion}, {p.localidad}</td>
                  <td>{p.telefono || "—"}</td>
                  <td>{p.contacto || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {proveedores.length === 0 && <div className="empty-inline">Sin proveedores registrados.</div>}
        </div>
      </div>

      {dialogo === "formulario" && <ProveedorFormDialog proveedor={seleccionado} onCerrar={() => setDialogo(null)} onGuardar={guardar} nextId={() => `prov-${++nextIdRef.current}`} />}
      {dialogo === "confirmarEliminar" && (
        <ConfirmDialog titulo="Eliminar proveedor" mensaje="¿Deseas eliminar el proveedor seleccionado?" textoConfirmar="Eliminar" tono="alerta" onConfirmar={eliminar} onCancelar={() => setDialogo(null)} />
      )}
    </div>
  );
}
