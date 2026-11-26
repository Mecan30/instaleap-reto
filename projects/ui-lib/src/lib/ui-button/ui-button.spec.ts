
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButton } from './ui-button';

describe('UiButton', () => {
  let component: UiButton;
  let fixture: ComponentFixture<UiButton>;

  // Configura el componente antes de cada prueba.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButton],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButton);
    component = fixture.componentInstance;

    // Proporciona el valor obligatorio de la etiqueta.
    fixture.componentRef.setInput('label', 'Guardar');
    fixture.detectChanges();
  });

  // Comprueba que Angular pueda crear el componente.
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Comprueba que se muestre el texto recibido.
  it('should display the provided label', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(button.textContent).toContain('Guardar');
  });

  // Comprueba los valores predeterminados de las propiedades.
  it('should use the default variant and size', () => {
    expect(component.variant()).toBe('primary');
    expect(component.size()).toBe('md');
  });

  // Comprueba que cada variante aplique su clase CSS correspondiente.
  it('should apply the correct class for each variant', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    const variants = ['primary', 'secondary', 'danger'] as const;

    for (const variant of variants) {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(button.classList).toContain(`ui-button--${variant}`);
    }
  });

  // Comprueba que cada tamaño aplique su clase CSS correspondiente.
  it('should apply the correct class for each size', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      expect(button.classList).toContain(`ui-button--${size}`);
    }
  });

  // Comprueba que el botón se deshabilite cuando disabled sea true.
  it('should disable the button when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
  });

  // Comprueba que el botón también se deshabilite durante la carga.
  it('should disable the button when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
  });

  // Comprueba que se muestre el indicador y el texto de carga.
  it('should display the loading spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner: HTMLElement | null =
      fixture.nativeElement.querySelector('.ui-button__spinner');

    expect(spinner).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Cargando...');
  });

  // Comprueba que el evento se emita cuando el botón está habilitado.
  it('should emit clicked when the button is activated', () => {
    const emitSpy = vi.spyOn(component.clicked, 'emit');

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).toHaveBeenCalledOnce();
  });

  // Comprueba que el evento no se emita si el botón está deshabilitado.
  it('should not emit clicked when the button is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.clicked, 'emit');

    component.handleClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  // Comprueba que el evento no se emita mientras el botón está cargando.
  it('should not emit clicked when the button is loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.clicked, 'emit');

    component.handleClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
