import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, X, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RiderOnboardingReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("id") || "APP-001";
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("details");
  const [rejectionReason, setRejectionReason] = useState("");

  // Dummy data
  const application = {
    id: applicationId,
    riderName: "Ravi Sharma",
    phone: "+91 98765 43210",
    alternateContact: "+91 98765 12345",
    dob: "1995-03-15",
    address: "123, Block A, Sector 21, Gurgaon, Haryana - 122001",
    vehicleType: "Two-Wheeler",
    vehicleRegistration: "DL-8C-9876",
    referralName: "",
    referralContact: "",
    status: "Pending Review",
    documentsStatus: "Needs Review",
    bankStatus: "Pending",
    documents: {
      pan: { status: "pending", url: "/placeholder.svg" },
      aadharFront: { status: "pending", url: "/placeholder.svg" },
      aadharBack: { status: "pending", url: "/placeholder.svg" },
      drivingLicense: { status: "pending", url: "/placeholder.svg" },
      vehiclePhoto: { status: "pending", url: "/placeholder.svg" },
    },
    bankDetails: {
      accountNumber: "XXXX XXXX 1234",
      confirmAccountNumber: "XXXX XXXX 1234",
      ifscCode: "SBIN0001234",
      bankName: "State Bank of India",
      accountHolderName: "Ravi Sharma",
      bankDocumentUrl: "/placeholder.svg",
    },
  };

  const handleApproveDetails = () => {
    toast({
      title: "Details Approved",
      description: "Rider details have been approved",
    });
  };

  const handleRequestUpdate = () => {
    toast({
      title: "Update Requested",
      description: "Rider will be notified to update details",
    });
  };

  const handleApproveDocument = (docType: string) => {
    toast({
      title: "Document Approved",
      description: `${docType} has been approved`,
    });
  };

  const handleRequestReupload = (docType: string) => {
    toast({
      title: "Reupload Requested",
      description: `Reupload requested for ${docType}`,
      variant: "destructive",
    });
  };

  const handleApproveAllDocuments = () => {
    toast({
      title: "All Documents Approved",
      description: "All documents have been approved successfully",
    });
  };

  const handleApproveBankDetails = () => {
    toast({
      title: "Bank Details Approved",
      description: "Bank details have been verified and approved",
    });
  };

  const handleApproveAndOnboard = () => {
    toast({
      title: "Rider Onboarded",
      description: `${application.riderName} has been successfully onboarded`,
    });
    setTimeout(() => {
      navigate("/rider-onboarding");
    }, 1500);
  };

  const handleRejectApplication = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Application Rejected",
      description: `Application rejected: ${rejectionReason}`,
      variant: "destructive",
    });
    setTimeout(() => {
      navigate("/rider-onboarding");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/rider-onboarding")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Review Application: {application.riderName} ({applicationId})
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{application.status}</Badge>
                  <Badge variant="outline">{application.documentsStatus}</Badge>
                  <Badge variant="outline">{application.bankStatus}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Rider Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
          </TabsList>

          {/* Tab 1: Rider Details */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.riderName}</p>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.phone}</p>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.dob}</p>
                  </div>
                  <div>
                    <Label>Alternate Contact</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.alternateContact}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Full Address</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.address}</p>
                  </div>
                  <div>
                    <Label>Vehicle Type</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.vehicleType}</p>
                  </div>
                  <div>
                    <Label>Vehicle Registration</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.vehicleRegistration}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleApproveDetails}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Details
                  </Button>
                  <Button variant="outline" onClick={handleRequestUpdate}>
                    Request Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Documents */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(application.documents).map(([key, doc]) => (
                <Card key={key}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </h3>
                        <Badge variant={doc.status === "approved" ? "default" : "secondary"}>
                          {doc.status}
                        </Badge>
                      </div>
                      <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleApproveDocument(key)}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleRequestReupload(key)}
                        >
                          Request Reupload
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleApproveAllDocuments}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve All Documents
              </Button>
              <Button variant="outline">
                Bulk Request Reupload
              </Button>
            </div>
          </TabsContent>

          {/* Tab 3: Bank Details */}
          <TabsContent value="bank" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Bank Name</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <Label>Account Holder Name</Label>
                    <p className="text-lg font-medium text-foreground mt-1">{application.bankDetails.accountHolderName}</p>
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <p className="text-lg font-medium text-foreground mt-1 font-mono">{application.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <Label>Confirm Account Number</Label>
                    <p className="text-lg font-medium text-foreground mt-1 font-mono">{application.bankDetails.confirmAccountNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label>IFSC Code</Label>
                    <p className="text-lg font-medium text-foreground mt-1 font-mono">{application.bankDetails.ifscCode}</p>
                  </div>
                </div>

                <div>
                  <Label>Canceled Cheque / Bank Passbook</Label>
                  <div className="mt-2 bg-muted rounded-lg aspect-video flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleApproveBankDetails}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Bank Details
                  </Button>
                  <Button variant="outline">
                    Request Bank Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Final Actions */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate("/rider-onboarding")}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRejectApplication}>
                  <X className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
                <Button onClick={handleApproveAndOnboard}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Onboard Rider
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RiderOnboardingReview;
