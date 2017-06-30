import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Http,Headers } from "@angular/http";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthserviceService } from "app/authservice.service";
import { PRAppr } from "app/pr-approval/prappr";
import { CanComponentDeactivate } from "app/canDeactivateGuard";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-pr-approval',
  templateUrl: './pr-approval.component.html',
  styleUrls: ['./pr-approval.component.css']
})
export class PrApprovalComponent implements OnInit,CanComponentDeactivate {
  @ViewChild(DxDataGridComponent) dataGrid:DxDataGridComponent
  prlist:PRAppr[]=[];
  rform:FormGroup;  
  isNeedAppr:boolean;
  changesSaved = false;
  // [columns]="['date', 'prno', 'vendname']"
  columns = [
       { dataField: 'tick', dataType: 'boolean', caption: ' ',width:25 },
        { dataField: 'date', caption: 'DATE',width:90 },
        { dataField: 'prno', caption:'PR NO',width:90 },
        { dataField: 'vendname',caption:'SUPPLIER'}        
    ];
  
  constructor(private auth:AuthserviceService,
              private http:Http,
              private route:Router,
              @Inject('API_URL') private apiUrl:string) { }

  ngOnInit() {
     this.auth.titleChanged.next('PR APPROVAL');   
     this.isNeedAppr = false;
     this.rform = new FormGroup({
       pass: new FormControl(null, Validators.required)       
     });
    this.getPRApprs();
  }
  
   getPRApprs() {    
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');   
     console.log(this.apiUrl+'api/purchase/aprs?id='+this.auth.getUserID());
     this.http.get(this.apiUrl+'api/purchase/aprs?id='+this.auth.getUserID(),
                 { headers: headers })
                  .subscribe(
                    (resp)=>{
                      this.prlist =resp.json();            
                    },
                    (err)=>{
                      console.log(err)
                    }
            );
   }
    
   oncellClick(e){
     console.log(e);
     if (e.columnIndex==0){
          var found= this.prlist.find(x=>x.prno==e.data.prno);
          if (found!=null){
            found.tick=!found.tick; 
            this.dataGrid.instance.refresh();
        }
     }else{     
       this.route.navigate(['/pritem',e.data.prno]);
     }

   } 
  
   onCancel(){
      this.route.navigate(['/main']);
   }

   onApprove(){
      this.isNeedAppr = true;
      this.changesSaved = true;
      this.submitApproval();
   }

   isPRSelected(){
     return this.prlist.filter(x=>x.tick==true).length >0;
   }

   canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
      console.log('canDeactivate');
      if (this.isPRSelected() && !this.changesSaved){
        return confirm('Do you want to discard the changes?');
      } else {
        return true;
      }    
  };

  submitApproval(){
    const URL =  this.apiUrl+'api/purchase/prappr';
        let data = JSON.stringify(
              {	"userid":this.auth.getUserID(),
                "pass":this.rform.value.pass,
                "prnos":this.prlist.filter(x=>x.tick==true).map(x=>x.prno).toString()
              });        
         let headers = new Headers();
         headers.append('Content-Type','application/json');         
         
        this.http.post(URL, data,{headers:headers})
            .subscribe(
                (resp) =>{
                  try{
                      let strs= resp.json();
                      console.log(strs);
                  }catch(e){
                    error => console.log(e);                   
                  }
                  
                },
                (error) =>{
                  console.log(error)                
                }
         )    
  }

}
