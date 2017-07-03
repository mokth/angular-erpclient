import { Component, OnInit, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, RequestMethod } from "@angular/http";
import { Router } from "@angular/router";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";

import { DailyProdInfo } from "app/daily-prod-output/DailyProdInfo";
import { DailyProdInput } from "app/daily-prod-output/DailyProdInput";
import { DateValidators } from "app/shared/DateValidator";
import { CanComponentDeactivate } from "app/canDeactivateGuard";
import { AuthserviceService } from "app/authservice.service";


@Component({
  selector: 'app-daily-prod-output',
  templateUrl: './daily-prod-output.component.html',
  styleUrls: ['./daily-prod-output.component.css']
})
export class DailyProdOutputComponent implements OnInit,CanComponentDeactivate {

  rform: FormGroup;  
  changesSaved = false;
  message:string="";
  worklist:DailyProdInfo[]=[];
  sheCodelist:string[]=[];
  workcenterlist:string[]=[];
  processlist:string[]=[];
  
  constructor(private auth:AuthserviceService,
              private http:Http,
              private router: Router,
              @Inject('API_URL') private apiUrl:string) { }

  ngOnInit() {
     this.auth.titleChanged.next('DAILY OUTPUT');
     this.rform = new FormGroup({
        date: new FormControl(null,[Validators.required,DateValidators.isValidDate]),
        workorder: new FormControl(null, Validators.required),
        workcenter: new FormControl(null, Validators.required),
        product: new FormControl({value: '', disabled: true}, Validators.required),
        process: new FormControl(null, Validators.required),
        machine: new FormControl({value: '', disabled: true}, Validators.required),
        output: new FormControl(null, Validators.required),
     });  
     this.getDailyProdList();
     this. onChanges();
  }
  
  onWorkOrderChanged(e){
      let found= this.worklist.find(
                  (x)=>{ return x.scheCode ==e.value; }
                );
      if (found==null) return;
      this.rform.get('product').setValue(found.prodCode);
      this.workcenterlist = this.worklist.filter(
              (elt) =>{ return elt.scheCode==e.value ;}
          ).map((x)=>{return x.wcCode }).sort();    
      
       this.workcenterlist = this.workcenterlist.filter(
              (elt, i, a) => i === a.findIndex( elt2 => elt === elt2 )
          );

        this.rform.get('workcenter').setValue('');  
        this.rform.get('process').setValue('');
        this.rform.get('machine').setValue('');
    }
  
  onChanges(): void {
    // this.rform.get('workorder').valueChanges.subscribe(val => {
    //   let found= this.worklist.find(
    //               (x)=>{ return x.scheCode ==val; }
    //             );
    //   if (found==null) return;
    //   this.rform.get('product').setValue(found.prodCode);
    //   this.workcenterlist = this.worklist.filter(
    //           (elt) =>{ return elt.scheCode==val ;}
    //       ).map((x)=>{return x.wcCode }).sort();       
    // });

    this.rform.get('workcenter').valueChanges.subscribe(val => {      
      let workno = this.rform.get('workorder').value;
      this.processlist = this.worklist.filter(
              (elt) =>{ return (elt.scheCode==workno && elt.wcCode==val) ;}
          ).map((x)=>{return x.nextProcess }).sort();                  
    });

     this.rform.get('process').valueChanges.subscribe(val => {      
      let workno = this.rform.get('workorder').value;
      let wccode = this.rform.get('workcenter').value;      
      let found = this.worklist.find(
              (x) =>{ return (
                x.scheCode==workno && x.wcCode==wccode && x.nextProcess==val
                );}
          );
      if (found==null) return;
      this.rform.get('machine').setValue(found.machineCode);    
    });
  }

  getDailyProdList() {    
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');     
    this.http.get(this.apiUrl+'api/production/daily',{ headers: headers })
      .subscribe(
      (resp)=>{
        this.worklist =resp.json();   
        this.sheCodelist = this.worklist.filter(
              (elt, i, a) => i === a.findIndex( elt2 => elt.scheCode === elt2.scheCode )
          ).map((x)=>{return x.scheCode });        
      },
      (err)=>{
         console.log(err)
       }
    );
   }

  getDailyJSon():string {
      let date = this.rform.get('date').value;
      let workno = this.rform.get('workorder').value;
      let wccode = this.rform.get('workcenter').value;
      let product = this.rform.get('product').value;
      let process = this.rform.get('process').value;
      let machine = this.rform.get('machine').value;
      let output = this.rform.get('output').value;
      let found = this.worklist.find(
           (x) =>{ return (
                   x.scheCode==workno && 
                   x.wcCode==wccode &&
                   x.machineCode==machine &&
                   x.nextProcess==process
               );}
          );

      let input:DailyProdInput = new DailyProdInput(
                                  date,'Mok',
                                  found.scheCode,found.relNo,
                                  found.prodCode,found.wcCode,
                                  found.wciCode,found.nextProcess,
                                  found.nextProcess,output);
      let body:string = "" 
      if (found!=null){        
          body = JSON.stringify(input);  
      } else return "";
    return body;
  }

  postDaily() {
      let body:string = this.getDailyJSon() ;
      console.log(body);
      if (body==""){
        return;
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');      
      this.http.post(this.apiUrl+'api/production/prod',
                    body,{ headers: headers })
        .subscribe(
        (resp)=>{
            let data =resp.json();
            if (data.status=='OK'){
                 this.rform.reset();
                this.message ="Daily production output saved."
            }else this.message ="Fail to save output."
        },
        (err)=>{
          this.message ="Fail to save output."+err
        },
        
      )
   
  }  
  onSubmit(form:FormGroup){
      this.changesSaved = true;
      this.postDaily();
  }

  onCancel(){
      this.router.navigate(["/main"]);
  }

   canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
      if (this.rform.value.workorder && !this.changesSaved){
        return confirm('Do you want to discard the changes?');
      } else {
        return true;
      }    
  };
}
