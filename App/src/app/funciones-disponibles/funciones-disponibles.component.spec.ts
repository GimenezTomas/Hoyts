import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionesDisponiblesComponent } from './funciones-disponibles.component';

describe('FuncionesDisponiblesComponent', () => {
  let component: FuncionesDisponiblesComponent;
  let fixture: ComponentFixture<FuncionesDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuncionesDisponiblesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionesDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
