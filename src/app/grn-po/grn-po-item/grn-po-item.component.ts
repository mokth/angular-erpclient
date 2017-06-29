import { Component, OnInit, Inject, Input } from '@angular/core';
import { Http, RequestOptions, RequestMethod,Headers } from "@angular/http";
import { GRNHis } from "app/grn-po/grnhis";
import { GRNHelper } from 'app/grn-po/grn-helper';

@Component({
  selector: 'app-grn-po-item',
  templateUrl: './grn-po-item.component.html',
  styleUrls: ['./grn-po-item.component.css']
})
export class GrnPoItemComponent implements OnInit {
  pono:string;
  porel:string;

 hislist:GRNHis[]=[];

 constructor(private http:Http,
             private grnhelp:GRNHelper,
             @Inject('API_URL') private apiUrl:string) { }
  
  ngOnInit() {
    this.getGRNHis();
    this.grnhelp.poChanged.subscribe(
      (x)=>{
        this.pono=x.pono;
        this.porel=x.porel;
        console.log(x);
      }
    )
 }
  
  ishaveRecord():boolean{
     return (this.hislist.length>0);
   }

  getGRNHis() {    
     let headers2 = new Headers();
     headers2.append('Content-Type', 'application/json');
     let options = new RequestOptions();
     options.headers = headers2;
     options.method=RequestMethod.Get;
     const url =this.apiUrl+'api/inventory/grnhis?pono='+this.pono+'&porel='+this.porel;
     this.http.get(url,{ headers: headers2 })
      .subscribe(
      (resp)=>{
        this.hislist =resp.json();   
        console.log(this.hislist.length);    
      },
      (err)=>{
         console.log(err)
       }
    );
   }
}
