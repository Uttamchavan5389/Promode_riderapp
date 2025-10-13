import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orders, products } from "@/data/dummyData";
import { Download, TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react";

const Reports = () => {
  const totalSales = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const topProducts = products
    .map(p => ({
      ...p,
      soldQty: orders
        .filter(o => o.status === 'Delivered')
        .flatMap(o => o.items)
        .filter(i => i.product_id === p.id)
        .reduce((sum, i) => sum + i.quantity, 0)
    }))
    .sort((a, b) => b.soldQty - a.soldQty)
    .slice(0, 5);

  const statusCounts = {
    placed: orders.filter(o => o.status === 'Placed').length,
    packed: orders.filter(o => o.status === 'Packed').length,
    dispatched: orders.filter(o => o.status === 'Dispatched').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    returned: orders.filter(o => o.status === 'Returned').length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-sm text-muted-foreground">Sales and performance insights</p>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{totalSales}</p>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{Math.round(totalSales / orders.length)}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.delivered}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Placed</span>
                  <span className="font-medium text-foreground">{statusCounts.placed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Packed</span>
                  <span className="font-medium text-foreground">{statusCounts.packed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Dispatched</span>
                  <span className="font-medium text-foreground">{statusCounts.dispatched}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Delivered</span>
                  <span className="font-medium text-primary">{statusCounts.delivered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Returned</span>
                  <span className="font-medium text-destructive">{statusCounts.returned}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{product.soldQty} units</p>
                      <p className="text-xs text-muted-foreground">₹{product.soldQty * product.price}</p>
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

export default Reports;
