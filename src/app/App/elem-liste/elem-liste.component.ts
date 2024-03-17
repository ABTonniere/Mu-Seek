import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-elem-liste',
  templateUrl: './elem-liste.component.html',
  styleUrl: './elem-liste.component.css'
})
export class ElemListeComponent {
  @Input() titre: string = "Hello World !";
  contenu: string = "Lorem ipsum dolor sit amet, consectekefhbsdjkffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffflghds<lfhskjfkysrjfyeufysfiyseiufhsdjifghdsfidfisGHIEGFquipsfhqsufgqsjifgqsfuygqfyuqstgfsuyqgfqsyufgqsuygftur adipiscing elit. Nulla ac purus nec nunc tincidunt aliquam"
  modifierValeur() {
    this.titre = 'Learn More';
    this.contenu = 'Hello there !';
  }
}
