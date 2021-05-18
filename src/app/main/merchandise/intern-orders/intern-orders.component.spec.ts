import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternOrdersComponent } from './intern-orders.component';

describe('InternOrdersComponent', () => {
  let component: InternOrdersComponent;
  let fixture: ComponentFixture<InternOrdersComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [InternOrdersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
