import { TestBed } from '@angular/core/testing';

import { ModalServicesService } from './modal-services.service';

describe('ModalServicesService', () => {
  let service: ModalServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
