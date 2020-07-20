import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportoneService {

  constructor(private _http: HttpClient) { }
  popularIngredient() {
    return this._http.get('https://samples.openweathermap.org/data/2.5/forecast/daily?id=524901&lang' +
      '=zh_cn&appid=b1b15e88fa797225412429c1c50c122a1')
      .pipe(map(result => result));

  }
}


