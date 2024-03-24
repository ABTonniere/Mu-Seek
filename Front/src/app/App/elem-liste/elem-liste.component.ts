import {Component, Input} from '@angular/core';
import {ListeComponent} from "../liste/liste.component";

@Component({
  selector: 'app-elem-liste',
  templateUrl: './elem-liste.component.html',
  styleUrl: './elem-liste.component.css'
})
export class ElemListeComponent {
  @Input() titre: string = "Nom de l'événement";
  @Input() description: string = "Description de l'événement"
  @Input() lieu: string = "Lieu de l'événement";
  @Input() date: string = "Date de l'événement";
  @Input() type: string = "type de l'événement";
  @Input() genre: string = "genre de l'événement";
  @Input() artiste: string = "artiste de l'événement";


  affichagePlus: boolean = false;

  toggleAffichagePlus() {
    this.affichagePlus = !this.affichagePlus;
  }
}
