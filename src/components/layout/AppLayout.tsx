import type { ReactNode } from "react";

/**
 * Envoltorio minimo de la rejilla de la aplicacion (topbar/ribbon + cuerpo +
 * statusbar). A diferencia del mockup original, cada modulo ahora arma su
 * propio Ribbon y su propio Sidebar (igual que en el desarrollo real, donde
 * cada pagina -Agenda.tsx, Personas.tsx, Celebraciones.tsx...- compone su
 * propio encabezado en vez de compartir un layout unico), asi que este
 * componente solo aporta la estructura visual de la rejilla.
 */
export function AppShellGrid({ children }: { children: ReactNode }) {
  return <div className="app-shell">{children}</div>;
}

export function AppBody({ children }: { children: ReactNode }) {
  return <div className="app-body">{children}</div>;
}
