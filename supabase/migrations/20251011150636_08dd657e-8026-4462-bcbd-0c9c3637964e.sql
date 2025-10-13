-- Create enum types for rider application status
CREATE TYPE rider_application_status AS ENUM ('pending_review', 'pending_docs', 'pending_bank', 'approved', 'rejected', 'needs_reupload');

CREATE TYPE document_type AS ENUM ('pan', 'aadhar_front', 'aadhar_back', 'license_front', 'license_back', 'rc_front', 'rc_back', 'vehicle_photo', 'selfie_with_id', 'bank_cheque');

CREATE TYPE document_status AS ENUM ('pending', 'approved', 'reupload_requested', 'rejected');

CREATE TYPE cod_collection_status AS ENUM ('expected', 'collected', 'partially_collected', 'shortfall', 'verified', 'discrepancy');

-- Rider Applications table (for onboarding)
CREATE TABLE public.rider_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  contact_number TEXT NOT NULL,
  alternate_contact TEXT,
  referral_name TEXT,
  referral_contact TEXT,
  full_address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_registration TEXT NOT NULL,
  status rider_application_status NOT NULL DEFAULT 'pending_review',
  admin_notes TEXT,
  rejection_reason TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rider Documents table
CREATE TABLE public.rider_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES rider_applications(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE(application_id, document_type)
);

-- Rider Bank Details table
CREATE TABLE public.rider_bank_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES rider_applications(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_document_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- COD Collections table (runsheet-level tracking)
CREATE TABLE public.cod_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  runsheet_id UUID NOT NULL REFERENCES runsheets(id) ON DELETE CASCADE,
  expected_cod_amount NUMERIC NOT NULL DEFAULT 0,
  collected_cod_amount NUMERIC NOT NULL DEFAULT 0,
  collection_proof_url TEXT,
  collection_reference TEXT,
  status cod_collection_status NOT NULL DEFAULT 'expected',
  discrepancy_reason TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new fields to existing runsheets table
ALTER TABLE public.runsheets 
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Normal',
ADD COLUMN IF NOT EXISTS hub TEXT,
ADD COLUMN IF NOT EXISTS departure_time TIME,
ADD COLUMN IF NOT EXISTS vehicle_number TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS total_prepaid_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_cod_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS close_requested_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS closed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE;

-- Add new fields to existing riders table
ALTER TABLE public.riders
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_location_lat NUMERIC,
ADD COLUMN IF NOT EXISTS last_location_lng NUMERIC,
ADD COLUMN IF NOT EXISTS orders_out_for_delivery INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS orders_pending_pickup INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS orders_delivered_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_delivery_time_minutes INTEGER,
ADD COLUMN IF NOT EXISTS delivery_success_rate NUMERIC DEFAULT 0.0;

-- Enable RLS
ALTER TABLE public.rider_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rider_bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cod_collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public access for now, should be restricted in production)
CREATE POLICY "Allow public read access on rider_applications" ON public.rider_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on rider_applications" ON public.rider_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on rider_applications" ON public.rider_applications FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on rider_documents" ON public.rider_documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert on rider_documents" ON public.rider_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on rider_documents" ON public.rider_documents FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on rider_bank_details" ON public.rider_bank_details FOR SELECT USING (true);
CREATE POLICY "Allow public insert on rider_bank_details" ON public.rider_bank_details FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on rider_bank_details" ON public.rider_bank_details FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on cod_collections" ON public.cod_collections FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cod_collections" ON public.cod_collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cod_collections" ON public.cod_collections FOR UPDATE USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_rider_applications_updated_at
BEFORE UPDATE ON public.rider_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rider_bank_details_updated_at
BEFORE UPDATE ON public.rider_bank_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cod_collections_updated_at
BEFORE UPDATE ON public.cod_collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();