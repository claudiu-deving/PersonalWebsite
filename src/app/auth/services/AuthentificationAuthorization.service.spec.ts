/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthentificationAuthorizationService } from './AuthentificationAuthorization.service';

describe('Service: AuthentificationAuthorization', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthentificationAuthorizationService]
    });
  });

  it('should ...', inject([AuthentificationAuthorizationService], (service: AuthentificationAuthorizationService) => {
    expect(service).toBeTruthy();
  }));
});
