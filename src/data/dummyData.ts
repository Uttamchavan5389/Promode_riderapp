// Dummy data for Promode Agro Farms Order Management System

export type OrderStatus = 'Placed' | 'Accepted' | 'Packed' | 'Dispatched' | 'Delivered' | 'Cancelled' | 'Returned' | 'Failed';
export type PaymentMode = 'COD' | 'Online';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  current_stock: number;
  reserved_stock: number;
  min_stock_threshold: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  is_substituted: boolean;
  substituted_with?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  lat: number;
  lng: number;
  zone: string;
  total_amount: number;
  payment_mode: PaymentMode;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  delivery_slot: string;
  notes?: string;
}

export interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle_number: string;
  vehicle_type: 'Two-Wheeler' | 'Three-Wheeler';
  current_status: 'Available' | 'On Trip' | 'Busy' | 'Offline';
  zone: string;
  rating: number;
  total_deliveries: number;
  orders_out_for_delivery: number;
  orders_pending_pickup: number;
  orders_delivered_today: number;
  avg_delivery_time_minutes: number;
  delivery_success_rate: number;
  last_seen: string;
  last_location_lat?: number;
  last_location_lng?: number;
  current_runsheet_id?: string;
  cod_outstanding: number;
  active: boolean;
  date_joined: string;
}

export interface Runsheet {
  id: string;
  rider_id: string;
  rider_name: string;
  run_date: string;
  orders_assigned: string[];
  route_zone: string;
  status: 'Created' | 'In Transit' | 'Completed';
  total_stops: number;
  estimated_time: string;
}

// Products
export const products: Product[] = [
  { id: 'P001', sku: 'VEG-TOM-001', name: 'Organic Tomatoes', category: 'Vegetables', price: 45, unit: 'kg', image: '🍅', current_stock: 150, reserved_stock: 25, min_stock_threshold: 20 },
  { id: 'P002', sku: 'VEG-POT-001', name: 'Fresh Potatoes', category: 'Vegetables', price: 30, unit: 'kg', image: '🥔', current_stock: 200, reserved_stock: 40, min_stock_threshold: 30 },
  { id: 'P003', sku: 'VEG-ONI-001', name: 'Red Onions', category: 'Vegetables', price: 35, unit: 'kg', image: '🧅', current_stock: 180, reserved_stock: 30, min_stock_threshold: 25 },
  { id: 'P004', sku: 'FRU-APP-001', name: 'Shimla Apples', category: 'Fruits', price: 120, unit: 'kg', image: '🍎', current_stock: 80, reserved_stock: 15, min_stock_threshold: 15 },
  { id: 'P005', sku: 'FRU-BAN-001', name: 'Farm Bananas', category: 'Fruits', price: 50, unit: 'dozen', image: '🍌', current_stock: 100, reserved_stock: 20, min_stock_threshold: 20 },
  { id: 'P006', sku: 'VEG-CAR-001', name: 'Orange Carrots', category: 'Vegetables', price: 40, unit: 'kg', image: '🥕', current_stock: 120, reserved_stock: 18, min_stock_threshold: 15 },
  { id: 'P007', sku: 'GRN-SPI-001', name: 'Fresh Spinach', category: 'Greens', price: 25, unit: 'bundle', image: '🥬', current_stock: 60, reserved_stock: 12, min_stock_threshold: 10 },
  { id: 'P008', sku: 'FRU-MAN-001', name: 'Alphonso Mangoes', category: 'Fruits', price: 180, unit: 'kg', image: '🥭', current_stock: 50, reserved_stock: 10, min_stock_threshold: 10 },
];

