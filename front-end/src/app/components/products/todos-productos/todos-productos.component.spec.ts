import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosProductosComponent } from './todos-productos.component';

describe('TodosProductosComponent', () => {
  let component: TodosProductosComponent;
  let fixture: ComponentFixture<TodosProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodosProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
