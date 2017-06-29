import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthserviceService } from './authservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private auth:AuthserviceService,private router: Router){
    if (auth.isAuthenticated()){
        router.navigate(['/main']);
    }else router.navigate(['/login']);
  }
  isLogon:boolean;

  ngOnInit() {
    this.isLogon = this.auth.isAuthenticated();
    this.auth.authChanged.subscribe(
      (x)=>{this.isLogon=x; }
      ) ;
  }
}
