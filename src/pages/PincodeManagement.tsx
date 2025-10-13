// @ts-nocheck - Supabase types will regenerate automatically
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Pincode {
  id: string;
  pincode: string;
  area_name: string;
  delivery_type: string;
  status: boolean;
  cutoff_time: string | null;
  notes: string | null;
}

const PincodeManagement = () => {
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPincode, setEditingPincode] = useState<Pincode | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    pincode: string;
    area_name: string;
    delivery_type: string;
    status: boolean;
    cutoff_time: string;
    notes: string;
  }>({
    pincode: "",
    area_name: "",
    delivery_type: "Next Day" as string,
    status: true,
    cutoff_time: "18:00",
    notes: ""
  });

  useEffect(() => {
    fetchPincodes();
  }, []);

  const fetchPincodes = async () => {
    try {
      // @ts-ignore - Supabase types will regenerate
      const { data, error } = await supabase
        .from("pincodes")
        .select("*")
        .order("pincode");

      if (error) throw error;
      setPincodes(data || []);
    } catch (error) {
      console.error("Error fetching pincodes:", error);
      toast({
        title: "Error",
        description: "Failed to load pincodes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPincode) {
        // @ts-ignore - Supabase types will regenerate
        const { error } = await supabase
          .from("pincodes")
          .update({
            pincode: formData.pincode,
            area_name: formData.area_name,
            delivery_type: formData.delivery_type as "Same Day" | "Next Day" | "Scheduled",
            status: formData.status,
            cutoff_time: formData.cutoff_time,
            notes: formData.notes
          })
          .eq("id", editingPincode.id);

        if (error) throw error;
        toast({ title: "Success", description: "Pincode updated successfully" });
      } else {
        // @ts-ignore - Supabase types will regenerate
        const { error } = await supabase
          .from("pincodes")
          .insert([{
            pincode: formData.pincode,
            area_name: formData.area_name,
            delivery_type: formData.delivery_type as "Same Day" | "Next Day" | "Scheduled",
            status: formData.status,
            cutoff_time: formData.cutoff_time,
            notes: formData.notes
          }]);

        if (error) throw error;
        toast({ title: "Success", description: "Pincode added successfully" });
      }

      fetchPincodes();
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving pincode:", error);
      toast({
        title: "Error",
        description: "Failed to save pincode",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pincode?")) return;

    try {
      // @ts-ignore - Supabase types will regenerate
      const { error } = await supabase
        .from("pincodes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Pincode deleted successfully" });
      fetchPincodes();
    } catch (error) {
      console.error("Error deleting pincode:", error);
      toast({
        title: "Error",
        description: "Failed to delete pincode",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (pincode: Pincode) => {
    setEditingPincode(pincode);
    setFormData({
      pincode: pincode.pincode,
      area_name: pincode.area_name,
      delivery_type: pincode.delivery_type as string,
      status: pincode.status,
      cutoff_time: pincode.cutoff_time || "18:00",
      notes: pincode.notes || ""
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPincode(null);
    setFormData({
      pincode: "",
      area_name: "",
      delivery_type: "Next Day",
      status: true,
      cutoff_time: "18:00",
      notes: ""
    });
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // @ts-ignore - Supabase types will regenerate
      const { error } = await supabase
        .from("pincodes")
        .update({ status: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Pincode ${!currentStatus ? 'activated' : 'deactivated'}` 
      });
      fetchPincodes();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/warehouse">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            Pincode Management
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Service Area Pincodes</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pincode
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingPincode ? "Edit Pincode" : "Add New Pincode"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="122001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="area_name">Area Name</Label>
                      <Input
                        id="area_name"
                        value={formData.area_name}
                        onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
                        placeholder="Sector 15, Gurugram"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery_type">Delivery Type</Label>
                      <Select
                        value={formData.delivery_type}
                        onValueChange={(value) => setFormData({ ...formData, delivery_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Same Day">Same Day</SelectItem>
                          <SelectItem value="Next Day">Next Day</SelectItem>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cutoff_time">Cutoff Time</Label>
                      <Input
                        id="cutoff_time"
                        type="time"
                        value={formData.cutoff_time}
                        onChange={(e) => setFormData({ ...formData, cutoff_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Optional notes"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="status"
                        checked={formData.status}
                        onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                      />
                      <Label htmlFor="status">Active</Label>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingPincode ? "Update" : "Add"} Pincode
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pincode</TableHead>
                    <TableHead>Area Name</TableHead>
                    <TableHead>Delivery Type</TableHead>
                    <TableHead>Cutoff Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pincodes.map((pincode) => (
                    <TableRow key={pincode.id}>
                      <TableCell className="font-medium">{pincode.pincode}</TableCell>
                      <TableCell>{pincode.area_name}</TableCell>
                      <TableCell>{pincode.delivery_type}</TableCell>
                      <TableCell>{pincode.cutoff_time || "N/A"}</TableCell>
                      <TableCell>
                        <Switch
                          checked={pincode.status}
                          onCheckedChange={() => toggleStatus(pincode.id, pincode.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(pincode)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(pincode.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PincodeManagement;