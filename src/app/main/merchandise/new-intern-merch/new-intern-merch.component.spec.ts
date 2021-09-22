/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewInternMerchComponent } from './new-intern-merch.component';

describe('NewInternMerchComponent', () => {
  let component: NewInternMerchComponent;
  let fixture: ComponentFixture<NewInternMerchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewInternMerchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInternMerchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
