/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import EligibilityCheck from "./pages/EligibilityCheck";
import EligibilityResult from "./pages/EligibilityResult";
import Membership from "./pages/Membership";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";
import DocumentVault from "./pages/DocumentVault";
import { AuthProvider } from "./components/layout/AuthProvider";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="eligibility" element={<EligibilityCheck />} />
              <Route path="result" element={<EligibilityResult />} />
              <Route path="membership" element={<Membership />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="apply" element={<Apply />} />
              <Route path="vault" element={<DocumentVault />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
