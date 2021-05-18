import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternOrdersComponent } from './extern-orders.component';

describe('ExternOrdersComponent', () => {
  let component: ExternOrdersComponent;
  let fixture: ComponentFixture<ExternOrdersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
