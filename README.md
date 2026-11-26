
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

# API de componentes (avance actual)

Tipo     |   Nombre     |               Tipo TS           |           Descripción
input()	 |   label      |	string (requerido)            | Texto visible del botón
input()	 |   variant    |	'primary'-'secondary'-'danger'|	Estilo visual del botón (por defecto 'primary')
input()	 |   size       |	'sm' | 'md' | 'lg'            |	Tamaño del botón (por defecto 'md')
input()	 |   disabled   |	boolean                       |	Bloquea la interacción (por defecto false)
input()	 |   loading    |	boolean                       |	Muestra spinner y bloquea el clic (por defecto false)
output() |   clicked    |	void                          |	Emite solo si no está disabled ni loading

# Decisiones de diseño iniciales

- Tailwind CSS v3 (3.4.17): se fijó la versión 3 para cumplir los requisitos del reto y mantener una paleta oscura con acentos verdes y cian acorde a la temática.
- API pública centralizada: se exportan los componentes desde (public-api.ts) para mantener el desacoplamiento entre (ui-lib) y (demo-app).

