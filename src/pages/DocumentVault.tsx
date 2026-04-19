import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { UploadCloud, FileText, Lock, CheckCircle2, Shield, FolderOpen } from "lucide-react";
import { useAuth } from "../components/layout/AuthProvider";

export default function DocumentVault() {
  const { user, dbUser, loading } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, type: string, size: string}[]>([
    { name: "Q1_2026_Bank_Statements.pdf", type: "Financial", size: "2.4 MB" }
  ]);

  if (loading) {
    return <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSimulatedUpload = () => {
    alert("Secure upload initialized. (This is a preview feature)");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Virtual Data Room</h1>
            <p className="text-slate-500 mt-1">Securely manage your KYC, Cap Table, and Financial documents for lender due diligence.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Shield className="w-4 h-4" /> Bank-Level Encryption Active
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100 bg-white">
                <CardTitle>Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                <div className="divide-y divide-slate-100">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500">{file.type} • {file.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">View</Button>
                    </div>
                  ))}
                  {uploadedFiles.length === 0 && (
                    <div className="p-12 text-center">
                      <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">Your data room is empty</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
                  onClick={handleSimulatedUpload}
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mx-auto mb-3 transition-colors" />
                  <p className="text-sm font-medium text-slate-900 mb-1">Click or drag document to upload</p>
                  <p className="text-xs text-slate-500">Supports PDF, XLSX (Max 20MB)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Required Checklist</CardTitle>
                <CardDescription className="text-slate-400">Lenders look for these files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Year-to-Date P&L", done: true },
                  { name: "Prior Year Tax Return", done: false },
                  { name: "Certificate of Incorporation", done: false },
                  { name: "Cap Table", done: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`text-sm ${item.done ? 'text-emerald-400 line-through opacity-80' : 'text-slate-300'}`}>{item.name}</span>
                    {item.done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-3 h-3 text-slate-500" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
