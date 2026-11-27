
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { TableColumn } from 'ui-lib';
import {
  ApiPaginatedResponse,
  Character,
  Episode,
  ExplorerItem,
  Location,
  ResourceType,
} from '../models/rick-and-morty.models';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

const ENDPOINT_BY_RESOURCE: Record<ResourceType, string> = {
  characters: 'character',
  episodes: 'episode',
  locations: 'location',
};

const COLUMNS_BY_RESOURCE: Record<ResourceType, TableColumn[]> = {
  characters: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'status', header: 'Estado' },
    { key: 'species', header: 'Especie' },
    { key: 'origin', header: 'Origen' },
  ],
  episodes: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'episode', header: 'Código' },
    { key: 'air_date', header: 'Emisión' },
  ],
  locations: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'type', header: 'Tipo' },
    { key: 'dimension', header: 'Dimensión' },
  ],
};

/**
 * Servicio central del Explorer de Recursos.
 * Gestiona estado reactivo con Signals y realiza las peticiones paginadas a Rick and Morty API.
 */
@Injectable({ providedIn: 'root' })
export class RickAndMortyExplorerService {
  private readonly http = inject(HttpClient);

  readonly selectedResource = signal<ResourceType>('characters');
  readonly selectedStatus = signal<string | null>(null);
  readonly items = signal<ExplorerItem[]>([]);
  readonly totalCount = signal<number>(0);
  readonly totalPages = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedItem = signal<ExplorerItem | null>(null);
  readonly pendingDeleteItem = signal<ExplorerItem | null>(null);

  private readonly nextPageUrl = signal<string | null>(null);
  private readonly prevPageUrl = signal<string | null>(null);

  readonly activeColumns = computed<TableColumn[]>(
    () => COLUMNS_BY_RESOURCE[this.selectedResource()]
  );

  readonly isStatusFilterEnabled = computed<boolean>(
    () => this.selectedResource() === 'characters'
  );

  readonly hasNextPage = computed<boolean>(() => this.nextPageUrl() !== null);

  readonly hasPrevPage = computed<boolean>(() => this.prevPageUrl() !== null);

  constructor() {
    this.fetchCurrentResource(1);
  }

  /**
   * Cambia el recurso dimensional activo, reinicia filtros, paginación y modales pendientes,
   * y solicita la página 1 correspondiente a la API.
   * @param resource Recurso a consultar (characters, episodes o locations).
   */
  selectResource(resource: ResourceType): void {
    this.selectedResource.set(resource);
    this.selectedStatus.set(null);
    this.selectedItem.set(null);
    this.pendingDeleteItem.set(null);
    this.currentPage.set(1);
    this.totalCount.set(0);
    this.totalPages.set(0);
    this.nextPageUrl.set(null);
    this.prevPageUrl.set(null);
    this.fetchCurrentResource(1);
  }

  /**
   * Aplica o limpia el filtro de estado (status) cuando el recurso activo es (characters)
   * y vuelve a la página 1.
   * @param status Estado seleccionado (Alive, Dead, unknown) o (null) para limpiar el filtro.
   */
  selectStatus(status: string | null): void {
    if (!this.isStatusFilterEnabled()) {
      return;
    }
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.totalCount.set(0);
    this.totalPages.set(0);
    this.nextPageUrl.set(null);
    this.prevPageUrl.set(null);
    this.fetchCurrentResource(1);
  }

  /**
   * Avanza a la página siguiente (siguiente bloque de hasta 20 registros).
   */
  nextPage(): void {
    const url = this.nextPageUrl();
    if (!url || this.loading()) {
      return;
    }

    const targetPage = this.extractPageFromUrl(url, this.currentPage() + 1);
    this.fetchFromUrl(url, undefined, targetPage);
  }

  /**
   * Retrocede a la página anterior (bloque anterior de hasta 20 registros).
   */
  prevPage(): void {
    const url = this.prevPageUrl();
    if (!url || this.loading()) {
      return;
    }

    const targetPage = this.extractPageFromUrl(url, Math.max(1, this.currentPage() - 1));
    this.fetchFromUrl(url, undefined, targetPage);
  }

