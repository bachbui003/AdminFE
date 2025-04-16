import { TestBed } from '@angular/core/testing';

import { OrderManagerService } from './order-manager.service';

describe('OrderManagerService', () => {
  let service: OrderManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
