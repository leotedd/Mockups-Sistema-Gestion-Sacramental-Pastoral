/* ============================================================================
   Generación de EVIDENCIAS VISUALES del módulo Celebraciones
   Sistema Integral de Gestión Sacramental y Pastoral · Parroquia Santa Cruz

   - No modifica código, estilos ni datos del mockup.
   - Solo navega la aplicación ya construida y toma capturas.
   - Ninguna operación persiste datos (no se pulsa "Guardar" ni "Eliminar").

   Uso:  node scripts/capturar-evidencias.mjs
         BASE_URL=http://localhost:5175 node scripts/capturar-evidencias.mjs
   ========================================================================== */

import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const BASE = (process.env.BASE_URL || "http://localhost:5175").replace(/\/$/, "");
const OUT = path.resolve("evidencias", "celebraciones");
const VW = 1440;
const VH = 900;

const resultados = [];

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => console.warn("   [pageerror]", e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.warn("   [console.error]", m.text());
  });

  // --- helpers -------------------------------------------------------------
  const goto = async (hash, waitSel) => {
    await page.setViewportSize({ width: VW, height: VH });
    const url = `${BASE}/#${hash}`;
    // Navegación con hash: si ya estamos en la misma URL, page.goto no recarga
    // el documento (React no se re-monta). Forzamos recarga real para que cada
    // captura parta de un estado limpio.
    if (page.url() === url) {
      await page.reload({ waitUntil: "load" });
    } else {
      await page.goto(url, { waitUntil: "load" });
      if (page.url() !== url) await page.reload({ waitUntil: "load" });
    }
    if (waitSel) await page.waitForSelector(waitSel, { state: "visible", timeout: 15000 });
    await page.waitForTimeout(450);
    // Una navegación por hash (sin recarga) conserva las notificaciones de la
    // pantalla anterior; se espera a que se cierren para no ensuciar la captura.
    await page
      .waitForFunction(() => document.querySelectorAll(".toast").length === 0, null, { timeout: 6000 })
      .catch(() => {});
  };

  const shot = async (name) => {
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(OUT, name) });
  };

  // Captura de "página completa": amplía el alto del viewport para que
  // todo el contenido de .page quepa sin scroll interno (el layout es fijo).
  const shotFull = async (name) => {
    await page.setViewportSize({ width: VW, height: VH });
    await page.waitForTimeout(200);
    const alto = await page.evaluate(() => {
      const shell = document.querySelector(".app-shell");
      const main = document.querySelector(".main");
      const pg = document.querySelector(".main .page") || document.querySelector(".main > *");
      if (!shell || !main || !pg) return 0;
      const chrome = shell.getBoundingClientRect().height - main.getBoundingClientRect().height;
      return Math.ceil(pg.scrollHeight + chrome + 28);
    });
    const h = Math.max(VH, alto || VH);
    await page.setViewportSize({ width: VW, height: h });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, name), fullPage: true });
    await page.setViewportSize({ width: VW, height: VH });
  };

  const campo = (etiqueta, dentro = "") =>
    page.locator(`${dentro} .field`.trim()).filter({ hasText: etiqueta });

  // Espera a que las notificaciones (toasts) se cierren solas, para que las
  // evidencias que no tratan sobre ellas queden limpias.
  const esperarSinToasts = async () => {
    await page
      .waitForFunction(() => document.querySelectorAll(".toast").length === 0, null, { timeout: 6000 })
      .catch(() => {});
  };

  const cap = async (name, { full = false, nota = "" } = {}, fn) => {
    process.stdout.write(`→ ${name} ... `);
    try {
      await fn();
      await page.waitForTimeout(250);
      if (full) await shotFull(name);
      else await shot(name);
      const buf = await readFile(path.join(OUT, name));
      const sz = pngSize(buf);
      const ok = buf.length > 4500 && !!sz && sz.w === VW && sz.h >= VH;
      resultados.push({ name, ok, bytes: buf.length, dim: sz ? `${sz.w}x${sz.h}` : "?", full, nota });
      console.log(`${ok ? "OK" : "REVISAR"}  ${Math.round(buf.length / 1024)}KB  ${sz ? sz.w + "x" + sz.h : "?"}${full ? "  [fullPage]" : ""}`);
    } catch (e) {
      resultados.push({ name, ok: false, err: e.message, full, nota });
      console.log(`ERROR  ${e.message}`);
    }
  };

  // =======================================================================
  // 01 · Listado de celebraciones
  // =======================================================================
  await cap("01_listado_celebraciones.png", { nota: "Listado inicial: filtros, tabla, estados, paginación, botón Nueva celebración." }, async () => {
    await goto("/", "table.grid tbody tr");
    await page.waitForSelector(".pagination");
  });

  // =======================================================================
  // 02 · Nueva celebración (formulario vacío)
  // =======================================================================
  await cap("02_nueva_celebracion.png", { full: true, nota: "Formulario Nueva celebración completo (Datos generales + Celebrantes + Intenciones + acciones)." }, async () => {
    await goto("/nueva", ".form-section");
    await page.waitForSelector("text=DATOS GENERALES");
  });

  // =======================================================================
  // 03-06 · Flujo Celebrantes / Intenciones sobre una celebración en creación
  // =======================================================================
  await goto("/nueva", ".form-section");
  await campo("Tipo de celebración").locator("select").selectOption("Misa dominical");
  await campo("Fecha").locator("input").fill("2026-10-18");
  await campo("Hora desde").locator("input").fill("07:00");
  await campo("Hora hasta").locator("input").fill("08:15");
  await campo("Lugar").locator("select").selectOption("Templo parroquial Santa Cruz");
  await campo("Observaciones").locator("textarea").fill(
    "Misa dominical de la comunidad. Participa el coro parroquial."
  );

  // 03 · Modal Seleccionar celebrante (lista completa de personas)
  await cap("03_seleccionar_celebrante.png", { nota: "Modal Seleccionar celebrante: buscador + tabla Nombre / Tipo-rol / selector + Cancelar / Seleccionar." }, async () => {
    await page.locator(".form-section", { hasText: "CELEBRANTES" }).getByRole("button", { name: "Agregar celebrante" }).click();
    await page.waitForSelector(".modal:has-text('Seleccionar celebrante')");
    await page.waitForSelector(".modal table.grid tbody tr");
    await page.waitForTimeout(200);
  });

  // Seleccionar al párroco y cerrar el modal
  await page.getByPlaceholder("Buscar persona...").fill("Miguel");
  await page.waitForTimeout(200);
  await page.locator(".modal table.grid tbody tr", { hasText: "Pbro. Miguel Ángel Recinos" }).click();
  await page.locator(".modal").getByRole("button", { name: "Seleccionar" }).click();
  await page.waitForSelector(".modal", { state: "detached" });
  await page.waitForSelector(".form-section:has-text('CELEBRANTES') table.grid tbody tr");

  // 04 · Celebrante agregado
  await cap("04_celebrante_agregado.png", { full: true, nota: "Celebración en creación con un celebrante agregado (Principal marcado con estrella + acción Quitar)." }, async () => {
    await esperarSinToasts();
    await page.locator(".form-section", { hasText: "CELEBRANTES" }).scrollIntoViewIfNeeded();
  });

  // 05 · Modal Agregar intención (con datos de ejemplo cargados)
  await cap("05_agregar_intencion.png", { nota: "Modal Agregar intención: Tipo de intención, Descripción, Solicitante, Observaciones + Cancelar / Agregar." }, async () => {
    await esperarSinToasts();
    await page.locator(".form-section", { hasText: "INTENCIONES" }).getByRole("button", { name: "Agregar intención" }).click();
    await page.waitForSelector(".modal:has-text('Agregar intención')");
    await page.locator(".modal .field").filter({ hasText: "Tipo de intención" }).locator("select").selectOption("Acción de gracias");
    await page.locator(".modal .field").filter({ hasText: "Intención / descripción" }).locator("textarea").fill(
      "Por las familias de la Parroquia Santa Cruz y por las vocaciones sacerdotales."
    );
    await page.locator(".modal .field").filter({ hasText: "Solicitante" }).locator("input").fill("Consejo pastoral parroquial");
    await page.locator(".modal .field").filter({ hasText: "Observaciones" }).locator("textarea").fill(
      "Se leerá durante la oración de los fieles."
    );
    await page.waitForTimeout(150);
  });

  // Agregar la intención y cerrar el modal
  await page.locator(".modal").getByRole("button", { name: "Agregar" }).click();
  await page.waitForSelector(".modal", { state: "detached" });
  await page.waitForSelector(".form-section:has-text('INTENCIONES') table.grid tbody tr");

  // 06 · Intención agregada
  await cap("06_intencion_agregada.png", { full: true, nota: "Celebración en creación con una intención registrada (Tipo, Descripción, Solicitante + acción Quitar)." }, async () => {
    await esperarSinToasts();
    await page.locator(".form-section", { hasText: "INTENCIONES" }).scrollIntoViewIfNeeded();
  });

  // =======================================================================
  // 07 · Detalle de celebración (con celebrantes e intención)
  // =======================================================================
  await cap("07_detalle_celebracion.png", { full: true, nota: "Detalle (solo lectura) de la Confirmación del 26/09/2026: información general, celebrantes, intenciones y acciones Volver / Imprimir / Eliminar / Editar." }, async () => {
    await goto("/celebracion/cel-011", "text=Detalle de celebración");
    await page.waitForSelector("text=Mons. Rodolfo Antonio Aguilar");
  });

  // =======================================================================
  // 08 · Editar celebración (datos precargados)
  // =======================================================================
  await cap("08_editar_celebracion.png", { full: true, nota: "Editar celebración con datos, celebrante e intención existentes precargados + acciones Cancelar / Guardar cambios." }, async () => {
    await goto("/celebracion/cel-011/editar", "text=Editar celebración");
    await page.waitForSelector("text=Mons. Rodolfo Antonio Aguilar");
    await page.waitForFunction(() => {
      const s = document.querySelector(".form-section select");
      return s && s.value === "Confirmación";
    });
  });

  // =======================================================================
  // 09 · Calendario · Vista Mes
  // =======================================================================
  await cap("09_calendario_mes.png", { full: true, nota: "Calendario, vista Mes (Septiembre 2026) con múltiples celebraciones + controles Día/Laboral/Semana/Mes/Hoy y Anterior/Siguiente." }, async () => {
    await goto("/calendario", ".cal-month");
    await page.waitForSelector(".cal-event");
  });

  // =======================================================================
  // 10 · Calendario · Vista Semana (con celebraciones)
  // =======================================================================
  await cap("10_calendario_semana.png", { nota: "Calendario, vista Semana 06/09/2026 – 12/09/2026: escala horaria y varias celebraciones." }, async () => {
    await goto("/calendario", ".cal-month");
    await page.locator(".rbtn--sm", { hasText: "Semana" }).click();
    await page.getByRole("button", { name: "Siguiente" }).click();
    await page.waitForSelector(".cal-week .cal-event");
    await page.waitForTimeout(200);
  });

  // =======================================================================
  // 11 · Calendario · Vista Día (día con celebraciones)
  // =======================================================================
  await cap("11_calendario_dia.png", { nota: "Calendario, vista Día (domingo 06/09/2026): escala horaria con tres misas dominicales." }, async () => {
    await goto("/calendario", ".cal-month");
    await page.locator(".rbtn--sm", { hasText: "Día" }).click();
    for (let i = 0; i < 5; i++) await page.getByRole("button", { name: "Siguiente" }).click();
    await page.waitForSelector(".cal-week .cal-event");
    const periodo = (await page.locator(".cal__period").textContent())?.trim();
    if (!periodo || !periodo.includes("06/09/2026")) throw new Error(`Periodo inesperado en vista Día: "${periodo}"`);
  });

  // =======================================================================
  // 12 · Calendario · Vista Laboral (rango debe coincidir con columnas)
  // =======================================================================
  await cap("12_calendario_laboral.png", { nota: "Calendario, vista Laboral 14/09/2026 – 18/09/2026: encabezado verificado contra columnas Lun 14/09 … Vie 18/09; celebraciones de la semana de la fiesta patronal." }, async () => {
    await goto("/calendario", ".cal-month");
    await page.locator(".rbtn--sm", { hasText: "Laboral" }).click();
    for (let i = 0; i < 2; i++) await page.getByRole("button", { name: "Siguiente" }).click();
    await page.waitForSelector(".cal-week .cal-event");

    const periodo = ((await page.locator(".cal__period").textContent()) || "").replace(/\s+/g, " ").trim();
    const cols = await page.locator(".cal-week__head span").allTextContents();
    const fechasCol = cols
      .slice(1)
      .map((s) => (s.match(/\d{2}\/\d{2}/) || [])[0])
      .filter(Boolean);
    const periodoFechas = (periodo.match(/\d{2}\/\d{2}/g) || []);
    if (
      fechasCol.length !== 5 ||
      periodoFechas[0] !== fechasCol[0] ||
      periodoFechas[1] !== fechasCol[fechasCol.length - 1]
    ) {
      throw new Error(
        `Inconsistencia encabezado/columnas. Encabezado="${periodo}"  Columnas=${JSON.stringify(fechasCol)}`
      );
    }
    if (!/^14\/09\/2026 . 18\/09\/2026$/.test(periodo)) {
      throw new Error(`Periodo laboral inesperado: "${periodo}"`);
    }
    // Mostrar las celebraciones de la tarde/noche (fiesta patronal)
    await page.locator(".cal-week").evaluate((el) => (el.scrollTop = 320));
    await page.waitForTimeout(250);
  });

  // =======================================================================
  // 13 · Estado CANCELADA (visible en el listado)
  // =======================================================================
  await cap("13_estado_cancelada.png", { nota: "Listado filtrado por 'Celebración especial': muestra los estados Confirmada, Cancelada y Programada; la celebración del 21/09/2026 aparece con chip 'Cancelada'." }, async () => {
    await goto("/", "table.grid tbody tr");
    await page.locator(".filters select").nth(0).selectOption("Celebración especial");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await page.waitForSelector("td:has-text('Cancelada')");
    await page.waitForTimeout(200);
  });
  // limpiar filtros (no persiste, pero se sigue la instrucción)
  await page.getByRole("button", { name: "Limpiar filtros" }).click().catch(() => {});

  // =======================================================================
  // 14 · Confirmación de eliminación (sin confirmar)
  // =======================================================================
  await cap("14_confirmacion_eliminar.png", { nota: "Modal 'Confirmar eliminación' abierto desde el detalle, con resumen de la celebración y botón Eliminar en rojo. NO se confirma." }, async () => {
    await goto("/celebracion/cel-011", "text=Detalle de celebración");
    await page.locator(".page__head").getByRole("button", { name: "Eliminar" }).click();
    await page.waitForSelector(".modal:has-text('Confirmar eliminación')");
    await page.waitForTimeout(200);
  });
  // cancelar la operación
  await page.locator(".modal").getByRole("button", { name: "Cancelar" }).click().catch(() => {});

  // =======================================================================
  // 15 · Validación de formulario (campos obligatorios)
  // =======================================================================
  await cap("15_validacion_formulario.png", { nota: "Intento de guardar Nueva celebración con campos obligatorios vacíos: mensajes de error por campo + notificación 'Revise el formulario'." }, async () => {
    await goto("/nueva", ".form-section");
    await page.getByRole("button", { name: "Guardar", exact: true }).click();
    await page.waitForSelector(".field--error");
    await page.waitForSelector(".toast--error");
    await page.waitForTimeout(200);
    await page.evaluate(() => document.querySelector(".main")?.scrollTo(0, 0));
    await page.waitForTimeout(150);
  });

  // =======================================================================
  // 16 · Mensaje de éxito (operación no destructiva: Actualizar)
  // =======================================================================
  await cap("16_mensaje_exito.png", { nota: "Acción 'Actualizar' del Ribbon sobre el listado: notificación 'Actualización exitosa' (no modifica datos)." }, async () => {
    await goto("/", "table.grid tbody tr");
    await esperarSinToasts();
    await page.locator(".rbtn", { hasText: "Actualizar" }).click();
    await page.waitForSelector(".toast--success:has-text('Actualización exitosa')");
    await page.waitForTimeout(150);
  });

  // =======================================================================
  // 17 · Sin resultados de búsqueda
  // =======================================================================
  await cap("17_sin_resultados.png", { nota: "Búsqueda sin coincidencias ('Vigilia pascual solemne'): estado 'Sin resultados de búsqueda'." }, async () => {
    await goto("/", "table.grid tbody tr");
    await esperarSinToasts();
    await page.getByPlaceholder("Tipo, lugar, celebrante, intención...").fill("Vigilia pascual solemne");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await page.waitForSelector("text=Sin resultados de búsqueda");
    await page.waitForTimeout(200);
  });
  await page.getByRole("button", { name: "Limpiar filtros" }).click().catch(() => {});

  // =======================================================================
  // 18 · Vista de impresión
  // =======================================================================
  await cap("18_impresion_celebracion.png", { full: true, nota: "Vista de impresión 'Programación de Celebraciones' del 1 al 30 de septiembre de 2026 (documento formal listo para imprimir)." }, async () => {
    await goto("/impresion", ".print-sheet");
    await page.waitForSelector(".print-grid tbody tr");
  });

  await browser.close();

  // --- resumen ------------------------------------------------------------
  console.log("\n──────────────────────────────────────────────");
  const okCount = resultados.filter((r) => r.ok).length;
  for (const r of resultados) {
    console.log(`${r.ok ? "  OK   " : "  FALLA"}  ${r.name}${r.err ? "  :: " + r.err : ""}`);
  }
  console.log("──────────────────────────────────────────────");
  console.log(`EVIDENCIAS OK: ${okCount}/${resultados.length}`);
  if (okCount !== resultados.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
