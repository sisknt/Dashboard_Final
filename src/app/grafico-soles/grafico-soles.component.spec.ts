import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoSolesComponent } from './grafico-soles.component';

describe('GraficoSolesComponent', () => {
  let component: GraficoSolesComponent;
  let fixture: ComponentFixture<GraficoSolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoSolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoSolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
