import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "motion/react";
import { Building, DollarSign, Globe, Share2, Check, UploadCloud, FileText, X } from "lucide-react";
import { analyzeBusinessEligibility } from "../lib/gemini";

export default function EligibilityCheck() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    revenue: "",
    industry: "",
    country: "",
    socialPresence: ""
  });
  
  const [statementFile, setStatementFile] = useState<File | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Allow pdf, csv, excel, image
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setStatementFile(file);
    }
  };

  const removeFile = () => {
    setStatementFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedUrl && !isWebsiteConfirmed) {
      alert("Please confirm your website preview before analyzing eligibility.");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const revenueNum = parseInt(formData.revenue.replace(/[^0-9]/g, ''));
      
      let documentFileObj = undefined;

      // Convert statement file to inline base64 data for Gemini
      if (statementFile) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(statementFile);
        });
        
        if (typeof reader.result === 'string') {
          // dataURL format: data:image/png;base64,iVBORw0KGgo...
          const base64Data = reader.result.split(',')[1];
          const mimeType = reader.result.split(',')[0].split(':')[1].split(';')[0];
          documentFileObj = { mimeType, data: base64Data };
        }
      }
      
      const analysisInfo = await analyzeBusinessEligibility({
        revenue: revenueNum,
        industry: formData.industry,
        country: formData.country,
        socialPresence: debouncedUrl || formData.socialPresence,
        hasFinancialStatement: !!statementFile,
        documentFile: documentFileObj
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-100/40 to-transparent pointer-events-none"></div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/95 backdrop-blur-xl">
          <CardHeader className="text-center pb-8 pt-10 px-10 border-b border-slate-100/50 bg-slate-50/30">
            <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">Check Your Eligibility</CardTitle>
            <CardDescription className="text-base mt-3 text-slate-500 font-light">
              Our AI analyzes your business profile to match you with the right funding partners securely.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
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
                <div className="space-y-3">
                  <Label htmlFor="revenue" className="flex items-center gap-2 text-slate-700 font-medium">
                    <DollarSign className="w-4 h-4 text-slate-400" /> Annual Revenue (USD)
                  </Label>
                  <Input 
                    id="revenue" 
                    placeholder="e.g. 150000" 
                    required 
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                    className="h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-500/20 text-lg rounded-xl transition-all"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="industry" className="flex items-center gap-2 text-slate-700 font-medium">
                    <Building className="w-4 h-4 text-slate-400" /> Industry
                  </Label>
                  <select 
                    id="industry"
                    required
                    className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-lg text-slate-800 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all appearance-none"
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

                <div className="space-y-3">
                  <Label htmlFor="country" className="flex items-center gap-2 text-slate-700 font-medium">
                    <Globe className="w-4 h-4 text-slate-400" /> Operating Country
                  </Label>
                  <Input 
                    id="country" 
                    placeholder="e.g. United States, Nigeria, UK" 
                    required 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-500/20 text-lg rounded-xl transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="social" className="flex items-center gap-2 text-slate-700 font-medium">
                    <Share2 className="w-4 h-4 text-slate-400" /> Business Website
                  </Label>
                  <Input 
                    id="social" 
                    placeholder="e.g. yourwebsite.com" 
                    required 
                    value={formData.socialPresence}
                    onChange={(e) => setFormData({...formData, socialPresence: e.target.value})}
                    className="h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-500/20 text-lg rounded-xl transition-all"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-medium">
                    <FileText className="w-4 h-4 text-slate-400" /> Recent Financial Statement (Optional)
                  </Label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      id="financial_statement"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
                    />
                    {!statementFile ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-14 border-dashed border-2 border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 gap-2 rounded-xl"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud className="w-5 h-5 text-slate-400" />
                        Upload Document (PDF, Image)
                      </Button>
                    ) : (
                      <div className="w-full h-14 border border-blue-200 bg-blue-50/50 rounded-xl px-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                          <span className="text-sm font-medium text-blue-900 truncate">{statementFile.name}</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-500"
                          onClick={removeFile}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Securely upload a recent bank statement or P&L statement to significantly improve funding match accuracy.</p>
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
                  className={`w-full h-14 text-lg mt-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all ${debouncedUrl && !isWebsiteConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
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
