import { Component, OnInit, Inject } from '@angular/core';
import { Http,Headers } from "@angular/http";
import { Router, ActivatedRoute } from "@angular/router";
import {Location} from '@angular/common';

import { PRItem } from "app/pr-approval/pritem";


@Component({
  selector: 'app-pr-item',
  templateUrl: './pr-item.component.html',
  styleUrls: ['./pr-item.component.css']
})
export class PrItemComponent implements OnInit {
  pritems:PRItem[]=[];
  prno:string;
  columns = [
        { dataField: 'icode', caption: 'ITEM'},
        { dataField: 'stdqty', caption: 'QTY',width:50 },
        { dataField: 'stduom', caption:'UOM',width:50 },
        { dataField: 'unitprice',caption:'PRICE',width:60 },
        { dataField: 'amount',caption:'AMT',width:80}        
    ];
  constructor(private http:Http,
              private route:Router,
              private _location: Location,
              private activeroute: ActivatedRoute,
              @Inject('API_URL') private apiUrl:string) { }

   ngOnInit() {
      this.activeroute.params.subscribe(params => {
       this.prno = params['id'];       
       this.getPRItems();   
    });
   }
   
    getPRItems() {    
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');        
     this.http.get(this.apiUrl+'api/purchase/pritems?id='+this.prno,
                 { headers: headers })
                  .subscribe(
                    (resp)=>{
                      this.pritems =resp.json();            
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
