import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { vigilanteGuard } from './vigilante.guard';

describe('vigilanteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => vigilanteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
