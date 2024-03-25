import {Component,OnInit} from '@angular/core';
import { ElemListeComponent } from "../elem-liste/elem-liste.component";
import {ServerPOSTService} from '../../services/server-post.service';

@Component({
	selector: 'app-liste',
	templateUrl: './liste.component.html',
	styleUrl: './liste.component.css'
})
export class ListeComponent implements OnInit {
	nbElem: number = 0;

	items: any[] = [];

	ajouterElem(titre: string, contenu: string) {
		this.items.push({id: this.nbElem++, titre: titre, contenu: contenu});
	}
	constructor(private server: ServerPOSTService){
	}
	ngOnInit() {
		this.server.changeList(this);
	}

	clearElem(){
		this.items = [];
	}
}
