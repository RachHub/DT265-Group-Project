import { Component, OnInit } from '@angular/core';
import {Top5Service} from "../_services/top5.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PopularsearchService} from "../_services/popularsearch.service";
import {first} from "rxjs/operators";
import {ChartDataSets} from "chart.js";
import {Label} from "ng2-charts";

@Component({
  selector: 'app-report3',
  templateUrl: './report3.component.html',
  styleUrls: ['./report3.component.css']
})
export class Report3Component implements OnInit {

  
  popularsearchData: ChartDataSets[] = [
    {
      data: [],
    }
  ];
  colors = [];
  popularsearchLabels: Label[] = [];

  searchitems: any[];
  pieChartLabels = [];
  
  public pieChartType = 'pie';

  constructor(private popularsearch: PopularsearchService,
              private router: Router,
              private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.popularsearch.popularSearch()
      .subscribe(data => {
        this.searchitems = data;
        this.popularsearchLabels = this.searchitems["labels"];
        this.popularsearchData = this.searchitems["data"];
        console.log(this.searchitems);
        });
        

    for (let i = 0; i < this.searchitems.length; i++) {
      this.colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }

    }
  }




