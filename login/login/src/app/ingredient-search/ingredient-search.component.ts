import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {Recipes} from "../recipes";
import {PassSearchitemService} from "../_services/pass-searchitem.service";
import {AuthenticationService} from "../_services/authentication.service";
import {AlertService} from "../_services/alert.service";
import {FormService} from "../_services/formservice.service";


@Component({
  selector: 'app-ingredient-search',
  templateUrl: './ingredient-search.component.html',
  styleUrls: ['./ingredient-search.component.css']
})
export class IngredientSearchComponent implements OnInit {
  selectIngredientForm: FormGroup;
  loading = false;
  issubmitted = false;
  returnUrl: string;
  recipes: Recipes[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passsearchitemservice: PassSearchitemService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private formService: FormService
  ) {
  }

  ngOnInit() {
    this.selectIngredientForm = this.formBuilder.group({
      ingredientselection: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/recipes/';

    this.formService.onFormSubmitted.subscribe( (formData: any ) => {
      this.onSubmit();
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.selectIngredientForm.controls;
  }

  onSubmit() {
    
    // stop here if form is invalid
    if (this.selectIngredientForm.invalid) {
      return;
    } else {
      this.issubmitted = true;
      // reset alerts on submit
      this.alertService.clear();

    }
    
    let item = this.f.ingredientselection.value
    this.router.navigate([this.returnUrl, item]);
  

  }
}
