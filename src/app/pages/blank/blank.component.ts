import {AfterViewInit, Component} from '@angular/core';
import {PosteService} from "@services/poste.service";
import {Poste} from "@/Model/Poste";
import {HttpErrorResponse} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from 'ngx-toastr';
import {SharedDataService} from "@services/shared-data.service";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss']
})

export class BlankComponent implements AfterViewInit{

  public postes: Poste[];
  public currentPage = 0;
  public totalPages : number;
  public totalElements: number;
  public firstPage : boolean;
  public lastPage : boolean;
  public allFilter : boolean;
  public libelleFilter : boolean;
  public nbClientsFilter : boolean;
  public pasDePosFilter : boolean;
  public searchFilter : boolean;
  public searchValue : string = '';
  public posteDeleted : Poste;
  public newPoste : Poste;

  closeResult: string = '';


  constructor(private posteService: PosteService, private modalService: NgbModal,
              private toastr: ToastrService,private sharedDataService:SharedDataService) {
  }

  ngAfterViewInit(): void {
    this.getPostes();
  }

  public refrechContent(response){
    this.postes=response["content"];
    this.currentPage=response["number"];
    this.totalPages=response["totalPages"];
    this.firstPage=response["first"];
    this.lastPage=response["last"];
    this.totalElements=response["totalElements"];
  }

  public getPostes() : void{
    this.searchValue = '';
    this.posteService.getAllPostesByPage(this.currentPage).subscribe(
      (response)=>{
        this.refrechContent(response);
        this.allFilter=true;
        this.libelleFilter=false;
        this.pasDePosFilter=false;
        this.nbClientsFilter=false;
        this.searchFilter=false;
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }

  getByLibelle() :void {
    this.searchValue = '';
    this.posteService.getAllPostesByLibelle(this.currentPage).subscribe(
      (response)=>{
        this.refrechContent(response);
        this.allFilter=false;
        this.libelleFilter=true;
        this.pasDePosFilter=false;
        this.nbClientsFilter=false;
        this.searchFilter=false;
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }

  getWithoutPosition() : void {
    this.searchValue = '';
    this.posteService.getAllPostesWithoutPos(this.currentPage).subscribe(
      (response)=>{
        this.refrechContent(response);
        this.allFilter=false;
        this.libelleFilter=false;
        this.pasDePosFilter=true;
        this.nbClientsFilter=false;
        this.searchFilter=false;
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }

  getByNbClients() {
    this.searchValue = '';
    this.posteService.getAllPostesByNbClients(this.currentPage).subscribe(
      (response)=>{
        this.refrechContent(response);
        this.allFilter=false;
        this.libelleFilter=false;
        this.pasDePosFilter=false;
        this.nbClientsFilter=true;
        this.searchFilter=false;
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }

  public getBySearch(value:string) : void{
    this.posteService.getAllPostesBySearch(this.currentPage,value).subscribe(
      (response)=>{
        this.refrechContent(response);
        this.allFilter=false;
        this.libelleFilter=false;
        this.pasDePosFilter=false;
        this.nbClientsFilter=false;
        this.searchFilter=true;
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }

  getData(){
    if(this.allFilter){
      this.getPostes();
    } else if (this.libelleFilter){
      this.getByLibelle();
    }else if (this.nbClientsFilter){
      this.getByNbClients();
    }else if (this.pasDePosFilter){
      this.getWithoutPosition();
    }else if (this.searchFilter){
      this.getBySearch(this.searchValue);
    }
  }

  getAll() {
    this.currentPage=0;
    this.getPostes();
  }


  //-------------Pagination methods
  getDeb() {
    this.currentPage=0;
    this.getData();

  }

  getPrec() {
    this.currentPage=this.currentPage-1;
    this.getData();
  }

  getSuiv() {
    this.currentPage=this.currentPage+1;
    this.getData();
  }

  getFin() {
    this.currentPage=this.totalPages-1;
    this.getData();
  }

  //---------------------------------

  changeValue(poste: Poste) {
    this.posteDeleted=poste;
  }

  // OperationS
  delete() {
    this.posteService.deletePoste(this.posteDeleted.id_poste).subscribe(
      (response)=>{
        this.getPostes();
        this.toastr.success('Le poste : '+this.posteDeleted.libelle+' a été bien supprimé');
        this.modalService.dismissAll();
      },
      (error: HttpErrorResponse)=>{alert(error.message)}
    );
  }



  // About Modals
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  redirectToMarker(p: Poste) {
    this.sharedDataService.setPosteShared(p);
  }


  onSubmit(addForm: NgForm) {

    let newPoste = {
      "libelle": addForm.value['libelle'],
      "type_poste": addForm.value['type_poste'],
      "loc_id": 0,
      "code_point": 0,
      "gsm": addForm.value['gsm'],
      "id_sig": 0,
      "id_prao": addForm.value['id_prao'],
      "x": 0.0,
      "y": 0.0,
      "rendement": 0.0,
      "conso_clients": 0,
      "conso_poste": 0,
      "date_rlv": 0,
      "indice_rend": 0,
      "ref_dlg": parseInt(addForm.value['ref_dlg']),
      "fiabilise": "",
      "nb_clients": parseInt(addForm.value['nb_clients']),
      "y_gps": 0.0,
      "x_gps": 0.0
    };

    this.posteService.addPoste(newPoste).subscribe(
      (response)=>{
        this.toastr.success('Le poste : '+addForm.value['libelle']+' a été bien ajouté');
        this.modalService.dismissAll();
      },
      (error: HttpErrorResponse)=>{this.toastr.error("Le poste :"+addForm.value['libelle']+" est déjà existant");}
    );
  }

  changeIdPosteConso(id_poste: number) {
    this.sharedDataService.setidPosteConso(id_poste);
  }

  changeNomPosteConso(libelle: string) {
    this.sharedDataService.setnomPosteConso(libelle);
  }
}
