import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainModule} from "./main-module/main.module";

@Component({
  selector: 'appMain',
  standalone: true,
  imports: [RouterOutlet, MainModule],
  templateUrl: './app.Main.html',
  styleUrl: './app.Main.css'
})
export class AppComponent {
  title = 'museek';
}

