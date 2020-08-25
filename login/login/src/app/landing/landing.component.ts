import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
  }

  onClickRegister() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/register';
    this.router.navigate([this.returnUrl]);
  }

  onClickLogin (){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
    this.router.navigate([this.returnUrl]);
  }

}
