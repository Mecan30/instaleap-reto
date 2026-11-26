
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';

/**
 * Representa una posible opción dentro de (<ui-select>).
 */
export interface SelectOption {
  /**
   * Texto visible para el usuario.
   */ 
  label: string;
  /**
   * Valor interno asociado a la opción.
   */
  value: string;
}

let nextSelectId = 0;

/**
 * Componente selector reutilizable con soporte para estados de carga y deshabilitado.
 */
@Component({
  selector: 'ui-select',
  templateUrl: './ui-select.html',
  styleUrl: './ui-select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelect {
  private readonly controlId = `ui-select-${++nextSelectId}`;

  /**
   * Lista de opciones disponibles { label, value }.
   */
  readonly options = input<SelectOption[]>([]);

  /**
   * Etiqueta visible asociada al selector.
   */
  readonly label = input<string>('');

  /**
   * Texto mostrado cuando no hay ninguna opción seleccionada.
   */
  readonly placeholder = input<string>('Seleccionar una opción');

  /**
   * Indica si el selector se encuentra en estado de carga.
   */
  readonly loading = input<boolean>(false);

  /**
   * Bloquea la interacción del usuario sobre el selector.
   */
  readonly disabled = input<boolean>(false);

  /**
   * Valor seleccionado con soporte de enlace bidireccional.
   */
  readonly value = model<string | null>(null);

  /**
   * Emite el objeto (SelectOption) completo cuando cambia la selección.
   */
  readonly selectionChange = output<SelectOption>();

  /**
   * Identificador único para asociar (<label>) y (<select>).
   */
  protected readonly selectElementId = this.controlId;

  /**
   * Indica si el control está inhabilitado por disabled() o loading().
   */
  protected readonly isInteractionBlocked = computed<boolean>(
    () => this.disabled() || this.loading()
  );

  /**
   * Maneja el cambio de opción en el elemento nativo (<select>),
   * actualiza el modelo (value) y emite el objeto (SelectOption) correspondiente.
   */
  onSelectionChange(event: Event): void {
    if (this.isInteractionBlocked()) {
      return;
    }

    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (!selectedValue) {
      this.value.set(null);
      return;
    }

    const matchedOption = this.options().find((opt) => opt.value === selectedValue);
    this.value.set(selectedValue);

    if (matchedOption) {
      this.selectionChange.emit(matchedOption);
    }
  }
}