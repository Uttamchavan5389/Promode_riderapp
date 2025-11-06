import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Building2,
  CreditCard,
  Upload,
  Eye,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function RiderOnboardingReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState("details");
  const [rejectionReason, setRejectionReason] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Dummy application data
  const application = {
    application_id: applicationId || "APP-001",
    rider_name: "Ravi Sharma",
    contact_number: "+91 98765 43210",
    alternate_contact: "+91 98765 12345",
    date_of_birth: "1995-03-15",
    full_address: "123, Block A, Sector 21, Gurgaon, Haryana - 122001",
    pincode: "122001",
    vehicle_type: "Two-Wheeler",
    vehicle_registration: "DL-8C-9876",
    referral_name: "Amit Kumar",
    referral_contact: "+91 98765 00000",
    status: "pending_review",
    created_at: "2025-01-03",
    documents: {
      aadhaar_front: { url: "/placeholder.svg", status: "pending", type: "Aadhaar Card (Front)" },
      aadhaar_back: { url: "/placeholder.svg", status: "pending", type: "Aadhaar Card (Back)" },
      pan_card: { url: "/placeholder.svg", status: "pending", type: "PAN Card" },
      driving_license: { url: "/placeholder.svg", status: "pending", type: "Driving License" },
      vehicle_photo: { url: "/placeholder.svg", status: "pending", type: "Vehicle Photo" },
      rc_front: { url: "/placeholder.svg", status: "pending", type: "RC Book (Front)" },
      rc_back: { url: "/placeholder.svg", status: "pending", type: "RC Book (Back)" },
    },
    bank_details: {
      bank_name: "State Bank of India",
      account_holder_name: "Ravi Sharma",
      account_number: "1234567890",
      ifsc_code: "SBIN0001234",
      bank_document: "/placeholder.svg",
      verified: false,
    },
    details_approved: false,
    documents_approved: false,
    bank_approved: false,
  };

  const [docStatuses, setDocStatuses] = useState(application.documents);
  const [detailsApproved, setDetailsApproved] = useState(application.details_approved);
  const [docsApproved, setDocsApproved] = useState(application.documents_approved);
  const [bankApproved, setBankApproved] = useState(application.bank_approved);

  const handleApproveDetails = () => {
    setDetailsApproved(true);
    toast.success("Personal details approved");
  };

  const handleRequestUpdate = () => {
    toast.info("Update request sent to rider");
  };

  const handleApproveDocument = (docKey: string) => {
    setDocStatuses(prev => ({
      ...prev,
      [docKey]: { ...prev[docKey as keyof typeof prev], status: "approved" }
    }));
    toast.success(`${docStatuses[docKey as keyof typeof docStatuses].type} approved`);
  };

  const handleRequestReupload = (docKey: string) => {
    toast.info(`Reupload request sent for ${docStatuses[docKey as keyof typeof docStatuses].type}`);
  };

  const handleApproveAllDocuments = () => {
    const allApproved = Object.keys(docStatuses).every(
      key => docStatuses[key as keyof typeof docStatuses].status === "approved"
    );
    if (allApproved) {
      setDocsApproved(true);
      toast.success("All documents approved");
    } else {
      toast.error("Please approve all documents first");
    }
  };

  const handleApproveBankDetails = () => {
    setBankApproved(true);
    toast.success("Bank details verified and approved");
  };

  const handleRequestBankDocument = () => {
    toast.info("Bank document reupload request sent");
  };

  const handleRejectApplication = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    toast.error("Application rejected");
    navigate("/rider-onboarding-queue");
  };

  const handleApproveAndOnboard = () => {
    if (!detailsApproved || !docsApproved || !bankApproved) {
      toast.error("Please approve all sections before onboarding");
      return;
    }
    toast.success("Rider successfully onboarded!");
    navigate("/rider-onboarding-queue");
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending_review: { label: "Pending Review", variant: "secondary" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "Rejected", variant: "destructive" as const },
    };
    const config = statusConfig[application.status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/rider-onboarding-queue")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Queue
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  Review Application: {application.rider_name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Application ID: {application.application_id} • Applied on {application.created_at}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Approval Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {detailsApproved ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={detailsApproved ? "text-primary font-medium" : "text-muted-foreground"}>
                    Personal Details
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {docsApproved ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={docsApproved ? "text-primary font-medium" : "text-muted-foreground"}>
                    Documents Verified
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {bankApproved ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={bankApproved ? "text-primary font-medium" : "text-muted-foreground"}>
                    Bank Details
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">
                  <User className="h-4 w-4 mr-2" />
                  Rider Details
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

              {/* Rider Details Tab */}
              <TabsContent value="details" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Full Name</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{application.rider_name}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Date of Birth</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{application.date_of_birth}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Contact Number</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{application.contact_number}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Alternate Contact</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{application.alternate_contact}</p>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label className="text-muted-foreground">Full Address</Label>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <p className="font-medium">{application.full_address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Vehicle Type</Label>
                      <p className="font-medium">{application.vehicle_type}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Registration Number</Label>
                      <p className="font-medium">{application.vehicle_registration}</p>
                    </div>
                  </CardContent>
                </Card>

                {application.referral_name && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Referral Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Referral Name</Label>
                        <p className="font-medium">{application.referral_name}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Referral Contact</Label>
                        <p className="font-medium">{application.referral_contact}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleApproveDetails}
                    disabled={detailsApproved}
                    className="flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {detailsApproved ? "Details Approved" : "Approve Details"}
                  </Button>
                  <Button variant="outline" onClick={handleRequestUpdate} className="flex-1">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Request Update
                  </Button>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(docStatuses).map(([key, doc]) => (
                    <Card key={key}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{doc.type}</CardTitle>
                          {doc.status === "approved" && (
                            <Badge variant="default" className="bg-primary">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div 
                          className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setPreviewImage(doc.url)}
                        >
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveDocument(key)}
                            disabled={doc.status === "approved"}
                            className="flex-1"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestReupload(key)}
                            className="flex-1"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Request Reupload
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  onClick={handleApproveAllDocuments}
                  disabled={docsApproved}
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {docsApproved ? "All Documents Approved" : "Approve All Documents"}
                </Button>
              </TabsContent>

              {/* Bank Details Tab */}
              <TabsContent value="bank" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Bank Name</Label>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{application.bank_details.bank_name}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Account Holder Name</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{application.bank_details.account_holder_name}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Account Number</Label>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">••••••{application.bank_details.account_number.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">IFSC Code</Label>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{application.bank_details.ifsc_code}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Canceled Cheque / Bank Passbook</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div 
                      className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => setPreviewImage(application.bank_details.bank_document)}
                    >
                      <Building2 className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApproveBankDetails}
                        disabled={bankApproved}
                        className="flex-1"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {bankApproved ? "Bank Details Verified" : "Verify & Approve Bank Details"}
                      </Button>
                      <Button variant="outline" onClick={handleRequestBankDocument} className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Request Bank Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Final Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Final Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rejection Reason (if applicable)</Label>
                  <Textarea
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleApproveAndOnboard}
                    disabled={!detailsApproved || !docsApproved || !bankApproved}
                    className="flex-1"
                    size="lg"
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Approve & Onboard Rider
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRejectApplication}
                    className="flex-1"
                    size="lg"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Reject Application
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/rider-onboarding-queue")} size="lg">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <FileText className="h-24 w-24 text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
