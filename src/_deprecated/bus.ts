/* Bus de eventos ligero para coordinar acciones del Ribbon con las pantallas
   activas (solo mockup). */

export type BusEvento =
  | "ribbon:actualizar"
  | "ribbon:add-celebrante"
  | "ribbon:add-intencion";

export function emitir(evento: BusEvento) {
  window.dispatchEvent(new CustomEvent(evento));
}

export function escuchar(evento: BusEvento, handler: () => void) {
  window.addEventListener(evento, handler);
  return () => window.removeEventListener(evento, handler);
}
