import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SelectMonthComponent} from "./select-month/select-month.component";
import {DisplayRecipesComponent} from "./display-recipes/display-recipes.component";
import {Displaytop5Component} from "./displaytop5/displaytop5.component";
import {Report1Component} from "./reports/report1.component";



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'select', component: SelectMonthComponent },
  { path: 'recipes/:month', component: DisplayRecipesComponent },
  { path: 'reports', component: Report1Component}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
