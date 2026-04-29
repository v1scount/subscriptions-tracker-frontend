

export interface CatalogEntry {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    billing_cycle: string;
    plan_name: string;
    next_billing_date: string;
    status: string;
    auto_renew: boolean;
    created_at: string;
    updated_at: string;
    user_id: string;
    deleted_at: string;
}

export interface BillingCycle {
    monthly: string;
    yearly: string;
    weekly: string;
}