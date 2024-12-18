import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialProductosComponent } from './historial-productos.component';

describe('HistorialProductosComponent', () => {
  let component: HistorialProductosComponent;
  let fixture: ComponentFixture<HistorialProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
