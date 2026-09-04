# Mockup · Sistema Integral de Gestión Sacramental y Pastoral

Parroquia Santa Cruz · Chiquimulilla

Prototipo visual **navegable y unificado** de todos los módulos del sistema.
No es el frontend definitivo: sirve como especificación visual y evidencia
de diseño para el desarrollo real. Todos los datos son **ficticios** y viven
en memoria (no hay backend, base de datos, API ni autenticación).

Este mockup fue actualizado para reflejar el **desarrollo real actual**
(`Sistema_Integral_de_Gestion_Sacramental_Pastoral`), que tiene prioridad
visual y funcional sobre este repositorio. Ver `documentacion/AUDITORIA.md`
para el detalle de diferencias corregidas.

## Tecnología

- React 18 + TypeScript + Vite
- react-router-dom (navegación con `HashRouter`)
- lucide-react (iconos)
- CSS propio (sin librería de utilidades), ver `src/styles/`

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

URL local: **http://localhost:5173/** (si el puerto está ocupado, Vite usa el
siguiente, p. ej. 5174; la URL exacta aparece en la consola).

```bash
npm run build      # verificación de tipos (tsc) + build de producción
npm run preview    # sirve el build de producción
```

## Módulos incluidos

| Módulo | Ruta | Estado en el desarrollo real | Fuente de diseño |
|---|---|---|---|
| Agenda | `/agenda` | Desarrollado | Reproduce `pages/Agenda.tsx` real |
| Personas | `/personas` | Desarrollado | Reproduce `pages/Personas.tsx` real |
| Parroquias | `/parroquias` | Desarrollado (solo Admin/Sacerdote) | Reproduce `pages/Parroquias.tsx` real |
| Usuarios | `/usuarios` | Desarrollado (solo Admin/Sacerdote) | Reproduce `pages/Usuarios.tsx` real |
| **Celebraciones** | `/celebraciones` | Desarrollado | Reproduce **exclusivamente** `pages/Celebraciones.tsx` real |
| Familias | `/familias` | Backend + servicio listos, sin UI real | Diseñado desde el DTO/esquema del backend |
| Catequesis | `/catequesis` | Backend + servicio listos, sin UI real | Diseñado desde el DTO/esquema del backend |
| Sacramental | `/sacramental` | Solo backend | Diseñado desde el DTO/esquema del backend |
| **Económico** | `/economico` (+ `/cuentas`, `/proveedores`, `/vencimientos`, `/balance`) | No existe (solo esquema de BD) | Construido desde cero a partir de `schema.prisma` y `tipo-de-reportes-sp.md` |
| Galería de estados (referencia interna, no es un módulo) | `/estados` | — | — |

## Estructura visual global (compartida por todos los módulos)

1. **Encabezado** borgoña con icono del módulo, nombre y parroquia, más una
   cinta de opciones (Ribbon) tipo Office. La mayoría de módulos usa el
   Ribbon genérico (`components/layout/Ribbon.tsx`, pestañas Inicio/Impresión
   configurables); **Celebraciones usa su propio Ribbon**
   (`components/celebraciones/CelebracionesRibbon.tsx`) con una pestaña
   dinámica, igual que en el sistema real.
2. **Sidebar** marfil con los módulos (Agenda, Personas, Parroquias\*,
   Usuarios\*, Familias, Catequesis, Sacramental, Económico, Celebraciones —
   \*visibles solo para Administrador/Sacerdote, alternable con el selector
   "Ver como" al pie del sidebar) y un panel superior contextual por módulo.
3. **Área principal** de alta densidad de información (tablas, filtros,
   formularios modales, detalle).
4. **Mensajes de éxito/aviso en línea** arriba del contenido (no hay toasts
   flotantes, igual que en el sistema real) y **status bar** borgoña con
   fecha del sistema, contador de registros y mensaje transitorio.

## Paleta

| Rol | Color |
|-----|-------|
| Borgoña institucional | `#5C061B` |
| Dorado litúrgico (selección/acento) | `#D4AF37` |
| Marfil (fondos) | `#FAF7F0` |
| Texto oscuro | `#1E1C1A` |

## Notas

- Fechas siempre en formato **dd/mm/aaaa**.
- Fecha simulada del sistema: **01/09/2026** (`src/context/AppShellContext.tsx`).
- Los datos no persisten al recargar la página (es intencional).
- Nombres orientados al usuario final: no se muestran nombres de tablas ni IDs.
- Funcionalidades **no implementadas todavía en el sistema real** se marcan
  explícitamente como pendientes en vez de simularse como terminadas: la
  impresión y el registro rápido de intenciones de Celebraciones muestran un
  aviso "en preparación" al intentarse, igual que en el desarrollo actual.
