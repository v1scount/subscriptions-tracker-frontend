"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  useAdminCatalogEntries, 
  useCreateAdminCatalogEntry, 
  useUpdateAdminCatalogEntry, 
  useDeleteAdminCatalogEntry 
} from "@/src/hooks/useAdminCatalog";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MoreHorizontal,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CatalogEntry, BillingCycle, CreateCatalogEntryInput } from "@/src/types/catalog";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form schema - aligned with DTO requirements
const catalogBillingOptionSchema = z.object({
  billing_cycle: z.nativeEnum(BillingCycle),
  price: z.number().min(0.01, "Price must be at least 0.01"),
});

const catalogPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  billing_options: z.array(catalogBillingOptionSchema).min(1, "At least one billing option is required"),
});

const catalogEntrySchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  category: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  plans: z.array(catalogPlanSchema).min(1, "At least one plan is required"),
  description: z.string().optional(),
  logo_url: z.union([z.string().url(), z.literal("")]).optional(),
  is_active: z.boolean(),
});

type CatalogEntryFormValues = z.infer<typeof catalogEntrySchema>;

// Column helper
const columnHelper = createColumnHelper<CatalogEntry>();

const BillingOptionsField = ({ form, planIndex }: { form: ReturnType<typeof useForm<CatalogEntryFormValues>>, planIndex: number }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `plans.${planIndex}.billing_options` as const
  });

  return (
    <div className="space-y-3 mt-2 pl-4 border-l-2 border-muted">
      <FormLabel className="text-xs text-muted-foreground">Billing Options</FormLabel>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-4">
          <FormField
            control={form.control}
            name={`plans.${planIndex}.billing_options.${index}.billing_cycle` as const}
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={BillingCycle.weekly}>Weekly</SelectItem>
                    <SelectItem value={BillingCycle.monthly}>Monthly</SelectItem>
                    <SelectItem value={BillingCycle.quarterly}>Quarterly</SelectItem>
                    <SelectItem value={BillingCycle.yearly}>Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`plans.${planIndex}.billing_options.${index}.price` as const}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Price"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="text-destructive mt-0.5"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ billing_cycle: BillingCycle.monthly, price: 0 })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Billing Option
      </Button>
    </div>
  );
};

const PlansField = ({ form }: { form: ReturnType<typeof useForm<CatalogEntryFormValues>> }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "plans"
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md relative bg-muted/20">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 text-destructive"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name={`plans.${index}.name` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Standard, Premium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`plans.${index}.description` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <BillingOptionsField form={form} planIndex={index} />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => append({ name: "", description: "", billing_options: [{ billing_cycle: BillingCycle.monthly, price: 0 }] })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Plan
      </Button>
    </div>
  );
};

