import {Component, OnInit, Output, Input, ViewChild} from '@angular/core';
import { SelectMonthComponent} from "../select-month/select-month.component";
import {first} from "rxjs/operators";
import {PassSearchitemService} from "../_services/pass-searchitem.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Recipes} from "../recipes";
import {SelectRecipeService} from "../_services/select-recipe.service"
import {FormService} from "../_services/formservice.service";


@Component({
  selector: 'app-display-recipes',
  templateUrl: './display-recipes.component.html',
  styleUrls: ['./display-recipes.component.css']
})
export class DisplayRecipesComponent implements OnInit {
  recipes: Recipes[];
  recipe:string;
  returnUrl: string;
  private searchitem:string;

  constructor(private passsearchitemService: PassSearchitemService,
              private selectRecipeService: SelectRecipeService,
              private router: Router,
              private route: ActivatedRoute,
              private formService: FormService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchitem = params['item']
      this.passsearchitemService.searchitem(this.searchitem)
      .pipe(first())
      .subscribe(
        data => {
          this.recipes = data;
          console.log(data);
          //this.router.navigate([this.returnUrl]);
        },
        error => {
          //this.alertService.error(error);
          //this.loading = false;
        });
    });

      this.selectRecipeService.currentRecipe.subscribe(recipe => this.recipe = recipe);

  }

  onClick(recipe){
    // Change data in recipe service to the recipe that has been clicked on

    this.selectRecipeService.changeRecipe(recipe);
  }

  onClickFavourites(){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/recipes/';
    let item = "favourites";
    this.router.navigate([this.returnUrl, item]);
  }



}
