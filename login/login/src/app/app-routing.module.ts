import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SelectIngredientComponent} from './select-ingredient/select-ingredient.component';
import {DisplayRecipesComponent} from './display-recipes/display-recipes.component';
import {Report1Component} from './report1/report1.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'select', component: SelectIngredientComponent },
  { path: 'recipes/:vegetable', component: DisplayRecipesComponent },
  { path: 'reports', component: Report1Component },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
