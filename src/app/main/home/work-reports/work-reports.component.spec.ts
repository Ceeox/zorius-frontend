/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WorkReportsComponent } from './work-reports.component';

describe('WorkReportsComponent', () => {
  let component: WorkReportsComponent;
  let fixture: ComponentFixture<WorkReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkReportsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
