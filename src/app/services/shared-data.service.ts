import { Injectable } from '@angular/core';
import {Poste} from "@/Model/Poste";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  posteShared : Poste;
  idPosteConso : number;
  nomPosteConso : string;

  constructor() { }

  public setPosteShared(poste:Poste){
    this.posteShared=poste;
  }

  public getPosteShared(){
    return this.posteShared;
  }

  public setidPosteConso(idPosteConso:number){
    this.idPosteConso=idPosteConso;
  }

  public getidPosteConso(){
    return this.idPosteConso;
  }


  public getnomPosteConso(): string {
    return this.nomPosteConso;
  }

  public setnomPosteConso(value: string) {
    this.nomPosteConso = value;
  }

}
