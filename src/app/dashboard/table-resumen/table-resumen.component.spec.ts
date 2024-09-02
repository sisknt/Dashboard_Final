import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableResumenComponent } from './table-resumen.component';

describe('TableResumenComponent', () => {
  let component: TableResumenComponent;
  let fixture: ComponentFixture<TableResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableResumenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
