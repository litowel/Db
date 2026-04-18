import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "motion/react";
import { Building, DollarSign, Globe, Share2 } from "lucide-react";
import { analyzeBusinessEligibility } from "../lib/gemini";

export default function EligibilityCheck() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    revenue: "",
    industry: "",
    country: "",
    socialPresence: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      const revenueNum = parseInt(formData.revenue.replace(/[^0-9]/g, ''));
      
      const analysisInfo = await analyzeBusinessEligibility({
        revenue: revenueNum,
        industry: formData.industry,
        country: formData.country,
        socialPresence: formData.socialPresence
      });

      // Store result in sessionStorage for the next page
      sessionStorage.setItem('eligibilityResult', JSON.stringify(analysisInfo));
      
      navigate("/result");
    } catch (error) {
      console.error("Failed to analyze eligibility:", error);
      setIsAnalyzing(false);
      alert("There was an issue processing your request. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <Card className="border-0 shadow-xl shadow-gray-200/50">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">Check Your Eligibility</CardTitle>
            <CardDescription className="text-base mt-2">
              Our AI analyzes your business profile to match you with the right funding partners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Analyzing your profile...</h3>
                  <p className="text-sm text-gray-500 mt-1">Calculating risk score and matching lenders</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="revenue" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" /> Annual Revenue (USD)
                  </Label>
                  <Input 
                    id="revenue" 
                    placeholder="e.g. 150000" 
                    required 
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry" className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" /> Industry
                  </Label>
                  <select 
                    id="industry"
                    required
                    className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  >
                    <option value="" disabled>Select your industry</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="saas">SaaS / Software</option>
                    <option value="retail">Retail</option>
                    <option value="services">Professional Services</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" /> Operating Country
                  </Label>
                  <Input 
                    id="country" 
                    placeholder="e.g. United States, Nigeria, UK" 
                    required 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-gray-500" /> Social Presence / Website
                  </Label>
                  <Input 
                    id="social" 
                    placeholder="https://yourwebsite.com or LinkedIn profile" 
                    required 
                    value={formData.socialPresence}
                    onChange={(e) => setFormData({...formData, socialPresence: e.target.value})}
                    className="h-12"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg mt-4">
                  Analyze Eligibility
                </Button>
              </form>
            )}
          </CardContent>
          {!isAnalyzing && (
            <CardFooter className="justify-center border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-500 text-center max-w-sm">
                By submitting, you agree to our terms. We do not perform a hard credit pull during this initial check.
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
