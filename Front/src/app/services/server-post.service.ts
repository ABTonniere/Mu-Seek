import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {ListeComponent} from "../App/liste/liste.component";
import {OpenstreetmapComponent} from "../App/openstreetmap/openstreetmap.component";

@Injectable({
	providedIn: 'root'
})

export class ServerPOSTService {
	REST_API: string = 'http://localhost:3080/Events';
	OSM: OpenstreetmapComponent | null = null;
	list: ListeComponent | null = null;
	lastResult: any[] = [];

	constructor(private httpClient: HttpClient) { }

	changeMap(map: OpenstreetmapComponent | null){
		this.OSM = map;
	}
	changeList(list: ListeComponent | null){
		this.list = list;
	}

	find(req: String){
		const query:string = `${this.REST_API}/search?req=${req}`;
		console.log('ServerPOSTService#find#query : ',query);
		return this.httpClient.get<any[]>(query);
	}

	GetEvents(longitude:number,latitude:number,reload:boolean) {
		console.log("che zpas koi mettre");
		if( reload ){ // Rechargé la liste des événements.
			// Préparer la nouvelle demande.
			const query = `${this.REST_API}/get?lon=${longitude}&lat=${latitude}`;
			console.log('ServerPOSTService#GetEvents#query : ',query);
			// Envoyé la demande au server.
			this.lastResult = [];
			this.httpClient.get<any[]>(query).subscribe(result => {
				if( result.length === 0 ){
					console.error("ServerPOSTService#GetEvents#result_api : ",result);
				} else {
					console.log("ServerPOSTService#GetEvents#result_api : ",result);
					this.lastResult = result;
				}
				// Rafraichire la carte.
				if( this.OSM ){
					console.log('ServerPOSTService#GetEvents#refreshOSM');
					// Nettoyé tout les vieux pins
					this.OSM.clearPins();
					// Affiché les nouveaux pins
					for( const res of this.lastResult ){
						console.log(res);
						this.OSM.putPin(res.area.coordinates.latitude, res.area.coordinates.longitude, res.nom);
					}
				}
				// Rafraichire la liste
				if( this.list ){
					console.log('ServerPOSTService#GetEvents#listElem');
					// Supprimer les vieux éléments
					this.list.clearElem();
					// Créer les nouveaux éléments
					for( const res of this.lastResult ){
						//ajouterElem(titre: string, description: string, lieu: string, date: string, type: string, genre: string, artiste: string)
						//res.nom, res.typeevents, res._id, res.lifeSpan.begin, res.lifeSpan.end, res.area.nom, res.area.adresse, res.urls
						let LstUrls = "";
						for( const url of res.urls ){
							LstUrls+= url.nom + "\n";
						}
						if(res.nom != "[concert]"){
							this.list.ajouterElem(
								"" + res.nom,
								"" + LstUrls,
								res.area.nom + " : " + res.area.adresse,
								res.area.coordinates.longitude,
								res.area.coordinates.latitude,
								new Date(res.lifeSpan.begin).toLocaleDateString() + " - " + new Date(res.lifeSpan.end).toLocaleDateString(),
								"" + res.typeevents,
								"Genres",
								"Artistes"
							);
						}
					}
				}
			});
			if( (!this.lastResult) || (this.lastResult.length===0) ){
				console.error("ServerPOSTService#GetEvents#lastResult : ",this.lastResult);
				return this.lastResult;
			}
		}
		// Déplacer la vue de la carte.
		//if( this.OSM ){
		//this.OSM.goTo([longitude,latitude],13);
		//}
		return this.lastResult;
	}
}
