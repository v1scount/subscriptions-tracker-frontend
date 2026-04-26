export enum BillingCycle {
  weekly = 'weekly',
  monthly = 'monthly',
  quarterly = 'quarterly',
  yearly = 'yearly',
}

export interface CatalogEntry {
  id: string;
  service_name: string;
  category?: string;
  price: number;
  currency?: string;
  billing_cycle?: BillingCycle;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCatalogEntryInput {
  service_name: string;
  category?: string;
  price: number;
  currency?: string;
  billing_cycle?: BillingCycle;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
}

export interface UpdateCatalogEntryInput extends Partial<CreateCatalogEntryInput> {}
