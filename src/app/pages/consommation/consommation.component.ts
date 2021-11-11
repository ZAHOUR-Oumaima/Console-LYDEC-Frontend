import {Component, OnInit} from '@angular/core';
import {SharedDataService} from "@services/shared-data.service";
import {ConsommationService} from "@services/consommation.service";
import {FormControl, FormGroup} from "@angular/forms";

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM',
  },
  display: {
    dateInput: 'YYYY/MM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

@Component({
  selector: 'app-consommation',
  templateUrl: './consommation.component.html',
  styleUrls: ['./consommation.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ConsommationComponent implements OnInit{

  range = new FormGroup({
    // @ts-ignore
    start: new FormControl(moment()),
    // @ts-ignore
    end: new FormControl(moment())
  });

  rendementData: any;

  consoData: any;


  idPoste : number;
  nomPoste : string;
  rendements : number[];
  consoPoste : number[];
  consoClients : number[];

  dateDeb : number;
  dateFin : number;


  constructor(private sharedDataService:SharedDataService,private consommationService: ConsommationService) {

  }

  getMounth(date:number){
    let dateStr : string = date.toString();
    let mounthStr = '';
    for(let i = 4 ; i <= 5 ; i++){
      mounthStr = mounthStr + dateStr[i] ;
    }
    return parseInt(mounthStr);
  }

  getYear(date:number){
    let dateStr : string = date.toString();
    let yearStr = '';
    for(let i = 0 ; i <= 3 ; i++){
      yearStr = yearStr + dateStr[i] ;
    }
    return parseInt(yearStr);
  }

  getMounthLabels(dateDeb:number, dateFin:number){

    let mounths = [];
    let date = dateDeb;
    let mounth = this.getMounth(date);
    let year = this.getYear(date);

    while (date<=dateFin){
      while (mounth<=12 && date<=dateFin ){
        mounths.push(year+'-'+mounth)
        mounth = mounth + 1;
        date = date + 1;
      }
      if(date<=dateFin){
        year = year + 1;
        mounth = 1;
        date = parseInt(year.toString()+'01');
      }
    }

    return mounths;

  }

  getConsoByPosteDate(dateDeb,dateFin,idPoste){
    this.consommationService.getConsoPosteByDate(dateDeb,dateFin,idPoste).subscribe(
      (response:number[])=>{
        this.consoPoste=response;

        this.consommationService.getConsoClientsByPoste(dateDeb,dateFin,idPoste).subscribe(
          (response:number[])=>{
            this.consoClients=response;

            this.consoData = {
              labels: this.getMounthLabels(dateDeb,dateFin),
              datasets: [
                {
                  label: 'Poste (kWh)',
                  data: this.consoPoste,
                  fill: false,
                  borderColor: '#68ea18'
                },
                {
                  label: 'Clients (kWh)',
                  data: this.consoClients,
                  fill: false,
                  borderColor: '#aa1c49'
                }
              ]
            }

          }
        )
      }
    )
  }

  getRendementByPosteDate(dateDeb,dateFin,idPoste){
    this.consommationService.getRendementByPosteDate(dateDeb,dateFin,idPoste).subscribe(

      (response:number[])=>{

        this.rendements=response;

        this.rendementData = {
          labels: this.getMounthLabels(dateDeb,dateFin),
          datasets: [
            {
              label: 'Rendement (%)',
              data: this.rendements,
              fill: false,
              borderColor: '#42A5F5'
            }
          ]
        }

      }

    )
  }

  ngOnInit() {

    this.idPoste=this.sharedDataService.getidPosteConso();
    this.nomPoste=this.sharedDataService.getnomPosteConso();

  }


  onFormSubmit() {
    this.getDate();
    this.getRendementByPosteDate(this.dateDeb,this.dateFin,this.idPoste);
    this.getConsoByPosteDate(this.dateDeb,this.dateFin,this.idPoste);
  }

  getDate(){
    let dateDebStr = this.range.value.start.toString();
    let dateFinStr = this.range.value.end.toString();
    let monthDebStr = '';
    let monthFinStr = '';
    let yearDebStr = '';
    let yearFinStr = '';

    for(let i=4;i<=6;i++){
      monthDebStr = monthDebStr + dateDebStr[i];
      monthFinStr = monthFinStr + dateFinStr[i];
    }
    for(let i=11;i<=14;i++){
      yearDebStr = yearDebStr + dateDebStr[i];
      yearFinStr = yearFinStr + dateFinStr[i];
    }
    monthDebStr = this.convertMonth(monthDebStr);
    monthFinStr = this.convertMonth(monthFinStr);

    this.dateDeb = parseInt(yearDebStr+monthDebStr);
    this.dateFin = parseInt(yearFinStr+monthFinStr);

  }

  convertMonth(month:string){
    if(MONTHS.indexOf(month)+1<10){
      return '0'+(MONTHS.indexOf(month)+1).toString();
    }
    return (MONTHS.indexOf(month)+1).toString();
  }



}
