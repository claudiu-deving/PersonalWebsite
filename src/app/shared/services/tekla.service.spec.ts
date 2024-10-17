import { TestBed } from '@angular/core/testing';

import { TeklaService } from './tekla.service';

describe('TeklaService', () => {
  let service: TeklaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeklaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
