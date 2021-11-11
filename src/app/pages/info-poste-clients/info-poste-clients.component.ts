import {Component, OnInit} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {MY_FORMATS} from "@pages/consommation/consommation.component";
import {FormControl, Validators} from "@angular/forms";
import {Moment} from "moment";
import {HttpErrorResponse} from "@angular/common/http";
import {PosteService} from "@services/poste.service";
import {ConsommationService} from "@services/consommation.service";
import {ToastrService} from "ngx-toastr";


export const COLORS = [
  "#42A5F5",
  "#66BB6A",
  "#FFA726",
  "#26C6DA",
  "#7E57C2",
  '#5EFF33',
  '#EB7F72',
  '#951847'];

@Component({
  selector: 'app-info-poste-clients',
  templateUrl: './info-poste-clients.component.html',
  styleUrls: ['./info-poste-clients.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class InfoPosteClientsComponent implements OnInit{

  delegations: number[];
  selectedDeleg: number;
  formatDate : number;
  consoData: any;
  nbrPostesData: any;
  nbrClientsData: any;

  delegControl = new FormControl('', Validators.required);

  date = new FormControl();



  ngOnInit(){
    this.getDelegations();
    this.getNbrPostesClientsByDeleg();
  }

  constructor(private posteService: PosteService,
              private consommationService: ConsommationService,
              private toastr: ToastrService) {
  }


  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: any) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }



  format(date) {
    date = new Date(date);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    this.formatDate = parseInt(year + month);
  }

  getDelegations(){
    this.posteService.getAllDeleg().subscribe(
      (response:number[])=>{
        this.delegations=response;
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }

  getDateLabels(dateConso:number,nbrJours:number){
    let listeDesJours : string[] = [];
    let year = dateConso.toString().slice(0,4);
    let month = dateConso.toString().slice(4,6);
    for(let i=1;i<=nbrJours;i++){
      if(i<9){
        listeDesJours.push(year+'-'+month+'-'+'0'+i);
      }
      else{
        listeDesJours.push(year+'-'+month+'-'+i);
      }
    }

    return listeDesJours;
  }

  getConsoPostesByDeleg(deleg:number,dateConso:number){
    this.consommationService.getConsoPostesByDelegDate(deleg,dateConso).subscribe(
      (response:number[])=>{

        this.consoData = {
          labels: this.getDateLabels(dateConso,response.length),
          datasets: [
            {
              label: 'Consommation (kWh)',
              data: response,
              fill: false,
              borderColor: '#42A5F5'
            }
          ]
        }
      },(error: HttpErrorResponse)=>{this.toastr.error('Vous devez selectionner tous les champs');}
    )
  }

  getNbrPostesClientsByDeleg(){
    this.posteService.getNbrPostesClientsByDeleg().subscribe(
      (response:number[][])=>{
        this.nbrPostesData = {
          datasets: [{
            data: this.getNbrPostes(response),
            backgroundColor: COLORS,
            label: 'Postes'
          }],
          labels: this.getDeleg(response)
        };
        this.nbrClientsData = {
          datasets: [{
            data: this.getNbrClients(response),
            backgroundColor: COLORS,
            label: 'Clients'
          }],
          labels: this.getDeleg(response)
        };
      }
  )
  }

  getDeleg(response : number[][]){
    let delegs : string[] = [];
    for(let i=0;i<response.length;i++){
      delegs.push('deleg : '+response[i][0]);
    }
    return delegs;
  }

  getNbrPostes(response : number[][]){
    let nbrPostes : number[] = [];
    for(let i=0;i<response.length;i++){
      nbrPostes.push(response[i][1]);
    }
    return nbrPostes;
  }

  getNbrClients(response : number[][]){
    let nbrClients : number[] = [];
    for(let i=0;i<response.length;i++){
      nbrClients.push(response[i][2]);
    }
    return nbrClients;
  }

  onFormSubmit() {

    this.format(this.date.value);
    this.getConsoPostesByDeleg(this.selectedDeleg,this.formatDate);

  }

}
