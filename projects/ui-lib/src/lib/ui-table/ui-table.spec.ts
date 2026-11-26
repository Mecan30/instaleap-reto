
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TableColumn } from 'ui-lib'; 
import { UiTable } from './ui-table';

interface MockRow {
  id: number;
  name: string;
  status: string;
}

describe('UiTable', () => {
  let component: UiTable<MockRow>;
  let fixture: ComponentFixture<UiTable<MockRow>>;

  const columns: TableColumn[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'status', header: 'Estado' },
  ];

  const rows: MockRow[] = [
    { id: 1, name: 'Rick Sanchez', status: 'Alive' },
    { id: 2, name: 'Morty Smith', status: 'Alive' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTable],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTable<MockRow>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render column headers and row values', () => {
    const text: string = fixture.nativeElement.textContent ?? '';
    expect(text).toContain('ID');
    expect(text).toContain('Nombre');
    expect(text).toContain('Estado');
    expect(text).toContain('Rick Sanchez');
    expect(text).toContain('Morty Smith');
  });

  it('should display emptyMessage when rows array is empty and not loading', () => {
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('emptyMessage', 'Sin resultados disponibles.');
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent ?? '';
    expect(text).toContain('Sin resultados disponibles.');
  });

  it('should display errorMessage when an error occurs', () => {
    fixture.componentRef.setInput('errorMessage', 'Error al cargar los datos.');
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent ?? '';
    expect(text).toContain('Error al cargar los datos.');
  });

  it('should emit actionTriggered when an action button is clicked', () => {
    const emitSpy = vi.spyOn(component.actionTriggered, 'emit');
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
    );

    expect(buttons.length).toBeGreaterThan(0);
    buttons[0].click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        row: rows[0],
      })
    );
  });
});
