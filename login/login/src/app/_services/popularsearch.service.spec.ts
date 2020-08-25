import { TestBed } from '@angular/core/testing';

import { PopularsearchService } from './popularsearch.service';

describe('PopularsearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopularsearchService = TestBed.get(PopularsearchService);
    expect(service).toBeTruthy();
  });
});
