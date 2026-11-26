
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * Componente raíz de la aplicación demo.
 */
@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  /**
   * Título base de la aplicación de demostración.
   */
  protected readonly title = signal('Rick & Morty Explorer');
}
