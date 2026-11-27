
# UI Component Library — Angular + TypeScript (instaleap-reto)

Workspace de Angular con una librería de componentes reutilizables (`ui-lib`) y una aplicación demo (`demo-app`) inspirada en el universo de Rick & Morty. Está construida con Angular, TypeScript estricto (`strict: true`) y Tailwind CSS v3.

**Demo en vivo:** [https://mecan30.github.io/instaleap-reto/](https://mecan30.github.io/instaleap-reto/)

## Arquitectura del proyecto

```
instaleap-reto/
├── projects/
│   ├── ui-lib/      ← librería de componentes (Button, Card, Select, Table)
│   └── demo-app/    ← app que consume la librería (Explorer de Recursos)
├── angular.json
└── package.json
```

- **`projects/ui-lib`**: librería de componentes standalone con `ChangeDetectionStrategy.OnPush` y Angular Signals API (`input()`, `output()`, `model()`). Todo se exporta desde `projects/ui-lib/src/public-api.ts`. Los componentes no conocen el dominio de los datos ni hacen llamadas HTTP.
- **`projects/demo-app`**: aplicación que consume `ui-lib` únicamente a través de su API pública (sin importaciones internas). Implementa el Explorer de Recursos sobre la [Rick and Morty API](https://rickandmortyapi.com/documentation). El estado del flujo (recurso activo, filtro, registros, carga, error) vive en `RickAndMortyExplorerService`, un servicio basado en signals.

## Instalación y ejecución

Desde la terminal, en la raíz del proyecto:

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar la librería (la demo la consume desde dist/ui-lib)
ng build ui-lib

# 3. Ejecutar la aplicación demo
ng serve demo-app
```

Después abre `http://localhost:4200`.

> **¿Por qué compilar la librería primero?** En `tsconfig.json` el alias `ui-lib` apunta a `./dist/ui-lib`, de modo que la demo usa la librería ya compilada, igual que lo haría un proyecto externo que la instala.

## API de los componentes

Todos los selectores usan el prefijo `ui-`.

### `<ui-button>`

| Tipo | Nombre | Tipo TS | Por defecto | Descripción |
|------|--------|---------|-------------|-------------|
| `input()` | `label` | `string` (requerido) | — | Texto visible del botón |
| `input()` | `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Estilo visual del botón |
| `input()` | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `input()` | `disabled` | `boolean` | `false` | Bloquea la interacción |
| `input()` | `loading` | `boolean` | `false` | Muestra spinner y bloquea el click |
| `output()` | `clicked` | `void` | — | Emite solo si no está `disabled` ni `loading` |

```html
<ui-button
  label="Explorar"
  variant="primary"
  size="md"
  [disabled]="false"
  [loading]="false"
  (clicked)="onAction()"
/>
```

### `<ui-card>`

| Tipo | Nombre | Tipo TS | Por defecto | Descripción |
|------|--------|---------|-------------|-------------|
| `input()` | `title` | `string` | `''` | Título del header de la card |
| `input()` | `subtitle` | `string \| null` | `null` | Subtítulo opcional bajo el título |
| `input()` | `elevation` | `'flat' \| 'raised' \| 'outlined'` | `'outlined'` | Estilo visual del contenedor |
| `output()` | `headerClicked` | `void` | — | Emite al hacer clic en el header |
| `ng-content` | — | — | — | Proyecta contenido arbitrario en el body |

```html
<ui-card
  title="Rick Sanchez"
  subtitle="Human · Alive"
  elevation="raised"
  (headerClicked)="onHeaderClick()"
>
  <p>Contenido proyectado en el body de la card.</p>
</ui-card>
```

### `<ui-select>`

**Modelo:** `SelectOption = { label: string; value: string }`

| Tipo | Nombre | Tipo TS | Por defecto | Descripción |
|------|--------|---------|-------------|-------------|
| `input()` | `options` | `SelectOption[]` | `[]` | Lista de opciones `{ label, value }` |
| `input()` | `label` | `string` | `''` | Etiqueta visible sobre el select |
| `input()` | `placeholder` | `string` | `'Seleccionar una opción'` | Texto cuando no hay selección |
| `input()` | `loading` | `boolean` | `false` | Estado de carga (spinner) |
| `input()` | `disabled` | `boolean` | `false` | Bloquea la interacción |
| `model()` | `value` | `string \| null` | `null` | Two-way binding del valor seleccionado |
| `output()` | `selectionChange` | `SelectOption` | — | Emite el objeto completo al cambiar |

```html
<ui-select
  label="Recurso"
  placeholder="Elige un recurso"
  [options]="resourceOptions"
  [loading]="isLoading()"
  [disabled]="isDisabled()"
  [(value)]="selectedResource"
  (selectionChange)="onResourceChange($event)"
/>
```

### `<ui-table>`

Tabla genérica (`UiTable<T>`): no conoce el dominio de los datos; solo renderiza columnas y emite acciones. El componente padre decide qué hacer con cada acción.

**Modelos:**

- `TableColumn = { key: string; header: string }`
- `TableAction<T> = { action: 'view' | 'delete'; row: T }`

| Tipo | Nombre | Tipo TS | Por defecto | Descripción |
|------|--------|---------|-------------|-------------|
| `input()` | `columns` | `TableColumn[]` | `[]` | Definición de columnas `{ key, header }` |
| `input()` | `rows` | `T[]` (genérico) | `[]` | Datos a renderizar |
| `input()` | `loading` | `boolean` | `false` | Muestra filas skeleton en lugar de datos |
| `input()` | `emptyMessage` | `string` | `'No hay registros para mostrar.'` | Mensaje cuando `rows` está vacío |
| `input()` | `errorMessage` | `string \| null` | `null` | Mensaje de error de red visible en la tabla |
| `output()` | `actionTriggered` | `TableAction<T>` | — | Emite `{ action: 'view' \| 'delete', row: T }` |

```html
<ui-table
  [columns]="tableColumns"
  [rows]="tableRows()"
  [loading]="isLoading()"
  [errorMessage]="errorMessage()"
  emptyMessage="No se encontraron resultados."
  (actionTriggered)="onTableAction($event)"
/>
```

## Decisiones de diseño

- **Tailwind CSS v3 (3.4.17):** se fijó la versión 3 para cumplir el requisito del reto y mantener una paleta oscura con acentos verdes y cian acorde a la temática.
- **API pública centralizada:** los componentes se exportan desde `public-api.ts` para mantener el desacoplamiento entre `ui-lib` y `demo-app`.
- **Desacoplamiento entre librería y dominio:** los componentes de `ui-lib` son agnósticos de la API de Rick and Morty. Toda la lógica de consumo HTTP, las columnas por recurso y el estado viven en `demo-app` (`RickAndMortyExplorerService`).
- **Estado reactivo con Signals:** el servicio centraliza el estado con `signal()` y `computed()` (`selectedResource`, `selectedStatus`, `items`, `loading`, `errorMessage`, `selectedItem`, `pendingDeleteItem`, `activeColumns`, `isStatusFilterEnabled`), junto con `OnPush` en `App`. Así no hay suscripciones manuales en la vista y las actualizaciones son predecibles.
- **Tipado estricto sin `any`** (`rick-and-morty.models.ts`): interfaces genéricas (`ApiPaginatedResponse<T>`), uniones literales (`ResourceType`, `CharacterStatus`) y type guards (`isCharacter`, `isEpisode`, `isLocation`) para alternar con seguridad entre personajes, episodios y ubicaciones.
- **Filtro dependiente del contexto:** el filtro de estado (`Alive`, `Dead`, `unknown`) solo se habilita en *Characters*, porque la API no permite filtrar por status en Episodes ni Locations. Se reinicia al cambiar de recurso.
- **Un 404 de la API se trata como "sin resultados":** la API responde 404 cuando un filtro no encuentra coincidencias; el servicio lo muestra como estado vacío y no como error. Los demás fallos (red, 500) sí muestran el estado de error.
- **Proyección de contenido y confirmación destructiva:** `<ui-card>` se reutiliza en el modal de detalle (contenido adaptado por tipo de recurso vía `ng-content`) y en el modal de confirmación previo a eliminar un registro.
- **Atmósfera Rick & Morty:** paleta oscura espacial (`#070b14` / `#0b1322`), acentos verde portal (`#97ce4c`) y cian, tipografía monoespaciada para identificadores y códigos, y una bitácora de eventos emitidos por los componentes.

## Paginación y contador general

- La tabla muestra bloques de hasta 20 registros, uno por página de la API.
- Los botones **Anterior** / **Siguiente** usan `info.prev` / `info.next` de la API y se deshabilitan cuando no hay página o hay una petición en curso.
- El indicador superior muestra el total real (`info.count`) del recurso y filtro activos, junto con la página actual y el total (`Pág. X/Y`).
- Al cambiar de recurso o de filtro se vuelve a la página 1.

## Pruebas unitarias con Vitest

Hay pruebas con `TestBed` para `UiButton`, `UiCard`, `UiSelect`, `UiTable` y `App`. Cubren renderizado, inputs y outputs, los estados (`disabled`, `loading`, vacío, error) y la proyección de contenido. En `App` se usan `provideHttpClient()` y `provideHttpClientTesting()` para no depender de la red.

```bash
ng test ui-lib --watch=false
ng test demo-app --watch=false
```

## Despliegue en GitHub Pages

Cada `push` a `main` ejecuta el workflow `.github/workflows/deploy.yml`: compila primero `ui-lib` (`npx ng build ui-lib`), luego `demo-app` con `--base-href /instaleap-reto/` y publica `dist/demo-app/browser` en GitHub Pages.

### Confirmación de eliminación con detalle completo

- **Ficha completa antes de eliminar:** El modal de confirmación de borrado muestra el mismo detalle del registro que el modal de consulta (imagen y atributos de personaje, código/emisión/personajes de episodio, o tipo/dimensión/residentes de ubicación) para revisar con claridad qué elemento se va a quitar de la vista actual.
- **Plantilla reutilizable (`NgTemplateOutlet`):** La vista de detalle se define en un `<ng-template #itemDetailContent let-item>` y se renderiza tanto en el modal de detalle como en el de confirmación evitando duplicar marcado HTML.

