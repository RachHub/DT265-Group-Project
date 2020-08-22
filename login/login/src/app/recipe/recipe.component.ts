import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DisplayRecipesComponent} from '../display-recipes/display-recipes.component';
import { Recipes } from '../recipes';
import { SelectRecipeService } from '../_services/select-recipe.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
 
})
export class RecipeComponent implements OnInit {

  recipe:string;
  
  constructor(private data: SelectRecipeService, private http: HttpClient) { }

  ngOnInit() {
    this.data.currentRecipe.subscribe(recipe => this.recipe = recipe)
  }

  onClick() {
    
    let recipe_id = this.recipe['recipe_id'];
    const headers: HttpHeaders = new HttpHeaders({
      'ContentType': 'application/json'
    });
    let favouritesUrl = 'https://seasonal-recipes.herokuapp.com/seasonal_recipes/api/v1.0/add_favourite';
    
    //Add favourite to current user's favourites list
    this.http.post<any>(favouritesUrl, {'username': localStorage.getItem('current_username'), 'recipe_id': recipe_id}, {headers: headers}).subscribe();
     
  }

}
