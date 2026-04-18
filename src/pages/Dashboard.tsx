import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { FileText, TrendingUp, AlertCircle, CheckCircle2, Clock, Building2 } from "lucide-react";
import { useAuth } from "../components/layout/AuthProvider";

export default function Dashboard() {
  const { user, dbUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Determine membership label
  let memberLabel = "No Membership";
  let memberBadgeStatus: "outline" | "default" | "secondary" | "success" = "outline";
  
  if (dbUser?.membershipTier === "FUNDING_ACCESS") {
    memberLabel = "Funding Access Member";
    memberBadgeStatus = "success";
  } else if (dbUser?.membershipTier === "GROWTH") {
    memberLabel = "Growth Member";
    memberBadgeStatus = "secondary";
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.displayName || user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={memberBadgeStatus} className="px-3 py-1 text-sm">
              {memberLabel}
            </Badge>
            <Button asChild>
              <Link to="/apply">New Application</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Eligibility Status</p>
                <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Qualified <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Applications</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Offers</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content - Applications */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No active applications</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">You haven't submitted any funding applications yet. Check your eligibility and apply to get matched with lenders.</p>
                  <Button asChild variant="outline" className="mt-2">
                    <Link to="/apply">Start Application</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - AI Insights */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg">AI Business Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Optimize Your Profile</h4>
                  <p className="text-sm text-gray-600">Consider updating your company details. Complete profiles attract 40% more lender interest.</p>
                </div>
                {dbUser?.membershipTier === "NONE" && (
                  <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Upgrade Membership</h4>
                    <p className="text-sm text-gray-600">Join the Funding Access tier to get direct matching with our premium partner network.</p>
                    <Button asChild variant="link" className="px-0 h-auto mt-2 text-blue-600">
                      <Link to="/membership">View Plans &rarr;</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
