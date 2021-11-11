import {Component, OnInit} from '@angular/core';
import {SharedDataService} from "@services/shared-data.service";

@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent {


    constructor(private sharedDataService:SharedDataService) {}


  resetMarkerInfo() {
    this.sharedDataService.setPosteShared(null);
  }
}
