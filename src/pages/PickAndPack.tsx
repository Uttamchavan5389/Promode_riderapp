import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/StatusBadge";
import { orders } from "@/data/dummyData";
import { ArrowLeft, Package, CheckCircle2, XCircle, Scan, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PickAndPack = () => {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});
  const [barcodeInput, setBarcodeInput] = useState("");

  if (!order) {
    return <div>Order not found</div>;
  }

  const toggleItem = (itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const allItemsPicked = order.items.every(item => pickedItems[item.id]);

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
                <h1 className="text-2xl font-bold text-foreground">Pick & Pack</h1>
                <p className="text-sm text-muted-foreground">{order.order_number}</p>
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
                  <Scan className="h-5 w-5" />
                  Barcode Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Scan or enter barcode/SKU"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button>Verify</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Items to Pick ({Object.keys(pickedItems).filter(k => pickedItems[k]).length}/{order.items.length})
                  </span>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print List
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const isPicked = pickedItems[item.id];
                    return (
                      <div 
                        key={item.id} 
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                          isPicked ? 'bg-primary/5 border-primary' : 'bg-card'
                        }`}
                      >
                        <Checkbox
                          checked={isPicked}
                          onCheckedChange={() => toggleItem(item.id)}
                          id={item.id}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{item.product_name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity} • ₹{item.price} each</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPicked ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">Mark unavailable items:</p>
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item to mark unavailable" />
                    </SelectTrigger>
                    <SelectContent>
                      {order.items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.product_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    This will trigger refund/substitution for the customer
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Slot</p>
                  <p className="font-medium text-foreground">{order.delivery_slot}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm text-foreground">{order.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  disabled={!allItemsPicked}
                >
                  Mark as Packed
                </Button>
                <Button variant="outline" className="w-full">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Packing Slip
                </Button>
                <Button variant="outline" className="w-full">
                  Assign to Picker
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PickAndPack;
