
# UI Component Library — Angular + TypeScript (instaleap-reto)

Workspace de Angular con una librería de componentes reutilizables (ui-lib) y una aplicación demo (demo-app) inspirada en el universo de Rick & Morty, construida con Angular, TypeScript estricto (strict: true) y Tailwind CSS v3.

# Arquitectura del proyecto

- projects/ui-lib: librería de componentes standalone con (ChangeDetectionStrategy.OnPush) y Angular Signals API (input(), output(), model()), expuestos públicamente desde (projects/ui-lib/src/public-api.ts).

- projects/demo-app: aplicación consumidora de (ui-lib) (sin importaciones internas directas), donde se construirá el flujo de exploración de recursos de la Rick and Morty API.

# Instalación y ejecución

Desde la terminal (Se empleó GitBash) ejecutar los siguiente comandos

1. Instalar dependencias: npm install
2. Compilar la librería: ng build ui-lib
3. Ejecutar la aplicación demo: ng serve demo-app

# API del componente (ui-button)

Tipo     |  Nombre  |        Tipo TS                |           Descripción
input()	 | label    | string (requerido)            | Texto visible del botón
input()	 | variant  | 'primary'-'secondary'-'danger'| Estilo visual del botón (por defecto 'primary')
input()	 | size     | 'sm'-'md'-'lg'                | Tamaño del botón (por defecto 'md')
input()	 | disabled | boolean                       | Bloquea la interacción (por defecto false)
input()	 | loading  | boolean                       | Muestra spinner y bloquea el click (default: false)
output() | clicked  | void                          | Emite solo si no está disabled ni loading

# Ejemplo de uso en HTML

<ui-button
  label="Explorar"
  variant="primary"
  size="md"
  [disabled]="false"
  [loading]="false"
  (clicked)="onAction()"
/>

# Decisiones de diseño iniciales

- Tailwind CSS v3 (3.4.17): se fijó la versión 3 para cumplir los requisitos del reto y mantener una paleta oscura con acentos verdes y cian acorde a la temática.

- API pública centralizada: se exportan los componentes desde (public-api.ts) para mantener el desacoplamiento entre (ui-lib) y (demo-app).

# Verificación en (demo-app)

La aplicación (demo-app) consume (<ui-button>) directamente desde (ui-lib) y expone una vista de prueba para validar:

- Variantes visuales (primary, secondary, danger).
- Tamaños (sm, md, lg).
- Bloqueo de interacción en estados (disabled) y (loading - con indicador de carga), frente a botones habilitados que emiten (clicked).

# Ejemplo de uso en HTML

<ui-button
    label="Primary" 
    variant="primary"
    (clicked)="onButtonClick('Primary')"
/>

<ui-button
    label="Pequeño (sm)"
    size="sm"
    (clicked)="onButtonClick('Pequeño sm')"
/>

<ui-button
    label="Cargando..."
    [loading]="true"
    (clicked)="onButtonClick('Tampoco debería salir')"
/>

<ui-button
    label="Activo"
    variant="primary"
    [disabled]="false"
    [loading]="false"
    (clicked)="onButtonClick('Activo (sí responde)')"
/>

# API del componente (ui-card)

    Tipo     |      Nombre       |          Tipo TS            |           Descripción
input()	     |   title           |	string                     | Titulo del header de la card
input()	     |   subtitle        |	string - null              | Subtitulo opcional debajo del titulo
input()	     |   elevation       |	'flat'-'raised'-'outlined' | Estilo visual del contenedor
output()	 |   headerclicked   |	void                       | Emite al hacer click en el header
ng-content	 |         -         |	             -             | Proyecta contenido arbitrario en el body


# Ejemplos de uso en HTML

<ui-card
    title="Rick Sanchez"
    subtitle="Human · Alive"
    elevation="raised"
    (headerClicked)="onButtonClick('Header: Rick Sanchez (raised)')"
>
    <p class="text-sm text-slate-300">
        Elevación <strong class="text-slate-100">raised</strong>. Clic aquí no debe disparar headerClicked.
    </p>
</ui-card>

# API del componente (ui-select)

    Tipo     |        Nombre       |          Tipo TS       |           Descripción
input()	     |   options           |	SelectOption[]      | Lista de opciones { label, value}
input()	     |   label             |	string              | Etiqueta visible sobre el select
input()	     |   placeholder       |	string              | Texto cuando no hay selección
input()	     |   loading           |	boolean             | Estado de carga (skeleton o spinner)
input()	     |   disable           |	boolean             | Bloquea la interacción
model()	     |   value             |	string - null       | Two-way binding del valor seleccionado
output()	 |   selectionChange   |	SelectOption        | Emite el objeto completo al cambiar

