-- Create user roles enum and table for proper authentication
CREATE TYPE public.app_role AS ENUM ('admin', 'warehouse_staff', 'rider');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Drop existing insecure policies on orders table
DROP POLICY IF EXISTS "Warehouse staff can read orders" ON public.orders;
DROP POLICY IF EXISTS "Warehouse staff can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Warehouse staff can update orders" ON public.orders;
DROP POLICY IF EXISTS "Only admins can delete orders" ON public.orders;

-- Secure orders table policies
CREATE POLICY "Authenticated staff can read orders"
ON public.orders FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Authenticated staff can insert orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Authenticated staff can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Only admins can delete orders"
ON public.orders FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing insecure policies on rider_applications
DROP POLICY IF EXISTS "Allow public read access on rider_applications" ON public.rider_applications;
DROP POLICY IF EXISTS "Allow public insert on rider_applications" ON public.rider_applications;
DROP POLICY IF EXISTS "Allow public update on rider_applications" ON public.rider_applications;

-- Secure rider_applications policies
CREATE POLICY "Authenticated staff can read applications"
ON public.rider_applications FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Anyone can submit application"
ON public.rider_applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated staff can update applications"
ON public.rider_applications FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

-- Drop existing insecure policies on products
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert on products" ON public.products;
DROP POLICY IF EXISTS "Allow public update on products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete on products" ON public.products;

-- Secure products table policies
CREATE POLICY "Anyone can read products"
ON public.products FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Only staff can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Only staff can update products"
ON public.products FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Only admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Secure other tables similarly
DROP POLICY IF EXISTS "Warehouse staff can read riders" ON public.riders;
DROP POLICY IF EXISTS "Warehouse staff can manage riders" ON public.riders;

CREATE POLICY "Authenticated staff can read riders"
ON public.riders FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Authenticated staff can manage riders"
ON public.riders FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

-- Add policies for rider_documents
DROP POLICY IF EXISTS "Allow public read access on rider_documents" ON public.rider_documents;
DROP POLICY IF EXISTS "Allow public insert on rider_documents" ON public.rider_documents;
DROP POLICY IF EXISTS "Allow public update on rider_documents" ON public.rider_documents;

CREATE POLICY "Authenticated staff can read documents"
ON public.rider_documents FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Anyone can upload documents"
ON public.rider_documents FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated staff can update documents"
ON public.rider_documents FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

-- Add policies for rider_bank_details
DROP POLICY IF EXISTS "Allow public read access on rider_bank_details" ON public.rider_bank_details;
DROP POLICY IF EXISTS "Allow public insert on rider_bank_details" ON public.rider_bank_details;
DROP POLICY IF EXISTS "Allow public update on rider_bank_details" ON public.rider_bank_details;

CREATE POLICY "Authenticated staff can read bank details"
ON public.rider_bank_details FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);

CREATE POLICY "Anyone can submit bank details"
ON public.rider_bank_details FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated staff can update bank details"
ON public.rider_bank_details FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'warehouse_staff')
);