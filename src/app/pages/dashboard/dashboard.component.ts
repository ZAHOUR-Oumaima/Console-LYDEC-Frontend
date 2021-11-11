import {Component, OnInit} from '@angular/core';
import {Poste} from "@/Model/Poste";
import {PosteService} from "@services/poste.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SharedDataService} from "@services/shared-data.service";
import {ToastrService} from "ngx-toastr";
import 'leaflet';
import 'leaflet-routing-machine';
import {ConsommationService} from "@services/consommation.service";
declare let L;

// default icon (blue)
let iconDefault = L.icon({
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',

  iconSize:     [25, 41], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor:  [1, -34] // point from which the popup should open relative to the iconAnchor
});
// red icon
let redIcon = L.icon({
  iconUrl: 'assets/destination.png',
  shadowUrl: 'assets/marker-shadow.png',

  iconSize:     [25, 41], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor:  [1, -34] // point from which the popup should open relative to the iconAnchor
});
// user icon
let userIcon = L.icon({
  iconUrl: 'https://assets.mapquestapi.com/icon/v2/flag-Moi-3B5998-22407F-lg.png',
  popupAnchor:  [1, -34] // point from which the popup should open relative to the iconAnchor
});



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  public postes: Poste[];
	public map;
	public posteInfo : Poste;
  public delegations: number[];
  public selectedDeleg: number;
  public markerGroup;
  public positionGroup;
  public rangeValues: number[] = [0,100];
  public dernierConsommation: number;



  constructor(private posteService: PosteService,private sharedDataService:SharedDataService,
              private consommationService: ConsommationService ,private toastr: ToastrService) {
    this.selectedDeleg=0;
    this.getDernierConsoPostes();
  }


  createMap(){
		const Casablanca = {
			lat : 33.5731104,
			lng : -7.5898434
		};

		const ZoomLevel = 12;
		this.map = L.map('map',{
			center: [Casablanca.lat, Casablanca.lng],
			zoom: ZoomLevel
		});

		const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	      minZoom: 11,
	      maxZoom: 17,
	      attribution: '&copy; Carte LYDEC '
	    });
		mainLayer.addTo(this.map);
		this.getPostes();
	}

  public getPostes() : void{
    this.markerGroup = L.layerGroup().addTo(this.map);
    this.positionGroup = L.layerGroup().addTo(this.map);
    this.posteInfo = this.sharedDataService.getPosteShared();
    if(this.posteInfo!=null){
      L.marker({lat:this.posteInfo.y_gps ,lng:this.posteInfo.x_gps}, {icon: redIcon}).addTo(this.map).bindPopup('<b>Poste :</b> '+this.posteInfo.libelle.toString()+'<br>'+'<b>Nombre de clients :</b> '
        +this.posteInfo.nb_clients+'<br><b>Fiable :</b> '+this.posteInfo.fiabilise+'<br><b>Consommation du poste :</b> '+this.posteInfo.conso_poste
        +' KWH<br><b>Consommtion des clients :</b> '+this.posteInfo.conso_clients+' KWH<br><b>Rendement :</b> '+this.posteInfo.rendement,{
        closeButton: true
      });
      this.userPosition();
      // zone sensible ?

    }
    this.posteService.getPostesByDeleg(this.selectedDeleg).subscribe(
      (response: Poste[])=>{
        this.postes=response;
        for (let p of response) {
          if(p.rendement>=this.rangeValues[0] && p.rendement<=this.rangeValues[1]){
            L.marker({lat: p.y_gps, lng: p.x_gps}, {icon: iconDefault}).addTo(this.markerGroup).bindPopup('<b>Poste :</b> ' + p.libelle.toString() + '<br>' + '<b>Nombre de clients :</b> '
              + p.nb_clients + '<br><b>Fiable :</b> ' + p.fiabilise + '<br><b>Consommation du poste :</b> ' + p.conso_poste
              + ' KWH<br><b>Consommtion des clients :</b> ' + p.conso_clients + ' KWH<br><b>Rendement :</b> ' + p.rendement, {
              closeButton: true
            });
          }
        }
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }

  getDelegations(){
    this.posteService.getAllDeleg().subscribe(
      (response:number[])=>{
        this.delegations=response;
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }

  ngOnInit(): void {
    this.getDelegations();
    this.getDernierConsoPostes();
    this.createMap();
    if(!navigator.geolocation){
      this.toastr.error('Vous devez activer la géolocalisation dans votre navigateur');
    }
    else{
      this.userPosition();
    }
  }


  getPostesByDeleg() {
    this.markerGroup.clearLayers();
    if(this.selectedDeleg!=0) {
      this.getPostes();
    }
  }

  userPosition(){
    navigator.geolocation.watchPosition(
      (position)=>{
        this.positionGroup.clearLayers();
        L.marker({lat: position.coords.latitude, lng: position.coords.longitude}, {icon: userIcon})
          .addTo(this.positionGroup).bindPopup('Moi',{closeButton: true});
        if(this.posteInfo!=null){
          L.Routing.control({
            waypoints: [
              L.latLng(position.coords.latitude, position.coords.longitude),
              L.latLng(this.posteInfo.y_gps,this.posteInfo.x_gps)
            ],
            addWaypoints: false,
            routeWhileDragging: true,
            draggableWaypoints: false,
            show: false,
            collapsible: true,
            lineOptions : {
              styles: [{
                color: '#D33C3C',
                opacity: 1,
                weight: 7
              }]
            },
            createMarker: function() { return null; }
          }).addTo(this.map);
        }
      },(error)=>{
        this.toastr.error(''+error);
        console.log(error);
      },{
        enableHighAccuracy:true,
        maximumAge: 0
      }
    )
  }

  //----------------------------------- fullscreen Map
  getFullScreenElement(){
    return document.fullscreenElement;
  }


  fullScreen() {
    if(this.getFullScreenElement()){
      document.exitFullscreen().then(r => {});
    }
    else{
      document.getElementById("map").requestFullscreen().then(r => {});
    }
  }


  // dernier consommation de tous les postes
  getDernierConsoPostes(){
    this.consommationService.getDernierConsommation().subscribe(
      (response:number)=>{
        this.dernierConsommation=response;
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    )
  }


}
