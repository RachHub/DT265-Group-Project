import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectRecipeService {

  private recipeSource = new BehaviorSubject('default recipe string');
  currentRecipe = this.recipeSource.asObservable();

  constructor() { }

  changeRecipe(recipe: string) {
    this.recipeSource.next(recipe)
  }
}
