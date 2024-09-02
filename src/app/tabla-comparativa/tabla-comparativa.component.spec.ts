import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaComparativaComponent } from './tabla-comparativa.component';

describe('TablaComparativaComponent', () => {
  let component: TablaComparativaComponent;
  let fixture: ComponentFixture<TablaComparativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaComparativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaComparativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
