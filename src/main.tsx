import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppShellProvider } from "./context/AppShellContext";
import "./styles/theme.css";
import "./styles/app.css";

// Sin React Router: reproduce la arquitectura real (App.tsx del sistema
// principal cambia de módulo con estado en memoria, no con el navegador).
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppShellProvider>
      <App />
    </AppShellProvider>
  </React.StrictMode>
);
