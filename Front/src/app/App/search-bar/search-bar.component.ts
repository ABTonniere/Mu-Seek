import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { AnimationService } from "../../services/animation.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ServerPOSTService} from '../../services/server-post.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  animations: [
    // opacité
    trigger('fadeOutNoLeave', [
      state('void', style({ opacity: 0.5 })),
      state('closed', style({
        opacity: 0,
        pointerEvents: 'none',
        zIndex: '-1000',
      })),
      transition('* => closed', [
        animate('0.2s 100ms ease-out')
      ]),
      transition(':leave', [])
    ]),

    trigger('fadeOut', [
      state('void', style({ opacity: 0.5 })),
      transition(':leave', [
        animate('0.2s 100ms ease-out', style({ opacity: 0 }))
      ]),
    ]),

    // translation
    trigger('translateOut', [
      state('open', style({
        // rien
      })),
      state('closed', style({
        left: '-100%',
      })),
      transition('* => closed', [
        animate('0.5s ease-out')
      ]),
      transition('* => open', [
        animate('0.5s ease-out')
      ]),
    ]),

    // translation
    trigger('translateTop', [
      state('open', style({
      })),
      state('closed', style({
        top: '0%',
        transform: (window.innerHeight > window.innerWidth) ? 'translate(-45vw, 5vh)': 'translate(-40vw, 5vh)'
      })),
      transition('* => closed', [
        animate('0.6s ease-out')
      ]),
      transition('* => open', [
        animate('0.6s ease-out')
      ]),
    ])
  ]
})
export class SearchBarComponent {
  playAnimation: boolean = true;

  constructor(private animationService: AnimationService, private server: ServerPOSTService) { }
  ngOnInit() {
    this.animationService.animationTriggered.subscribe(() => {
      this.playAnimation = false;
    });
  }

  preventDefault(event: Event, callback: Function, searchValue: string) {
    if (searchValue.trim() === '' || searchValue.trim().length < 3) {
      event.preventDefault();
      console.log("Access rejected!");
      return;
    }
    else if(this.playAnimation) {
      this.search(searchValue);
      this.animationService.triggerAnimation();
    }
    console.log("Access granted!");
  }

  triggerAnimation() {
    if(this.playAnimation) this.animationService.triggerAnimation();
  }

  search(req: String) {
    //this.server.find(req);
    this.server.GetEvents(0, 0, true);
  }
}