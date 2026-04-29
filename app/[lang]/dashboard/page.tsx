import { getDictionary, Locale } from '@/app/[lang]/dictionaries'
import TrackSubscriptionModal from '@/components/add-subscription-modal'
import { SubscriptionList } from '@/components/subscriptions/subscription-list'


export default async function DashboardPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.navigation.subscriptions}</h1>
                    <p className="text-muted-foreground">
                        {dict.navigation.subscriptions}
                    </p>
                </div>
                <TrackSubscriptionModal />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SubscriptionList />
            </div>
        </div>
    )
}
