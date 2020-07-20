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





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    SelectMonthComponent,
    DisplayRecipesComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [ AuthenticationService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
