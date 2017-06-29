
export class GRNPoItem {

  constructor(
        public poNo : string,
        public poRelNo: string,
        public line : string,
        public iCode : string,
        public iDes: string,
        public tolerance :Number,
        public poQty  :Number,
        public poPurQty  :Number,
        public recvQty :Number,
        public balanceQty :Number,
        public packSz  :Number,
        public stdUOM : string,
        public purchaseUOM : string,
        public poDesc : string
  ) {  }

}