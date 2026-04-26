export enum BillingCycle {
  weekly = 'weekly',
  monthly = 'monthly',
  quarterly = 'quarterly',
  yearly = 'yearly',
}

export interface CatalogBillingOption {
  id?: string;
  plan_id?: string;
  billing_cycle: BillingCycle;
  price: number;
}

export interface CatalogPlan {
  id?: string;
  catalog_id?: string;
  name: string;
  description?: string;
  billing_options: CatalogBillingOption[];
}

export interface CatalogEntry {
  id: string;
  service_name: string;
  category?: string;
  currency?: string;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  plans: CatalogPlan[];
}

export interface CreateCatalogEntryInput {
  service_name: string;
  category?: string;
  currency?: string;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
  plans: Omit<CatalogPlan, 'id' | 'catalog_id'>[];
}

export interface UpdateCatalogEntryInput extends Partial<CreateCatalogEntryInput> {}
