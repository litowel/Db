import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle2, Star, Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { usePaystackPayment } from "react-paystack";
import { useAuth } from "../components/layout/AuthProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const GROWTH_PRICE_USD = 49;
const FUNDING_ACCESS_PRICE_USD = 199;

export default function Membership() {
  const navigate = useNavigate();
  const { user, dbUser, signIn } = useAuth();
  
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Fetch live USD to GHS exchange rate
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.GHS) {
          setExchangeRate(data.rates.GHS);
        } else {
          setExchangeRate(14.5); // Fallback if API fails
        }
      })
      .catch((err) => {
        console.error("Failed to fetch FX rate", err);
        setExchangeRate(14.5); // Fallback on network error
      });
  }, []);

  const handleSuccess = async (reference: any, tier: 'GROWTH' | 'FUNDING_ACCESS') => {
    if (!user) return;
    setIsProcessing(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        membershipTier: tier,
        membershipStatus: "ACTIVE"
      });
      // Allow database to sync locally
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error("Failed to update membership status", error);
      alert("Payment successful but failed to update your status. Please contact support.");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    console.log('Payment window closed');
  };

  const paystackConfig = {
    // Falls back to a specific testing key if none is provided via env
    publicKey: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_a04282ba755b1160a0ad8fcab85e3150eedbb7ae',
    currency: 'GHS',
  };

  // Setup Paystack Hooks
  const initializeGrowthPayment = usePaystackPayment({
    ...paystackConfig,
    email: user?.email || '',
    amount: Math.round(GROWTH_PRICE_USD * exchangeRate * 100), // Lowest currency unit (Pesewas)
  });

  const initializeFundingPayment = usePaystackPayment({
    ...paystackConfig,
    email: user?.email || '',
    amount: Math.round(FUNDING_ACCESS_PRICE_USD * exchangeRate * 100), // Lowest currency unit (Pesewas)
  });

  const renderActionButton = (tier: 'GROWTH' | 'FUNDING_ACCESS', usdPrice: number, initPayment: any) => {
    if (!user) {
      return (
        <Button onClick={signIn} variant={tier === 'FUNDING_ACCESS' ? 'default' : 'outline'} className={`w-full h-12 text-base ${tier === 'FUNDING_ACCESS' ? 'bg-blue-600 hover:bg-blue-500 text-white' : ''} relative z-10`}>
          Sign In to Join
        </Button>
      );
    }

    if (dbUser?.membershipTier === tier) {
       return (
         <Button disabled variant="outline" className={`w-full h-12 text-base ${tier === 'FUNDING_ACCESS' ? 'bg-gray-800 text-gray-500 border-gray-700' : ''} relative z-10`}>
           Current Plan
         </Button>
       );
    }

    // Determine the action button text context
    let btnText = `Join for $${usdPrice}`;
    if (dbUser?.membershipTier === 'GROWTH' && tier === 'FUNDING_ACCESS') btnText = `Upgrade for $${usdPrice}`;

    return (
       <Button 
         onClick={() => {
           console.log("Starting Paystack payment...");
           // Check if key is present
           const key = (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY;
           if (!key) console.warn("VITE_PAYSTACK_PUBLIC_KEY is missing! Using fallback.");
           
           try {
             // @ts-ignore
             initPayment({
               onSuccess: (ref: any) => handleSuccess(ref, tier), 
               onClose: handleClose
             });
           } catch(e) {
             console.error("Paystack launch error:", e);
             // Fallback to argument syntax if object fails
             // @ts-ignore
             initPayment((ref: any) => handleSuccess(ref, tier), handleClose);
           }
         }} 
         disabled={!exchangeRate || isProcessing}
         variant={tier === 'FUNDING_ACCESS' ? 'default' : 'outline'} 
         className={`w-full h-12 text-base ${tier === 'FUNDING_ACCESS' ? 'bg-blue-600 hover:bg-blue-500 text-white' : ''} relative z-10`}
       >
         {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : btnText}
         {!isProcessing && <ArrowRight className="w-4 h-4 ml-2" />}
       </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Choose Your Path to Funding</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're ready to apply today or need help getting there, we have a program designed for your business stage.
          </p>
          {exchangeRate > 0 && (
            <p className="mt-4 text-sm text-gray-500">Live Exchange Rate: 1 USD = {exchangeRate.toFixed(2)} GHS (Billed via Paystack)</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Growth Membership */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth Membership</h3>
              <p className="text-gray-500">For businesses building traction</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900">${GROWTH_PRICE_USD}</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Funding readiness roadmap",
                "AI-driven improvement tips",
                "Business optimization insights",
                "Monthly eligibility re-checks",
                "Community access"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {renderActionButton('GROWTH', GROWTH_PRICE_USD, initializeGrowthPayment)}
          </motion.div>

          {/* Funding Access Membership */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> RECOMMENDED
            </div>
            <div className="mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Funding Access</h3>
              <p className="text-gray-400">For qualified businesses ready to apply</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">${FUNDING_ACCESS_PRICE_USD}</span>
                <span className="text-gray-400 font-medium">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              {[
                "Direct access to lender applications",
                "Priority deal matching algorithm",
                "AI-generated structured summaries",
                "Faster processing times",
                "Dedicated funding advisor",
                "No hidden application fees"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {renderActionButton('FUNDING_ACCESS', FUNDING_ACCESS_PRICE_USD, initializeFundingPayment)}
            
            {/* Background decoration */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Note: DealBridge AI charges a success fee of 1-3% only when funding is successfully secured through our partner network.
            <br/>All payments are processed securely in GHS via Paystack at current live exchange rates.
          </p>
        </div>
      </div>
    </div>
  );
}
