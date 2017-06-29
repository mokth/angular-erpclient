import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class GRNHelper
{
    poChanged = new Subject<any>();

    onPoChanged(pono:string,porel:string){
        this.poChanged.next({'pono':pono,'porel':porel});
    }
}