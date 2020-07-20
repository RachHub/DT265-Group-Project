import {Component, OnInit, ViewChild} from '@angular/core';
import { SelectMonthComponent} from "../select-month/select-month.component";
import {first} from "rxjs/operators";
import {PassMonthService} from "../_services/pass-month.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Recipes} from "../recipes";

@Component({
  selector: 'app-display-recipes',
  templateUrl: './display-recipes.component.html',
  styleUrls: ['./display-recipes.component.css']
})
export class DisplayRecipesComponent implements OnInit {
  recipes: Recipes[];

  constructor(private passmonthService: PassMonthService,
              private router: Router,
              private route: ActivatedRoute,) { }

  ngOnInit() {
    this.passmonthService.searchmonth(this.route.snapshot.paramMap.get('month'))
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
