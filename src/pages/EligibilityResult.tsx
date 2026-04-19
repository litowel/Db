import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle, ArrowRight, Lightbulb, FileCheck2 } from "lucide-react";
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 text-center"
        >
          {isQualified ? (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 border-8 border-emerald-100 mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-50 border-8 border-amber-100 mb-6 shadow-sm">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {isQualified ? "Pre-Qualified for Funding" : "Profile Optimization Required"}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            {isQualified 
              ? "Based on our AI financial analysis parameters, your business model indicates strong baseline metrics for top-tier matched lenders."
              : "Your business model requires a bit more structural traction before matching with our institutional lender network."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-white border-b border-slate-100 pb-5">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 bg-white flex-1">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-700 font-semibold text-sm">Automated Risk Score</span>
                  <Badge variant={riskClass} className="px-3 py-1 text-xs">
                    {riskLabel}
                  </Badge>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${result.riskScore < 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${riskPercentage}%` }}
                  ></div>
                </div>
              </div>

              {isQualified && (
                <div className="pt-5 border-t border-slate-100">
                  <span className="text-slate-500 text-sm font-medium block mb-2">Estimated Cap Limit</span>
                  <span className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    ${result.estimatedFundingMin?.toLocaleString() || 0} - ${result.estimatedFundingMax?.toLocaleString() || 0}
                  </span>
                </div>
              )}
              
              <div className="pt-5 border-t border-slate-100">
                <span className="text-slate-500 text-sm font-medium block mb-3">Suggested Capital Types</span>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedFundingTypes?.length > 0 ? (
                    result.suggestedFundingTypes.map((type, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">{type}</Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">Bootstrapping / Friends & Family</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/40 rounded-2xl h-full flex flex-col">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-5">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> AI Strategic Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8 flex-1">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Key Strengths
                </h4>
                <ul className="space-y-4">
                  {result.insights?.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                      <span className="text-slate-700 leading-relaxed font-medium text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" /> Suggested Improvements
                </h4>
                <ul className="space-y-4">
                  {result.improvements?.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <span className="text-slate-700 leading-relaxed font-medium text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-10 mt-10"
        >
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">
            {isQualified 
              ? "Ready to secure your funding?"
              : "Let's build your funding roadmap."}
          </h3>
          <p className="text-slate-600 mb-8 font-medium text-lg max-w-2xl mx-auto">
            {isQualified
              ? "Join your Funding Access tier to bypass waitlists, execute structured applications instantly, and initiate direct lender matches."
              : "Join our Growth Program to secure monthly actionable guidance until your metrics hit pre-qualification baselines."}
          </p>
          <Button asChild size="lg" className="h-14 px-10 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
            <Link to="/membership">View Verified Match Memberships <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
