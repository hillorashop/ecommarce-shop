export type dbBillboard = {
  id: string;
  billboardImage: string;
  billboardImageMobileDevice:string | null;
  productLink: string;
};

export type dbCategory = {
  id: string;
  name: string;
  categoryImage: string;
  products: dbProduct[];
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
  price: number;
  discountPrice?: number;
  packageQuantity: string;
  packageQuantityType: string;
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
  fbc?:string | null;
  fbp?:string | null;
  ttpCookie?:   string | null;
  ttclidValue?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  orderItems: dbOrderItem[];
};

export type dbOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
