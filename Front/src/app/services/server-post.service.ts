import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class ServerPOSTService {
	// Node/Express API
	REST_API: string = 'http://localhost:3080/Events';

	constructor(private httpClient: HttpClient) { }

	GetEvents() {
		const result_api = this.httpClient.get(`${this.REST_API}`);
		console.log('ServerPOSTService#GetEvents : ',result_api);
		return result_api;
	}
}
