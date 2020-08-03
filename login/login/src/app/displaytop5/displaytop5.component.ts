import { Component, OnInit } from '@angular/core';
import {first} from 'rxjs/operators';
import {Top5Service} from '../_services/top5.service';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-displaytop5',
  templateUrl: './displaytop5.component.html',
  styleUrls: ['./displaytop5.component.css']
})
export class Displaytop5Component implements OnInit {
  favorites: any[];

  constructor(private top5service: Top5Service,
              private router: Router,
              private route: ActivatedRoute,) { }

  ngOnInit() {
    this.top5service.top5()
      .pipe(first())
      .subscribe(
        data => {
          this.favorites = data;
        },
        error => {
          //this.alertService.error(error);
          //this.loading = false;
        });
  }

}
