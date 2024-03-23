import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { AnimationService } from "../../services/animation.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

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
        transform: 'translate(-40vw, 5vh)',
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
  constructor(private animationService: AnimationService) { }

  playAnimation: boolean = true;

  ngOnInit() {
    this.animationService.animationTriggered.subscribe(() => {
      this.playAnimation = false;
      console.log("Bien pris");
    });
  }

  triggerAnimation() {
    this.animationService.triggerAnimation();
  }
}