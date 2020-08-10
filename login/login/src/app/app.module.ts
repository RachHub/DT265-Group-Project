import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import {AuthenticationService} from './_services/authentication.service';
import { JwtInterceptor} from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AlertComponent } from './_components/alert.component';
import { SelectMonthComponent } from './select-month/select-month.component';
import { DisplayRecipesComponent } from './display-recipes/display-recipes.component';

import { RecipeComponent } from './recipe/recipe.component';



import { Report1Component } from './reports/report1.component';
import { ReportoneService} from './_services/reportone.service';
import { ChartsModule} from 'ng2-charts';
import { Report3Component } from './popularsearch/report3.component';
import { Report4Component } from './report4/report4.component';
import { Displaytop5Component } from './displaytop5/displaytop5.component';
import { IngredientSearchComponent } from './ingredient-search/ingredient-search.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    SelectMonthComponent,
    DisplayRecipesComponent,
    RecipeComponent,
    Report1Component,
    Report3Component,
    Report4Component,
    Displaytop5Component,
    IngredientSearchComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule
  ],
  providers: [ AuthenticationService, ReportoneService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
