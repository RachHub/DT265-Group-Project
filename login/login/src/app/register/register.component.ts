import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';
import {AuthenticationService} from '../_services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private registerFormBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.registrationForm = this.registerFormBuilder.group({
      register_username: ['', Validators.required],
      register_pw: ['', Validators.required],
      email: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/select';
  }

  // convenience getter for easy access to form fields
  get rf() { return this.registrationForm.controls; }

  onSubmitRegister() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.register(this.rf.register_username.value, this.rf.register_pw.value, this.rf.email.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

    localStorage.setItem('currentUser', this.rf.register_username.value);
    //console.log(JSON.parse(localStorage.getItem('currentUser')).register_username);
    //console.log(JSON.parse(localStorage.getItem('currentUser')).email);
}


  logout() {
    this.authenticationService.logout();
  }
}
