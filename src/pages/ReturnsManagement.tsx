import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/data/dummyData";
import { Package, RefreshCw, CheckCircle2, DollarSign } from "lucide-react";

const ReturnsManagement = () => {
  const returnedOrders = orders.filter(o => o.status === 'Returned');

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Returns & Refunds</h1>
            <p className="text-sm text-muted-foreground">Process returns and manage refunds</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{returnedOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Returns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{returnedOrders.reduce((sum, o) => sum + o.total_amount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Refund Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Restocked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Returns</CardTitle>
          </CardHeader>
          <CardContent>
            {returnedOrders.length === 0 ? (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending returns</p>
              </div>
            ) : (
              <div className="space-y-4">
                {returnedOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-medium text-foreground">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <Badge variant="destructive">Returned</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <p className="text-foreground">{item.product_name} × {item.quantity}</p>
                          <p className="text-muted-foreground">₹{item.subtotal}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Refund Amount</p>
                        <p className="text-lg font-bold text-foreground">₹{order.total_amount}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Mark Restockable
                        </Button>
                        <Button size="sm">
                          Process Refund
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReturnsManagement;
