import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ElemListeComponent } from "../App/elem-liste/elem-liste.component";
import { SearchBarComponent } from "../App/search-bar/search-bar.component";
import { ListeComponent } from "../App/liste/liste.component"
import {OpenstreetmapComponent} from "../App/openstreetmap/openstreetmap.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [ElemListeComponent, SearchBarComponent, ListeComponent, OpenstreetmapComponent],
    imports: [
        CommonModule,
        NgOptimizedImage,
    ],
  exports: [ElemListeComponent, SearchBarComponent, ListeComponent, OpenstreetmapComponent]
})
export class AppModule { }
