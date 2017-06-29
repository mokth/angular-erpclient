 export class DailyProdInput{
  constructor(
        public datestr:string,
        public userID:string,
        public scheCode:string,
        public relNo :string,
        public prodCode :string,        
        public wcCode :string,
        public wciCode :string,
        public machineCode :string,
        public nextProcess :string,
        public Output:number
  ) {  }
}
