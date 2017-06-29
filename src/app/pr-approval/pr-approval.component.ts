import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Http,Headers } from "@angular/http";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";

import { AuthserviceService } from "app/authservice.service";
import { PRAppr } from "app/pr-approval/prappr";

@Component({
  selector: 'app-pr-approval',
  templateUrl: './pr-approval.component.html',
  styleUrls: ['./pr-approval.component.css']
})
export class PrApprovalComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid:DxDataGridComponent
  prlist:PRAppr[]=[];
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
}
