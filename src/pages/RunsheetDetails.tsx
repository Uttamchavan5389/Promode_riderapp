import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Phone, MapPin, Clock, Package, DollarSign, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RunsheetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");

  // Dummy data
  const runsheet = {
    id: "RS-2025-001",
    rider: { name: "Rajesh Kumar (RD001)", phone: "+91 9876543210" },
    zone: "Sector 21",
    departure: "2025-01-11 at 09:30 AM",
    created: "2025-01-11 09:15 AM",
    totalOrders: 5,
    delivered: 2,
    prepaidTotal: 3300,
    codExpected: 2800,
    codCollected: 850,
  };

  const orders = [
    {
      id: "ORD-2025-1001",
      customer: "Anita Sharma",
      phone: "+91 9988776655",
      items: "Fresh Vegetables (2kg), Fruits (1kg)",
      address: "B-45, Sector 21, Gurgaon - 122001",
      amount: 850,
      payment: "COD",
      status: "Delivered",
      deliveryTime: "10:15 AM",
    },
    {
      id: "ORD-2025-1002",
      customer: "Rahul Verma",
      phone: "+91 9123456789",
      items: "Organic Dal (1kg), Rice (5kg)",
      address: "C-12, Sector 21, Gurgaon - 122001",
      amount: 1200,
      payment: "PREPAID",
      status: "Delivered",
      deliveryTime: "10:45 AM",
    },
    {
      id: "ORD-2025-1003",
      customer: "Meera Patel",
      phone: "+91 9765432109",
      items: "Farm Fresh Milk (2L), Eggs (12)",
      address: "D-78, Sector 22, Gurgaon - 122002",
      amount: 450,
      payment: "COD",
      status: "Out for Delivery",
      deliveryTime: "-",
    },
    {
      id: "ORD-2025-1004",
      customer: "Sunil Kapoor",
      phone: "+91 9654321098",
      items: "Honey (500g), Ghee (1kg)",
      address: "E-34, Sector 21, Gurgaon - 122001",
      amount: 2100,
      payment: "PREPAID",
      status: "Out for Delivery",
      deliveryTime: "-",
    },
    {
      id: "ORD-2025-1005",
      customer: "Kavita Singh",
      phone: "+91 9543210987",
      items: "Seasonal Fruits Mix (3kg)",
      address: "F-56, Sector 23, Gurgaon - 122003",
      amount: 1500,
      payment: "COD",
      status: "Assigned",
      deliveryTime: "-",
    },
  ];

  const handleCloseRunsheet = () => {
    if (!collectedAmount) {
      toast({
        title: "Error",
        description: "Please enter the collected amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Runsheet Closed",
      description: `Runsheet ${id} has been closed successfully`,
    });
    setCloseDialogOpen(false);
    navigate("/runsheets");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Delivered: "default",
      "Out for Delivery": "secondary",
      Assigned: "outline",
    };
    return variants[status as keyof typeof variants] || "outline";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/runsheets")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Runsheet Details</h1>
                <p className="text-sm text-muted-foreground">{id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Rider
              </Button>
              <Button variant="outline" size="sm">
                Notify Rider
              </Button>
              <Button variant="outline" size="sm">
                Reassign Rider
              </Button>
              <Button size="sm" onClick={() => setCloseDialogOpen(true)}>
                Close Runsheet
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{runsheet.totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">
                    {runsheet.delivered}/{runsheet.totalOrders}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prepaid Total</p>
                  <p className="text-2xl font-bold text-blue-600">₹{runsheet.prepaidTotal.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">COD Expected</p>
                  <p className="text-2xl font-bold text-amber-600">₹{runsheet.codExpected.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-amber-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Runsheet Information */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Runsheet Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Rider</p>
                  <p className="font-medium text-foreground">{runsheet.rider.name}</p>
                  <p className="text-sm text-muted-foreground">{runsheet.rider.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Zone</p>
                  <p className="font-medium text-foreground">{runsheet.zone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Departure</p>
                  <p className="font-medium text-foreground">{runsheet.departure}</p>
                  <p className="text-xs text-muted-foreground">Created: {runsheet.created}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Orders ({orders.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payment</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Delivery Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">{order.id}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-foreground">{order.items}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-foreground">{order.address}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">₹{order.amount}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={order.payment === "COD" ? "secondary" : "default"}>
                          {order.payment}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusBadge(order.status) as any}>{order.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-foreground">{order.deliveryTime}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Close Runsheet Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Runsheet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Expected COD Collection</Label>
              <p className="text-lg font-bold text-foreground">₹{runsheet.codExpected}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">COD Collected from Delivered Orders</Label>
              <p className="text-lg font-bold text-green-600">₹{runsheet.codCollected}</p>
            </div>
            <div>
              <Label htmlFor="collected-amount">Actual Amount Collected *</Label>
              <Input
                id="collected-amount"
                type="number"
                placeholder="Enter collected amount"
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payment-mode">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger id="payment-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseRunsheet}>Close Runsheet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RunsheetDetails;
