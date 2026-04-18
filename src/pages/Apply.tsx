import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { CheckCircle2, FileText, Building2, DollarSign } from "lucide-react";
import { useAuth } from "../components/layout/AuthProvider";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Apply() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    founded: "",
    employees: "",
    description: "",
    mrr: "",
    fundingNeeded: "",
    purpose: ""
  });

  if (loading) {
    return <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      
      try {
        const mockAiSummary = `${formData.companyName} is a company founded in ${formData.founded} with ${formData.employees} employees, currently generating $${formData.mrr} in MRR. They are seeking $${formData.fundingNeeded} primarily for ${formData.purpose}.`;

        const newApp = {
          userId: user.uid,
          amountRequested: parseInt(formData.fundingNeeded) || 0,
          purpose: formData.purpose,
          aiSummary: mockAiSummary,
          status: "SUBMITTED",
          createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "applications"), newApp);
        
        navigate("/dashboard");
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "applications");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-300" style={{ width: `${(step - 1) * 50}%` }}></div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Business Details"}
              {step === 2 && "Financial Information"}
              {step === 3 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell lenders about your company structure and operations."}
              {step === 2 && "Provide high-level financial metrics to generate your AI summary."}
              {step === 3 && "Review your AI-generated application summary before sending to partners."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitting ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-medium text-gray-900">Submitting to Partner Network...</p>
                <p className="text-sm text-gray-500">Generating AI summary and matching with lenders</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Legal Company Name</Label>
                      <Input id="companyName" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Acme Corp LLC" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="founded">Year Founded</Label>
                        <Input id="founded" type="number" value={formData.founded} onChange={e => setFormData({...formData, founded: e.target.value})} placeholder="2020" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employees">Number of Employees</Label>
                        <select id="employees" value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" required>
                          <option value="">Select...</option>
                          <option value="1-10">1-10</option>
                          <option value="11-50">11-50</option>
                          <option value="51-200">51-200</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Brief Description</Label>
                      <textarea 
                        id="description" 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        placeholder="What does your business do?"
                        required
                      ></textarea>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                      <Label htmlFor="mrr">Monthly Recurring Revenue (MRR)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input id="mrr" type="number" value={formData.mrr} onChange={e => setFormData({...formData, mrr: e.target.value})} className="pl-10" placeholder="15000" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fundingNeeded">Amount Requested</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input id="fundingNeeded" type="number" value={formData.fundingNeeded} onChange={e => setFormData({...formData, fundingNeeded: e.target.value})} className="pl-10" placeholder="50000" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Use of Funds</Label>
                      <select id="purpose" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" required>
                        <option value="">Select primary use...</option>
                        <option value="marketing">Marketing & Acquisition</option>
                        <option value="inventory">Inventory Purchase</option>
                        <option value="hiring">Hiring / Payroll</option>
                        <option value="expansion">Expansion</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">AI-Generated Application Summary</h3>
                      </div>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        "{formData.companyName || 'Your company'} is a business founded in {formData.founded || 'recent years'} with {formData.employees || 'a few'} employees, currently generating ${formData.mrr || '0'} in MRR. They are seeking ${formData.fundingNeeded || '0'} primarily for {formData.purpose || 'business growth'}."
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Matching with Partner Lenders</p>
                        <p className="text-xs text-gray-500 mt-1">Your application will be securely routed to our network of matched lenders.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-6 border-t border-gray-100">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  <Button type="submit">
                    {step === 3 ? "Submit Application" : "Continue"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
