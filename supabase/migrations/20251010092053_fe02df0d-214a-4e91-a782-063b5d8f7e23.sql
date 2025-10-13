-- Create enum types
CREATE TYPE payment_mode AS ENUM ('COD', 'Online');
CREATE TYPE order_status AS ENUM ('Placed', 'Accepted', 'Packed', 'Dispatched', 'Delivered', 'Cancelled', 'Returned', 'Failed');
CREATE TYPE delivery_type AS ENUM ('Same Day', 'Next Day', 'Scheduled');
CREATE TYPE shift_type AS ENUM ('Morning', 'Afternoon', 'Evening');
CREATE TYPE rider_status AS ENUM ('Available', 'On Delivery', 'Off Duty');
CREATE TYPE runsheet_status AS ENUM ('Created', 'In Transit', 'Completed');

-- Pincodes table
CREATE TABLE public.pincodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pincode TEXT NOT NULL UNIQUE,
  area_name TEXT NOT NULL,
  delivery_type delivery_type NOT NULL DEFAULT 'Next Day',
  status BOOLEAN NOT NULL DEFAULT true,
  cutoff_time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Delivery slots table
CREATE TABLE public.delivery_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pincode_id UUID NOT NULL REFERENCES public.pincodes(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  shift_type shift_type NOT NULL,
  max_orders INTEGER NOT NULL DEFAULT 20,
  current_orders INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pincode_id, delivery_date, start_time)
);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  image TEXT,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reserved_stock INTEGER NOT NULL DEFAULT 0,
  min_stock_threshold INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Packers table
CREATE TABLE public.packers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  assigned_orders INTEGER NOT NULL DEFAULT 0,
  packed_count INTEGER NOT NULL DEFAULT 0,
  performance_score DECIMAL(3,2) DEFAULT 0.00,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Riders table
CREATE TABLE public.riders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_number TEXT,
  current_status rider_status NOT NULL DEFAULT 'Available',
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_deliveries INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  zone TEXT,
  slot_id UUID REFERENCES public.delivery_slots(id),
  packer_id UUID REFERENCES public.packers(id),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_mode payment_mode NOT NULL,
  status order_status NOT NULL DEFAULT 'Placed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  is_substituted BOOLEAN NOT NULL DEFAULT false,
  substituted_with TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Runsheets table
CREATE TABLE public.runsheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_id UUID NOT NULL REFERENCES public.riders(id),
  run_date DATE NOT NULL,
  route_zone TEXT,
  status runsheet_status NOT NULL DEFAULT 'Created',
  total_stops INTEGER NOT NULL DEFAULT 0,
  estimated_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Runsheet orders junction table
CREATE TABLE public.runsheet_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  runsheet_id UUID NOT NULL REFERENCES public.runsheets(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id),
  sequence INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(runsheet_id, order_id)
);

-- Enable Row Level Security
ALTER TABLE public.pincodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runsheet_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access on pincodes" ON public.pincodes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on pincodes" ON public.pincodes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on pincodes" ON public.pincodes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on pincodes" ON public.pincodes FOR DELETE USING (true);

CREATE POLICY "Allow public read access on slots" ON public.delivery_slots FOR SELECT USING (true);
CREATE POLICY "Allow public insert on slots" ON public.delivery_slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on slots" ON public.delivery_slots FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on slots" ON public.delivery_slots FOR DELETE USING (true);

CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow public read access on packers" ON public.packers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on packers" ON public.packers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on packers" ON public.packers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on packers" ON public.packers FOR DELETE USING (true);

CREATE POLICY "Allow public read access on riders" ON public.riders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on riders" ON public.riders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on riders" ON public.riders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on riders" ON public.riders FOR DELETE USING (true);

CREATE POLICY "Allow public read access on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Allow public read access on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on order_items" ON public.order_items FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on runsheets" ON public.runsheets FOR SELECT USING (true);
CREATE POLICY "Allow public insert on runsheets" ON public.runsheets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on runsheets" ON public.runsheets FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on runsheet_orders" ON public.runsheet_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on runsheet_orders" ON public.runsheet_orders FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_pincodes_updated_at BEFORE UPDATE ON public.pincodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_slots_updated_at BEFORE UPDATE ON public.delivery_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packers_updated_at BEFORE UPDATE ON public.packers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_riders_updated_at BEFORE UPDATE ON public.riders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_runsheets_updated_at BEFORE UPDATE ON public.runsheets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_pincode ON public.orders(pincode);
CREATE INDEX idx_orders_slot_id ON public.orders(slot_id);
CREATE INDEX idx_orders_packer_id ON public.orders(packer_id);
CREATE INDEX idx_delivery_slots_pincode_id ON public.delivery_slots(pincode_id);
CREATE INDEX idx_delivery_slots_date ON public.delivery_slots(delivery_date);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_runsheet_orders_runsheet_id ON public.runsheet_orders(runsheet_id);