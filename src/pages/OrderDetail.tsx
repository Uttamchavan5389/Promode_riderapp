import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { orders, riders } from "@/data/dummyData";
import { ArrowLeft, Phone, MapPin, Clock, CreditCard, Package, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrderDetail = () => {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/orders">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{order.order_number}</h1>
                <p className="text-sm text-muted-foreground">Order Details</p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity} • ₹{item.price} each</p>
                        </div>
                      </div>
                      <p className="font-semibold text-foreground">₹{item.subtotal}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">₹{order.total_amount}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {order.status === 'Packed' && (
              <Card>
                <CardHeader>
                  <CardTitle>Assign Rider</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select rider" />
                      </SelectTrigger>
                      <SelectContent>
                        {riders.filter(r => r.current_status === 'Available').map((rider) => (
                          <SelectItem key={rider.id} value={rider.id}>
                            {rider.name} - {rider.vehicle_number} (⭐ {rider.rating})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button>Assign & Dispatch</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium text-foreground">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{order.customer_phone}</p>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Delivery Address
                  </p>
                  <p className="text-sm text-foreground">{order.address}</p>
                  <p className="text-sm text-muted-foreground mt-1">{order.zone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium text-foreground">{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Slot</p>
                    <p className="font-medium text-foreground">{order.delivery_slot}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Mode</p>
                    <p className="font-medium text-foreground">{order.payment_mode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <StatusBadge status={order.payment_mode === 'Online' ? 'Delivered' : 'Placed'} />
                  </div>
                </div>
                {order.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-foreground">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
