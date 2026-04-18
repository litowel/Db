import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "motion/react";
import { Building, DollarSign, Globe, Share2, Check } from "lucide-react";
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
  
  const [debouncedUrl, setDebouncedUrl] = useState("");
  const [isWebsiteConfirmed, setIsWebsiteConfirmed] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Basic URL validation
      if (formData.socialPresence && formData.socialPresence.includes('.')) {
        let url = formData.socialPresence;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        setDebouncedUrl(url);
        setIsWebsiteConfirmed(false); // Reset confirmation if URL changes
      } else {
        setDebouncedUrl("");
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [formData.socialPresence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedUrl && !isWebsiteConfirmed) {
      alert("Please confirm your website preview before analyzing eligibility.");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const revenueNum = parseInt(formData.revenue.replace(/[^0-9]/g, ''));
      
      const analysisInfo = await analyzeBusinessEligibility({
        revenue: revenueNum,
        industry: formData.industry,
        country: formData.country,
        socialPresence: debouncedUrl || formData.socialPresence
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
                    <Share2 className="w-4 h-4 text-gray-500" /> Business Website
                  </Label>
                  <Input 
                    id="social" 
                    placeholder="e.g. yourwebsite.com" 
                    required 
                    value={formData.socialPresence}
                    onChange={(e) => setFormData({...formData, socialPresence: e.target.value})}
                    className="h-12"
                  />
                </div>

                {debouncedUrl && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 border border-blue-100 bg-blue-50/50 p-4 rounded-xl"
                  >
                    <Label className="text-sm font-semibold text-blue-900 block">Website Preview</Label>
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                        {/* Using an API to bypass iframe X-Frame-Options blocking common on modern sites */}
                        <img 
                            src={`https://api.microlink.io/?url=${encodeURIComponent(debouncedUrl)}&screenshot=true&meta=false&embed=screenshot.url`}
                            alt="Website Preview"
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://loremflickr.com/600/400/website?lock=${debouncedUrl.length}`;
                            }}
                        />
                        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur text-xs px-2 py-1 rounded shadow-sm flex items-center gap-2 truncate">
                           <Globe className="w-3 h-3 text-blue-500 shrink-0" />
                           <span className="truncate">{debouncedUrl}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100 shadow-sm pr-2">
                        <span className="text-sm text-gray-700 font-medium">Is this your business website?</span>
                        <Button 
                            type="button" 
                            variant={isWebsiteConfirmed ? "default" : "outline"}
                            size="sm"
                            className={`gap-2 transition-colors ${isWebsiteConfirmed ? "bg-green-600 hover:bg-green-700" : "hover:border-blue-300"}`}
                            onClick={() => setIsWebsiteConfirmed(!isWebsiteConfirmed)}
                        >
                            {isWebsiteConfirmed ? <Check className="w-4 h-4" /> : null}
                            {isWebsiteConfirmed ? "Confirmed" : "Yes, confirm"}
                        </Button>
                    </div>
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  className={`w-full h-12 text-lg mt-4 ${debouncedUrl && !isWebsiteConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!!debouncedUrl && !isWebsiteConfirmed}
                >
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
