
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

# 9. Componente (<ui-table>)

# Uso de IA

- El prompt utilizado: Solicitud para implementar el cuarto componente (<ui-table>) de forma genérica (<T>), aplicando estilos con (@apply) de Tailwind CSS v3, exportando sus tipos públicos e integrando una prueba visual interactiva en (demo-app).

- Qué se aceptó y por qué: Manejo exclusivo de tres estados visuales mutuamente excluyentes mediante signals computados (loading con skeleton rows, hasError y isEmpty) y delegación total de las acciones (view) y (delete) mediante (actionTriggered). Método tipado ( getCellValue(row: T, key: string) ) capaz de resolver valores primitivos, nulos y objetos anidados con propiedad (name) sin romper el tipado estricto.

- Qué se rechazó o modificó: Se aclaró que la interfaz (DemoRow) pertenece únicamente al laboratorio temporal en (demo-app/src/app/app.ts) y no debe exportarse desde (public-api.ts) de (ui-lib), evitando acoplar la librería a modelos de prueba.

# Retos y Soluciones

- Orden entre compilación de librería y consumo en (demo-app): Al agregar el apartado de (<ui-table>) en (app.html) y (app.ts), se verificó la necesidad de ejecutar (ng build ui-lib) antes de compilar (demo-app) para actualizar los tipos y artefactos en (dist/ui-lib).

- Ubicación del tipado de filas de prueba (DemoRow): Se definió (interface DemoRow) dentro de (projects/demo-app/src/app/app.ts) justo antes del decorador (@Component), manteniendo limpia la frontera entre la librería genérica y la aplicación consumidora.

# 10. Explorer de Recursos en (demo-app) e Integración con (ui-lib)

# Decisiones tomadas

- Desacoplamiento entre (ui-lib) y (demo-app): Se mantuvieron los cuatro componentes de (ui-lib) agnósticos del dominio y de peticiones HTTP; el consumo de Rick and Morty API, columnas por recurso y estado del explorador se centralizaron en (RickAndMortyExplorerService) dentro de (demo-app).

- Estado reactivo con Angular Signals y (OnPush): Se usaron (signal() y computed()) en el servicio junto con (ChangeDetectionStrategy.OnPush) en (App) para gestionar recurso activo, filtro de (status) solo habilitado en (characters) y reiniciado al cambiar de recurso, carga, error, detalle y confirmación de borrado.

