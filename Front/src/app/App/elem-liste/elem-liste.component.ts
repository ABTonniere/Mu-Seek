import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-elem-liste',
  templateUrl: './elem-liste.component.html',
  styleUrl: './elem-liste.component.css'
})
export class ElemListeComponent {
  @Input() titre: string = "Hello World !";
  @Input() description: string = "Lorem ipsum dolor sit amet, consectekefhbsdjkffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffflghds<lfhskjfkysrjfyeufysfiyseiufhsdjifghdsfidfisGHIEGFquipsfhqsufgqsjifgqsfuygqfyuqstgfsuyqgfqsyufgqsuygftur adipiscing elit. Nulla ac purus nec nunc tincidunt aliquam"
  @Input() lieu: string = "Quelque part dans le monde";
  @Input() date: string = "Aujourd'hui ou demain ou après-demain ou jamais";


  affichagePlus: boolean = false;

  toggleAffichagePlus() {
    this.affichagePlus = !this.affichagePlus;
  }
}
