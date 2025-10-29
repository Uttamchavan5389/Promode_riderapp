import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WarehouseDashboard from "./pages/WarehouseDashboard";
import OrdersList from "./pages/OrdersList";
import OrderDetail from "./pages/OrderDetail";
import Inventory from "./pages/Inventory";
import CustomerTracking from "./pages/CustomerTracking";
import RunsheetManagement from "./pages/RunsheetManagement";
import PickAndPack from "./pages/PickAndPack";
import RiderPortal from "./pages/RiderPortal";
import CreateRunsheet from "./pages/CreateRunsheet";
import CashCollectionManagement from "./pages/CashCollectionManagement";
import DeliveryAction from "./pages/DeliveryAction";
import ReturnsManagement from "./pages/ReturnsManagement";
import Reports from "./pages/Reports";
import PincodeManagement from "./pages/PincodeManagement";
import SlotManagement from "./pages/SlotManagement";
import RiderManagementDashboard from "./pages/RiderManagementDashboard";
import RiderOnboarding from "./pages/RiderOnboarding";
import RiderOverview from "./pages/RiderOverview";
import EnhancedRiderOverview from "./pages/EnhancedRiderOverview";
import RunsheetDetails from "./pages/RunsheetDetails";
import RiderOnboardingReview from "./pages/RiderOnboardingReview";
import RiderOnboardingQueue from "./pages/RiderOnboardingQueue";
import RiderRunsheets from "./pages/RiderRunsheets";
import CashVerificationDetails from "./pages/CashVerificationDetails";
import CollectionDetailsView from "./pages/CollectionDetailsView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/warehouse" element={<WarehouseDashboard />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/orders/:id/pick" element={<PickAndPack />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pincodes" element={<PincodeManagement />} />
            <Route path="/slots" element={<SlotManagement />} />
            <Route path="/runsheet-management" element={<RunsheetManagement />} />
            <Route path="/returns" element={<ReturnsManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/rider" element={<RiderPortal />} />
            <Route path="/rider/delivery/:id" element={<DeliveryAction />} />
            <Route path="/rider-management" element={<RiderManagementDashboard />} />
            <Route path="/rider-onboarding" element={<RiderOnboarding />} />
            <Route path="/rider-onboarding-review" element={<RiderOnboardingReview />} />
              <Route path="/rider-overview" element={<EnhancedRiderOverview />} />
              <Route path="/rider-onboarding-queue" element={<RiderOnboardingQueue />} />
            <Route path="/runsheets/:id" element={<RunsheetDetails />} />
            <Route path="/rider-runsheets/:riderId" element={<RiderRunsheets />} />
            <Route path="/create-runsheet" element={<CreateRunsheet />} />
            <Route path="/cash-collection" element={<CashCollectionManagement />} />
            <Route path="/cash-verification/:id" element={<CashVerificationDetails />} />
            <Route path="/collection-details/:id" element={<CollectionDetailsView />} />
            <Route path="/track" element={<CustomerTracking />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
