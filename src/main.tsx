import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AppShellProvider } from "./context/AppShellContext";
import "./styles/theme.css";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <AppShellProvider>
        <App />
      </AppShellProvider>
    </HashRouter>
  </React.StrictMode>
);
