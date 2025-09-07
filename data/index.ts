import { title } from "process";





export const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "Faq", href: "/faq" },
  { name: "About", href: "/about" },
];




export const FAQITEMS = [
  {
    question: "What is Hillora?",
    answer: "Hillora is a powerful online shopping platform that offers a wide range of products, including nutritious organic food, clothing choices, and modern daily life essentials. Our goal is to provide a convenient and reliable shopping experience for our customers."
  },
  {
    question: "Where is Hillora located?",
    answer: "Hillora head office is located at: 1st Floor, Ali Complex, Matiranga, Khagrachari."
  },
  {
    question: "How can I contact Hillora customer support?",
    answer: "You can reach our customer support team by email or support ticket on website.",
    mail: "mail@Hillora.com"
  },
  {
    question: "How long does it take to process and ship an order?",
    answer: "We typically process orders within 2-3 business days. Shipping time varies depending on your location and the selected shipping method."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a Shipment Confirmation email with a tracking number. You can use this tracking number to track the status of your order on our website or the shipping carrier's website."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only offer shipping within Bangladesh. We do not ship internationally."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods, including credit/debit cards, online banking, and cash on delivery. The available payment options will be displayed during the checkout process."
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we take the security of your payment information seriously. We use secure encryption technology to protect your data and ensure a safe checkout process."
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Currently, we do not accept returns or exchanges, except for damaged or defective products. Please refer to our Returns & Exchanges Policy for more details."
  },
  {
    question: "How can I request a refund?",
    answer: "If you have received a damaged or defective product, please contact our customer support within 24 hours of receipt. Provide the necessary details, and we will assist you with the refund process as per our Refund Policy."
  },
  {
    question: "Do I need to create an account to place an order?",
    answer: "Yes, creating an account is required to place an order on Hillora. It allows you to track your orders, manage your preferences, and enjoy a personalized shopping experience."
  },
  {
    question: "How do you protect my personal information?",
    answer: "We prioritize the protection of your personal information and adhere to strict privacy standards. Please refer to our Privacy Policy to understand how we collect, use, and protect your data."
  }
];

export const siteMeta = {
  siteName:"Hillora",
  desc:"Hillora – A Bangladesh based Ecommerce Website (বাংলাদেশের খাগড়াছড়ি ভিত্তিক ই-কমার্স ওয়েবসাইট)।",
  keyWords:[
    "Hillora",
    "Bangladesh Ecommerce",
    "Khagrachari Shop",
    "Online Shopping BD",
    "ই-কমার্স বাংলাদেশ",
    "খাগড়াছড়ি শপ",
  ],
   openGraph:{
    title:"",
    desc:"",
    image:[

    ]
   },
   twitter:{
    title: "Hillora – Bangladesh Ecommerce",
    description: "বাংলাদেশ ভিত্তিক ই-কমার্স ওয়েবসাইট",
    creator:"@your_twitter",
    image:[

    ]
   }

}

export const siteMetaFaq = {
  desc:"Frequently Asked Questions about Hillora, Bangladesh's trusted online shopping platform. Learn about orders, products, payments, and more.",
  image:"/faq.png"
}


export const siteMetaAbout = {
  desc:"Discover Hillora, Bangladesh's unique online shopping platform offering organic food, fashionable clothing, and modern daily essentials with convenient delivery.",
  image:"/about.png"
}


export const  ONE_DAY = 24 * 60 * 60 * 1000
export const  TWODAY = 48 * 60 * 60 * 1000
export const  THREEDAY = 72 * 60 * 60 * 1000