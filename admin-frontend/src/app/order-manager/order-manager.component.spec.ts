import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManagerComponent } from './order-manager.component';

describe('OrderManagerComponent', () => {
  let component: OrderManagerComponent;
  let fixture: ComponentFixture<OrderManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderManagerComponent]
    });
    fixture = TestBed.createComponent(OrderManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
