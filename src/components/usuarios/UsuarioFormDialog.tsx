import { useState } from "react";
import { Save, UserCog } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { TextField } from "../ui/Field";
import type { Rol, Usuario } from "../../data/usuarios";

interface Props {
  modo: "nuevo" | "ver" | "editar";
  usuario: Usuario | null;
  roles: Rol[];
  onCerrar: () => void;
  onGuardar: (u: Usuario) => void;
  nextId: () => string;
}

/** Reproduce components/UsuarioFormDialog.tsx del desarrollo real. */
export function UsuarioFormDialog({ modo, usuario, roles, onCerrar, onGuardar, nextId }: Props) {
  const soloLectura = modo === "ver";
  const [nombreUsuario, setNombreUsuario] = useState(usuario?.usuario ?? "");
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(usuario?.descripcion ?? "");
  const [contrasena, setContrasena] = useState("");
  const [rolesSel, setRolesSel] = useState<string[]>(usuario?.roles ?? []);
  const [errores, setErrores] = useState<{ nombreUsuario?: string; nombre?: string; contrasena?: string }>({});

  const toggleRol = (r: string) => setRolesSel((l) => (l.includes(r) ? l.filter((x) => x !== r) : [...l, r]));

  const guardar = () => {
    const e: typeof errores = {};
    if (!nombreUsuario.trim()) e.nombreUsuario = "Ingrese el nombre de usuario.";
    if (!nombre.trim()) e.nombre = "Ingrese el nombre completo.";
    if (modo === "nuevo" && contrasena.trim().length < 8) e.contrasena = "La contraseña debe tener al menos 8 caracteres.";
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    onGuardar({ id: usuario?.id ?? nextId(), usuario: nombreUsuario.trim(), nombre: nombre.trim(), descripcion, activo: usuario?.activo ?? true, roles: rolesSel });
  };

  const titulo = modo === "nuevo" ? "Nuevo usuario" : modo === "editar" ? "Editar usuario" : "Ficha del usuario";

  return (
    <Modal
      titulo={titulo}
      icon={<UserCog size={16} />}
      wide
      onClose={onCerrar}
      footer={soloLectura ? <Button onClick={onCerrar}>Cerrar</Button> : <><Button onClick={onCerrar}>Cancelar</Button><Button variante="primary" icon={<Save size={14} />} onClick={guardar}>Guardar</Button></>}
    >
      <div className="form-grid">
        <TextField label="Nombre de usuario" required disabled={soloLectura || modo === "editar"} value={nombreUsuario} error={errores.nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
        <TextField label="Nombre completo" required disabled={soloLectura} className="col-span-2" value={nombre} error={errores.nombre} onChange={(e) => setNombre(e.target.value)} />
        <TextField label="Descripción / cargo" disabled={soloLectura} className="col-span-2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        {modo === "nuevo" && (
          <TextField label="Contraseña" required type="password" value={contrasena} error={errores.contrasena} onChange={(e) => setContrasena(e.target.value)} />
        )}
        <div className="field col-span-3">
          <label className="field__label">Roles asignados</label>
          <div className="btn-row">
            {roles.map((r) => (
              <label key={r.id} className="badge-role" style={{ cursor: soloLectura ? "default" : "pointer", background: rolesSel.includes(r.nombre) ? "var(--dorado-suave)" : undefined }}>
                <input type="checkbox" disabled={soloLectura} checked={rolesSel.includes(r.nombre)} onChange={() => toggleRol(r.nombre)} style={{ marginRight: 4 }} />
                {r.nombre}
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
