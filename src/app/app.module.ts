import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { DxDataGridModule,DxLookupModule } from 'devextreme-angular';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthserviceService } from "app/authservice.service";
import { MainMenuComponent } from "app/main-menu/main-menu.component";
import { AuthguardService } from "app/authguard.service";
import { ItemCodeComponent } from './item-code/item-code.component';
import { GrnPoComponent } from './grn-po/grn-po.component';
import { config } from './config';
import { GrnPoItemComponent } from './grn-po/grn-po-item/grn-po-item.component';
import { GRNHelper } from 'app/grn-po/grn-helper';
import { SharedModule } from "app/shared/share-module";
import { MaintLogComponent } from './maint-log/maint-log.component';
import { CanDeactivateGuard } from "app/canDeactivateGuard";
import { DailyProdOutputComponent } from './daily-prod-output/daily-prod-output.component';
import { GrnHisComponent } from './grn-po/grn-his/grn-his.component';
import { PrApprovalComponent } from './pr-approval/pr-approval.component';
import { PrItemComponent } from './pr-approval/pr-item/pr-item.component';

const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'main', component: MainMenuComponent, canActivate: [AuthguardService] },
  { path: 'login',component:LoginComponent},
  { path: 'item',component:ItemCodeComponent, canActivate: [AuthguardService] },
  { path: 'grnpo',component:GrnPoComponent, canActivate: [AuthguardService] },
  { path: 'grnhis/:id',component:GrnHisComponent, canActivate: [AuthguardService] },
  { path: 'logrep',component:MaintLogComponent, canActivate: [AuthguardService], canDeactivate: [CanDeactivateGuard]  },
  { path: 'prapr',component:PrApprovalComponent, canActivate: [AuthguardService], canDeactivate: [CanDeactivateGuard]  },
  { path: 'pritem/:id',component:PrItemComponent, canActivate: [AuthguardService] },
  { path: 'daily',component:DailyProdOutputComponent, canActivate: [AuthguardService], canDeactivate: [CanDeactivateGuard]  },
  
 
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainMenuComponent,
    ItemCodeComponent,
    GrnPoComponent,
    GrnPoItemComponent,
    MaintLogComponent,
    DailyProdOutputComponent,
    GrnHisComponent,
    PrApprovalComponent,
    PrItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule,
    DxDataGridModule,
    DxLookupModule,
    RouterModule.forRoot(appRoutes)
  ],
  
  providers: [AuthserviceService,
              AuthguardService,
              CanDeactivateGuard,
              GRNHelper,
               {provide:'API_URL',useValue: config.apiUrl}
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
