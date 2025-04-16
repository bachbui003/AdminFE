import { TestBed } from '@angular/core/testing';

import { CategoriesManagerService } from './categories-manager.service';

describe('CategoriesManagerService', () => {
  let service: CategoriesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
