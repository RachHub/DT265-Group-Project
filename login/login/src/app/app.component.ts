import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from './_services/authentication.service';
import { User } from './_models/user';
import { ReportoneService} from './_services/reportone.service';

import './_content/app.less';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
