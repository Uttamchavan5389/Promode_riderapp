import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, XCircle, AlertCircle, Clock, 
  Upload, Eye, ChevronLeft, User, FileText, CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RiderApplication {
  id: string;
  rider_name: string;
  date_of_birth: string;
  contact_number: string;
  alternate_contact: string;
  referral_name: string;
  referral_contact: string;
  full_address: string;
  pincode: string;
  vehicle_type: string;
  vehicle_registration: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

interface Document {
  id: string;
  document_type: string;
  file_url: string;
  status: string;
  admin_notes: string;
  uploaded_at: string;
}

interface BankDetails {
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_document_url: string;
  verified: boolean;
  admin_notes: string;
}

const RiderOnboarding = () => {
  const [applications, setApplications] = useState<RiderApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<RiderApplication | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (selectedApplication) {
      fetchDocuments(selectedApplication.id);
      fetchBankDetails(selectedApplication.id);
    }
  }, [selectedApplication]);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('rider_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
      return;
    }
    
    setApplications(data || []);
  };

  const fetchDocuments = async (applicationId: string) => {
    const { data, error } = await supabase
      .from('rider_documents')
      .select('*')
      .eq('application_id', applicationId);
    
    if (error) {
      console.error("Error fetching documents:", error);
      return;
    }
    
    setDocuments(data || []);
  };

  const fetchBankDetails = async (applicationId: string) => {
    const { data, error } = await supabase
      .from('rider_bank_details')
      .select('*')
      .eq('application_id', applicationId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching bank details:", error);
      return;
    }
    
    setBankDetails(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending_review': return 'bg-yellow-500';
      case 'pending_docs': return 'bg-orange-500';
      case 'pending_bank': return 'bg-blue-500';
      case 'needs_reupload': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    const { error } = await supabase
      .from('rider_applications')
      .update({ 
        status: status as any,
        admin_notes: notes || adminNotes 
      })
      .eq('id', applicationId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Application status updated"
    });
    
    fetchApplications();
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication({ ...selectedApplication, status, admin_notes: notes || adminNotes });
    }
  };

  const updateDocumentStatus = async (documentId: string, status: string, notes: string) => {
    const { error } = await supabase
      .from('rider_documents')
      .update({ 
        status: status as any,
        admin_notes: notes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', documentId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Document status updated"
    });
    
    if (selectedApplication) {
      fetchDocuments(selectedApplication.id);
    }
  };

  const verifyBankDetails = async (applicationId: string, verified: boolean, notes: string) => {
    const { error } = await supabase
      .from('rider_bank_details')
      .update({ 
        verified,
        admin_notes: notes,
        verified_at: verified ? new Date().toISOString() : null
      })
      .eq('application_id', applicationId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to verify bank details",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: verified ? "Bank details verified" : "Bank verification removed"
    });
    
    fetchBankDetails(applicationId);
  };

  const approveApplication = async () => {
    if (!selectedApplication) return;

    // Check if all requirements are met
    const allDocsApproved = documents.every(doc => doc.status === 'approved');
    const bankVerified = bankDetails?.verified;

    if (!allDocsApproved || !bankVerified) {
      toast({
        title: "Cannot Approve",
        description: "All documents must be approved and bank details verified",
        variant: "destructive"
      });
      return;
    }

    await updateApplicationStatus(selectedApplication.id, 'approved', 'Application approved and rider onboarded');
    
    // Create rider entry
    const { error: riderError } = await supabase
      .from('riders')
      .insert({
        name: selectedApplication.rider_name,
        phone: selectedApplication.contact_number,
        vehicle_number: selectedApplication.vehicle_registration,
        current_status: 'Available'
      });

    if (riderError) {
      toast({
        title: "Error",
        description: "Failed to create rider profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Application Approved!",
        description: "Rider has been successfully onboarded"
      });
      setSelectedApplication(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/rider-management">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Rider Onboarding</h1>
                <p className="text-sm text-muted-foreground">Review and verify new rider applications</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Applications Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApplication(app)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedApplication?.id === app.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{app.rider_name}</p>
                        <p className="text-xs text-muted-foreground">{app.contact_number}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(app.status)}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getStatusLabel(app.status)}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {applications.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No applications pending</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-2">
            {selectedApplication ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedApplication.rider_name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Application ID: {selectedApplication.id.substring(0, 8)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {getStatusLabel(selectedApplication.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">
                        <User className="h-4 w-4 mr-2" />
                        Details
                      </TabsTrigger>
                      <TabsTrigger value="documents">
                        <FileText className="h-4 w-4 mr-2" />
                        Documents
                      </TabsTrigger>
                      <TabsTrigger value="bank">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Bank
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Full Name</Label>
                          <p className="font-medium">{selectedApplication.rider_name}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Date of Birth</Label>
                          <p className="font-medium">{new Date(selectedApplication.date_of_birth).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Contact Number</Label>
                          <p className="font-medium">{selectedApplication.contact_number}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Alternate Contact</Label>
                          <p className="font-medium">{selectedApplication.alternate_contact || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Address</Label>
                          <p className="font-medium">{selectedApplication.full_address}</p>
                          <p className="text-sm text-muted-foreground">Pincode: {selectedApplication.pincode}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Vehicle Type</Label>
                          <p className="font-medium">{selectedApplication.vehicle_type}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Vehicle Registration</Label>
                          <p className="font-medium">{selectedApplication.vehicle_registration}</p>
                        </div>
                        {selectedApplication.referral_name && (
                          <>
                            <div>
                              <Label className="text-muted-foreground">Referral Name</Label>
                              <p className="font-medium">{selectedApplication.referral_name}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Referral Contact</Label>
                              <p className="font-medium">{selectedApplication.referral_contact}</p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <Label>Admin Notes</Label>
                        <Textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add notes about this application..."
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => updateApplicationStatus(selectedApplication.id, 'pending_docs', adminNotes)}
                        >
                          Request Documents
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', adminNotes)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map((doc) => (
                          <Card key={doc.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">
                                  {doc.document_type.split('_').map(w => 
                                    w.charAt(0).toUpperCase() + w.slice(1)
                                  ).join(' ')}
                                </p>
                                <Badge 
                                  variant={doc.status === 'approved' ? 'default' : 'outline'}
                                  className="text-xs"
                                >
                                  {doc.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div 
                                className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setImagePreview(doc.file_url)}
                              >
                                <img 
                                  src={doc.file_url} 
                                  alt={doc.document_type}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateDocumentStatus(doc.id, 'approved', 'Document approved')}
                                  disabled={doc.status === 'approved'}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateDocumentStatus(doc.id, 'reupload_requested', 'Please reupload clearer image')}
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Request Reupload
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {documents.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No documents uploaded yet</p>
                      )}
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-4 mt-4">
                      {bankDetails ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground">Bank Name</Label>
                              <p className="font-medium">{bankDetails.bank_name}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Account Holder</Label>
                              <p className="font-medium">{bankDetails.account_holder_name}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Account Number</Label>
                              <p className="font-medium">{bankDetails.account_number}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">IFSC Code</Label>
                              <p className="font-medium">{bankDetails.ifsc_code}</p>
                            </div>
                            {bankDetails.bank_document_url && (
                              <div className="col-span-2">
                                <Label className="text-muted-foreground">Cancelled Cheque / Passbook</Label>
                                <div 
                                  className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setImagePreview(bankDetails.bank_document_url)}
                                >
                                  <img 
                                    src={bankDetails.bank_document_url} 
                                    alt="Bank document"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                            {bankDetails.verified ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-sm font-medium">Bank details verified</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium">Bank details pending verification</span>
                              </>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {!bankDetails.verified ? (
                              <Button 
                                onClick={() => verifyBankDetails(selectedApplication.id, true, 'Bank details verified')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Verify Bank Details
                              </Button>
                            ) : (
                              <Button 
                                variant="outline"
                                onClick={() => verifyBankDetails(selectedApplication.id, false, 'Verification removed')}
                              >
                                Remove Verification
                              </Button>
                            )}
                            <Button variant="outline">
                              Request Bank Document
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No bank details provided yet</p>
                      )}
                    </TabsContent>
                  </Tabs>

                  {/* Final Approval Section */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">Final Approval</h3>
                        <p className="text-sm text-muted-foreground">
                          All documents and bank details must be verified
                        </p>
                      </div>
                      <Button 
                        size="lg"
                        onClick={approveApplication}
                        disabled={
                          !documents.every(doc => doc.status === 'approved') ||
                          !bankDetails?.verified ||
                          selectedApplication.status === 'approved'
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve & Onboard Rider
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select an application to review</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Image Preview Dialog */}
      <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Document preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RiderOnboarding;
