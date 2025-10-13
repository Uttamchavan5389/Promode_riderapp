import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse, Package, Truck, BarChart3, MapPin, RefreshCw, ClipboardList } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Promode Agro Farms
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Farm-to-Door Order Management System</p>
          <p className="text-muted-foreground">Fresh produce, tracked from warehouse to your doorstep</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-6 w-6 text-primary" />
                Warehouse Dashboard
              </CardTitle>
              <CardDescription>
                View orders, manage inventory, and track warehouse operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/warehouse">
                <Button className="w-full">Open Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Orders Management
              </CardTitle>
              <CardDescription>
                Browse all orders, update status, and assign riders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/orders">
                <Button className="w-full">View Orders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Pincode Management
              </CardTitle>
              <CardDescription>
                Manage service area pincodes and delivery zones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/pincodes">
                <Button className="w-full">Manage Pincodes</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-primary" />
                Slot Management
              </CardTitle>
              <CardDescription>
                Configure delivery time slots for each pincode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/slots">
                <Button className="w-full">Manage Slots</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-primary" />
                Pick & Pack
              </CardTitle>
              <CardDescription>
                Barcode scanning and order fulfillment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/orders/ORD001/pick">
                <Button className="w-full">Start Picking</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Runsheet Management
              </CardTitle>
              <CardDescription>
                Create and manage delivery batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/runsheets">
                <Button className="w-full">View Runsheets</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Rider Management
              </CardTitle>
              <CardDescription>
                Manage riders, runsheets, COD tracking & onboarding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/rider-management">
                <Button className="w-full">Manage Riders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Rider Portal
              </CardTitle>
              <CardDescription>
                Delivery assignments and route management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/rider">
                <Button className="w-full">Open Rider Portal</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-6 w-6 text-primary" />
                Returns & Refunds
              </CardTitle>
              <CardDescription>
                Process returns and manage refunds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/returns">
                <Button className="w-full">Manage Returns</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>
                Sales reports and performance insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/reports">
                <Button className="w-full">View Reports</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Inventory
              </CardTitle>
              <CardDescription>
                Monitor stock levels and manage products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/inventory">
                <Button className="w-full">View Inventory</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Customer Tracking
              </CardTitle>
              <CardDescription>
                Track your order delivery status in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/track">
                <Button className="w-full" variant="secondary">Track Order</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            🌱 Delivering fresh, organic produce with complete transparency
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
