import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { orders } from "@/data/dummyData";
import { Package, MapPin, Clock, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CustomerTracking = () => {
  const [selectedOrderId] = useState('ORD002');
  const order = orders.find(o => o.id === selectedOrderId);

  if (!order) return null;

  const statusSteps = [
    { status: 'Placed', label: 'Order Placed', completed: true },
    { status: 'Accepted', label: 'Accepted', completed: order.status !== 'Placed' },
    { status: 'Packed', label: 'Packed', completed: ['Packed', 'Dispatched', 'Delivered'].includes(order.status) },
    { status: 'Dispatched', label: 'Out for Delivery', completed: ['Dispatched', 'Delivered'].includes(order.status) },
    { status: 'Delivered', label: 'Delivered', completed: order.status === 'Delivered' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Real-time updates on your fresh produce delivery</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{order.order_number}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="relative">
                {statusSteps.map((step, index) => (
                  <div key={step.status} className="flex items-start gap-4 mb-6 last:mb-0">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? <CheckCircle className="h-5 w-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-12 ${step.completed ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {step.completed && step.status === order.status && (
                        <p className="text-sm text-muted-foreground mt-1">Current status</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items ({order.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">₹{item.subtotal}</p>
                </div>
              ))}
              <div className="pt-3 border-t flex justify-between items-center">
                <p className="font-semibold text-lg text-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">₹{order.total_amount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{order.address}</p>
              <p className="text-sm text-muted-foreground mt-2">{order.zone}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Delivery Slot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-primary">{order.delivery_slot}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {order.status === 'Dispatched' ? 'Your order will arrive soon!' : 'Estimated delivery time'}
              </p>
            </CardContent>
          </Card>
        </div>

        {order.status === 'Dispatched' && (
          <Card className="mt-6 shadow-lg border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground mb-4">
                  🚚 Your order is out for delivery!
                </p>
                <p className="text-muted-foreground mb-4">Our rider will reach you in approximately 30 minutes</p>
                <Button className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call Delivery Partner
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CustomerTracking;
