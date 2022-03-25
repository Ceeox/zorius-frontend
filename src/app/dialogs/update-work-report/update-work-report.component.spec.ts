import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkReportComponent } from './update-work-report.component';

describe('UpdateWorkReportComponent', () => {
  let component: UpdateWorkReportComponent;
  let fixture: ComponentFixture<UpdateWorkReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateWorkReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateWorkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
