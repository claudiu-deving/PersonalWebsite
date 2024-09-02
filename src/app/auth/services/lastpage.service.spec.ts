import { TestBed } from '@angular/core/testing';

import { LastpageService } from './lastpage.service';

describe('LastpageService', () => {
  let service: LastpageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastpageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
