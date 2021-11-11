import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";
import {Poste} from "@/Model/Poste";


@Injectable({
  providedIn: 'root'
})
export class PosteService {


  private apiServerUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getAllPostesByPage(page:number) : Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/postes/allByPage?page=${page}`);
  }

  public getAllPostesWithPos() : Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/postes/allNotNull`);
  }

  public getAllPostesByLibelle(page:number) : Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/postes/allByPage?page=${page}&sortBy=libelle`);
  }

  public getAllPostesWithoutPos(page:number) : Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/postes/allWithoutPos?page=${page}`);
  }

  public getAllPostesByNbClients(page:number) : Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/postes/allByPage?page=${page}&sortBy=nbclients`);
  }

  public getAllPostesBySearch(page:number,libelle:string) : Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/postes/search?libelle=${libelle}&page=${page}`);
  }

  public addPoste(poste):Observable<any>{
    return this.http.post(`${this.apiServerUrl}/postes/add`,poste);
  }

  public deletePoste(id):Observable<any>{
    return this.http.delete(`${this.apiServerUrl}/postes/delete?id=${id}`);
  }

  public getAllDeleg(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/postes/delegations`);
  }

  public getPostesByDeleg(deleg:number): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/postes/posteByDelegation?deleg=${deleg}`);
  }

  public getNbrPostesClientsByDeleg() :  Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/postes/countByDeleg`);
  }

}
