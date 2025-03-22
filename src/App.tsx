
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AnimatePresence } from "@/components/AnimatePresence";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";

// Layout
import Layout from "@/components/Layout";

// Pages
import Dashboard from "@/pages/Dashboard";
import EmissionsTracker from "@/pages/EmissionsTracker";
import SupplyChain from "@/pages/SupplyChain";
import NetZeroPlanner from "@/pages/NetZeroPlanner";
import CarbonImpact from "@/pages/CarbonImpact";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ScrollToTop />
              <AnimatePresence>
                <Routes>
                  {/* Public routes */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                  </Route>
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="emissions" element={<EmissionsTracker />} />
                      <Route path="supply-chain" element={<SupplyChain />} />
                      <Route path="net-zero-planner" element={<NetZeroPlanner />} />
                      <Route path="carbon-impact" element={<CarbonImpact />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Route>
                </Routes>
              </AnimatePresence>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

export default App;
