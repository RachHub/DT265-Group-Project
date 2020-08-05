import { TestBed } from '@angular/core/testing';

import { SelectRecipeService } from './select-recipe.service';

describe('SelectRecipeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectRecipeService = TestBed.get(SelectRecipeService);
    expect(service).toBeTruthy();
  });
});
