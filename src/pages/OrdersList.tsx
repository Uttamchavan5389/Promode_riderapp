import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { orders, type OrderStatus, type PaymentMode } from "@/data/dummyData";
import { ArrowLeft, Search, Package, CheckCircle, XCircle, Clock, Calendar, MapPin, User, Phone, Filter, ChevronDown, ChevronUp, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";

const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMode | "all">("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.payment_mode === paymentFilter;
    const matchesZone = zoneFilter === "all" || order.zone === zoneFilter;
    
    return matchesSearch && matchesStatus && matchesPayment && matchesZone;
  });

  const zones = Array.from(new Set(orders.map(o => o.zone)));

  const orderStats = useMemo(() => ({
    total: orders.length,
    placed: orders.filter(o => o.status === 'Placed').length,
    accepted: orders.filter(o => o.status === 'Accepted').length,
    packed: orders.filter(o => o.status === 'Packed').length,
    dispatched: orders.filter(o => o.status === 'Dispatched').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    returned: orders.filter(o => o.status === 'Returned').length,
  }), []);

  const getPaymentStatus = (order: typeof orders[0]) => {
    if (order.payment_mode === 'Online') return 'PAID';
    if (order.status === 'Delivered') return 'PAID';
    return 'PENDING';
  };

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
                <h1 className="text-2xl font-bold text-foreground">All Orders</h1>
                <p className="text-sm text-muted-foreground">{filteredOrders.length} orders found</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-primary">{orderStats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Placed</p>
              <p className="text-2xl font-bold text-blue-600">{orderStats.placed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Accepted</p>
              <p className="text-2xl font-bold text-cyan-600">{orderStats.accepted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Returned</p>
              <p className="text-2xl font-bold text-orange-600">{orderStats.returned}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number or customer name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 min-w-[120px]"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {showFilters && (
            <Card className="animate-fade-in">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Placed">Placed</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Packed">Packed</SelectItem>
                      <SelectItem value="Dispatched">Dispatched</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment</SelectItem>
                      <SelectItem value="COD">COD</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={zoneFilter} onValueChange={setZoneFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Zones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      {zones.map(zone => (
                        <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer border-l-4" style={{
                borderLeftColor: order.status === 'Delivered' ? 'hsl(var(--success))' : 
                                order.status === 'Cancelled' ? 'hsl(var(--destructive))' : 
                                order.status === 'Placed' ? 'hsl(var(--primary))' : 
                                'hsl(var(--muted))'
              }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-foreground">{order.order_number}</h3>
                        <Badge 
                          variant={getPaymentStatus(order) === 'PAID' ? 'default' : 'secondary'}
                          className={getPaymentStatus(order) === 'PAID' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'}
                        >
                          {getPaymentStatus(order)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {order.payment_mode}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{order.customer_phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Oct 10, 2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={order.status} />
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-lg text-foreground">₹{order.total_amount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm py-3 border-t border-b">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full p-2 bg-orange-100">
                        <Package className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="font-semibold text-foreground">{order.items.length} items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full p-2 bg-blue-100">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Delivery Slot</p>
                        <p className="font-semibold text-foreground truncate">{order.delivery_slot}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full p-2 bg-green-100">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Zone</p>
                        <p className="font-semibold text-foreground">{order.zone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full p-2 bg-purple-100">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-semibold text-foreground">{order.status}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {order.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OrdersList;
