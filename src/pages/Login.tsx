import { useState, type FormEvent } from "react";
import { Church, LogIn } from "lucide-react";
import { useAppShell } from "../context/AppShellContext";

/**
 * Pantalla de acceso del mockup. Reproduce 1:1 la estructura visual de
 * pages/Login.tsx del proyecto principal: panel izquierdo oscuro (marca +
 * formulario) y panel derecho claro con la insignia circular de TRES capas
 * (marco blanco con sombra → anillo cónico dorado → fotografía circular con
 * borde blanco). `/login.jpeg` es una copia local de
 * `frontend/public/login.jpeg` del proyecto principal (misma fotografía de
 * la fachada de la Parroquia Santa Cruz, copiada — no movida — para lograr
 * fidelidad visual; el original del proyecto principal no se tocó).
 *
 * NO existe ningún selector de rol en el Login real (el rol viene de la
 * cuenta autenticada) — por eso este mockup tampoco lo tiene.
 *
 * Es puramente una DEMOSTRACIÓN VISUAL: los campos Usuario/Contraseña
 * existen solo como elementos de diseño, no son obligatorios y no se
 * validan contra nada. "Ingresar" siempre deja pasar al mockup.
 */
export function Login() {
  const { iniciarSesion } = useAppShell();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    iniciarSesion(usuario.trim() || "Secretaría parroquial");
  };

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-panel__inner">
          <div className="login-brand">
            <Church size={22} />
            <span>Administración Diocesana</span>
          </div>
          <h1 className="login-title">¡Hola, Bienvenido!</h1>
          <p className="login-sub">Parroquia Santa Cruz · Chiquimulilla</p>

          <div className="login-divider" />

          <h2 className="login-form-title">Iniciar sesión</h2>
          <p className="login-form-hint">Use las credenciales asignadas por la administración.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="login-usuario">Usuario</label>
              <input
                id="login-usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                placeholder="admin"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="login-input"
                autoFocus
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-contrasena">Contraseña</label>
              <input
                id="login-contrasena"
                name="contrasena"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="login-input"
              />
            </div>

            <button type="submit" className="login-btn">
              <LogIn size={18} />
              Ingresar
            </button>
          </form>

          <p className="login-footer">Sistema de gestión parroquial</p>
        </div>
      </div>

      <div className="login-side">
        <div className="login-badge">
          <div className="login-badge__frame">
            <div className="login-badge__ring">
              <img src="/login.jpeg" alt="Parroquia Santa Cruz, Chiquimulilla" className="login-badge__photo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
