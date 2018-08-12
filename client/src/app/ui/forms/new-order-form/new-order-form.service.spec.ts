import { TestBed, inject } from '@angular/core/testing';

import { NewOrderFormService } from './new-order-form.service';

describe('NewOrderFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewOrderFormService]
    });
  });

  it('should be created', inject([NewOrderFormService], (service: NewOrderFormService) => {
    expect(service).toBeTruthy();
  }));
});
