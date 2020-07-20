import { TestBed } from '@angular/core/testing';

import { PassMonthService } from './pass-month.service';

describe('PassMonthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PassMonthService = TestBed.get(PassMonthService);
    expect(service).toBeTruthy();
  });
});
