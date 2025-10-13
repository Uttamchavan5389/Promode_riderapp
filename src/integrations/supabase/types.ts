export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cod_collections: {
        Row: {
          collected_cod_amount: number
          collection_proof_url: string | null
          collection_reference: string | null
          created_at: string
          discrepancy_reason: string | null
          expected_cod_amount: number
          id: string
          runsheet_id: string
          status: Database["public"]["Enums"]["cod_collection_status"]
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          collected_cod_amount?: number
          collection_proof_url?: string | null
          collection_reference?: string | null
          created_at?: string
          discrepancy_reason?: string | null
          expected_cod_amount?: number
          id?: string
          runsheet_id: string
          status?: Database["public"]["Enums"]["cod_collection_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          collected_cod_amount?: number
          collection_proof_url?: string | null
          collection_reference?: string | null
          created_at?: string
          discrepancy_reason?: string | null
          expected_cod_amount?: number
          id?: string
          runsheet_id?: string
          status?: Database["public"]["Enums"]["cod_collection_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cod_collections_runsheet_id_fkey"
            columns: ["runsheet_id"]
            isOneToOne: false
            referencedRelation: "runsheets"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_slots: {
        Row: {
          active: boolean
          created_at: string
          current_orders: number
          delivery_date: string
          end_time: string
          id: string
          max_orders: number
          pincode_id: string
          shift_type: Database["public"]["Enums"]["shift_type"]
          start_time: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          current_orders?: number
          delivery_date: string
          end_time: string
          id?: string
          max_orders?: number
          pincode_id: string
          shift_type: Database["public"]["Enums"]["shift_type"]
          start_time: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          current_orders?: number
          delivery_date?: string
          end_time?: string
          id?: string
          max_orders?: number
          pincode_id?: string
          shift_type?: Database["public"]["Enums"]["shift_type"]
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_slots_pincode_id_fkey"
            columns: ["pincode_id"]
            isOneToOne: false
            referencedRelation: "pincodes"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          is_substituted: boolean
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
          substituted_with: string | null
          subtotal: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_substituted?: boolean
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
          substituted_with?: string | null
          subtotal: number
        }
        Update: {
          created_at?: string
          id?: string
          is_substituted?: boolean
          order_id?: string
          price?: number
          product_id?: string
          product_name?: string
          quantity?: number
          substituted_with?: string | null
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          lat: number | null
          lng: number | null
          notes: string | null
          order_number: string
          packer_id: string | null
          payment_mode: Database["public"]["Enums"]["payment_mode"]
          pincode: string
          slot_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          zone: string | null
        }
        Insert: {
          address: string
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          order_number: string
          packer_id?: string | null
          payment_mode: Database["public"]["Enums"]["payment_mode"]
          pincode: string
          slot_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at?: string
          zone?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          order_number?: string
          packer_id?: string | null
          payment_mode?: Database["public"]["Enums"]["payment_mode"]
          pincode?: string
          slot_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_packer_id_fkey"
            columns: ["packer_id"]
            isOneToOne: false
            referencedRelation: "packers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "delivery_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      packers: {
        Row: {
          active: boolean
          assigned_orders: number
          created_at: string
          id: string
          name: string
          packed_count: number
          performance_score: number | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          assigned_orders?: number
          created_at?: string
          id?: string
          name: string
          packed_count?: number
          performance_score?: number | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          assigned_orders?: number
          created_at?: string
          id?: string
          name?: string
          packed_count?: number
          performance_score?: number | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pincodes: {
        Row: {
          area_name: string
          created_at: string
          cutoff_time: string | null
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          id: string
          notes: string | null
          pincode: string
          status: boolean
          updated_at: string
        }
        Insert: {
          area_name: string
          created_at?: string
          cutoff_time?: string | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          id?: string
          notes?: string | null
          pincode: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          area_name?: string
          created_at?: string
          cutoff_time?: string | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          id?: string
          notes?: string | null
          pincode?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          current_stock: number
          id: string
          image: string | null
          min_stock_threshold: number
          name: string
          price: number
          reserved_stock: number
          sku: string
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          current_stock?: number
          id?: string
          image?: string | null
          min_stock_threshold?: number
          name: string
          price: number
          reserved_stock?: number
          sku: string
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_stock?: number
          id?: string
          image?: string | null
          min_stock_threshold?: number
          name?: string
          price?: number
          reserved_stock?: number
          sku?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      rider_applications: {
        Row: {
          admin_notes: string | null
          alternate_contact: string | null
          approved_at: string | null
          approved_by: string | null
          contact_number: string
          created_at: string
          date_of_birth: string
          full_address: string
          id: string
          pincode: string
          referral_contact: string | null
          referral_name: string | null
          rejection_reason: string | null
          rider_name: string
          status: Database["public"]["Enums"]["rider_application_status"]
          updated_at: string
          vehicle_registration: string
          vehicle_type: string
        }
        Insert: {
          admin_notes?: string | null
          alternate_contact?: string | null
          approved_at?: string | null
          approved_by?: string | null
          contact_number: string
          created_at?: string
          date_of_birth: string
          full_address: string
          id?: string
          pincode: string
          referral_contact?: string | null
          referral_name?: string | null
          rejection_reason?: string | null
          rider_name: string
          status?: Database["public"]["Enums"]["rider_application_status"]
          updated_at?: string
          vehicle_registration: string
          vehicle_type: string
        }
        Update: {
          admin_notes?: string | null
          alternate_contact?: string | null
          approved_at?: string | null
          approved_by?: string | null
          contact_number?: string
          created_at?: string
          date_of_birth?: string
          full_address?: string
          id?: string
          pincode?: string
          referral_contact?: string | null
          referral_name?: string | null
          rejection_reason?: string | null
          rider_name?: string
          status?: Database["public"]["Enums"]["rider_application_status"]
          updated_at?: string
          vehicle_registration?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      rider_bank_details: {
        Row: {
          account_holder_name: string
          account_number: string
          admin_notes: string | null
          application_id: string
          bank_document_url: string | null
          bank_name: string
          created_at: string
          id: string
          ifsc_code: string
          updated_at: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          admin_notes?: string | null
          application_id: string
          bank_document_url?: string | null
          bank_name: string
          created_at?: string
          id?: string
          ifsc_code: string
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          admin_notes?: string | null
          application_id?: string
          bank_document_url?: string | null
          bank_name?: string
          created_at?: string
          id?: string
          ifsc_code?: string
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_bank_details_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "rider_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_documents: {
        Row: {
          admin_notes: string | null
          application_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_url: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["document_status"]
          uploaded_at: string
        }
        Insert: {
          admin_notes?: string | null
          application_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_url: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          uploaded_at?: string
        }
        Update: {
          admin_notes?: string | null
          application_id?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_url?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rider_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "rider_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          avg_delivery_time_minutes: number | null
          created_at: string
          current_status: Database["public"]["Enums"]["rider_status"]
          delivery_success_rate: number | null
          id: string
          last_location_lat: number | null
          last_location_lng: number | null
          last_seen: string | null
          name: string
          orders_delivered_today: number | null
          orders_out_for_delivery: number | null
          orders_pending_pickup: number | null
          phone: string
          rating: number | null
          total_deliveries: number
          updated_at: string
          vehicle_number: string | null
        }
        Insert: {
          avg_delivery_time_minutes?: number | null
          created_at?: string
          current_status?: Database["public"]["Enums"]["rider_status"]
          delivery_success_rate?: number | null
          id?: string
          last_location_lat?: number | null
          last_location_lng?: number | null
          last_seen?: string | null
          name: string
          orders_delivered_today?: number | null
          orders_out_for_delivery?: number | null
          orders_pending_pickup?: number | null
          phone: string
          rating?: number | null
          total_deliveries?: number
          updated_at?: string
          vehicle_number?: string | null
        }
        Update: {
          avg_delivery_time_minutes?: number | null
          created_at?: string
          current_status?: Database["public"]["Enums"]["rider_status"]
          delivery_success_rate?: number | null
          id?: string
          last_location_lat?: number | null
          last_location_lng?: number | null
          last_seen?: string | null
          name?: string
          orders_delivered_today?: number | null
          orders_out_for_delivery?: number | null
          orders_pending_pickup?: number | null
          phone?: string
          rating?: number | null
          total_deliveries?: number
          updated_at?: string
          vehicle_number?: string | null
        }
        Relationships: []
      }
      runsheet_orders: {
        Row: {
          created_at: string
          id: string
          order_id: string
          runsheet_id: string
          sequence: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          runsheet_id: string
          sequence?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          runsheet_id?: string
          sequence?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "runsheet_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "runsheet_orders_runsheet_id_fkey"
            columns: ["runsheet_id"]
            isOneToOne: false
            referencedRelation: "runsheets"
            referencedColumns: ["id"]
          },
        ]
      }
      runsheets: {
        Row: {
          close_requested_at: string | null
          closed_at: string | null
          closed_by: string | null
          created_at: string
          departure_time: string | null
          estimated_time: string | null
          hub: string | null
          id: string
          notes: string | null
          priority: string | null
          rider_id: string
          route_zone: string | null
          run_date: string
          status: Database["public"]["Enums"]["runsheet_status"]
          total_cod_amount: number | null
          total_prepaid_amount: number | null
          total_stops: number
          updated_at: string
          vehicle_number: string | null
        }
        Insert: {
          close_requested_at?: string | null
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          departure_time?: string | null
          estimated_time?: string | null
          hub?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          rider_id: string
          route_zone?: string | null
          run_date: string
          status?: Database["public"]["Enums"]["runsheet_status"]
          total_cod_amount?: number | null
          total_prepaid_amount?: number | null
          total_stops?: number
          updated_at?: string
          vehicle_number?: string | null
        }
        Update: {
          close_requested_at?: string | null
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          departure_time?: string | null
          estimated_time?: string | null
          hub?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          rider_id?: string
          route_zone?: string | null
          run_date?: string
          status?: Database["public"]["Enums"]["runsheet_status"]
          total_cod_amount?: number | null
          total_prepaid_amount?: number | null
          total_stops?: number
          updated_at?: string
          vehicle_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "runsheets_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "warehouse_staff" | "rider"
      cod_collection_status:
        | "expected"
        | "collected"
        | "partially_collected"
        | "shortfall"
        | "verified"
        | "discrepancy"
      delivery_type: "Same Day" | "Next Day" | "Scheduled"
      document_status:
        | "pending"
        | "approved"
        | "reupload_requested"
        | "rejected"
      document_type:
        | "pan"
        | "aadhar_front"
        | "aadhar_back"
        | "license_front"
        | "license_back"
        | "rc_front"
        | "rc_back"
        | "vehicle_photo"
        | "selfie_with_id"
        | "bank_cheque"
      order_status:
        | "Placed"
        | "Accepted"
        | "Packed"
        | "Dispatched"
        | "Delivered"
        | "Cancelled"
        | "Returned"
        | "Failed"
      payment_mode: "COD" | "Online"
      rider_application_status:
        | "pending_review"
        | "pending_docs"
        | "pending_bank"
        | "approved"
        | "rejected"
        | "needs_reupload"
      rider_status: "Available" | "On Delivery" | "Off Duty"
      runsheet_status: "Created" | "In Transit" | "Completed"
      shift_type: "Morning" | "Afternoon" | "Evening"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "warehouse_staff", "rider"],
      cod_collection_status: [
        "expected",
        "collected",
        "partially_collected",
        "shortfall",
        "verified",
        "discrepancy",
      ],
      delivery_type: ["Same Day", "Next Day", "Scheduled"],
      document_status: [
        "pending",
        "approved",
        "reupload_requested",
        "rejected",
      ],
      document_type: [
        "pan",
        "aadhar_front",
        "aadhar_back",
        "license_front",
        "license_back",
        "rc_front",
        "rc_back",
        "vehicle_photo",
        "selfie_with_id",
        "bank_cheque",
      ],
      order_status: [
        "Placed",
        "Accepted",
        "Packed",
        "Dispatched",
        "Delivered",
        "Cancelled",
        "Returned",
        "Failed",
      ],
      payment_mode: ["COD", "Online"],
      rider_application_status: [
        "pending_review",
        "pending_docs",
        "pending_bank",
        "approved",
        "rejected",
        "needs_reupload",
      ],
      rider_status: ["Available", "On Delivery", "Off Duty"],
      runsheet_status: ["Created", "In Transit", "Completed"],
      shift_type: ["Morning", "Afternoon", "Evening"],
    },
  },
} as const
