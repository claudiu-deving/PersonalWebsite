/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RouteTrackingService } from './routeTracking.service';

describe('Service: RouteTracking', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteTrackingService]
    });
  });

  it('should ...', inject([RouteTrackingService], (service: RouteTrackingService) => {
    expect(service).toBeTruthy();
  }));
});
