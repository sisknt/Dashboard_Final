import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenSolesComponent } from './resumen-soles.component';

describe('ResumenSolesComponent', () => {
  let component: ResumenSolesComponent;
  let fixture: ComponentFixture<ResumenSolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenSolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenSolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
