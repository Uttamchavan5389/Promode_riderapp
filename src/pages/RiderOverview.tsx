import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { riders } from "@/data/dummyData";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  MapPin,
  TrendingUp,
  Clock,
  Package,
  DollarSign,
  FileText,
  Users,
  Activity,
} from "lucide-react";

const RiderOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [zoneFilter, setZoneFilter] = useState("All Zones");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");

  const activeRiders = riders.filter((r) => r.current_status === "On Trip" || r.current_status === "Busy");
  const availableRiders = riders.filter((r) => r.current_status === "Available");
  const totalOrders = riders.reduce((sum, r) => sum + r.orders_out_for_delivery, 0);
  const totalCOD = riders.reduce((sum, r) => sum + r.cod_outstanding, 0);

  const filteredRiders = riders.filter((rider) => {
    const matchesSearch =
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || rider.current_status === statusFilter;
    const matchesZone = zoneFilter === "All Zones";
    const matchesVehicle = vehicleFilter === "All Vehicles" || rider.vehicle_type === vehicleFilter;
    return matchesSearch && matchesStatus && matchesZone && matchesVehicle;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      "On Trip": "default",
      Available: "secondary",
      Busy: "outline",
      Offline: "destructive",
    };
    return variants[status as keyof typeof variants] || "outline";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Rider Overview</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage delivery riders in real-time</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Riders</p>
                  <p className="text-2xl font-bold text-foreground">{riders.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Riders</p>
                  <p className="text-2xl font-bold text-green-600">{activeRiders.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-blue-600">{availableRiders.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders Out</p>
                  <p className="text-2xl font-bold text-orange-600">{totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">COD Outstanding</p>
                  <p className="text-2xl font-bold text-amber-600">₹{totalCOD.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-amber-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Runsheets</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <FileText className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Zones">All Zones</SelectItem>
                </SelectContent>
              </Select>
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Vehicles">All Vehicles</SelectItem>
                  <SelectItem value="Two-Wheeler">Two-Wheeler</SelectItem>
                  <SelectItem value="Three-Wheeler">Three-Wheeler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Active Riders */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Active Riders ({activeRiders.length})</h2>
        </div>

        <div className="grid gap-4">
          {filteredRiders.map((rider) => (
            <Card key={rider.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Rider Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {rider.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-foreground">{rider.name}</h3>
                        <Badge variant={getStatusBadge(rider.current_status) as any}>
                          {rider.current_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{rider.id}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{rider.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{rider.vehicle_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Assignment */}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Current Runsheet</p>
                    <p className="font-medium text-foreground mb-1">RS-2025-001</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Assigned: </span>
                        <span className="font-medium text-foreground">{rider.orders_out_for_delivery + rider.orders_pending_pickup}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Delivered: </span>
                        <span className="font-medium text-green-600">{rider.orders_delivered_today}</span>
                      </div>
                      <div>
                        <span className="text-orange-600">Pending: </span>
                        <span className="font-medium text-orange-600">{rider.orders_out_for_delivery}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Sector 21, Gurgaon</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">2 mins ago</p>
                  </div>

                  {/* Performance */}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Delivery Rate:</p>
                    <p className="text-2xl font-bold text-green-600">{rider.delivery_success_rate.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">Avg Time: {rider.avg_delivery_time_minutes} mins</p>
                    <p className="text-sm text-amber-600 font-medium mt-1">COD Pending: ₹{rider.cod_outstanding.toLocaleString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="whitespace-nowrap">
                      <Phone className="h-3 w-3 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="whitespace-nowrap">
                      <MapPin className="h-3 w-3 mr-2" />
                      Track
                    </Button>
                    <Button size="sm" className="whitespace-nowrap">
                      <FileText className="h-3 w-3 mr-2" />
                      Runsheet
                    </Button>
                    <Button size="sm" variant="outline" className="whitespace-nowrap">
                      Reassign
                    </Button>
                    <Button size="sm" variant="destructive" className="whitespace-nowrap">
                      Suspend Rider
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RiderOverview;
