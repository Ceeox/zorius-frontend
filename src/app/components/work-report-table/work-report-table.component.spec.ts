import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkReportTableComponent } from './work-report-table.component';

describe('WorkReportTableComponent', () => {
  let component: WorkReportTableComponent;
  let fixture: ComponentFixture<WorkReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkReportTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
