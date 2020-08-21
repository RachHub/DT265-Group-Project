import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Recipes } from '../recipes'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PassSearchitemService {

  constructor(private http: HttpClient) { }
  projectUrl2 = 'http://127.0.0.1:5000/seasonal_recipes/api/v1.0/ingredientsearch/';
  projectUrl = 'http://127.0.0.1:5000/seasonal_recipes/api/v1.0/';
  projectUrl3 = 'http://127.0.0.1:5000/seasonal_recipes/api/v1.0/recipes/';
  

  searchitem(item) {
    if (item == 'January' || item == 'February' || item == 'March' || item == 'April' || item == 'May' || item == 'June'
      || item == 'July' || item == 'August' ||
      item == 'September' || item == 'October' || item == 'November' || item == 'December') {
      return this.http.get<Recipes[]>(this.projectUrl + item);
    } else if (item == 'favourites') {

      const headers: HttpHeaders = new HttpHeaders({
        'ContentType': 'application/json'
    });
    
      
      let user_data = {'username': localStorage.getItem('current_username')}
      //Get favourites for current user from favourites endpoint
      return this.http.post<Recipes[]>((this.projectUrl3 + item), {'username': localStorage.getItem('current_username')}, {headers: headers})
      .pipe(
      );

    } else  {
      return this.http.get<Recipes[]>(this.projectUrl2 + item);
    }
      }
  }

