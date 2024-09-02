import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resumen1Component } from './resumen1.component';

describe('Resumen1Component', () => {
  let component: Resumen1Component;
  let fixture: ComponentFixture<Resumen1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Resumen1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Resumen1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
