import { TestBed } from '@angular/core/testing';

import { PassIngredientService } from './pass-ingredient.service';

describe('PassIngredientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PassIngredientService = TestBed.get(PassIngredientService);
    expect(service).toBeTruthy();
  });
});
