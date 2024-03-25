import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as L from 'leaflet';
import {AnimationService} from "../../services/animation.service";
import {OpenstreetmapService} from "../../services/openstreetmap.service";
import {ServerPOSTService} from "../../services/server-post.service";

@Component({
	selector: 'app-openstreetmap',
	templateUrl: './openstreetmap.component.html',
	styleUrls: ['./openstreetmap.component.css'],
	animations: [
		trigger('fadeOut', [
			transition(':leave', [
				animate('0.6s ease-out', style({ opacity: 0 }))
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

	constructor(private animationService: AnimationService, private openstreetmapService: OpenstreetmapService, private server: ServerPOSTService) { }

	ngOnInit() {
		this.server.changeMap(this);

		this.animationService.animationTriggered.subscribe(() => {
			this.playAnimation = false;
			//animation service
			this.openstreetmapService.clearPins$.subscribe(() => {
				this.clearPins();
			});

			// openstreetmap service
			this.openstreetmapService.placePin$.subscribe(({ x, y, name }) => {
				this.putPin(x, y, name);
				this.zoomToCoordinate(x,y,10);
			});
		});

		this.map = L.map('map').setView([48.01845, 0.160852], 13);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			minZoom: 5,
			maxZoom: 18,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(this.map);

		this.map.zoomControl.remove(); //supprimer les boutons de zoom/dézoom
		this.markers = L.layerGroup();
		this.markers.addTo(this.map);
		this.putPin(48.01845, 0.160852, 'TEST')

		this.map.on('dblclick', (event: any) => {
			const latlng = event.latlng;
			this.server.GetEvents(latlng.lng,latlng.lat,true);
		});
	}
	public putPin(x: any, y: any, name: string) {
		const myIcon = L.icon({
			iconUrl: 'https://i.imgur.com/vhu2eYZ.png',
			iconSize: [50, 70],
			iconAnchor: [25, 70],
		});
		let marker = L.marker([x, y], { icon: myIcon }).addTo(this.map).openPopup();
		this.markers.addLayer(marker);
		this.zoomToCoordinate(x, y, 10);
	}

	public zoomToCoordinate(latitude: any, longitude: any, zoomLevel: any) {
		this.map.setView([latitude, longitude], zoomLevel);
	}

	public clearPins() {
		this.map.removeLayer(this.markers);
		this.markers = L.layerGroup();
		this.markers.addTo(this.map);
	}
}
