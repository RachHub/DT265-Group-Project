import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SelectMonthComponent} from "./select-month/select-month.component";
import {DisplayRecipesComponent} from "./display-recipes/display-recipes.component";
import {RecipeComponent} from './recipe/recipe.component';
import {Displaytop5Component} from "./displaytop5/displaytop5.component";
import {Report1Component} from "./reports/report1.component";
import {IngredientSearchComponent} from "./ingredient-search/ingredient-search.component";
import {MapComponent} from "./map/map.component";


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { path: 'select', component: SelectMonthComponent },
  { path: 'recipes/:item', component: DisplayRecipesComponent },
  { path: 'recipe', component: RecipeComponent },
  { path: 'reports', component: Report1Component},
  { path: 'searchingredient', component: IngredientSearchComponent},
  { path: 'map', component: MapComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
