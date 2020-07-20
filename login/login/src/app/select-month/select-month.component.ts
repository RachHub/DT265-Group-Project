import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthenticationService} from "../_services/authentication.service";
import {AlertService} from "../_services/alert.service";
import { PassMonthService} from '../_services/pass-month.service';
import {Recipes} from "../recipes";

@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.css'],

})
export class SelectMonthComponent implements OnInit {
  selectForm: FormGroup;
  loading = false;
  issubmitted = false;
  returnUrl: string;
  recipes: Recipes[];


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passmonthService: PassMonthService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
  }

  headers = ['vegetable', 'title', 'ingredients', 'method'];

  ngOnInit() {
    this.selectForm = this.formBuilder.group({
      monthselection: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/recipes/';
  }

// convenience getter for easy access to form fields
  get f() {
    return this.selectForm.controls;
  }


  onSubmit() {

    // stop here if form is invalid
    if (this.selectForm.invalid) {
      return;
    } else {
      this.issubmitted = true;

      // reset alerts on submit
      this.alertService.clear();

    }

    let searchItem = this.f.monthselection.value

    this.loading = true;
    this.passmonthService.searchmonth(this.f.monthselection.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate([this.returnUrl, searchItem]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

    //console.log(JSON.parse(localStorage.getItem('currentUser')));
    //console.log(JSON.parse(localStorage.getItem('currentUser')).email);
  }
  logout() {
    this.authenticationService.logout();
  }


  }
