
# Registro de desarrollo - Instaleap UI Components

Este documento registra las decisiones técnicas, dificultades, soluciones, validaciones y utilización de herramientas de inteligencia artificial durante el desarrollo de la prueba técnica.

# 1. Configuración inicial del workspace

# Creación del workspace

Se creó un workspace de Angular cumpliendo el propósito de organizar por separado la biblioteca de componentes y la aplicación de demostración.

# Configuración de TypeScript estricto

Durante la revisión de la configuración se identificó que el modo estricto de TypeScript no estaba activado explícitamente.

Solución: se agregó ("strict": true) en el archivo raíz (tsconfig.json), para aplicar las comprobaciones estrictas de TypeScript a los proyectos que heredan esta configuración.

# Uso de IA

- Solicitud: ayuda para revisar la configuración de TypeScript y comprobar si cumplía el requisito de modo estricto.

- Aporte recibido: explicación de cómo inspeccionar la configuración efectiva mediante (npx tsc --showConfig) y recomendación de activar (strict).

- Decisión: se aceptó la recomendación y se verificó la configuración resultante.

# Configuración de pruebas

Al ejecutar las pruebas se presentó un error relacionado con la definición de (rootDir) en (projects/ui-lib/tsconfig.spec.json).

Solución: se agregó la propiedad ("rootDir": "./src/lib") a la configuración de pruebas, siguiendo la indicación del error de TypeScript.

Posteriormente, las pruebas se ejecutaron correctamente.

# Uso de IA:

- Solicitud: ayuda para interpretar el error de TypeScript y comprender cómo corregir la configuración.

- Aporte recibido: explicación del propósito de (rootDir) y orientación para aplicar el ajuste.

- Decisión: se adoptó el ajuste y se verificó mediante la ejecución de las pruebas.

# 2. Creación de la biblioteca ui-lib

Haciendo uso de Git bash se ejecutó el comando (ng generate library ui-lib --prefix=ui) para la creación de la biblioteca mediante Angular CLI.

# Convención de selectores

Durante la generación del primer componente se identificó que utilizar simultáneamente el nombre (ui-button) y el prefijo (ui) producía el selector (ui-ui-button).

Solución: se corrigió el selector a (ui-button) y se estableció como convención generar los siguientes componentes utilizando nombres sin el prefijo, conservando (ui) como prefijo del proyecto.

# 3. Implementación del componente ui-button

# Dificultades y soluciones

- Dificultad: definir cómo evitar que el evento de clic se emita cuando el botón está deshabilitado o cargando.
  Solución: se implementó una condición de protección en el método ( handleClick() ) y se vinculó el atributo (disabled) del elemento HTML a ambos estados.

- Dificultad: representar las variantes y tamaños sin duplicar componentes.
  Solución: se utilizaron clases CSS dinámicas según los valores de los inputs.

# Uso de IA

Solicitudes realizadas:

- Orientación para definir la API del componente.
- Explicación e implementación de Signals y tipos unión.
- Ayuda para construir la estructura HTML y los estilos CSS.
- Orientación para diseñar pruebas unitarias de los diferentes estados y eventos.
- Explicación de los comandos y de los resultados de las validaciones.

Aportes aceptados: propuestas de implementación, organización del código, documentación JSDoc y pruebas unitarias.

Criterios aplicados: se revisaron las propuestas y se realizaron los cambios en el proyecto con acompañamiento y explicación. Se buscó comprender la responsabilidad de cada propiedad, método y prueba antes de continuar.

# 4. Configuración de Tailwind CSS v3

Se instaló (tailwindcss@3.4.179) para cumplir con la restricción de usar Tailwind CSS v3 y no v4.

# Uso de IA

- Solicitud: verificar la instalación de Tailwind CSS v3 y configurar el escaneo de plantillas en el workspace.

- Qué se aceptó y por qué: la instalación explícita de (tailwindcss@3) y la configuración de (content) hacia  ( ./projects/**/*.{html,ts} ) para cubrir tanto (ui-lib) como (demo-app).

- Qué se modificó o rechazó: se ajustaron rutas y nombres de estilos cuando hubo desalineaciones entre archivos (como la ruta de estilos del componente y el nombre de la clase del spinner) y se limpió código de prueba innecesario.

