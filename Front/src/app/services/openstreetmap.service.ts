import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {ConsoleLogger} from "@angular/compiler-cli";

@Injectable({
	providedIn: 'root'
})

export class OpenstreetmapService {
	private clearPinsSource = new Subject<void>();
	clearPins$ = this.clearPinsSource.asObservable();

	private placePinSource = new Subject<{ x: any; y: any; name: string; }>();
	placePin$ = this.placePinSource.asObservable();

	clearPins() {
		this.clearPinsSource.next();
	}

	putPin(x: any, y: any, name: string) {
		this.placePinSource.next({ x, y, name });
	}
}
