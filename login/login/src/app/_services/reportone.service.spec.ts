import { TestBed } from '@angular/core/testing';

import { ReportoneService } from './reportone.service';

describe('ReportoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportoneService = TestBed.get(ReportoneService);
    expect(service).toBeTruthy();
  });
});
