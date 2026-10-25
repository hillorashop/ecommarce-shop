export type dbCouponCategory = {
  id: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
};

export type dbCouponCode = {
  id: string;
  couponCode: string;
  discountPercentage: number;
  startDate: Date;
  expiryDate: Date;
  status: string;
  categories: dbCouponCategory[];
  createdAt: Date;
  updatedAt: Date;
};


export interface dbPrivacy {
  id: string;
  privacyContent : string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeyWords: string[];
}

export interface dbReturnPolicy {
  id: string;
  returnContent: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeyWords: string[];
}


export interface dbAbout {
  id: string;
  aboutContent: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeyWords: string[];
}


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
  freeDelivery?: boolean | null;
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
  comment?: string | null;
  images?: string[];
  userName?: string | null;
  userAvatar?: string | null;
  userId?: string | null;
  productId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isCustom?: boolean;
  user?: {
    id: string;
    name?: string | null;
    image?: string | null;
  } | null;
  product?: {
    id: string;
    name: string;
    productImage?: string;
    productUrl?: string;
  } | null;
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
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "NEARBY" | "COMPLETED" | "CANCELLED" | "RETURNED" | "CONFIRM" | "FAILED";
  total: number;
  orderFor?:string | null;
  email?:string | null;
  zilla?:string | null;
  thana?:string | null;

  shippingMethod?:string | null;
  shippingCost?:number | null;

  couponCode?:string | null;
  couponDiscount?:number | null;

  specialNote?:string | null; 
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
  tradeLicenseNumber?: string | null
  eTinNumber?: string | null
}


export interface dbDeliveryCharge {
  id:string         
  insideDhaka : number 
  outsideDhaka: number
  postOffice:number 
  insideKhagrachari: number | null
}

export interface dbPromotionalBanner {
  id: string;
  title?: string | null;
  leftLargeImage: string;
  leftLargeLink: string;
  topRightImage: string;
  topRightLink: string;
  bottomRightImage: string;
  bottomRightLink: string;
  createdAt?: Date;
  updatedAt?: Date;
}
