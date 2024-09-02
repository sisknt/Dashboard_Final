import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsProductoComponent } from './stats-producto.component';

describe('StatsProductoComponent', () => {
  let component: StatsProductoComponent;
  let fixture: ComponentFixture<StatsProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
