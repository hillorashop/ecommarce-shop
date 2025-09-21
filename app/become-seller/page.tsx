
import { HeadingTitle } from "@/components/heading-title";
import { SellerOnboarding } from "@/components/seller-onboarding";
import { Users, TrendingUp, Shield} from "lucide-react"

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


      

            {/* Benefits */}

<div className="grid md:grid-cols-3 gap-6 mb-12">
  <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 border">
    <Users className="h-12 w-12 text-primary mb-4" />
    <h3 className="font-semibold mb-2">হাজার হাজার Customers</h3>
    <p className="text-sm text-muted-foreground text-center">
      বাংলাদেশের সক্রিয় Buyers-এর কাছে পৌঁছান
    </p>
  </div>

  <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 border">
    <TrendingUp className="h-12 w-12 text-primary mb-4" />
    <h3 className="font-semibold mb-2">Powerful Analytics</h3>
    <p className="text-sm text-muted-foreground text-center">
      বিস্তারিত Insights-এর মাধ্যমে আপনার Performance Track করুন
    </p>
  </div>

  <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 border">
    <Shield className="h-12 w-12 text-primary mb-4" />
    <h3 className="font-semibold mb-2">Secure Payments</h3>
    <p className="text-sm text-muted-foreground text-center">
      দ্রুত এবং নিরাপদ Transactions, Buyer Protection সহ
    </p>
  </div>
</div>


     
            <SellerOnboarding/>
      </div>
    </div>
  )
}


export default SellerPage;