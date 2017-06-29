import { FileDropDirective } from 'ng2-file-upload';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { Http,Headers } from "@angular/http";
import { Router, ActivatedRoute } from "@angular/router";
import {Location} from '@angular/common';

import DataSource from 'devextreme/data/data_source'

import { GRNHis } from "app/grn-po/grnhis";

@Component({
  selector: 'app-grn-his',
  templateUrl: './grn-his.component.html',
  styleUrls: ['./grn-his.component.css']  
})
export class GrnHisComponent implements OnInit {
  pono:string;
  porel:string="1";
  polist:GRNHis[]=[];
  constructor(private http:Http,
              private route:Router,
              private _location: Location,
              private activeroute: ActivatedRoute,
              @Inject('API_URL') private apiUrl:string) { }

  ngOnInit() {
     this.activeroute.params.subscribe(params => {
       this.pono = params['id'];       
       this.getGRNhis();   
    });
  }
  
  getGRNhis() {    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');     
    this.http.get(this.apiUrl+'api/inventory/grnhis?pono='+this.pono+"&porel="+this.porel,
                  { headers: headers })
      .subscribe(
      (resp)=>{
        this.polist =resp.json();   
        console.log(this.polist);    
      },
      (err)=>{
         console.log(err)
       }
    );
   }

    onCancel(){
      this._location.back();
    }
}
