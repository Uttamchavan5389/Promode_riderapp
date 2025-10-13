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
import { Clock, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Pincode {
  id: string;
  pincode: string;
  area_name: string;
}

interface DeliverySlot {
  id: string;
  pincode_id: string;
  delivery_date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  max_orders: number;
  current_orders: number;
  active: boolean;
  pincodes?: Pincode;
}

const SlotManagement = () => {
  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<DeliverySlot | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    pincode_id: string;
    delivery_date: string;
    start_time: string;
    end_time: string;
    shift_type: string;
    max_orders: number;
    active: boolean;
  }>({
    pincode_id: "",
    delivery_date: format(new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "12:00",
    shift_type: "Morning" as string,
    max_orders: 20,
    active: true
  });

  useEffect(() => {
    fetchPincodes();
    fetchSlots();
  }, []);

  const fetchPincodes = async () => {
    try {
      // @ts-ignore - Supabase types will regenerate
      const { data, error } = await supabase
        .from("pincodes")
        .select("id, pincode, area_name")
        .eq("status", true)
        .order("pincode");

      if (error) throw error;
      setPincodes(data || []);
    } catch (error) {
      console.error("Error fetching pincodes:", error);
    }
  };

  const fetchSlots = async () => {
    try {
      // @ts-ignore - Supabase types will regenerate
      const { data, error } = await supabase
        .from("delivery_slots")
        .select(`
          *,
          pincodes (
            id,
            pincode,
            area_name
          )
        `)
        .order("delivery_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast({
        title: "Error",
        description: "Failed to load delivery slots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSlot) {
        // @ts-ignore - Supabase types will regenerate
        const { error } = await supabase
          .from("delivery_slots")
          .update({
            pincode_id: formData.pincode_id,
            delivery_date: formData.delivery_date,
            start_time: formData.start_time,
            end_time: formData.end_time,
            shift_type: formData.shift_type as "Morning" | "Afternoon" | "Evening",
            max_orders: formData.max_orders,
            active: formData.active
          })
          .eq("id", editingSlot.id);

        if (error) throw error;
        toast({ title: "Success", description: "Slot updated successfully" });
      } else {
        // @ts-ignore - Supabase types will regenerate
        const { error } = await supabase
          .from("delivery_slots")
          .insert([{
            pincode_id: formData.pincode_id,
            delivery_date: formData.delivery_date,
            start_time: formData.start_time,
            end_time: formData.end_time,
            shift_type: formData.shift_type as "Morning" | "Afternoon" | "Evening",
            max_orders: formData.max_orders,
            current_orders: 0,
            active: formData.active
          }]);

        if (error) throw error;
        toast({ title: "Success", description: "Slot created successfully" });
      }

      fetchSlots();
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving slot:", error);
      toast({
        title: "Error",
        description: "Failed to save slot",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      // @ts-ignore - Supabase types will regenerate
      const { error } = await supabase
        .from("delivery_slots")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Slot deleted successfully" });
      fetchSlots();
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast({
        title: "Error",
        description: "Failed to delete slot",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (slot: DeliverySlot) => {
    setEditingSlot(slot);
    setFormData({
      pincode_id: slot.pincode_id,
      delivery_date: slot.delivery_date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      shift_type: slot.shift_type as string,
      max_orders: slot.max_orders,
      active: slot.active
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSlot(null);
    setFormData({
      pincode_id: "",
      delivery_date: format(new Date(), "yyyy-MM-dd"),
      start_time: "09:00",
      end_time: "12:00",
      shift_type: "Morning",
      max_orders: 20,
      active: true
    });
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // @ts-ignore - Supabase types will regenerate
      const { error } = await supabase
        .from("delivery_slots")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Slot ${!currentStatus ? 'activated' : 'deactivated'}` 
      });
      fetchSlots();
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
            <Clock className="h-8 w-8 text-primary" />
            Delivery Slot Management
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Delivery Time Slots</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSlot ? "Edit Slot" : "Create New Slot"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="pincode_id">Pincode</Label>
                      <Select
                        value={formData.pincode_id}
                        onValueChange={(value) => setFormData({ ...formData, pincode_id: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pincode" />
                        </SelectTrigger>
                        <SelectContent>
                          {pincodes.map((pincode) => (
                            <SelectItem key={pincode.id} value={pincode.id}>
                              {pincode.pincode} - {pincode.area_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="delivery_date">Delivery Date</Label>
                      <Input
                        id="delivery_date"
                        type="date"
                        value={formData.delivery_date}
                        onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input
                          id="start_time"
                          type="time"
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_time">End Time</Label>
                        <Input
                          id="end_time"
                          type="time"
                          value={formData.end_time}
                          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="shift_type">Shift Type</Label>
                      <Select
                        value={formData.shift_type}
                        onValueChange={(value) => setFormData({ ...formData, shift_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Afternoon">Afternoon</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="max_orders">Maximum Orders</Label>
                      <Input
                        id="max_orders"
                        type="number"
                        value={formData.max_orders}
                        onChange={(e) => setFormData({ ...formData, max_orders: parseInt(e.target.value) })}
                        min="1"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingSlot ? "Update" : "Create"} Slot
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
                    <TableHead>Date</TableHead>
                    <TableHead>Pincode</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{format(new Date(slot.delivery_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        {slot.pincodes?.pincode} - {slot.pincodes?.area_name}
                      </TableCell>
                      <TableCell>
                        {slot.start_time} - {slot.end_time}
                      </TableCell>
                      <TableCell>{slot.shift_type}</TableCell>
                      <TableCell>
                        {slot.current_orders} / {slot.max_orders}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={slot.active}
                          onCheckedChange={() => toggleStatus(slot.id, slot.active)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(slot)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(slot.id)}
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

export default SlotManagement;