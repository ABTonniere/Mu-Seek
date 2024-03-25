import { Injectable } from '@angular/core';
import {ListeComponent} from "../App/liste/liste.component";

@Injectable({
	providedIn: 'root'
})

export class SearchService {
	list: ListeComponent | null = null;

	affSearch(sortie:any){
		if( this.list ){
			this.list.clearElem();
			this.list.ajouterElem(
				"Type d'événements",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				""
			);
			for( const res of sortie.Typeevents ){
				this.list.ajouterElem(
					"" + res,
					"",
					"",
					"",
					"",
					"",
					"",
					"Genres",
					"Artistes"
				);
			}
			this.list.ajouterElem(
				"Lieux",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				""
			);
			for( const res of sortie.Areas ){
				this.list.ajouterElem(
					"" + res,
					"",
					"",
					"",
					"",
					"",
					"",
					"Genres",
					"Artistes"
				);
			}
			this.list.ajouterElem(
				"Événements",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				""
			);
			for( const res of sortie.Events ){
				this.list.ajouterElem(
					"" + res,
					"",
					"",
					"",
					"",
					"",
					"",
					"Genres",
					"Artistes"
				);
			}
		}
	}

	constructor() { }

	changeList(list: ListeComponent | null){
		this.list = list;
	}
}
