import {Component,} from '@angular/core';
import { ElemListeComponent } from "../elem-liste/elem-liste.component";
import {AnimationService} from "../../services/animation.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css',
  animations: [
    trigger('fadeIn', [
      state('open', style({ opacity: 0 })),
      state('closed', style({
        opacity: 1,
      })),
      transition('* => closed', [
        animate('0.2s 100ms ease-out')
      ]),
    ]),

    trigger('translateIn', [
      state('open', style({

      })),
      state('closed', style({
        right: '0%',
      })),
      transition('* => closed', [
        animate('0.4s ease-out')
      ]),
      transition('* => open', [
        animate('0.4s easy-in')
      ]),
    ]),

    trigger('translateOut', [
      state('open', style({

      })),
      state('closed', style({
        right: '-100%',
      })),
      transition('* => closed', [
        animate('0.4s ease-out')
      ]),
      transition('* => open', [
        animate('0.4s easy-in')
      ]),
    ]),
  ]
})
export class ListeComponent {

  nbElem: number = 0;

  items: any[] = [
    {id: this.nbElem++, titre: "Hello World !", description: "Lorem ipsum dolor sit amet, consectekefhbsdjk", lieu: "Quelque paAAAHHrt dans le monde (J'ai eu peur)(Même si je suis une machine)(respectez-moi svp T_T)", date: "Aujourd'hui ou demain ou après-demain ou jamais"},
    {id: this.nbElem++, titre: "Another World !", description: "Un texte pour dire que c'est pour que ce soit différent de l'autre", lieu: "Quelque part dans le monde mais ailleur que l'autre", date: "Pas au même moment que l'autre"}
  ];

  ajouterElem(titre: string, contenu: string) {
    this.items.push({id: this.nbElem++, titre: titre, contenu: contenu});
  }
  constructor(private animationService: AnimationService){
    for (let i : number = 0; i < 50; i++) {
      this.items.push({id: this.nbElem++, titre: "Another World !", description: "Un texte pour dire que c'est pour que ce soit différent de l'autre", lieu: "Quelque part dans le monde mais ailleur que l'autre", date: "Pas au même moment que l'autre"});
    }
  }

  //animations
  playAnimation: boolean = true;

  ngOnInit() {
    this.animationService.animationTriggered.subscribe(() => {
      this.playAnimation = !this.playAnimation;
    });
  }

  triggerAnimation() {
    this.animationService.triggerAnimation();
  }
}
