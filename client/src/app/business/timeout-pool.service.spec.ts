import { TestBed, inject } from '@angular/core/testing';

import { TimeoutPoolService } from './timeout-pool.service';

describe('TimeoutPoolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeoutPoolService]
    });
  });

  it('should be created', inject([TimeoutPoolService], (service: TimeoutPoolService) => {
    expect(service).toBeTruthy();
  }));
});
