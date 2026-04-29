import React from 'react'
import { TrackSubscriptionModal } from '@/components/TrackSubscriptionModal'

export default function DashboardPage() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Subscriptions</h1>
                    <p className="text-muted-foreground">
                        Manage and track all your active subscriptions in one place.
                    </p>
                </div>
                <TrackSubscriptionModal />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Future subscription cards will go here */}
                <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted bg-muted/5">
                    <p className="text-muted-foreground mb-4 text-center max-w-xs">
                        You're not tracking any subscriptions yet. Click the button above to add your first one!
                    </p>
                </div>
            </div>
        </div>
    )
}
