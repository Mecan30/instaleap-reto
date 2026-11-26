
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SelectOption } from 'ui-lib'; 
import { UiSelect } from './ui-select';

describe('UiSelect', () => {
  let component: UiSelect;
  let fixture: ComponentFixture<UiSelect>;

  const sampleOptions: SelectOption[] = [
    { label: 'Characters', value: 'characters' },
    { label: 'Episodes', value: 'episodes' },
    { label: 'Locations', value: 'locations' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', sampleOptions);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the provided label and options', () => {
    fixture.componentRef.setInput('label', 'Recurso dimensional');
    fixture.detectChanges();

    const hostText: string = fixture.nativeElement.textContent ?? '';
    expect(hostText).toContain('Recurso dimensional');
    expect(hostText).toContain('Characters');
    expect(hostText).toContain('Episodes');
    expect(hostText).toContain('Locations');
  });

  it('should disable the select element when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const selectEl = fixture.nativeElement.querySelector('select') as HTMLSelectElement | null;
    expect(selectEl).not.toBeNull();
    expect(selectEl?.disabled).toBe(true);
  });

  it('should emit selectionChange when an option is selected', () => {
    const emitSpy = vi.spyOn(component.selectionChange, 'emit');
    const selectEl = fixture.nativeElement.querySelector('select') as HTMLSelectElement | null;

    expect(selectEl).not.toBeNull();
    if (selectEl) {
      selectEl.value = 'episodes';
      selectEl.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    }

    expect(emitSpy).toHaveBeenCalledWith({ label: 'Episodes', value: 'episodes' });
  });
});
