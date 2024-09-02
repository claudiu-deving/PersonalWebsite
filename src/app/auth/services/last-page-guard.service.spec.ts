import { TestBed } from '@angular/core/testing';

import { LastPageGuardService } from './last-page-guard.service';

describe('LastPageGuardService', () => {
  let service: LastPageGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastPageGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
