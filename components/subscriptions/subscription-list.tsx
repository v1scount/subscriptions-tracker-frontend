"use client";

import { useSubscriptions } from "@/src/hooks/useSubscriptions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useDictionary } from "@/components/dictionary-provider";

export function SubscriptionList() {
  const { data: subscriptions, isLoading, error } = useSubscriptions();
  const dict = useDictionary();

  if (isLoading) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted bg-muted/5">
        <p className="text-muted-foreground mb-4 text-center">Loading subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-destructive/50 bg-destructive/10">
        <p className="text-destructive mb-4 text-center">Failed to load subscriptions</p>
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted bg-muted/5">
        <p className="text-muted-foreground mb-4 text-center max-w-xs">
          {dict.dashboard.no_subscriptions_yet}
        </p>
      </div>
    );
  }

  return (
    <div className="col-span-full">
      <DataTable columns={columns} data={subscriptions} />
    </div>
  );
}
