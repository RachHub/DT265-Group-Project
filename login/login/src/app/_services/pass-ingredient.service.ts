import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Recipes } from 'src/app/recipes'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PassIngredientService {

  constructor(private http: HttpClient) { }
  projectUrl = 'http://127.0.0.1:5000//seasonal_recipes/api/v1.0/';

  searchingredient(ingredient) {
    let params = new HttpParams();
    params = params.append('vegetable', (ingredient));


    return this.http.get<Recipes>(this.projectUrl, {params});
      };
  }

