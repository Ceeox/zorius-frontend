/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewWrComponent } from './new-wr.component';

describe('NewWrComponent', () => {
  let component: NewWrComponent;
  let fixture: ComponentFixture<NewWrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
