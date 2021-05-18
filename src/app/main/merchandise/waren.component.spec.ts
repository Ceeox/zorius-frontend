import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WarenComponent } from './waren.component';

describe('WarenComponent', () => {
  let component: WarenComponent;
  let fixture: ComponentFixture<WarenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WarenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