# Ejemplos de uso en HTML

<ui-select
  label="Recurso"
  placeholder="Elige un recurso"
  [options]="resourceOptions"
  [loading]="isLoading()"
  [disabled]="isDisabled()"
  [(value)]="selectedResource"
  (selectionChange)="onResourceChange($event)"
/>

# API del componente (ui-table)

    Tipo     |        Nombre       |          Tipo TS       |           Descripción
input()	     |   columns           |	TableColumn[]       | Definición de columnas { key, header}
input()	     |   rows              |	T[] (Genérico)      | Datos a renderizar
input()	     |   loading           |	boolean             | Muestra skeleton rows en lugar de datos
input()	     |   empetyMessage     |	string              | Mensaje cuando row está vacío
input()	     |   errorMessage      |	string - null       | Mensaje de error de red visible en la tabla
output()	 |   actionTriggered   |	TableAction         | Emite { action: 'view'-'delete', row: T }

<ui-table
  [columns]="tableColumns"
  [rows]="tableRows()"
  [loading]="isLoading()"
  [errorMessage]="errorMessage()"
  emptyMessage="No se encontraron resultados."
  (actionTriggered)="onTableAction($event)"
/>

# Integración del Explorer de Recursos y UX en (demo-app)

- Desacoplamiento entre librería UI y dominio de negocio: Los componentes de (ui-lib) se mantuvieron agnósticos de la API de Rick and Morty. Toda la lógica de consumo HTTP, transformación de columnas y estado de la aplicación vive en (demo-app) (RickAndMortyExplorerService).

- Gestión de estado reactiva con Angular Signals: En (RickAndMortyExplorerService) se centralizó el estado mediante ( signal() y computed() ) (selectedResource, selectedStatus, items, loading, errorMessage, selectedItem, pendingDeleteItem, activeColumns, isStatusFilterEnabled), junto con (ChangeDetectionStrategy.OnPush) en (App), evitando suscripciones manuales en la vista y manteniendo actualizaciones predecibles.

- Tipado estricto sin (any) (rick-and-morty.models.ts): Se modelaron interfaces genéricas (ApiPaginatedResponse<T>), uniones literales (ResourceType, CharacterStatus) y type guards (isCharacter, isEpisode, isLocation) para garantizar seguridad de tipos en tiempo de compilación al alternar entre personajes, episodios y ubicaciones.

- Filtro dependiente del contexto: El selector de estado (Alive, Dead, unknown) se habilita únicamente cuando el recurso activo es (Characters) y se reinicia automáticamente al cambiar de recurso, evitando peticiones inválidas en (Episodes) y (Locations).

- Proyección de contenido (ng-content) y confirmación destructiva: Se reutilizó (<ui-card>) tanto para el modal de detalle adaptativo por tipo de recurso como para un modal de confirmación previo a eliminar un registro (pendingDeleteItem), cumpliendo el flujo de feedback explícito al usuario mediante (<ui-button>).

- Atmósfera visual inspirada en Rick & Morty (Tailwind CSS v3): Se diseñó una paleta oscura espacial (#070b14 / #0b1322) con acentos verde portal (#97ce4c) y cian dimensional (cyan-400), tipografía monoespaciada para identificadores y códigos, y una bitácora en vivo de eventos emitidos por los componentes.

# Pruebas unitarias con Vitest

- Ejecución de suites (ui-lib) y (demo-app): El proyecto ejecuta pruebas unitarias con Vitest (ng test) y (TestBed) sobre (ui-lib) (UiButton, UiCard, UiSelect, UiTable) y (demo-app) (App), cubriendo renderizado, inputs/outputs, estados (disabled, loading, vacío, error), proyección de contenido con (ng-content) e integración inicial con (HttpClient) de prueba.

- Comandos útiles:
    ng test ui-lib --watch=false
    ng test demo-app --watch=false

# Despliegue en GitHub Pages

- Aplicación en vivo (demo-app): Disponible en [https://mecan30.github.io/instaleap-reto/]

- Automatización con GitHub Actions: Cada (push) a la rama (main) ejecuta el workflow en (.github/workflows/deploy.yml), compilando primero (ui-lib) (npx ng build ui-lib) y luego (demo-app) con (--base-href /instaleap-reto/) antes de publicar el artefacto resultante (dist/demo-app/browser) en GitHub Pages.

