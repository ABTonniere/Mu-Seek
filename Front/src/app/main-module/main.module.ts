import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElemListeComponent } from "../App/elem-liste/elem-liste.component";
import { SearchBarComponent } from "../App/search-bar/search-bar.component";
import { ListeComponent } from "../App/liste/liste.component"
import {MapComponent} from "../App/map/map.component";


@NgModule({
  declarations: [ElemListeComponent, SearchBarComponent, ListeComponent, MapComponent],
  imports: [
    CommonModule
  ],
  exports: [ElemListeComponent, SearchBarComponent, ListeComponent, MapComponent]
})
export class MainModule { }
