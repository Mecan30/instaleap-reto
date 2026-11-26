
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCard } from './ui-card';

@Component({
  imports: [UiCard],
  template: `
    <ui-card [title]="title" [subtitle]="subtitle">
      <p class="body-content">Contenido principal de prueba</p>
      <div card-footer class="footer-content">Acción de pie</div>
    </ui-card>
  `,
})
class TestHostComponent {
  title = 'Título de la tarjeta';
  subtitle = 'Subtítulo de prueba';
}

describe('UiCard', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create the card component', () => {
    const card = fixture.nativeElement.querySelector('ui-card');
    expect(card).toBeTruthy();
  });

  it('should display the provided title and subtitle', () => {
    const text: string = fixture.nativeElement.textContent ?? '';
    expect(text).toContain('Título de la tarjeta');
    expect(text).toContain('Subtítulo de prueba');
  });

  it('should project main content and footer content via ng-content', () => {
    const bodyEl = fixture.nativeElement.querySelector('.body-content');
    const footerEl = fixture.nativeElement.querySelector('.footer-content');

    expect(bodyEl?.textContent).toContain('Contenido principal de prueba');
    expect(footerEl?.textContent).toContain('Acción de pie');
  });
});
