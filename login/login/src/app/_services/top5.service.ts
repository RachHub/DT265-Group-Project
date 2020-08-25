import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Recipes} from "../recipes";

@Injectable({
  providedIn: 'root'
})
export class Top5Service {


  constructor(private http: HttpClient) { }
  projectUrl = 'https://seasonal-recipes.herokuapp.com/seasonal_recipes/api/v1.0/favorites';

  top5() {
    return this.http.get<any>(this.projectUrl);
  }


}
