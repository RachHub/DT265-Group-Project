import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>('https://seasonal-recipes.herokuapp.com/users');
  }

  register(user: User) {
    return this.http.post('https://seasonal-recipes.herokuapp.com/register', user);
  }

  delete(id: number) {
    return this.http.delete('https://seasonal-recipes.herokuapp.com/users/${id}');
  }
}
