import { KPICard } from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { orders, products } from "@/data/dummyData";
import { Package, TrendingUp, Truck, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WarehouseDashboard = () => {
  const todayOrders = orders.length;
  const packedOrders = orders.filter(o => o.status === 'Packed').length;
  const outForDelivery = orders.filter(o => o.status === 'Dispatched').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const lowStock = products.filter(p => p.current_stock <= p.min_stock_threshold);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Promode Agro Farms</h1>
              <p className="text-sm text-muted-foreground">Warehouse Management System</p>
            </div>
            <div className="flex gap-3">
              <Link to="/orders">
                <Button>View All Orders</Button>
              </Link>
              <Link to="/inventory">
                <Button variant="outline">Inventory</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-1 text-foreground">Today's Overview</h2>
          <p className="text-sm text-muted-foreground">January 10, 2025</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Orders Today" value={todayOrders} icon={Package} trend="8% from yesterday" trendUp />
          <KPICard title="Packed" value={packedOrders} icon={TrendingUp} />
          <KPICard title="Out for Delivery" value={outForDelivery} icon={Truck} />
          <KPICard title="Delivered" value={delivered} icon={CheckCircle} trend="12% from yesterday" trendUp />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <Link key={order.id} to={`/orders/${order.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-foreground">₹{order.total_amount}</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStock.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.image}</span>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-destructive">{product.current_stock} {product.unit}</p>
                      <p className="text-xs text-muted-foreground">Min: {product.min_stock_threshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default WarehouseDashboard;
