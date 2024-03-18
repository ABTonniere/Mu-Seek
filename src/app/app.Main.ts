import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as L from 'leaflet';
import {MainModule} from "./main-module/main.module";

@Component({
  selector: 'appMain',
  standalone: true,
  imports: [RouterOutlet, MainModule],
  templateUrl: './app.Main.html',
  styleUrl: './app.Main.css'
})

export class AppComponent implements OnInit {
  title = 'museek';
  ngOnInit() {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 5,
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }
}
