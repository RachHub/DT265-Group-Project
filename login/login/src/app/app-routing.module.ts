import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SelectMonthComponent} from "./select-month/select-month.component";
import {DisplayRecipesComponent} from "./display-recipes/display-recipes.component";
import {RecipeComponent} from './recipe/recipe.component';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'select', component: SelectMonthComponent },
  { path: 'recipes/:month', component: DisplayRecipesComponent },
  { path: 'recipe', component: RecipeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
