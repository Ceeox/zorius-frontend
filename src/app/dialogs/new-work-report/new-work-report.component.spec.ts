import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWorkReportComponent } from './new-work-report.component';

describe('NewWorkReportComponent', () => {
  let component: NewWorkReportComponent;
  let fixture: ComponentFixture<NewWorkReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewWorkReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWorkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
