import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PopularsearchService {

  constructor(private http: HttpClient) { }
  projectUrl = 'http://127.0.0.1:5000/seasonal_recipes/api/v1.0/searchitems';

  popularSearch() {
    return this.http.get<any>(this.projectUrl);
  }
}
