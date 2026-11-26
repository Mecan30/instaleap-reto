
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

/**
 * Estilo visual de elevación o borde del contenedor de la tarjeta.
 */ 
export type CardElevation = 'flat' | 'raised' | 'outlined';

/**
 * Componente de tarjeta reutilizable.
 */
@Component({
  selector: 'ui-card',
  imports: [],
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCard {
  /**
   * Título principal mostrado en el header de la tarjeta.
   */
  readonly title = input<string>('');

  /**
   * Subtítulo opcional mostrado debajo del título en el header.
   */
  readonly subtitle = input<string | null>(null);

  /** 
   * Estilo visual del contenedor (flat, raised o outlined).
   */
  readonly elevation = input<CardElevation>('outlined');

  /**
   * Se emite únicamente cuando el usuario hace clic en el header de la tarjeta.
   */
  readonly headerClicked = output<void>();
  
  /**
   * Maneja el clic sobre el encabezado de la tarjeta y emite (headerClicked).
   */
  protected onHeaderClick(): void {
    this.headerClicked.emit();
  }
}