// Orders
export const orders: Order[] = [
  {
    id: 'ORD001',
    order_number: 'ORD-20251010-0001',
    customer_id: 'C001',
    customer_name: 'Rajesh Kumar',
    customer_phone: '+91 98765 43210',
    address: '123, MG Road, Sector 15, Gurugram',
    lat: 28.4595,
    lng: 77.0266,
    zone: 'Zone A',
    total_amount: 485,
    payment_mode: 'Online',
    status: 'Packed',
    items: [
      { id: 'OI001', product_id: 'P001', product_name: 'Organic Tomatoes', quantity: 2, price: 45, subtotal: 90, is_substituted: false },
      { id: 'OI002', product_id: 'P004', product_name: 'Shimla Apples', quantity: 2, price: 120, subtotal: 240, is_substituted: false },
      { id: 'OI003', product_id: 'P007', product_name: 'Fresh Spinach', quantity: 3, price: 25, subtotal: 75, is_substituted: false },
      { id: 'OI004', product_id: 'P006', product_name: 'Orange Carrots', quantity: 2, price: 40, subtotal: 80, is_substituted: false },
    ],
    created_at: '2025-01-10T08:30:00Z',
    updated_at: '2025-01-10T09:15:00Z',
    delivery_slot: '11:00 AM - 1:00 PM',
    notes: 'Please call before delivery'
  },
  {
    id: 'ORD002',
    order_number: 'ORD-20251010-0002',
    customer_id: 'C002',
    customer_name: 'Priya Sharma',
    customer_phone: '+91 98765 43211',
    address: '456, DLF Phase 2, Gurugram',
    lat: 28.4920,
    lng: 77.0900,
    zone: 'Zone A',
    total_amount: 330,
    payment_mode: 'COD',
    status: 'Dispatched',
    items: [
      { id: 'OI005', product_id: 'P002', product_name: 'Fresh Potatoes', quantity: 5, price: 30, subtotal: 150, is_substituted: false },
      { id: 'OI006', product_id: 'P003', product_name: 'Red Onions', quantity: 3, price: 35, subtotal: 105, is_substituted: false },
      { id: 'OI007', product_id: 'P005', product_name: 'Farm Bananas', quantity: 1, price: 50, subtotal: 50, is_substituted: false },
    ],
    created_at: '2025-01-10T08:45:00Z',
    updated_at: '2025-01-10T10:00:00Z',
    delivery_slot: '11:00 AM - 1:00 PM'
  },
  {
    id: 'ORD003',
    order_number: 'ORD-20251010-0003',
    customer_id: 'C003',
    customer_name: 'Amit Patel',
    customer_phone: '+91 98765 43212',
    address: '789, Sohna Road, Sector 49, Gurugram',
    lat: 28.4089,
    lng: 77.0531,
    zone: 'Zone B',
    total_amount: 595,
    payment_mode: 'Online',
    status: 'Placed',
    items: [
      { id: 'OI008', product_id: 'P008', product_name: 'Alphonso Mangoes', quantity: 3, price: 180, subtotal: 540, is_substituted: false },
      { id: 'OI009', product_id: 'P007', product_name: 'Fresh Spinach', quantity: 2, price: 25, subtotal: 50, is_substituted: false },
    ],
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-10T09:00:00Z',
    delivery_slot: '2:00 PM - 4:00 PM'
  },
  {
    id: 'ORD004',
    order_number: 'ORD-20251010-0004',
    customer_id: 'C004',
    customer_name: 'Sneha Reddy',
    customer_phone: '+91 98765 43213',
    address: '321, Golf Course Road, Gurugram',
    lat: 28.4646,
    lng: 77.0299,
    zone: 'Zone A',
    total_amount: 405,
    payment_mode: 'COD',
    status: 'Delivered',
    items: [
      { id: 'OI010', product_id: 'P001', product_name: 'Organic Tomatoes', quantity: 3, price: 45, subtotal: 135, is_substituted: false },
      { id: 'OI011', product_id: 'P004', product_name: 'Shimla Apples', quantity: 2, price: 120, subtotal: 240, is_substituted: false },
      { id: 'OI012', product_id: 'P002', product_name: 'Fresh Potatoes', quantity: 1, price: 30, subtotal: 30, is_substituted: false },
    ],
    created_at: '2025-01-10T07:30:00Z',
    updated_at: '2025-01-10T12:30:00Z',
    delivery_slot: '11:00 AM - 1:00 PM'
  },
  {
    id: 'ORD005',
    order_number: 'ORD-20251010-0005',
    customer_id: 'C005',
    customer_name: 'Vikram Singh',
    customer_phone: '+91 98765 43214',
    address: '555, Cyber City, DLF Phase 3, Gurugram',
    lat: 28.4940,
    lng: 77.0890,
    zone: 'Zone A',
    total_amount: 265,
    payment_mode: 'Online',
    status: 'Accepted',
    items: [
      { id: 'OI013', product_id: 'P005', product_name: 'Farm Bananas', quantity: 2, price: 50, subtotal: 100, is_substituted: false },
      { id: 'OI014', product_id: 'P003', product_name: 'Red Onions', quantity: 3, price: 35, subtotal: 105, is_substituted: false },
      { id: 'OI015', product_id: 'P006', product_name: 'Orange Carrots', quantity: 1, price: 40, subtotal: 40, is_substituted: false },
    ],
    created_at: '2025-01-10T09:30:00Z',
    updated_at: '2025-01-10T09:45:00Z',
    delivery_slot: '2:00 PM - 4:00 PM'
  }
];

