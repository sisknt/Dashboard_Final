import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaComparativaSemanaYearComponent } from './tabla-comparativa-semana-year.component';

describe('TablaComparativaSemanaYearComponent', () => {
  let component: TablaComparativaSemanaYearComponent;
  let fixture: ComponentFixture<TablaComparativaSemanaYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaComparativaSemanaYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaComparativaSemanaYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
