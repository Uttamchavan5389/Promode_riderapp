import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/data/dummyData";
import { ArrowLeft, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Inventory = () => {
  const lowStockCount = products.filter(p => p.current_stock <= p.min_stock_threshold).length;
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.current_stock, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
                <p className="text-sm text-muted-foreground">{totalProducts} products • {totalStock} total units</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold text-destructive">{lowStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="text-2xl font-bold text-foreground">{totalStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => {
                const stockPercentage = (product.current_stock / (product.current_stock + product.reserved_stock)) * 100;
                const isLowStock = product.current_stock <= product.min_stock_threshold;
                
                return (
                  <div key={product.id} className={`p-6 rounded-lg border ${isLowStock ? 'border-destructive/30 bg-destructive/5' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{product.image}</div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.sku} • {product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{product.current_stock}</p>
                        <p className="text-sm text-muted-foreground">{product.unit} available</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Stock Level</span>
                        <span className="text-foreground font-medium">
                          {product.current_stock} / {product.current_stock + product.reserved_stock}
                        </span>
                      </div>
                      <Progress value={stockPercentage} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Reserved</p>
                        <p className="font-medium text-foreground">{product.reserved_stock} {product.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Min Threshold</p>
                        <p className="font-medium text-foreground">{product.min_stock_threshold} {product.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-medium text-foreground">₹{product.price}/{product.unit}</p>
                      </div>
                    </div>
                    
                    {isLowStock && (
                      <div className="mt-4 flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Low stock alert - Reorder required</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Inventory;
