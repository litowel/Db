import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CheckCircle2, FileText, Building2, DollarSign, Lock, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "../components/layout/AuthProvider";

export default function Apply() {
  const navigate = useNavigate();
  const { user, dbUser, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isFundingAccessMember = dbUser?.membershipTier === "FUNDING_ACCESS";

  const lenders = [
    {
      id: "lender_1",
      name: "Stripe Capital Partners",
      type: "Revenue-Based Financing",
      amountPattern: "$10k - $250k",
      target: "E-Commerce, SaaS",
      timeToFund: "24-48 Hours",
      status: isFundingAccessMember ? "High Match" : "Locked",
      color: "blue"
    },
    {
      id: "lender_2",
      name: "Mercury Venture Debt",
      type: "Venture Debt",
      amountPattern: "$250k - $2M",
      target: "Post-Seed Startups",
      timeToFund: "1-2 Weeks",
      status: isFundingAccessMember ? "Pending Docs" : "Locked",
      color: "emerald"
    },
    {
      id: "lender_3",
      name: "Clearco Growth",
      type: "Marketing Capital",
      amountPattern: "$10k - $5M",
      target: "D2C, E-Commerce",
      timeToFund: "48 Hours",
      status: isFundingAccessMember ? "High Match" : "Locked",
      color: "blue"
    },
    {
      id: "lender_4",
      name: "BridgePoint Credit",
      type: "Traditional Term Loan",
      amountPattern: "$50k - $500k",
      target: "B2B Services, Retail",
      timeToFund: "2-4 Weeks",
      status: isFundingAccessMember ? "Low Match" : "Locked",
      color: "slate"
    }
  ];

  const handleApply = (lenderName: string) => {
    if (!isFundingAccessMember) {
      navigate('/membership');
      return;
    }
    
    // Simulate real application logic routing
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`AI Application Package successfully securely submitted to ${lenderName}. They will review your Virtual Data Room documents.`);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Partner Deal Room</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Based on your AI Eligibility Check and banking algorithms, these institutional lenders are highly matched to your capital needs.
            </p>
          </div>
          {!isFundingAccessMember && (
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/membership">Upgrade to Apply <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          )}
        </div>

        {/* Not fully permissioned banner */}
        {!isFundingAccessMember && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900">
            <Lock className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Apply Buttons Locked</h3>
              <p className="text-xs mt-1 text-amber-700">
                You are currently on a Growth Plan (or free tier). You must possess a Funding Access membership to electronically bridge your Data Room directly with these institutional lenders.
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {lenders.map((lender) => (
            <Card key={lender.id} className={`border-0 shadow-sm transition-all ${isFundingAccessMember ? 'hover:shadow-md border-slate-200' : 'bg-slate-100 opacity-90 border-transparent'}`}>
              <CardHeader className="pb-3 flex flex-row items-start justify-between bg-white rounded-t-xl">
                <div>
                  <Badge variant="outline" className={`mb-2 bg-${lender.color}-50 text-${lender.color}-700 border-${lender.color}-200`}>
                    {lender.type}
                  </Badge>
                  <CardTitle className="text-xl">{lender.name}</CardTitle>
                  <CardDescription className="text-slate-500 mt-1">Targets: {lender.target}</CardDescription>
                </div>
                {!isFundingAccessMember && <Lock className="w-5 h-5 text-slate-400" />}
              </CardHeader>
              <CardContent className="pt-4 bg-white rounded-b-xl border-t border-slate-50">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Funding Range</p>
                    <p className="text-lg font-bold text-slate-900">{lender.amountPattern}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Time to Fund</p>
                    <p className="text-sm font-medium text-slate-900">{lender.timeToFund}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => handleApply(lender.name)}
                  variant={isFundingAccessMember ? "default" : "secondary"}
                  className={`w-full ${isFundingAccessMember ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-slate-500'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending Package..."
                  ) : isFundingAccessMember ? (
                    <>Submit Deal Package <Zap className="w-4 h-4 ml-2 fill-current" /></>
                  ) : (
                    <>Locked - Upgrade Required</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
