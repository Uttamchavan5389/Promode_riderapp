import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { runsheets, orders, riders } from "@/data/dummyData";
import { Plus, MapPin, Clock, User, Phone, Package } from "lucide-react";
import { Link } from "react-router-dom";

const RunsheetManagement = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Runsheet Management</h1>
              <p className="text-sm text-muted-foreground">Create and manage delivery batches</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Runsheet
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-6">
          {runsheets.map((runsheet) => {
            const rider = riders.find(r => r.id === runsheet.rider_id);
            const assignedOrders = orders.filter(o => runsheet.orders_assigned.includes(o.id));
            
            return (
              <Card key={runsheet.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">{runsheet.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">{new Date(runsheet.run_date).toLocaleDateString('en-GB')}</p>
                      </div>
                      <Badge variant={
                        runsheet.status === 'Completed' ? 'default' :
                        runsheet.status === 'In Transit' ? 'secondary' : 'outline'
                      }>
                        {runsheet.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Print</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Rider</p>
                        <p className="font-medium text-foreground">{rider?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{rider?.phone}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{rider?.vehicle_number}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Route Zone</p>
                        <p className="font-medium text-foreground">{runsheet.route_zone}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Est. Time: {runsheet.estimated_time}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Stops</p>
                        <p className="font-medium text-foreground">{runsheet.total_stops} orders</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Total Amount: ₹{assignedOrders.reduce((sum, o) => sum + o.total_amount, 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <p className="text-sm font-medium text-foreground mb-3">Orders in this runsheet:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {assignedOrders.map((order) => (
                        <Link key={order.id} to={`/orders/${order.id}`}>
                          <div className="p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm text-foreground">{order.order_number}</p>
                              <Badge variant="outline" className="text-xs">{order.status}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{order.address}</p>
                            <p className="text-sm font-medium text-primary mt-2">₹{order.total_amount}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default RunsheetManagement;
