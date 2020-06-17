import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthenticationService} from "../_services/authentication.service";
import {AlertService} from "../_services/alert.service";
import { PassIngredientService} from '../_services/pass-ingredient.service';

@Component({
  selector: 'app-select-ingredient',
  templateUrl: './select-ingredient.component.html',
  styleUrls: ['./select-ingredient.component.css']
})
export class SelectIngredientComponent implements OnInit {
  selectForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passingredientService: PassIngredientService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.selectForm = this.formBuilder.group({
      ingredientselection: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
  }

// convenience getter for easy access to form fields
    get f() { return this.selectForm.controls; }

    onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.selectForm.invalid) {
        return;
      }

      let searchItem = this.f.ingredientselection.value

      this.loading = true;
      this.passingredientService.searchingredient(this.f.ingredientselection.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
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