- Confirmación previa al eliminar y temática Rick & Morty: Se incorporó un modal de confirmación con (<ui-card>) y (<ui-button>) antes de eliminar un elemento de la lista visible, y se aplicó una estética oscura con acentos verde portal (#97ce4c) y cian en Tailwind CSS v3, junto con JSDoc en los métodos públicos del servicio y handlers del componente.

# Uso de IA

# Integración del Explorer de Recursos
# RickAndMortyExplorerService, rick-and-morty.models.ts, app.ts y app.html

- El prompt utilizado: Solicitud para crear los modelos tipados de Rick and Morty API, configurar       ( HttpClient() ) y conectar lo componentes de (ui-lib) en la aplicación demo.

- Qué se aceptó y por qué: Se aceptó la separación en modelos estrictos, servicio con Signals y proyección de contenido con (ng-content) en (<ui-card>), porque mantiene tipado fuerte sin (any), evita lógica de red dentro de la vista y reutiliza la librería tal como fue diseñada.

- Qué se rechazó o modificó: Se modificó la versión inicial del botón de cerrar del modal porque proyectaba texto interno sin pasar el (input) requerido (label="Cerrar"), y se ajustó el manejo de la acción (delete) para exigir confirmación previa del usuario en vez de limitarse a registrar texto en la bitácora.

# Ajustes visuales, confirmación de borrado y auditoría de JSDoc

- El prompt utilizado: Consultas sobre la ausencia de imágenes en episodios/ubicaciones, el comportamiento rápido del skeleton loading, la estética inspirada en Rick & Morty, el flujo de confirmación al eliminar y la revisión de JSDoc en métodos públicos.

- Qué se aceptó y por qué: Se incorporó la paleta y atmósfera de Rick & Morty en Tailwind CSS v3, el flujo de confirmación (pendingDeleteItem, requestDelete, confirmDelete, cancelDelete) y los bloques JSDoc en (RickAndMortyExplorerService) y (App), ya que mejoran la UX, cumplen los criterios de feedback y documentan la API pública.

- Qué se rechazó o modificó: No se añadió retardo artificial a las peticiones HTTP para forzar el skeleton loading.

# Retos y Soluciones

- Aviso del Language Server sobre (TableColumn) (ngtypecheck): El editor mostraba marcas de error sobre propiedades de (TableColumn) en (ui-table.html) pese a que (ng build ui-lib) y (ng build demo-app) compilaban sin fallos. Se identificó como caché del servidor de lenguaje y se superó reiniciando el Angular Language Service / TS Server y verificando la compilación real.

- Confusión inicial sobre imágenes en (Episodes - Locations) y rapidez del skeleton: Se aclaró que la API de Rick and Morty solo provee (image) en personajes y que el skeleton pasa rápido por la baja latencia de respuesta; se mantuvieron las fichas adaptativas por tipo de recurso y se validó el estado de carga en el flujo reactivo.

# 11. Pruebas Unitarias con Vitest (ui-lib) y (demo-app)

# Decisiones tomadas

- Cobertura funcional de los componentes de (ui-lib) y (App): Se mantuvieron y verificaron las pruebas de (UiButton) (variantes, tamaños, disabled, loading, spinner y emisión de clicked) y se ampliaron las pruebas de (UiCard) (título, subtítulo y proyección vía ng-content), (UiSelect) (etiqueta, opciones, disabled y selectionChange), (UiTable) (columnas, filas, estados vacío/error y actionTriggered) junto con la prueba del encabezado actual en (App).

- Aislamiento de red en pruebas de (App): Se registraron (provideHttpClient()) y (provideHttpClientTesting()) en el (TestBed) de (App) para probar el componente sin depender de llamadas reales a la API externa durante la ejecución de tests.

# Uso de IA

# Ampliación de specs con Vitest y (TestBed) (UiCard, UiSelect, UiTable y App)
   
- El prompt utilizado: Solicitud para adaptar y ampliar las pruebas unitarias de los componentes de la librería y de la aplicación demo usando Vitest.

- Qué se aceptó y por qué: Se aceptó el enfoque de (TestBed) con (vi.spyOn) y la verificación de estados visibles/eventos emitidos, porque valida el comportamiento real de los componentes y pasa en verde en (ui-lib) y (demo-app).

- Qué se rechazó o modificó: Se descartó dejar (UiCard) únicamente con la prueba inicial de creación y se ajustó la aserción antigua de (App) (que buscaba 'Hello, demo-app') para alinearla con el título real del (Resource Explorer).

# Retos y Soluciones

- Pruebas incompletas en componentes y aserción desactualizada en (App): (UiCard), (UiSelect) y (UiTable) contaban solo con la prueba base de creación, y (App) conservaba un texto inicial distinto al actual. Se completaron las specs por componente y se actualizó (app.spec.ts) con proveedores HTTP de prueba, logrando 24 pruebas en verde en (ui-lib) y 2 en (demo-app).

- Limpieza de caracteres de copia/lectura en specs: Al revisar los archivos de prueba se cuidó que las aserciones y spies (`vi.spyOn`) quedaran sin errores tipográficos para ejecutar (ng test --watch=false) sin fallos.

# 12. Despliegue Automatizado de (demo-app) en GitHub Pages

# Decisiones tomadas

- Publicación vía GitHub Actions en GitHub Pages: Se cambió la visibilidad del repositorio a público y se configuró (Settings -> Pages) con origen (GitHub Actions) para automatizar la compilación y publicación en cada (push) a (main) sin depender de plataformas externas.

- Compilación secuencial de librería y aplicación con (--base-href): El workflow compila primero (ui-lib) para generar su salida actualizada y luego construye (demo-app) pasando (--base-href /instaleap-reto/) para que las rutas y recursos estáticos resuelvan correctamente bajo la subruta del repositorio en GitHub Pages.

# Uso de IA

# Configuración del workflow de GitHub Actions (.github/workflows/deploy.yml)
   
- El prompt utilizado: Solicitud para configurar el despliegue de (demo-app) en GitHub Pages usando GitHub Actions.

- Qué se aceptó y por qué: Se adoptó la estructura con (actions/checkout), (actions/setup-node), compilación previa de (ui-lib), build de (demo-app) con (--base-href /instaleap-reto/) y subida del artefacto (dist/demo-app/browser) mediante (actions/upload-pages-artifact) y (actions/deploy-pages), ya que se adapta a la arquitectura multi-proyecto del workspace de Angular.

- Qué se rechazó o modificó: Se descartó usar los workflows sugeridos por defecto en la interfaz de GitHub Pages (Jekyll o Static HTML), dado que el workspace requiere compilación de Angular y la librería interna antes del despliegue.

# Retos y Soluciones

- Ubicación inicial del archivo de workflow: Al crear (deploy.yml) inicialmente quedó en (.github/deploy.yml) en lugar de dentro de (.github/workflows/), lo que impidió referenciar (.github/workflows/deploy.yml) al preparar el commit. Mover el archivo a (.github/workflows/deploy.yml) permitió registrarlo, hacer el commit y ejecutar el workflow en verde en GitHub Actions.

# 13. Paginación por Páginas (Anterior / Siguiente) Preservando el Contador General

# Decisiones tomadas

- Paginación por página en lugar de carga acumulativa: Se reemplazó la acumulación progresiva de filas por una navegación paginada con botones Anterior y Siguiente respaldada por (info.count), (info.pages), (info.next) y (info.prev) de la API, manteniendo como máximo 20 registros visibles por página en la tabla.

- Preservación del contador general y reinicio al filtrar: (totalCount) conserva el total real de registros reportado por la API para la consulta activa mostrándose en el encabezado junto con (currentPage) y (totalPages), mientras que cambiar de recurso (selectResource) o de filtro de estado (`selectStatus`) restablece la paginación a la página 1.

# Uso de IA

# Ajuste de paginación en servicio, componente y plantilla (rick-and-morty-explorer.service.ts, app.ts, app.html)

- El prompt utilizado: Solicitud para cambiar la carga acumulativa de elementos por una paginación donde se muestren hasta 20 elementos por página, con navegación hacia adelante y hacia atrás y manteniendo el contador general.

- Qué se aceptó y por qué: Se adoptó el manejo de (currentPage, totalPages, totalCount, hasPrevPage y hasNextPage) mediante Signals/computed en (RickAndMortyExplorerService), junto con (<ui-button>) para Anterior y Siguiente en (app.html) y manejadores en (App), aprovechando la paginación nativa de la API y los componentes ya existentes de (ui-lib).

- Qué se rechazó o modificó: Se descartó mantener la acumulación continua de registros en (items) al avanzar de página, priorizando una vista acotada por página de hasta 20 filas con retroceso y avance explícitos.

# Retos y Soluciones

- Sincronización del número de página al usar URLs (next/prev): Como la API entrega las URLs completas de la página siguiente y anterior en (info.next) e (info.prev), se añadió una extracción segura del parámetro (page) desde la URL (con respaldo calculado a partir de (currentPage)) para mantener (currentPage()) alineado con lo que muestra la tabla.

