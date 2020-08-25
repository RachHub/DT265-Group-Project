import { TestBed } from '@angular/core/testing';

import { PassSearchitemService } from './pass-searchitem.service';

describe('PassMonthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PassSearchitemService = TestBed.get(PassSearchitemService);
    expect(service).toBeTruthy();
  });
});
