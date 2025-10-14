import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  UserPlus,
  FileText,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Dummy data for rider applications
const riderApplications = [
  {
    id: "RA-001",
    rider_name: "Rajesh Kumar",
    contact_number: "9876543210",
    alternate_contact: "9876543211",
    vehicle_type: "2-Wheeler",
    vehicle_registration: "DL01AB1234",
    pincode: "110001",
    full_address: "123, Main Street, Delhi",
    date_of_birth: "1995-01-15",
    referral_name: "Amit Singh",
    referral_contact: "9876543212",
    status: "pending_review",
    created_at: "2025-01-10",
    documents: [
      { type: "aadhar_front", url: "/placeholder.svg", status: "pending" },
      { type: "aadhar_back", url: "/placeholder.svg", status: "pending" },
      { type: "pan_card", url: "/placeholder.svg", status: "pending" },
      { type: "driving_license_front", url: "/placeholder.svg", status: "pending" },
      { type: "driving_license_back", url: "/placeholder.svg", status: "pending" },
      { type: "vehicle_image", url: "/placeholder.svg", status: "pending" },
      { type: "rc_front", url: "/placeholder.svg", status: "pending" },
      { type: "rc_back", url: "/placeholder.svg", status: "pending" },
    ],
    bank_details: {
      bank_name: "State Bank of India",
      account_holder_name: "Rajesh Kumar",
      account_number: "12345678901234",
      ifsc_code: "SBIN0001234",
      verified: false
    }
  }
];

const RiderOnboardingQueue = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredApplications = riderApplications.filter(app =>
    app.rider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.contact_number.includes(searchQuery) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = () => {
    toast({
      title: "Rider Approved",
      description: `${selectedApplication.rider_name} has been approved and added to active riders.`,
    });
    setSelectedApplication(null);
    navigate("/rider-overview");
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Application Rejected",
      description: `${selectedApplication.rider_name}'s application has been rejected.`,
      variant: "destructive",
    });
    setSelectedApplication(null);
    setRejectionReason("");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Rider Onboarding Queue</h1>
              <p className="text-sm text-muted-foreground">Review and approve new rider applications</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <UserPlus className="h-4 w-4 mr-2" />
              {filteredApplications.length} Pending
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Applications</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Rider Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Vehicle Type</TableHead>
                  <TableHead>Pincode</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id}</TableCell>
                    <TableCell>{application.rider_name}</TableCell>
                    <TableCell>{application.contact_number}</TableCell>
                    <TableCell>{application.vehicle_type}</TableCell>
                    <TableCell>{application.pincode}</TableCell>
                    <TableCell>{application.created_at}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Pending Review
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredApplications.length} application(s)
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">{currentPage}</span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Review Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Rider Application</DialogTitle>
            <DialogDescription>
              Review all details and documents before approving or rejecting
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Personal Details
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="bank">
                  <Building2 className="h-4 w-4 mr-2" />
                  Bank Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Rider Name</Label>
                    <p className="font-medium">{selectedApplication.rider_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date of Birth</Label>
                    <p className="font-medium">{selectedApplication.date_of_birth}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact Number</Label>
                    <p className="font-medium">{selectedApplication.contact_number}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Alternate Contact</Label>
                    <p className="font-medium">{selectedApplication.alternate_contact}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Full Address</Label>
                    <p className="font-medium">{selectedApplication.full_address}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Pincode</Label>
                    <p className="font-medium">{selectedApplication.pincode}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Vehicle Type</Label>
                    <p className="font-medium">{selectedApplication.vehicle_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Vehicle Registration</Label>
                    <p className="font-medium">{selectedApplication.vehicle_registration}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Referral Name</Label>
                    <p className="font-medium">{selectedApplication.referral_name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Referral Contact</Label>
                    <p className="font-medium">{selectedApplication.referral_contact || "N/A"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedApplication.documents.map((doc: any, idx: number) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Label className="text-sm font-medium capitalize">
                            {doc.type.replace(/_/g, " ")}
                          </Label>
                          <Badge 
                            variant="outline" 
                            className="ml-2 bg-warning/10 text-warning border-warning/20"
                          >
                            Pending
                          </Badge>
                        </div>
                      </div>
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-3">
                        <CreditCard className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Full
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Bank Name</Label>
                    <p className="font-medium">{selectedApplication.bank_details.bank_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Account Holder Name</Label>
                    <p className="font-medium">{selectedApplication.bank_details.account_holder_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Account Number</Label>
                    <p className="font-medium">{selectedApplication.bank_details.account_number}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">IFSC Code</Label>
                    <p className="font-medium">{selectedApplication.bank_details.ifsc_code}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Verification Status</Label>
                    <Badge variant="outline" className="ml-2 bg-warning/10 text-warning border-warning/20">
                      Not Verified
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="border-t pt-4 space-y-4">
            <div>
              <Label>Admin Notes / Rejection Reason</Label>
              <Textarea
                placeholder="Enter notes or rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleReject}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject Application
              </Button>
              <Button onClick={handleApprove} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Approve & Onboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RiderOnboardingQueue;
