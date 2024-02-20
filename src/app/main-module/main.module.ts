import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElemListeComponent } from "../App/elem-liste/elem-liste.component";
import { SearchBarComponent } from "../App/search-bar/search-bar.component";
import { ListeComponent } from "../App/liste/liste.component"


@NgModule({
  declarations: [ElemListeComponent, SearchBarComponent, ListeComponent],
  imports: [
    CommonModule
  ],
  exports: [ElemListeComponent, SearchBarComponent, ListeComponent]
})
export class MainModule { }
