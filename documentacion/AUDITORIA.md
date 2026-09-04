# Auditoría y unificación de mockups — Sistema Integral de Gestión Sacramental y Pastoral

Fecha: 04/09/2026. Alcance: unificación completa de mockups (Agenda, Personas,
Familias, Catequesis, Sacramental, Económico, Celebraciones, Parroquias,
Usuarios) bajo la línea visual del desarrollo real actual.

## Fuentes usadas (por prioridad)

- **Diseño:** `Sistema_Integral_de_Gestion_Sacramental_Pastoral` (frontend real,
  React+Vite+Tailwind) > mockups originales de este repo > Office Eclesial.
- **Funcionalidad:** documentación del proyecto (`backend/prisma/tipo-de-reportes-sp.md`,
  `frontend/docs/*`) + base de datos (`backend/prisma/schema.prisma`) + backend
  (`backend/src/modules/*`) > mockups > Office Eclesial.
- Office Eclesial solo se usó como referencia funcional (no visual); su
  carpeta local (`Documents/Office Eclesial 3 - Versión Parroquial`) resultó
  ser únicamente un log de la app instalada, sin contenido utilizable.

## Diferencias detectadas y corregidas respecto a los mockups antiguos

1. Header de dos piezas (TopBar + Ribbon) → **un solo encabezado** (barra
   borgoña + cinta de opciones), como en el desarrollo real.
2. Ribbon con pestañas fijas "Inicio/Impresión" clicables (mockup viejo de
   Celebraciones) → **pestaña dinámica** que cambia sola según el modo
   (Inicio / Nueva celebración / Editar celebración / Detalle), exclusiva de
   Celebraciones. El resto de módulos sí usa el Ribbon genérico con pestañas
   Inicio/Impresión reales.
3. Grupo del ribbon "Otras acciones" → renombrado **"Registro"**.
4. Sidebar: se agregó **Parroquias** y **Usuarios** (visibles solo para
   Administrador/Sacerdote/Párroco) y se **quitó "Directorio"** (nunca se
   desarrolló). Se agregó el **panel superior contextual** por módulo.
5. Paginación con botones numerados (1,2,3…) → **"Anterior / Página X de Y /
   Siguiente"**, igual en todos los módulos.
6. **Toasts flotantes** → **mensajes en línea (banners)** arriba del
   contenido + mensaje transitorio en la barra de estado.
7. Nuevo/Editar en Celebraciones: rutas de página completa (`/nueva`,
   `/celebracion/:id/editar`) → **"Nuevo" es un modal**, **"Editar" reemplaza
   el contenido principal in-place**, sin cambiar de ruta.
8. Calendario de Celebraciones: pasó de ruta independiente (`/calendario`) a
   **alternador de vista** dentro de la misma pantalla.
9. Impresión de Celebraciones (antes pantalla `VistaImpresionPage` completa):
   **todavía no está implementada en el sistema real** → se muestra como
   aviso "en preparación", no como función terminada.
10. Registro rápido de "Agregar intención" desde el Ribbon sobre una
    celebración ya guardada: **pendiente en el sistema real** → aviso "en
    preparación". Sigue funcionando dentro del formulario de Nueva/Editar
    celebración (sí implementado, confirmado por la matriz de pruebas real).
11. Agenda y Personas: **sí tienen impresión implementada** en el sistema
    real (vista previa + configuración de página) → se construyeron esas
    pantallas como funcionales, no como pendientes.

## Módulo construido desde cero: Económico

Sin mockup previo ni pantalla desarrollada. Se construyó a partir de:

- `backend/prisma/schema.prisma`, modelos `ec*` (27 tablas): jerarquía de
  cuentas Rubro→Grupo→Cuenta→Subcuenta, cabecera/detalle de movimientos
  (Debe/Haber), saldos, proveedores, vencimientos, centros de costo,
  catálogos (bancos, formas de pago, tipos de movimiento).
- `backend/prisma/tipo-de-reportes-sp.md`, sección 5 ("Módulo Económico y
  Contabilidad Parroquial"): `ecBalance`, `ecDiario`, `ecColaboracionesMes`,
  `ecConsultaMovAnualPersona` — de aquí salen las pantallas Libro de
  movimientos, Balance de cuentas, Vencimientos y Proveedores.

No se inventó ningún proceso sin respaldo en el esquema o el catálogo de
reportes.

## Pendiente / no cubierto en esta pasada

- Las capturas en `evidencias/celebraciones/*.png` corresponden al diseño
  **anterior** a esta actualización y deben regenerarse navegando el mockup
  actualizado.
- Catálogo de cuentas de Económico es de solo lectura en este mockup (el
  alta seguiría el mismo patrón modal que el resto del sistema).
- Agenda simplifica la configuración de periodicidad/recurrencia de citas
  (el tipo real `PeriodicidadConfig` existe en el backend pero no se
  representó en el formulario, por ser una funcionalidad secundaria).
