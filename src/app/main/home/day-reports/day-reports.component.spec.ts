import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayReportsComponent } from './day-reports.component';

describe('DayReportsComponent', () => {
  let component: DayReportsComponent;
  let fixture: ComponentFixture<DayReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
