import {Component, ComponentFactoryResolver, Output, ViewChild, ViewContainerRef} from '@angular/core';
import { ElemListeComponent } from "../elem-liste/elem-liste.component";

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css'
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



}
