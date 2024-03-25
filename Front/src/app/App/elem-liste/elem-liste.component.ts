import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {OpenstreetmapComponent} from "../openstreetmap/openstreetmap.component";
import {AnimationService} from "../../services/animation.service";
import {OpenstreetmapService} from "../../services/openstreetmap.service";

@Component({
  selector: 'app-elem-liste',
  templateUrl: './elem-liste.component.html',
  styleUrl: './elem-liste.component.css',
  animations: [
    trigger('extend', [
      state('closed', style({ height: '0px', overflow: 'hidden' })),
      state('open', style({ height: '*' })),
      transition('closed <=> open', [animate('300ms ease-out')])
    ]),
  ]
})

export class ElemListeComponent {
  affichagePlus: boolean = false;
  mapPin: boolean = false;

  constructor(private openstreetmapService: OpenstreetmapService) { }

  @Input() titre: string = "Nom de l'événement";
  @Input() description: string = "Description de l'événement"
  @Input() lieu: string = "Lieu de l'événement";
  @Input() date: string = "Date de l'événement";
  @Input() type: string = "type de l'événement";
  @Input() genre: string = "genre de l'événement";
  @Input() artiste: string = "artiste de l'événement";

  affichePlus() {
    this.affichagePlus = !this.affichagePlus;
  }

  pinMap() {
    this.mapPin = !this.mapPin;
    this.openstreetmapService.putPin(10, 0, "zebi");
  }
}
