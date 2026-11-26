
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * Define una columna visible dentro de `<ui-table>`.
 */
export interface TableColumn {
  /**
   * Propiedad del registro a renderizar en la celda.
   */
  key: string;
  /**
   * Encabezado visible en la cabecera de la tabla.
   */
  header: string;
}

/**
 * Tipos de acción soportados por fila en `<ui-table>`.
 */
export type TableActionType = 'view' | 'delete';

/**
 * Payload emitido por `actionTriggered` cuando el usuario interactúa con una fila.
 */
export interface TableAction<T> {
  /**
   * Acción solicitada sobre el registro.
   */
  action: TableActionType;
  /**
   * Registro completo asociado a la fila.
   */
  row: T;
}

/**
 * Tabla genérica reutilizable con soporte para skeleton loading,
 * estado vacío, mensaje de error y emisión de acciones por fila.
 */
@Component({
  selector: 'ui-table',
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTable<T extends object = Record<string, unknown>> {
  /**
   * Definición de columnas `{ key, header }` a mostrar.
   */
  readonly columns = input<TableColumn[]>([]);

  /**
   * Colección genérica de registros a renderizar.
   */
  readonly rows = input<T[]>([]);

  /**
   * Indica si la tabla debe mostrar filas esqueleto de carga.
   */
  readonly loading = input<boolean>(false);

  /**
   * Mensaje mostrado cuando `rows` está vacío y no hay error ni carga activa.
   */
  readonly emptyMessage = input<string>('No hay registros para mostrar.');

  /**
   * Mensaje de error visible cuando ocurre un fallo de red o carga.
   */
  readonly errorMessage = input<string | null>(null);

  /**
   * Emite `{ action: 'view' | 'delete', row }` al pulsar una acción en una fila.
   */
  readonly actionTriggered = output<TableAction<T>>();

  /**
   * Filas simuladas para el estado de carga esqueleto.
   */
  protected readonly skeletonRows = [1, 2, 3, 4, 5];

  /**
   * Indica si se debe mostrar el estado de error.
   */
  protected readonly hasError = computed<boolean>(() => Boolean(this.errorMessage()));

  /**
   * Indica si se debe mostrar el estado vacío.
   */
  protected readonly isEmpty = computed<boolean>(
    () => !this.loading() && !this.hasError() && this.rows().length === 0
  );

  /**
   * Obtiene de forma tipada y segura el valor de una clave sobre un registro `T`.
   */
  protected getCellValue(row: T, key: string): string {
    const record = row as Record<string, unknown>;
    const rawValue = record[key];

    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return '—';
    }

    if (typeof rawValue === 'object') {
      if ('name' in rawValue && typeof rawValue.name === 'string') {
        return rawValue.name;
      }
      return JSON.stringify(rawValue);
    }

    return String(rawValue);
  }

  /**
   * Emite la acción de ver detalle para la fila indicada.
   */
  protected onView(row: T): void {
    this.actionTriggered.emit({ action: 'view', row });
  }

  /**
   * Emite la acción de eliminar para la fila indicada.
   */
  protected onDelete(row: T): void {
    this.actionTriggered.emit({ action: 'delete', row });
  }
}