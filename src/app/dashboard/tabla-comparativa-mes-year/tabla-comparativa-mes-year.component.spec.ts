import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaComparativaMesYearComponent } from './tabla-comparativa-mes-year.component';

describe('TablaComparativaMesYearComponent', () => {
  let component: TablaComparativaMesYearComponent;
  let fixture: ComponentFixture<TablaComparativaMesYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaComparativaMesYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaComparativaMesYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