  /**
   * Abre el modal de detalle seleccionando el registro indicado.
   * @param item Elemento seleccionado de la tabla.
   */
  openDetail(item: ExplorerItem): void {
    this.selectedItem.set(item);
  }

  /**
   * Cierra el modal de detalle limpiando el registro seleccionado.
   */
  closeDetail(): void {
    this.selectedItem.set(null);
  }

  /**
   * Marca un registro como pendiente de eliminación para abrir el modal de confirmación.
   * @param item Registro que el usuario solicitó eliminar.
   */
  requestDelete(item: ExplorerItem): void {
    this.pendingDeleteItem.set(item);
  }

  /**
   * Cancela la eliminación pendiente y cierra el modal de confirmación.
   */
  cancelDelete(): void {
    this.pendingDeleteItem.set(null);
  }

  /**
   * Confirma y ejecuta la eliminación local del registro pendiente.
   * @returns El elemento eliminado si había uno pendiente, o (null) en caso contrario.
   */
  confirmDelete(): ExplorerItem | null {
    const target = this.pendingDeleteItem();
    if (!target) {
      return null;
    }

    this.items.update((current) => current.filter((entry) => entry.id !== target.id));

    if (this.selectedItem()?.id === target.id) {
      this.selectedItem.set(null);
    }

    this.pendingDeleteItem.set(null);
    return target;
  }

  /**
   * Verifica si el elemento actual corresponde a un personaje (Character).
   * @param item Registro a evaluar.
   * @returns (true) si el recurso activo es (characters) y el objeto tiene (species).
   */
  isCharacter(item: ExplorerItem): item is Character {
    return this.selectedResource() === 'characters' && 'species' in item;
  }

  /**
   * Verifica si el elemento actual corresponde a un episodio (Episode).
   * @param item Registro a evaluar.
   * @returns (true) si el recurso activo es (episodes) y el objeto tiene (air_date).
   */
  isEpisode(item: ExplorerItem): item is Episode {
    return this.selectedResource() === 'episodes' && 'air_date' in item;
  }

  /**
   * Verifica si el elemento actual corresponde a una ubicación (Location).
   * @param item Registro a evaluar.
   * @returns (true) si el recurso activo es (locations) y el objeto tiene dimension.
   */
  isLocation(item: ExplorerItem): item is Location {
    return this.selectedResource() === 'locations' && 'dimension' in item;
  }

  private extractPageFromUrl(url: string, fallback: number): number {
    try {
      const parsed = new URL(url);
      const pageParam = Number(parsed.searchParams.get('page'));
      return Number.isInteger(pageParam) && pageParam > 0 ? pageParam : fallback;
    } catch {
      return fallback;
    }
  }

  private fetchCurrentResource(page: number): void {
    const resource = this.selectedResource();
    const endpoint = ENDPOINT_BY_RESOURCE[resource];
    const url = `${API_BASE_URL}/${endpoint}`;

    let params = new HttpParams().set('page', String(page));
    const status = this.selectedStatus();
    if (resource === 'characters' && status) {
      params = params.set('status', status);
    }

    this.fetchFromUrl(url, params, page);
  }

  private fetchFromUrl(url: string, params: HttpParams | undefined, targetPage: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.http
      .get<ApiPaginatedResponse<ExplorerItem>>(url, params ? { params } : {})
      .pipe(
        catchError((err: unknown) => {
          const statusCode =
            typeof err === 'object' && err !== null && 'status' in err
              ? Number((err as { status?: unknown }).status)
              : 0;

          this.items.set([]);
          this.totalCount.set(0);
          this.totalPages.set(0);
          this.nextPageUrl.set(null);
          this.prevPageUrl.set(null);

          if (statusCode === 404) {
            this.errorMessage.set(null);
          } else {
            this.errorMessage.set(
              'No fue posible obtener los datos desde Rick and Morty API. Verifica tu conexión e inténtalo de nuevo.'
            );
          }

          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.currentPage.set(targetPage);
          this.totalCount.set(response.info.count);
          this.totalPages.set(response.info.pages);
          this.nextPageUrl.set(response.info.next);
          this.prevPageUrl.set(response.info.prev);
          this.items.set(response.results);
        }
      });
  }
}
