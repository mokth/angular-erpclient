export class PRItem {

  constructor(
        public prno:string,
        public line:string,
        public icode:string,
        public idesc:string,
        public stdqty:number,
        public stduom:string,
        public unitprice:number,
        public currency:string,
        public taxamt:number,
        public amount:number  
  ) {  }
}
