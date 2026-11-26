
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

/**
 * Variantes visuales disponibles para el botón.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * Tamaños disponibles para el botón.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Componente del botón reutilizable.
 */
@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButton {
  /**
   * Texto que se mostrará en el botón.
   */
  readonly label = input.required<string>();

  /**
   * Estilo visual que mostrará el botón.
   * @default 'primary'
   */
  readonly variant = input<ButtonVariant>('primary');

  /**
   * Tamaño que mostrará el botón.
   * @default 'md'
   */
  readonly size = input<ButtonSize>('md');

  /**
   * Indica si el botón esta deshabilitado.
   * @default false
   */
  readonly disabled = input(false);

  /**
   * Indica si el botón está procesando una acción.
   * @default false
   */
  readonly loading = input(false);

  /**
   * Evento que se emite cuando el botón se activa.
   */
  readonly clicked = output<void>();

  /**
   * El evento de click se emitirá solamente
   * si el botón esta habilitado
   * y no se encuentra procesando una acción
   */
  handleClick(): void {
    if (this.disabled() || this.loading()) {
      return;
    }
    this.clicked.emit();
  }
}
