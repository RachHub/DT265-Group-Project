import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  latitude: any;
  longitude: any;
  title1 = 'Kilruddery Farmers Market';
  title2 = 'Kilternan Country Market';
  title3 = 'The Complete Food Market';
  title4 = 'The Green Door Market';
  title5 = 'Farmleigh Food Market';
  title6 = 'Farmers Market @ St Annes Park'

  constructor() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition( pos => {
        this.longitude = +pos.coords.longitude;
        this.latitude = +pos.coords.latitude;
      });
    }
  }
}
