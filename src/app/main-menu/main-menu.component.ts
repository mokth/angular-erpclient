import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthserviceService } from "app/authservice.service";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(private auth:AuthserviceService,private router: Router) { }

  ngOnInit() {
  }
 
 OnLogout(){
  this.auth.logOut();
  console.log('log out');
  this.router.navigate(['/login']);
 }
}
