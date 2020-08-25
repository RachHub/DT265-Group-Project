import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PopularsearchService {

  constructor(private http: HttpClient) { }
  projectUrl = 'https://seasonal-recipes.herokuapp.com/seasonal_recipes/api/v1.0/searchitems';

  popularSearch() {
    return this.http.get<any>(this.projectUrl);
  }
}
