import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConsommationService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getDernierConsommation() : Observable<number>{
    return this.http.get<any>(`${this.apiServerUrl}/conso/dernier_conso`);
  }

  public getRendementByPosteDate(dateDeb:number,dateFin:number,idPoste:number) : Observable<number[]>{
    return this.http.get<any>(`${this.apiServerUrl}/conso/rendement?dateDeb=${dateDeb}&dateFin=${dateFin}&idPoste=${idPoste}`);
  }

  public getConsoPosteByDate(dateDeb:number,dateFin:number,idPoste:number) : Observable<number[]>{
    return this.http.get<any>(`${this.apiServerUrl}/conso/poste?dateDeb=${dateDeb}&dateFin=${dateFin}&idPoste=${idPoste}`);
  }

  public getConsoClientsByPoste(dateDeb:number,dateFin:number,idPoste:number) : Observable<number[]>{
    return this.http.get<any>(`${this.apiServerUrl}/conso/clients?dateDeb=${dateDeb}&dateFin=${dateFin}&idPoste=${idPoste}`);
  }

  public getConsoPostesByDelegDate(deleg:number,dateConso:number) :  Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/conso/conso_deleg?deleg=${deleg}&date=${dateConso}`);
  }

}
