import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DollarSign, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CODCollectionDialogProps {
  runsheetId: string;
  expectedAmount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CODCollectionDialog = ({
  runsheetId,
  expectedAmount,
  open,
  onOpenChange,
  onSuccess
}: CODCollectionDialogProps) => {
  const [collectedAmount, setCollectedAmount] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!collectedAmount) {
      toast({
        title: "Error",
        description: "Please enter collected amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const collected = parseFloat(collectedAmount);
    const status = collected === expectedAmount 
      ? 'collected' 
      : collected < expectedAmount 
        ? 'partially_collected' 
        : 'collected';

    try {
      // Create or update COD collection record
      const { error: codError } = await supabase
        .from('cod_collections')
        .upsert({
          runsheet_id: runsheetId,
          expected_cod_amount: expectedAmount,
          collected_cod_amount: collected,
          collection_reference: reference,
          status: status as any,
          discrepancy_reason: collected !== expectedAmount ? notes : null
        });

      if (codError) throw codError;

      // Update runsheet status
      const { error: runsheetError } = await supabase
        .from('runsheets')
        .update({
          status: 'Closed' as any,
          close_requested_at: new Date().toISOString(),
          closed_at: new Date().toISOString()
        })
        .eq('id', runsheetId);

      if (runsheetError) throw runsheetError;

      toast({
        title: "Success",
        description: "COD collection recorded and runsheet closed"
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setCollectedAmount("");
      setReference("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record COD collection",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const discrepancy = collectedAmount 
    ? parseFloat(collectedAmount) - expectedAmount 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record COD Collection</DialogTitle>
          <DialogDescription>
            Enter the collected cash amount and collection reference
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Expected COD</span>
              <span className="text-lg font-bold text-foreground">₹{expectedAmount.toFixed(2)}</span>
            </div>
            {discrepancy !== 0 && collectedAmount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discrepancy</span>
                <span className={`text-lg font-bold ${discrepancy < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {discrepancy > 0 ? '+' : ''}₹{discrepancy.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="collected">Collected Amount *</Label>
            <div className="relative mt-2">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="collected"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reference">Collection Reference</Label>
            <Input
              id="reference"
              placeholder="e.g., UPI Txn ID, Receipt Number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="mt-2"
            />
          </div>

          {discrepancy !== 0 && collectedAmount && (
            <div>
              <Label htmlFor="notes">Discrepancy Reason *</Label>
              <Textarea
                id="notes"
                placeholder="Explain the reason for discrepancy..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
            <Upload className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">
              Upload collection proof (optional)
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Recording..." : "Record Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CODCollectionDialog;
