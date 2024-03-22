import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {ConsoleLogger} from "@angular/compiler-cli";

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  animationTriggered = new Subject<void>();

  constructor() { }

  triggerAnimation() {
    console.log("Click event");
    this.animationTriggered.next();
  }
}