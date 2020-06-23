import {Component, OnInit, ViewChild} from '@angular/core';
import { SelectIngredientComponent} from "../select-ingredient/select-ingredient.component";
import {first} from "rxjs/operators";
import {PassIngredientService} from "../_services/pass-ingredient.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Recipes} from "../recipes";

@Component({
  selector: 'app-display-recipes',
  templateUrl: './display-recipes.component.html',
  styleUrls: ['./display-recipes.component.css']
})
export class DisplayRecipesComponent implements OnInit {
  recipes: Recipes[];

  constructor(private passingredientService: PassIngredientService,
              private router: Router,
              private route: ActivatedRoute,) { }

  ngOnInit() {
    this.passingredientService.searchingredient(this.route.snapshot.paramMap.get('vegetable'))
      .pipe(first())
      .subscribe(
        data => {
          this.recipes = data;
          console.log(data)
          //this.router.navigate([this.returnUrl]);
        },
        error => {
          //this.alertService.error(error);
          //this.loading = false;
        });

  }

}
