import { Component, OnInit, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from "@angular/http";
import { Router } from "@angular/router";
import DataSource from 'devextreme/data/data_source'
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthserviceService } from "app/authservice.service";

@Component({
  selector: 'app-item-code',
  templateUrl: './item-code.component.html',
  styleUrls: ['./item-code.component.css']
})
export class ItemCodeComponent implements OnInit {
  rform:FormGroup;  
  dataSource:any;
  imagepath:string;
  itemcode:string;
  constructor(private auth:AuthserviceService,
              private http:Http,
              private route:Router,
              @Inject('API_URL') private apiUrl:string) { }

  ngOnInit() {
    this.auth.titleChanged.next('MASTER ITEM');
    this.rform = new FormGroup({
       itemcode: new FormControl(null, Validators.required),
       itemdesc: new FormControl(null, Validators.required),
       itemtype: new FormControl(null, Validators.required),
       itemclass: new FormControl(null, Validators.required),
       itemuom: new FormControl(null, Validators.required),
       itemwh: new FormControl(null, Validators.required),
       itempath: new FormControl(null, Validators.required)
      
     });
    this.getItems();

  }

   getItems() {    
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     this.http.get(this.apiUrl+'api/inventory/item',{ headers: headers})
      .subscribe(
      (resp)=>{
        this.dataSource =resp.json();   
      
      },
      (err)=>{
         console.log(err)
       }
    );
   }

    onValueChanged(e){
      console.log(e);
      this.rform.get('itemcode').setValue( e.value.idesc);
      this.rform.get('itemtype').setValue( e.value.itype);
      this.rform.get('itemclass').setValue( e.value.iclass);
      this.rform.get('itemuom').setValue( e.value.stduom);
      this.rform.get('itemwh').setValue( e.value.defwarehouse);
      let path = e.value.imagepath;
      this.itemcode =e.value.icode;
      this.imagepath ="http://localhost/erp/"+ path.replace('~','').replace('\\','/');
    
    }

    onCancel(){
      this.route.navigate(["/main"]);
    }
}
