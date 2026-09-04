import { CalendarDays, Church } from "lucide-react";

export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span style={{ position: "relative", display: "inline-flex" }}>
          <CalendarDays size={18} />
          <Church size={11} style={{ position: "absolute", right: -4, bottom: -3 }} />
        </span>
        Celebraciones parroquiales
      </div>
      <div className="topbar__parish">Parroquia Santa Cruz · Chiquimulilla</div>
    </header>
  );
}
