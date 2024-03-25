import {Component, HostListener,} from '@angular/core';
import {AnimationService} from "../../services/animation.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ElemListeComponent} from "../elem-liste/elem-liste.component";
import {ServerPOSTService} from "../../services/server-post.service";

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css',
  animations: [

      // simple animation de fondu
    trigger('fadeIn', [
      state('open', style({ opacity: 0 })),
      state('closed', style({
        opacity: 1,
      })),
      transition('* => closed', [
        animate('0.2s 100ms ease-out')
      ]),
    ]),

      // animation pour faire apparaître le side-panel
    trigger('translateIn', [
      state('open', style({
        right: '-100vw',
      })),
      state('closed', style({
        right: '0vw',
      })),
      transition('* => closed', [
        animate('0.4s ease-out')
      ]),
      transition('* => open', [
        animate('0.4s ease-out')
      ]),
    ]),

      // animation pour sortir le side-panel de l'écran
    trigger('translateOut', [
      state('open', style({
        right: '0vw',
      })),
      state('closed', style({
        right: (window.innerHeight > window.innerWidth) && (window.innerWidth <= 962) ? '-50vw': '-25vw',
      })),
      transition('* => closed', [
        animate('0.5s ease-out')
      ]),
      transition('* => open', [
        animate('0.5s ease-out')
      ]),
    ]),

      // animation pour changer l'image du collapse button
    trigger('imageChangeAnimation', [
      transition(':increment', [
        animate('0.5s', style({ opacity: 0 })),
        animate('0.5s', style({ opacity: 1 }))
      ]),
      transition(':decrement', [
        animate('0.5s', style({ opacity: 0 })),
        animate('0.5s', style({ opacity: 1 }))
      ])
    ])
  ]
})

export class ListeComponent {

  nbElem: number = 0;
  imageIndex: number = 1;
  playAnimation: boolean = true;
  sideAnimation: boolean = false;
  elemCourant: ElemListeComponent | null = null;

  items: any[] = [];

  ajouterElem(titre: string, description: string, lieu: string, date: string, type: string, genre: string, artiste: string) {
    this.items.push({id: this.nbElem++, titre: titre, contenu: contenu});
    // this.items.push({id: this.nbElem++, titre: titre, description: description, lieu: lieu, date: date, type: type, genre: genre, artiste: artiste});
  }

  constructor(private animationService: AnimationService, private server: ServerPOSTService){
    // ajout de 50 éléments pour tester le scroll
    for (let i : number = 0; i < 50; i++) {
      this.items.push({id: this.nbElem++, titre: "Another World !", description: "Un texte pour dire que c'est pour que ce soit différent de l'autre", lieu: "Quelque part dans le monde mais ailleur que l'autre", date: "Pas au même moment que l'autre"});
    }
  }

  // trigger des animations
  ngOnInit() {
    this.server.changeList(this);
    this.animationService.animationTriggered.subscribe(() => {
      this.playAnimation = false;
      this.sideAnimation = !this.sideAnimation;
      this.imageIndex = (this.imageIndex + 1) % 2;
    });
  }

  // on fait les animations de tous les éléments uniquement si on est pas dans la page de départ
  triggerAnimation() {
    if(!this.playAnimation) this.animationService.triggerAnimation();
  }

  clearElem(){
    this.items = [];
  }
}
