/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListWrTodayComponent } from './list-wr-today.component';

describe('ListWrTodayComponent', () => {
  let component: ListWrTodayComponent;
  let fixture: ComponentFixture<ListWrTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ListWrTodayComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWrTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
