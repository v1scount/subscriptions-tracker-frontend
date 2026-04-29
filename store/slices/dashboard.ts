import {StateCreator} from 'zustand'

interface add_subsctiprion_modal {
    catalogId: string;
    planId: string;
    billingCycle: string;
    nextBillingDate: Date;
}

interface add_subsctiprion_modal_state {
    open: boolean;
}


interface dashboard_store {
    add_subsctiprion_modal: add_subsctiprion_modal_state;
}

const createDashboardSlice = (set) => ({
    
})