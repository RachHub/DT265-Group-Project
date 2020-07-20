import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report3',
  templateUrl: './report3.component.html',
  styleUrls: ['./report3.component.css']
})
export class Report3Component implements OnInit {
  public pieChartLabels = ['Tomatoes', 'Carrots', 'Onions', 'Other'];
  public pieChartData = [20, 90, 90, 30];
  public pieChartType = 'pie';

  constructor() { }

  ngOnInit() {
  }

}