// Riders
export const riders: Rider[] = [
  { 
    id: 'R001', 
    name: 'Suresh Kumar',
    email: 'suresh.kumar@promode.com',
    phone: '+91 98111 11111',
    vehicle_number: 'DL-01-AB-1234',
    vehicle_type: 'Two-Wheeler',
    current_status: 'On Trip',
    zone: 'Zone A',
    rating: 4.8,
    total_deliveries: 1250,
    orders_out_for_delivery: 5,
    orders_pending_pickup: 2,
    orders_delivered_today: 12,
    avg_delivery_time_minutes: 28,
    delivery_success_rate: 96.5,
    last_seen: new Date(Date.now() - 5 * 60000).toISOString(),
    last_location_lat: 28.4595,
    last_location_lng: 77.0266,
    current_runsheet_id: 'RS001',
    cod_outstanding: 2450,
    active: true,
    date_joined: '2024-01-15'
  },
  { 
    id: 'R002', 
    name: 'Ramesh Yadav',
    email: 'ramesh.yadav@promode.com',
    phone: '+91 98111 11112',
    vehicle_number: 'DL-01-AB-5678',
    vehicle_type: 'Two-Wheeler',
    current_status: 'Available',
    zone: 'Zone B',
    rating: 4.6,
    total_deliveries: 980,
    orders_out_for_delivery: 0,
    orders_pending_pickup: 0,
    orders_delivered_today: 8,
    avg_delivery_time_minutes: 32,
    delivery_success_rate: 94.2,
    last_seen: new Date(Date.now() - 2 * 60000).toISOString(),
    last_location_lat: 28.4089,
    last_location_lng: 77.0531,
    cod_outstanding: 0,
    active: true,
    date_joined: '2024-02-10'
  },
  { 
    id: 'R003', 
    name: 'Manoj Singh',
    email: 'manoj.singh@promode.com',
    phone: '+91 98111 11113',
    vehicle_number: 'DL-01-AB-9012',
    vehicle_type: 'Three-Wheeler',
    current_status: 'On Trip',
    zone: 'Zone A',
    rating: 4.9,
    total_deliveries: 1420,
    orders_out_for_delivery: 8,
    orders_pending_pickup: 3,
    orders_delivered_today: 15,
    avg_delivery_time_minutes: 25,
    delivery_success_rate: 98.1,
    last_seen: new Date(Date.now() - 8 * 60000).toISOString(),
    last_location_lat: 28.4646,
    last_location_lng: 77.0299,
    current_runsheet_id: 'RS002',
    cod_outstanding: 3850,
    active: true,
    date_joined: '2023-11-20'
  },
  { 
    id: 'R004', 
    name: 'Deepak Verma',
    email: 'deepak.verma@promode.com',
    phone: '+91 98111 11114',
    vehicle_number: 'DL-01-AB-3456',
    vehicle_type: 'Two-Wheeler',
    current_status: 'Busy',
    zone: 'Zone C',
    rating: 4.7,
    total_deliveries: 1100,
    orders_out_for_delivery: 3,
    orders_pending_pickup: 1,
    orders_delivered_today: 10,
    avg_delivery_time_minutes: 30,
    delivery_success_rate: 95.8,
    last_seen: new Date(Date.now() - 15 * 60000).toISOString(),
    last_location_lat: 28.4920,
    last_location_lng: 77.0900,
    current_runsheet_id: 'RS003',
    cod_outstanding: 1200,
    active: true,
    date_joined: '2024-03-05'
  },
  { 
    id: 'R005', 
    name: 'Anil Sharma',
    email: 'anil.sharma@promode.com',
    phone: '+91 98111 11115',
    vehicle_number: 'DL-01-AB-7890',
    vehicle_type: 'Two-Wheeler',
    current_status: 'Offline',
    zone: 'Zone B',
    rating: 4.5,
    total_deliveries: 850,
    orders_out_for_delivery: 0,
    orders_pending_pickup: 0,
    orders_delivered_today: 0,
    avg_delivery_time_minutes: 35,
    delivery_success_rate: 92.0,
    last_seen: new Date(Date.now() - 120 * 60000).toISOString(),
    cod_outstanding: 0,
    active: false,
    date_joined: '2024-04-12'
  },
  { 
    id: 'R006', 
    name: 'Rajesh Patel',
    email: 'rajesh.patel@promode.com',
    phone: '+91 98111 11116',
    vehicle_number: 'DL-01-AB-2468',
    vehicle_type: 'Three-Wheeler',
    current_status: 'Available',
    zone: 'Zone A',
    rating: 4.8,
    total_deliveries: 1300,
    orders_out_for_delivery: 0,
    orders_pending_pickup: 0,
    orders_delivered_today: 11,
    avg_delivery_time_minutes: 27,
    delivery_success_rate: 97.2,
    last_seen: new Date(Date.now() - 1 * 60000).toISOString(),
    last_location_lat: 28.4595,
    last_location_lng: 77.0266,
    cod_outstanding: 0,
    active: true,
    date_joined: '2023-12-08'
  }
];

// Runsheets
export const runsheets: Runsheet[] = [
  {
    id: 'RS001',
    rider_id: 'R001',
    rider_name: 'Suresh Kumar',
    run_date: '2025-01-10',
    orders_assigned: ['ORD002'],
    route_zone: 'Zone A',
    status: 'In Transit',
    total_stops: 1,
    estimated_time: '30 mins'
  },
  {
    id: 'RS002',
    rider_id: 'R003',
    rider_name: 'Manoj Singh',
    run_date: '2025-01-10',
    orders_assigned: ['ORD001'],
    route_zone: 'Zone A',
    status: 'Created',
    total_stops: 1,
    estimated_time: '25 mins'
  }
];
