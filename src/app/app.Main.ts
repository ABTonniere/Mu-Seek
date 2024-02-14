import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'appMain',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.Main.html',
  styleUrl: './app.Main.css'
})
export class AppComponent {
  title = 'museek';
}
