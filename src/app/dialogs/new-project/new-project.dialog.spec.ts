/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewProjectDialog } from './new-project.dialog';

describe('NewProjectDialogComponent', () => {
  let component: NewProjectDialog;
  let fixture: ComponentFixture<NewProjectDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [NewProjectDialog],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