# 5. Creación y base limpia de demo-app

Se generó la aplicación (demo-app) dentro de (projects/demo-app) con prefijo (app) para consumir (ui-lib) 

# Uso de IA

- Solicitud: limpiar el código de prueba de (demo-app) y dejar una base ordenada con temática de Rick & Morty.

- Qué se aceptó y por qué: la estructura base limpia en (app.ts) y (app.html) con (OnPush) y signals, manteniendo el enfoque modular y sin lógica de prueba residual.

- Qué se modificó o rechazó: se retiró el bloque de prueba de interacción para no mezclar demostraciones temporales con el flujo principal del reto.

# 6. Verificación visual de (<ui-button>) en (demo-app)

Se importó (UiButton) en (demo-app) desde el paquete público (ui-lib) y se montó una pantalla de prueba visual para inspeccionar variantes, tamaños, estados y la emisión del evento (clicked) mediante una señal de prueba (lastAction).

# Uso de IA

- Solicitud: orientación para conectar (UiButton) en (demo-app) y agregar casos de prueba visuales incluyendo un botón activo que respondiera al click.

- Qué se aceptó y por qué: importar el componente desde (ui-lib), usar una señal local para verificar en pantalla cuándo se dispara (clicked) y contrastar botones bloqueados (disabled - loading) frente a uno habilitado.

- Qué se modificó o rechazó: se mantuvo la prueba acotada a la verificación visual de (<ui-button>) sin adelantar todavía la integración de la API de Rick & Morty ni volver atrás a la base vacía antes de terminar de comprobar los estados.

# 7. Componente (<ui-card>)

# Uso de IA

- El prompt utilizado: solicitudd para definir y estructurar (ui-card.html) y (ui-card.css) con Tailwind CSS (@apply)

- Qué se aceptó y por qué: Usar (elevation) con valor por defecto (outlined) y variantes (flat, raised, outlined) para dar consistencia visual reutilizable.

- Qué se rechazó o modificó: Se eliminó el computed (elevationClasses) en (ui-card.ts) tras verificar que el control de variantes ya se resolvía mediante clases en (ui-card.html) y (@apply) en (ui-card.css), evitando duplicar lógica entre TypeScript y la plantilla/estilos.

# Retos y Soluciones

- Advertencia de lint por (UiCard) no usada en (App): Al importar (UiCard) en (demo-app) antes de renderizar (<ui-card>) en (app.html) y luego por caché del language server, apareció una advertencia. Se resolvió añadiendo (<ui-card>) en (app.html) y reiniciando los servicios de Angular/TypeScript en VS Code.

- Aviso de (Unknown at rule @apply): Se verificó que (ng build ui-lib) compilaba sin errores y que el aviso correspondía al análisis estático de CSS/editor frente a directivas de Tailwind CSS.

# 8. Componente (<ui-select>)

# Uso de IA

- El prompt utilizado: Solicitud para revisar los requisitos de (<ui-select>) en la prueba técnica e implementar (ui-select.ts), (ui-select.html) y (ui-select.css) aplicando (@apply) de Tailwind CSS v3, junto con una prueba interactiva en (demo-app).

- Qué se aceptó y por qué: Definición y exportación de la interfaz (SelectOption) { label: string; value: string } desde (public-api.ts) para tipar estrictamente tanto (options) como el payload de (selectionChange) y el bloqueo unificado de interacción ( isInteractionBlocked = computed(() => this.disabled() || this.loading()) ) e identificador incremental (selectElementId) para vincular accesibilidad entre (<label>) y (<select>).

- Qué se rechazó o modificó: Se descartó mantener botones manuales de alternancia de (loading) y (disabled) como parte definitiva de la interfaz, ya que esos estados serán controlados reactivamente por el servicio con signals.

# Retos y Soluciones

- Errores de compilación en plantilla (statusOptions, selectedStatus, onStatusChange): Al incorporar los dos selectores de prueba (recurso y filtro de estado) en (app.html) antes de declarar sus señales y manejadores en (app.ts), Angular reportó propiedades inexistentes en (App). Se resolvió definiendo (statusOptions), (selectedStatus) y (onStatusChange) en (app.ts).

