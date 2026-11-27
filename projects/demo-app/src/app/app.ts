
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  SelectOption,
  TableAction,
  UiButton,
  UiCard,
  UiSelect,
  UiTable,
} from 'ui-lib';
import { ExplorerItem, ResourceType } from './models/rick-and-morty.models';
import { RickAndMortyExplorerService } from './services/rick-and-morty-explorer.service';

/**
 * Componente raíz de la aplicación demo.
 * Conecta los componentes de `ui-lib` con el Explorer de Recursos de Rick and Morty API.
 */
@Component({
  selector: 'app-root',
  imports: [UiButton, UiCard, UiSelect, UiTable],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly explorer = inject(RickAndMortyExplorerService);

  protected readonly resourceOptions: SelectOption[] = [
    { label: 'Characters', value: 'characters' },
    { label: 'Episodes', value: 'episodes' },
    { label: 'Locations', value: 'locations' },
  ];

  protected readonly statusOptions: SelectOption[] = [
    { label: 'Alive', value: 'Alive' },
    { label: 'Dead', value: 'Dead' },
    { label: 'unknown', value: 'unknown' },
  ];

  protected readonly lastEventLog = signal<string>(
    'Portal listo - selecciona un recurso o acción en la tabla.'
  );

  /**
   * Maneja el cambio de recurso desde (<ui-select>) y actualiza la bitácora.
   * @param option Opción de recurso seleccionada.
   */
  protected onResourceChange(option: SelectOption): void {
    this.explorer.selectResource(option.value as ResourceType);
    this.lastEventLog.set(`Recurso cambiado a "${option.label}".`);
  }

  /**
   * Maneja el cambio de filtro de estado desde (<ui-select>) y registra el evento.
   * @param option Opción de estado seleccionada.
   */
  protected onStatusChange(option: SelectOption): void {
    this.explorer.selectStatus(option.value || null);
    this.lastEventLog.set(
      option.value ? `Filtro de estado aplicado: "${option.label}".` : 'Filtro de estado limpiado.'
    );
  }

  /**
   * Retrocede a la página anterior de registros y actualiza la bitácora.
   */
  protected onPrevPage(): void {
    const target = Math.max(1, this.explorer.currentPage() - 1);
    this.explorer.prevPage();
    this.lastEventLog.set(`Navegando a la página ${target}.`);
  }

  /**
   * Avanza a la página siguiente de registros y actualiza la bitácora.
   */
  protected onNextPage(): void {
    const target = this.explorer.currentPage() + 1;
    this.explorer.nextPage();
    this.lastEventLog.set(`Navegando a la página ${target}.`);
  }

  /**
   * Responde a las acciones emitidas por (<ui-table>) (view o delete).
   * @param event Acción y fila asociadas al evento de tabla.
   */
  protected onTableAction(event: TableAction<ExplorerItem>): void {
    if (event.action === 'view') {
      this.explorer.openDetail(event.row);
      this.lastEventLog.set(`Abriendo expediente de "${event.row.name}" (#${event.row.id}).`);
      return;
    }

    this.explorer.requestDelete(event.row);
    this.lastEventLog.set(
      `Confirmación pendiente para eliminar "${event.row.name}" (#${event.row.id}).`
    );
  }

  /**
   * Confirma la eliminación del registro pendiente y registra el resultado en la bitácora.
   */
  protected onConfirmDelete(): void {
    const deleted = this.explorer.confirmDelete();
    if (deleted) {
      this.lastEventLog.set(`Registro eliminado: "${deleted.name}" (#${deleted.id}).`);
    }
  }

  /**
   * Cancela la eliminación pendiente y actualiza la bitácora de eventos.
   */
  protected onCancelDelete(): void {
    const pending = this.explorer.pendingDeleteItem();
    this.explorer.cancelDelete();
    if (pending) {
      this.lastEventLog.set(`Eliminación cancelada para "${pending.name}".`);
    }
  }
}
