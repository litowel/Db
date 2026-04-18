import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle, ArrowRight, Lightbulb } from "lucide-react";
import { EligibilityAnalysis } from "../lib/gemini";

export default function EligibilityResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState<EligibilityAnalysis | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('eligibilityResult');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      navigate('/eligibility');
    }
  }, [navigate]);

  if (!result) return null;

  const isQualified = result.isQualified;
  // Invert score meaning for display if needed: UI expects "Low" to mean low risk (good).
  // If the AI outputs 0-100 where lower is better, we'll map < 50 to Low, else High.
  const riskClass = result.riskScore < 50 ? "success" : "warning";
  const riskLabel = result.riskScore < 50 ? `Low (${result.riskScore}/100)` : `High (${result.riskScore}/100)`;
  const riskPercentage = Math.max(5, 100 - result.riskScore); // Just for visually pleasing progress bar

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 text-center"
        >
          {isQualified ? (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isQualified ? "You're Qualified for Funding!" : "Not Quite Ready Yet"}
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {isQualified 
              ? "Based on your profile, you meet the criteria for several of our partner lenders."
              : "Your business needs a bit more traction before matching with our current lender network."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Risk Score</span>
                  <Badge variant={riskClass}>
                    {riskLabel}
                  </Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${result.riskScore < 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${riskPercentage}%` }}
                  ></div>
                </div>
              </div>

              {isQualified && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-gray-500 text-sm block mb-1">Estimated Funding Range</span>
                  <span className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    ${result.estimatedFundingMin?.toLocaleString() || 0} - ${result.estimatedFundingMax?.toLocaleString() || 0}
                  </span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                <span className="text-gray-500 text-sm block mb-2">Suggested Funding Type</span>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedFundingTypes?.length > 0 ? (
                    result.suggestedFundingTypes.map((type, idx) => (
                      <Badge key={idx} variant="secondary">{type}</Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">Bootstrapping</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-blue-800 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.insights?.map((insight, idx) => (
                  <div key={`insight-${idx}`} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-blue-900 text-sm">{insight}</span>
                  </div>
                ))}

                {result.improvements?.length > 0 && <hr className="border-blue-200 my-2" />}

                {result.improvements?.map((imp, idx) => (
                  <div key={`imp-${idx}`} className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-blue-900 text-sm">{imp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {isQualified 
              ? "Unlock full funding access and apply to lenders"
              : "Get funding-ready with our Growth Program"}
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            {isQualified
              ? "Join our Funding Access Membership to get priority deal matching, structured application summaries, and direct introductions to lenders."
              : "Join our Growth Membership to get a step-by-step roadmap, AI improvement tips, and business optimization insights."}
          </p>
          <Button asChild size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
            <Link to="/membership">
              {isQualified ? "Join Funding Access Program" : "Join Growth Program"} <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
