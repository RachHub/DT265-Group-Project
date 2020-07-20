import { TestBed } from '@angular/core/testing';

import { Top5Service } from './top5.service';

describe('Top5Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Top5Service = TestBed.get(Top5Service);
    expect(service).toBeTruthy();
  });
});
