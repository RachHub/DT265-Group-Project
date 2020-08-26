import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { AgmCoreModule } from '@agm/core';

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
import { FormService} from './_services/formservice.service';

import { RecipeComponent } from './recipe/recipe.component';



import { Report1Component } from './reports/report1.component';
import { ReportoneService} from './_services/reportone.service';
import { ChartsModule} from 'ng2-charts';
import { Report3Component } from './popularsearch/report3.component';
import { Report4Component } from './report4/report4.component';
import { Displaytop5Component } from './displaytop5/displaytop5.component';
import { IngredientSearchComponent } from './ingredient-search/ingredient-search.component';
import { MapComponent } from './map/map.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';



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
    MapComponent,
    RegisterComponent,
    LandingComponent,
    AboutComponent,
    



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    GoogleMapsModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyAB8gz4YNb2nnqxxaZbxylKyDG7A-oUJeQ'})
  ],
  providers: [ AuthenticationService, FormService, ReportoneService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
