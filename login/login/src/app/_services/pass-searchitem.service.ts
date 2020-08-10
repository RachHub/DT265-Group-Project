import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Recipes } from 'src/app/recipes'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PassSearchitemService {

  constructor(private http: HttpClient) { }
  projectUrl2 = 'http://127.0.0.1:5000/seasonal_recipes/api/v1.0/ingredientsearch/';
  projectUrl = 'http://127.0.0.1:5000/seasonal_recipes/api/v1.0/';

  searchitem(item) {
    if (item == 'January' || item == 'February' || item == 'March' || item == 'April' || item == 'May' || item == 'June'
      || item == 'July' || item == 'August' ||
      item == 'September' || item == 'October' || item == 'November' || item == 'December') {
      return this.http.get<Recipes[]>(this.projectUrl + item);
    } else {
      return this.http.get<Recipes[]>(this.projectUrl2 + item);
    }
      }
  }

