import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  FileText,
  Package,
  IndianRupee,
  Eye,
  Calendar,
} from "lucide-react";
import { runsheets, orders } from "@/data/dummyData";

const RiderRunsheets = () => {
  const { riderId } = useParams();
  const navigate = useNavigate();

  // Get rider's runsheets (in real app, filter by rider ID)
  const riderRunsheets = runsheets.filter((r) => r.rider_id === riderId);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Rider Runsheets</h1>
                <p className="text-sm text-muted-foreground">All runsheets assigned to this rider</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Runsheets</p>
                  <p className="text-3xl font-bold text-foreground">{riderRunsheets.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-3xl font-bold text-success">
                    {riderRunsheets.filter((r) => r.status === "Completed").length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-success opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-accent">
                    {riderRunsheets.filter((r) => r.status === "In Transit").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total COD</p>
                  <p className="text-2xl font-bold text-warning">
                    ₹
                    {riderRunsheets
                      .reduce((sum, r) => {
                        const runsheetOrders = r.orders_assigned
                          .map((orderId) => orders.find((o) => o.id === orderId))
                          .filter(Boolean);
                        const codTotal = runsheetOrders
                          .filter((o) => o?.payment_mode === "COD")
                          .reduce((s, o) => s + (o?.total_amount || 0), 0);
                        return sum + codTotal;
                      }, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <IndianRupee className="h-8 w-8 text-warning opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Runsheets List */}
        <div className="space-y-4">
          {riderRunsheets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No runsheets found for this rider</p>
              </CardContent>
            </Card>
          ) : (
            riderRunsheets.map((runsheet) => {
              const runsheetOrders = runsheet.orders_assigned
                .map((orderId) => orders.find((o) => o.id === orderId))
                .filter(Boolean);
              const totalOrders = runsheetOrders.length;
              const deliveredOrders = runsheetOrders.filter((o) => o?.status === "Delivered").length;
              const progress = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;
              const prepaidTotal = runsheetOrders
                .filter((o) => o?.payment_mode === "Online")
                .reduce((sum, o) => sum + (o?.total_amount || 0), 0);
              const codTotal = runsheetOrders
                .filter((o) => o?.payment_mode === "COD")
                .reduce((sum, o) => sum + (o?.total_amount || 0), 0);

              return (
                <Card key={runsheet.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Runsheet Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">{runsheet.id}</h3>
                            <Badge variant={runsheet.status === "In Transit" ? "default" : "outline"}>
                              {runsheet.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Date: {runsheet.run_date}</p>
                          <p className="text-sm text-muted-foreground">Zone: {runsheet.route_zone}</p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-2">Order Progress</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Delivered: {deliveredOrders}/{totalOrders}
                            </span>
                            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>

                      {/* Financial */}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Prepaid:</p>
                        <p className="text-lg font-bold text-success mb-2">₹{prepaidTotal.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mb-1">COD:</p>
                        <p className="text-lg font-bold text-warning">₹{codTotal.toLocaleString()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => navigate(`/runsheets/${runsheet.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default RiderRunsheets;
