import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";

import MemberBenefits from "./pages/MemberBenefits";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import EventManagementAdmin from "./pages/EventManagementAdmin";
import CouponManagementAdmin from "./pages/CouponManagementAdmin";
import Events from "./pages/Events";
import Advocacy from "./pages/Advocacy";
import Resources from "./pages/Resources";
import FindLocalChapter from "./pages/FindLocalChapter";
import MemberDirectory from "./pages/MemberDirectory";
import MemberProfile from "./pages/MemberProfile";
import NotFound from "./pages/NotFound";
import JobBoard from "./pages/JobBoard";
import Forums from "./pages/Forums";
import VideoLibrary from "./pages/VideoLibrary";
import ChapterLeaderboard from "./pages/ChapterLeaderboard";
import ReferralProgram from "./pages/ReferralProgram";
import Onboarding from "./pages/Onboarding";
import PendingApproval from "./pages/PendingApproval";
import Certification from "./pages/Certification";
import VerifyCertification from "./pages/VerifyCertification";
import MarketReports from "./pages/MarketReports";
import MemberAnalytics from "./pages/MemberAnalytics";
import Messages from "./pages/Messages";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import FeaturedMembershipsAdmin from "./pages/FeaturedMembershipsAdmin";
import AdManagement from "./pages/AdManagement";
import AdvertiserSignup from "./pages/AdvertiserSignup";
import AdvertiserLogin from "./pages/AdvertiserLogin";
import AdvertiserDashboard from "./pages/AdvertiserDashboard";
import AdvancedAdvertiserAnalytics from "./pages/AdvancedAdvertiserAnalytics";
import AdvertiserProfile from "./pages/AdvertiserProfile";
import AdvertiserBilling from "./pages/AdvertiserBilling";
import Billing from "./pages/Billing";
import DebugSignup from "./pages/DebugSignup";
import SignupFlowTest from "./pages/SignupFlowTest";
import ApprovalQueue from "./pages/ApprovalQueue";
import FeaturedMemberTracking from "./pages/FeaturedMemberTracking";
import RenewFeatured from "./pages/RenewFeatured";

import { CookieConsent } from "./components/CookieConsent";
import { useEffect } from "react";
import { trackPageView } from "./lib/analytics";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AuthProvider>
              {/* Session diagnostic - only shows in development */}
              {/* <SessionDiagnostic /> */}
              
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/member-benefits" element={<MemberBenefits />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/jobs" element={<JobBoard />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsArticle />} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/chapter-leaderboard" element={<ChapterLeaderboard />} />
                <Route path="/verify-certification" element={<VerifyCertification />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/renew-featured" element={<RenewFeatured />} />

                {/* Advertiser routes (public) */}
                <Route path="/advertiser/signup" element={<AdvertiserSignup />} />
                <Route path="/advertiser/login" element={<AdvertiserLogin />} />
                <Route path="/advertiser/dashboard" element={<AdvertiserDashboard />} />
                <Route path="/advertiser/analytics" element={<AdvancedAdvertiserAnalytics />} />
                <Route path="/advertiser/profile" element={<AdvertiserProfile />} />
                <Route path="/advertiser/billing" element={<AdvertiserBilling />} />

                {/* Onboarding - Accessible during signup/payment flow */}
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Protected member routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/events" element={<Events />} />
                <Route path="/advocacy" element={<ProtectedRoute><Advocacy /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                <Route path="/market-reports" element={<ProtectedRoute><MarketReports /></ProtectedRoute>} />
                <Route path="/find-local-chapter" element={<ProtectedRoute><FindLocalChapter /></ProtectedRoute>} />
                <Route path="/member-directory" element={<ProtectedRoute><MemberDirectory /></ProtectedRoute>} />
                <Route path="/members/:id" element={<ProtectedRoute><MemberProfile /></ProtectedRoute>} />
                <Route path="/videos" element={<ProtectedRoute><VideoLibrary /></ProtectedRoute>} />
                <Route path="/referral-program" element={<ProtectedRoute><ReferralProgram /></ProtectedRoute>} />
                <Route path="/certification" element={<ProtectedRoute><Certification /></ProtectedRoute>} />
                <Route path="/my-analytics" element={<ProtectedRoute><MemberAnalytics /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path="/admin/user" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/event" element={<AdminRoute><EventManagementAdmin /></AdminRoute>} />
                <Route path="/admin/coupons" element={<AdminRoute><CouponManagementAdmin /></AdminRoute>} />
                <Route path="/admin/featured-memberships" element={<AdminRoute><FeaturedMembershipsAdmin /></AdminRoute>} />
                <Route path="/admin/advertisements" element={<AdminRoute><AdManagement /></AdminRoute>} />
                <Route path="/admin/approval-queue" element={<AdminRoute><ApprovalQueue /></AdminRoute>} />
                <Route path="/admin/featured-member-tracking" element={<AdminRoute><FeaturedMemberTracking /></AdminRoute>} />
                <Route path="/debug-signup" element={<AdminRoute><DebugSignup /></AdminRoute>} />
                <Route path="/signup-flow-test" element={<AdminRoute><SignupFlowTest /></AdminRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieConsent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;