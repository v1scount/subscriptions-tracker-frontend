import { BillingCycle, CatalogEntry } from "./catalog";

export enum SubscriptionStatus {
  active = 'active',
  cancelled = 'cancelled',
  paused = 'paused',
  expired = 'expired',
}

export interface Subscription {
  id: string;
  user_id: string;
  catalog_id?: string;
  service_name: string;
  category?: string;
  price: number;
  currency?: string;
  billing_cycle: BillingCycle;
  plan_name?: string;
  next_billing_date: string;
  status: SubscriptionStatus;
  auto_renew: boolean;
  description?: string;
  created_at: string;
  catalog?: CatalogEntry;
}

export interface CreateSubscriptionInput {
  catalog_id: string;
  plan_name: string;
  billing_cycle: BillingCycle;
  price: number;
  next_billing_date: string;
  description?: string;
}
