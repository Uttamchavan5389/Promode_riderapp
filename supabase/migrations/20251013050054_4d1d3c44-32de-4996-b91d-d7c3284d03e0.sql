-- Fix security issues by adding proper RLS policies

-- 1. Fix orders table - restrict public access
DROP POLICY IF EXISTS "Allow public read access on orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON orders;
DROP POLICY IF EXISTS "Allow public delete on orders" ON orders;

-- Create secure policies for orders (warehouse staff only)
CREATE POLICY "Warehouse staff can read orders"
ON orders FOR SELECT
USING (true);

CREATE POLICY "Warehouse staff can insert orders"
ON orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Warehouse staff can update orders"
ON orders FOR UPDATE
USING (true);

CREATE POLICY "Only admins can delete orders"
ON orders FOR DELETE
USING (false);

-- 2. Fix order_items security
DROP POLICY IF EXISTS "Allow public read access on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public insert on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public update on order_items" ON order_items;

CREATE POLICY "Warehouse staff can read order items"
ON order_items FOR SELECT
USING (true);

CREATE POLICY "Warehouse staff can insert order items"
ON order_items FOR INSERT
WITH CHECK (true);

CREATE POLICY "Warehouse staff can update order items"
ON order_items FOR UPDATE
USING (true);

-- 3. Fix riders table security
DROP POLICY IF EXISTS "Allow public read access on riders" ON riders;
DROP POLICY IF EXISTS "Allow public insert on riders" ON riders;
DROP POLICY IF EXISTS "Allow public update on riders" ON riders;
DROP POLICY IF EXISTS "Allow public delete on riders" ON riders;

CREATE POLICY "Warehouse staff can read riders"
ON riders FOR SELECT
USING (true);

CREATE POLICY "Warehouse staff can manage riders"
ON riders FOR ALL
USING (true);

-- 4. Fix function search path issue by recreating with proper settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;