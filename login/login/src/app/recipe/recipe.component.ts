import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DisplayRecipesComponent} from '../display-recipes/display-recipes.component';
import { Recipes } from '../recipes';
import { SelectRecipeService } from '../_services/select-recipe.service';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
 
})
export class RecipeComponent implements OnInit {

  recipe:string;
  
  constructor(private data: SelectRecipeService) { }

  ngOnInit() {
    this.data.currentRecipe.subscribe(recipe => this.recipe = recipe)
  }

}
