
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

Tipo     |   Nombre     |               Tipo TS           |           Descripción
input()	 |   label      |	string (requerido)            | Texto visible del botón
input()	 |   variant    |	'primary'-'secondary'-'danger'|	Estilo visual del botón (por defecto 'primary')
input()	 |   size       |	'sm'-'md'-'lg'                |	Tamaño del botón (por defecto 'md')
input()	 |   disabled   |	boolean                       |	Bloquea la interacción (por defecto false)
input()	 |   loading    |	boolean                       |	Muestra spinner y bloquea el clic (por defecto false)
output() |   clicked    |	void                          |	Emite solo si no está disabled ni loading

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

La aplicación (demo-app) consume `<ui-button>` directamente desde (ui-lib) y expone una vista de prueba para validar:
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

# API del componente actual (ui-card)

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

