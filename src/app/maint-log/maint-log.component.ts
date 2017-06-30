import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { RequestOptions, Headers, Http } from "@angular/http";
import { FormGroup, Validators, FormControl } from "@angular/forms";

import { CanComponentDeactivate } from "app/canDeactivateGuard";
import { AuthserviceService } from "app/authservice.service";


@Component({
  selector: 'app-maint-log',
  templateUrl: './maint-log.component.html',
  styleUrls: ['./maint-log.component.css']
})

export class MaintLogComponent implements OnInit,CanComponentDeactivate {
 
  fileList: FileList;
  rform:FormGroup;  
  changesSaved = false;
  message:string="";

  constructor(private auth:AuthserviceService,
              private http:Http, 
              private router: Router,
              @Inject('API_URL') private apiUrl:string) { }
 
  ngOnInit() {
    this.auth.titleChanged.next('MAINTENANCE');   
    this.rform = new FormGroup({
       date: new FormControl(null, Validators.required),
       machine: new FormControl(null, Validators.required),
       desc: new FormControl(null, Validators.required),
       pic: new FormControl()
     });
  
  }
  
   validateFile(c: FormControl):{[s:string]:boolean} {
    if (this.fileList==null || this.fileList.length==0){
      console.log('validate file is false');
      return {'nofilefound':true};
    }
    console.log('validate file is true');
    return null; 
   }

  submitPicture(refcode:string){
    const URL =  this.apiUrl+'api/production/replog?ref='+refcode;
     if(this.fileList.length > 0) {
        let file: File = this.fileList[0];
        let formData:FormData = new FormData();
        formData.append("file", file);  
        console.log('posting file....');     
        console.log(file);     
        this.http.post(URL, formData)
            .subscribe(
                (resp) =>{
                     let strs= resp.json();
                     this.message="Submit report status : "+strs.status;
                     if (strs.status=="Success"){
                       this.resetForm();                     }
                  },
                (error) =>{
                  console.log(error)
                  this.message="Report create but fail to uploading file."+error;
                 }                
            )
    }
  }

  resetForm(){
    this.rform.reset();
    this.rform.get('pic').reset();
    this.fileList= null;
  }

  submitNewReport(){
    const URL =  this.apiUrl+'api/production/newrep';
        let data = JSON.stringify(
              {	"date":this.rform.value.date,
                "macCode":this.rform.value.machine,
                "macDesc":this.rform.value.desc
              });        
         let headers = new Headers();
         headers.append('Content-Type','application/json');         
         let options = new RequestOptions({ headers: headers });
        this.http.post(URL, data,options)
            .subscribe(
                (resp) =>{
                  try{
                      let strs= resp.json();
                      this.submitPicture(strs.refcode);                      
                  }catch(e){
                    error => console.log(e);
                    this.message="Error submitting report...try again."
                  }
                  
                },
                (error) =>{
                  console.log(error)
                  this.message="Error submitting report...try again."+error;
                }
         )    
  }

  fileChange(event) {
    this.fileList = event.target.files;
    console.log(this.fileList);
  }

  isPicFileReady(){
    return  (this.fileList!=null && this.fileList.length>0);
  }
  onSubmit(form:FormGroup){
     if (!this.isPicFileReady())
        return;

      this.changesSaved = true;
      this.submitNewReport();
  }

  onCancel(){
      this.router.navigate(["/main"]);
  }
  
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
      console.log('canDeactivate');
      if (this.rform.value.date && !this.changesSaved){
        return confirm('Do you want to discard the changes?');
      } else {
        return true;
      }    
  };

}
