import { Component, OnInit, Inject } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { GRNPo } from "app/grn-po/grnpo";
import { GRNPoItem } from "app/grn-po/grnpoitem";
import { GRNHelper } from "app/grn-po/grn-helper";
import { Router } from "@angular/router";
import DataSource from 'devextreme/data/data_source'
import { AuthserviceService } from "app/authservice.service";


@Component({
  selector: 'app-grn-po',
  templateUrl: './grn-po.component.html',
  styleUrls: ['./grn-po.component.css']
  
})
export class GrnPoComponent implements OnInit {

  grnpo:GRNPo=null;
  grnpoitem:GRNPoItem=null;
  polist:GRNPo[]=[];
  poitem:GRNPoItem[]=[];
  dataSource:any;

  constructor(private auth:AuthserviceService,
              private http:Http,
              private grnhelp:GRNHelper,
              private route:Router,
              @Inject('API_URL') private apiUrl:string) { }
  
  ngOnInit() {
    this.auth.titleChanged.next('GOOD RECEIPT');   
    this.getGRNPo();
  }
  
  getGRNPo() {    
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');     
    this.http.get(this.apiUrl+'api/inventory/grnpo',{ headers: headers })
      .subscribe(
      (resp)=>{
        this.polist =resp.json();   
         if (localStorage.getItem('_pono')!=null){
          var foundpo = this.polist.find((x)=>x.poNo==localStorage.getItem('_pono'));
          localStorage.removeItem('_pono');
          this.updateObjValue2(foundpo);
         }
      },
      (err)=>{
         console.log(err)
       }
    );
   }
  

   isGRN_Null():boolean{
     return this.grnpo!=null;
   }
   isGRNItem_Null():boolean{
     return this.grnpoitem!=null;
   }
   getGRNPoItems(pono:string,porel:string) {    
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     const url =this.apiUrl+'api/inventory/grnpoitem?pono='+pono+'&porel='+porel;
      console.log('get item '+url);
    this.http.get(url,{ headers: headers })
      .subscribe(
      (resp)=>{
        this.poitem =resp.json();
         if (localStorage.getItem('_poitemcode')!=null){
          var founditem = this.poitem.find((x)=>x.iCode==localStorage.getItem('_poitemcode'));
          localStorage.removeItem('_poitemcode');
          this.updateObjValue3(founditem);
         } 
      },
      (err)=>{
         console.log(err)
       }
    );
   }

    updateObjValue2(item) {
     // console.log(item);
      this.grnpo= item;
      this.getGRNPoItems(this.grnpo.poNo,this.grnpo.poRelNo);
      this.grnhelp.poChanged.next({'pono':this.grnpo.poNo,'porel':this.grnpo.poRelNo});
    }

    updateObjValue3(item) {
     // console.log(item);
      this.grnpoitem= item;    
    }

    onGrnHisClick(){
      if (this.grnpo!=null){
          localStorage.setItem('_pono', this.grnpo.poNo)
          if (this.grnpoitem!=null){
            localStorage.setItem('_poitemcode', this.grnpoitem.iCode)
          }
          this.route.navigate(['/grnhis',this.grnpo.poNo]);
      }
    }
    
     onCancel(){
      this.route.navigate(['/main']);
    }
   
}
