import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as L from 'leaflet';
import {AnimationService} from "../../services/animation.service";
import {ServerPOSTService} from '../../services/server-post.service';

@Component({
	selector: 'app-openstreetmap',
	templateUrl: './openstreetmap.component.html',
	styleUrls: ['./openstreetmap.component.css'],
	animations: [
		trigger('fadeOut', [
			transition(':leave', [
				animate('500ms ease-out', style({ opacity: 0 }))
			]),
		])
	]
})

export class OpenstreetmapComponent implements OnInit {
	title = 'openstreetmap';
	map: any;
	markers: any;
	overlayState = 'void'; // État initial de l'overlay

	playAnimation: boolean = true;

	constructor(private animationService: AnimationService, private server: ServerPOSTService) { }

	ngOnInit() {
		this.server.changeMap(this);
		this.animationService.animationTriggered.subscribe(() => {
			this.playAnimation = false;
			console.log("Bien pris");
		});
		this.goTo([48.01845, 0.160852], 13);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			minZoom: 5,
			maxZoom: 18,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(this.map);
		this.map.zoomControl.remove(); //supprimer les boutons de zoom/dézoom
		this.markers = L.layerGroup();
		this.markers.addTo(this.map);
		this.putPin(48.01845, 0.160852, 'TEST')
	}

	public goTo(coords:[number,number], val:number){
		this.map = L.map('map').setView(coords, val);
	}

	public putPin(x: any, y: any, name: string) {
		const myIcon = L.icon({
			iconUrl: 'https://i.imgur.com/vhu2eYZ.png',
			iconSize: [50, 70],
			iconAnchor: [20, 70],
		});
		let marker = L.marker([x, y], { icon: myIcon }).addTo(this.map).openPopup();
		this.markers.addLayer(marker);
	}

	public clearPins() {
		this.map.removeLayer(this.markers);
		this.markers = L.layerGroup();
		this.markers.addTo(this.map);
	}

}