const CatalogEntryForm = ({
  form,
  onSubmit,
  submitLabel,
}: {
  form: ReturnType<typeof useForm<CatalogEntryFormValues>>;
  onSubmit: (values: CatalogEntryFormValues) => void;
  submitLabel: string;
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="service_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Netflix" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Entertainment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input placeholder="USD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <FormLabel className="text-base">Plans & Billing Options *</FormLabel>
        </div>
        <PlansField form={form} />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the service..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="logo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/logo.png" {...field} />
            </FormControl>
            <FormDescription>URL to the service logo image</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active</FormLabel>
              <FormDescription>
                Make this catalog entry available for selection
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <DialogFooter>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  </Form>
);

export default function CatalogAdminPage() {
  const { data: catalogData, isLoading } = useAdminCatalogEntries();
  const data = catalogData || [];
  
  const createMutation = useCreateAdminCatalogEntry();
  const updateMutation = useUpdateAdminCatalogEntry();
  const deleteMutation = useDeleteAdminCatalogEntry();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingEntry, setEditingEntry] = useState<CatalogEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<CatalogEntry | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<CatalogEntryFormValues>({
    resolver: zodResolver(catalogEntrySchema),
    defaultValues: {
      service_name: "",
      category: "",
      currency: "USD",
      plans: [{ name: "Standard", description: "", billing_options: [{ billing_cycle: BillingCycle.monthly, price: 0 }] }],
      description: "",
      logo_url: "",
      is_active: true,
    },
  });

  const editForm = useForm<CatalogEntryFormValues>({
    resolver: zodResolver(catalogEntrySchema),
    defaultValues: {
      service_name: "",
      category: "",
      currency: "USD",
      plans: [{ name: "Standard", description: "", billing_options: [{ billing_cycle: BillingCycle.monthly, price: 0 }] }],
      description: "",
      logo_url: "",
      is_active: true,
    },
  });

  const columns = [
    columnHelper.accessor("service_name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Service Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="flex items-center gap-3">
          {info.row.original.logo_url && (
            <img
              src={info.row.original.logo_url}
              alt={info.getValue()}
              className="h-8 w-8 rounded object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div>
            <div className="font-medium">{info.getValue()}</div>
            {info.row.original.category && (
              <div className="text-xs text-muted-foreground">
                {info.row.original.category}
              </div>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("plans", {
      header: "Plans & Options",
      cell: (info) => (
        <div className="flex flex-col gap-2">
          {info.getValue()?.map((plan, i) => (
            <div key={i} className="text-sm border-l-2 pl-2">
              <div className="font-semibold">{plan.name}</div>
              <div className="flex flex-col gap-1 mt-1">
                {plan.billing_options?.map((opt, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="capitalize text-[10px] px-1 py-0 h-4">
                      {opt.billing_cycle}
                    </Badge>
                    <span>
                      ${opt.price} {info.row.original.currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {(!info.getValue() || info.getValue()?.length === 0) && (
            <span className="text-muted-foreground text-sm">No plans</span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("is_active", {
      header: "Status",
      cell: (info) => (
        <Badge
          variant={info.getValue() ? "default" : "secondary"}
          className={info.getValue() ? "bg-green-500" : ""}
        >
          {info.getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleEdit(row.original)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeletingEntry(row.original)}
              className="cursor-pointer text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleCreate = (values: CatalogEntryFormValues) => {
    createMutation.mutate(values as unknown as CreateCatalogEntryInput, {
      onSuccess: () => {
        toast.success("Catalog entry created successfully");
        setIsCreateDialogOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast.error(`Failed to create entry: ${error.message}`);
      }
    });
  };

  const handleEdit = (entry: CatalogEntry) => {
    setEditingEntry(entry);
    editForm.reset({
      service_name: entry.service_name,
      category: entry.category || "",
      currency: entry.currency || "USD",
      plans: entry.plans?.length ? entry.plans.map(p => ({
        name: p.name,
        description: p.description || "",
        billing_options: p.billing_options?.length ? p.billing_options.map(bo => ({
          billing_cycle: bo.billing_cycle,
          price: bo.price
        })) : [{ billing_cycle: BillingCycle.monthly, price: 0 }]
      })) : [{ name: "Standard", description: "", billing_options: [{ billing_cycle: BillingCycle.monthly, price: 0 }] }],
      description: entry.description || "",
      logo_url: entry.logo_url || "",
      is_active: entry.is_active ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (values: CatalogEntryFormValues) => {
    if (!editingEntry) return;
    updateMutation.mutate({ id: editingEntry.id, data: values as unknown as CreateCatalogEntryInput }, {
      onSuccess: () => {
        toast.success("Catalog entry updated successfully");
        setIsEditDialogOpen(false);
        setEditingEntry(null);
        editForm.reset();
      },
      onError: (error) => {
        toast.error(`Failed to update entry: ${error.message}`);
      }
    });
  };

  const handleDelete = () => {
    if (!deletingEntry) return;
    deleteMutation.mutate(deletingEntry.id, {
      onSuccess: () => {
        toast.success("Catalog entry deleted successfully");
        setDeletingEntry(null);
      },
      onError: (error) => {
        toast.error(`Failed to delete entry: ${error.message}`);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscription Catalog</h1>
          <p className="text-muted-foreground">
            Manage subscription types and services available to users
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Catalog Entry</DialogTitle>
              <DialogDescription>
                Add a new subscription type to the catalog
              </DialogDescription>
            </DialogHeader>
            <CatalogEntryForm
              form={form}
              onSubmit={handleCreate}
              submitLabel="Create Entry"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search catalog entries..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading entries...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Catalog Entry</DialogTitle>
            <DialogDescription>
              Update the subscription service details
            </DialogDescription>
          </DialogHeader>
          <CatalogEntryForm
            form={editForm}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingEntry}
        onOpenChange={() => setDeletingEntry(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the catalog entry "
              {deletingEntry?.service_name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingEntry(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
