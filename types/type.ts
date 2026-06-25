export interface dbBlog {
  id: string;
  title: string;
  content: string;
  url: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  desktopCoverImage: string;
  mobileCoverImage: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeyWords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type dbBillboard = {
  id: string;
  billboardImage: string;
  billboardImageMobileDevice:string | null;
  productLink: string;
};

export type dbCategory = {
  id: string;
  name: string;
  categoryUrl:string | null;
  description?:string | null;
  categoryImage: string;
  products: dbProduct[];
};

export type UnitPricing = {
  price: number;
  discountPrice?: number;
};


export type dbProduct = {
  id: string;
  productId:string;
  productUrl:string;
  name: string;
  description: string
  subDescription: string;
  productImage: string;
  gallery: string[];
  productType?:"BEST_SELLING" | "ALL_PRODUCT" | null;
  lastBestSellingAt?: Date | null;  
  price: number;
  discountPrice?: number;
  kgUnit?:     Record<number, UnitPricing>;
  piecesUnit?: Record<number, UnitPricing>;
  gramUnit?:   Record<number, UnitPricing>;
  inStocks: number;
  categoryId: string;
  orderItems: dbOrderItem[];
  reviews: dbReview[];    
  comments: dbComment[];    
};

export type dbReview = {
  id: string;
  rating: number;
  userId: string;
  productId: string;
};

export type dbComment = {
  id: string;
  content: string;
  userId: string;
  productId: string;
};


export type dbOrder = {
  id: string;
  paymentMethod: string;
  orderId:string;
  isPaid: boolean;
  name: string;
  mobileNumber: string;
  address: string;
  accountType: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "NEARBY" | "COMPLETED" | "CANCELLED" | "RETURNED" | "CONFIRM";
  total: number;
  totalDiscount?: number | null;
  transactionId?: string | null;
  userId?: string | null;
  userAgent?:string| null;
  ip?:string | null
  fbc?:string | null;
  fbp?:string | null;
  ttpCookie?:   string | null;
  ttclidValue?: string | null;
  gclid?: string | null;
  li_fat_id?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  dclid?: string | null;
  uuid?: string | null;
  msclkid?: string | null;
  fbclid?: string | null;
  twclid?: string | null;
  rdt_cid?: string | null;
  epik?: string | null;
  ScCid?: string | null;
  sccid?: string | null;
  qclid?: string | null;
  irclickid?: string | null;
  awc?: string | null;
  createdAt: Date;
  updatedAt: Date;


  orderItems: dbOrderItem[];
};

export type dbOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  variant?: string | null;
  price?:   number | null;
  createdAt: Date;
  updatedAt: Date;
};


export interface dbContactInfo {
  id: string
  customerCareNumber?: string | null
  messengerUsername?: string | null
  whatsappNumber?: string | null
  infoEmail?: string | null
  shopAddress?: string | null
}