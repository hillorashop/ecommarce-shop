import { HeadingTitle } from "@/components/heading-title";
import { SellerOnboarding } from "@/components/seller-onboarding";
import { Users, TrendingUp, Shield} from "lucide-react"


const features = [
  {
    icon: Users,
    title: "হাজার হাজার Customers",
    description: "বাংলাদেশের সক্রিয় Buyers-এর কাছে পৌঁছান",
  },
  {
    icon: TrendingUp,
    title: "Powerful Analytics",
    description: "বিস্তারিত Insights-এর মাধ্যমে আপনার Performance Track করুন",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "দ্রুত এবং নিরাপদ Transactions, Buyer Protection সহ",
  },
];

const  SellerPage = () => {

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 mb-10">
     
  
<div className="text-center space-y-2 mb-8 mx-auto max-w-3xl">
  <HeadingTitle title="Hillora সঙ্গে বিক্রি শুরু করুন" />
  <p className="text-muted-foreground text-sm lg:text-base">
    Hillora হল সেই প্ল্যাটফর্ম যেখানে পাহাড়ি ঐতিহ্য এবং Modern Products একসাথে মিলিত হয়ে আপনার ব্যবসাকে পৌঁছে দেয় বাংলাদেশের Customers-এর কাছে।  
    আমাদের সঙ্গে যুক্ত হোন, আপনার Products-এর গল্প জানান, এবং দেশের মানুষকে আপনার Brand-এর সঙ্গে পরিচিত করুন—সহজ, Safe এবং কার্যকরীভাবে।
  </p>
</div>
        <SellerOnboarding/>

    <div className="grid md:grid-cols-3 gap-6 mt-12">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-card text-card-foreground rounded-xl border shadow-sm hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <Icon className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground text-center">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
         
      </div>
    </div>
  )
}


export default SellerPage;