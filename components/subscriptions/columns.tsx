"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Subscription } from "@/src/types/subscription";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "service_name",
    header: "Service",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.catalog?.logo_url ? (
          <img
            src={row.original.catalog.logo_url}
            alt={row.getValue("service_name")}
            className="h-8 w-8 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
            {(row.getValue("service_name") as string).substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="font-medium">{row.getValue("service_name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "plan_name",
    header: "Plan",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const currency = row.original.currency || "USD";
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(price);
 
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "billing_cycle",
    header: "Billing Cycle",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("billing_cycle")}</div>
    ),
  },
  {
    accessorKey: "next_billing_date",
    header: "Next Billing",
    cell: ({ row }) => {
      const dateVal = row.getValue("next_billing_date");
      if (!dateVal) return null;
      const date = new Date(dateVal as string);
      return <div>{format(date, "MMM d, yyyy")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"} className={status === "active" ? "bg-green-500 hover:bg-green-600" : ""}>
          {status}
        </Badge>
      );
    },
  },
];
