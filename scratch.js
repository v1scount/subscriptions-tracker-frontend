const fs = require('fs');
const file = 'app/[lang]/dashboard/admin/catalog/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import { useForm } from "react-hook-form";', 'import { useForm, useFieldArray } from "react-hook-form";');

content = content.replace(
`const catalogEntrySchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  category: z.string().optional(),
  price: z.number().min(0.01, "Price must be at least 0.01"),
  currency: z.string().min(1, "Currency is required"),
  billing_cycle: z.nativeEnum(BillingCycle).optional(),
  description: z.string().optional(),
  logo_url: z.union([z.string().url(), z.literal("")]).optional(),
  is_active: z.boolean(),
});`,
`const catalogBillingOptionSchema = z.object({
  billing_cycle: z.nativeEnum(BillingCycle),
  price: z.number().min(0.01, "Price must be at least 0.01"),
});

const catalogEntrySchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  category: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  billing_options: z.array(catalogBillingOptionSchema).min(1, "At least one billing option is required"),
  description: z.string().optional(),
  logo_url: z.union([z.string().url(), z.literal("")]).optional(),
  is_active: z.boolean(),
});`
);

content = content.replace(
`const sampleData: CatalogEntry[] = [
  {
    id: "1",
    service_name: "Netflix",
    category: "Entertainment",
    price: 15.99,
    currency: "USD",
    billing_cycle: BillingCycle.monthly,
    description: "Streaming service for movies and TV shows",
    logo_url: "https://example.com/netflix-logo.png",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    service_name: "Spotify",
    category: "Music",
    price: 9.99,
    currency: "USD",
    billing_cycle: BillingCycle.monthly,
    description: "Music streaming platform",
    logo_url: "https://example.com/spotify-logo.png",
    is_active: true,
    created_at: "2024-01-02T00:00:00Z",
  },
];`,
`const sampleData: CatalogEntry[] = [
  {
    id: "1",
    service_name: "Netflix",
    category: "Entertainment",
    currency: "USD",
    description: "Streaming service for movies and TV shows",
    logo_url: "https://example.com/netflix-logo.png",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    billing_options: [
      { billing_cycle: BillingCycle.monthly, price: 15.99 }
    ]
  },
  {
    id: "2",
    service_name: "Spotify",
    category: "Music",
    currency: "USD",
    description: "Music streaming platform",
    logo_url: "https://example.com/spotify-logo.png",
    is_active: true,
    created_at: "2024-01-02T00:00:00Z",
    billing_options: [
      { billing_cycle: BillingCycle.monthly, price: 9.99 },
      { billing_cycle: BillingCycle.yearly, price: 99.99 }
    ]
  },
];`
);

content = content.replace(
`      category: "",
      price: 0,
      currency: "USD",
      billing_cycle: undefined,`,
`      category: "",
      currency: "USD",
      billing_options: [{ billing_cycle: BillingCycle.monthly, price: 0 }],`
);
content = content.replace(
`      category: "",
      price: 0,
      currency: "USD",
      billing_cycle: undefined,`,
`      category: "",
      currency: "USD",
      billing_options: [{ billing_cycle: BillingCycle.monthly, price: 0 }],`
);

content = content.replace(
`      category: entry.category || "",
      price: entry.price,
      currency: entry.currency || "USD",
      billing_cycle: entry.billing_cycle,`,
`      category: entry.category || "",
      currency: entry.currency || "USD",
      billing_options: entry.billing_options?.length ? entry.billing_options : [{ billing_cycle: BillingCycle.monthly, price: 0 }],`
);

const columnsOld = `    columnHelper.accessor("price", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div>
          <div className="font-medium">
            \${info.getValue().toFixed(2)} {info.row.original.currency}
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {info.row.original.billing_cycle || "One-time"}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("billing_cycle", {
      header: "Billing Cycle",
      cell: (info) => (
        <Badge variant="outline" className="capitalize">
          {info.getValue() || "N/A"}
        </Badge>
      ),
    }),`;
const columnsNew = `    columnHelper.accessor("billing_options", {
      header: "Billing Options",
      cell: (info) => (
        <div className="flex flex-col gap-1">
          {info.getValue()?.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="capitalize">
                {opt.billing_cycle}
              </Badge>
              <span className="font-medium">
                \${opt.price.toFixed(2)} {info.row.original.currency}
              </span>
            </div>
          ))}
          {(!info.getValue() || info.getValue()?.length === 0) && (
            <span className="text-muted-foreground text-sm">No options</span>
          )}
        </div>
      ),
    }),`;
content = content.replace(columnsOld, columnsNew);


const formFieldsOld = `        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="billing_cycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Cycle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
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
        </div>`;

const formFieldsNew = `        <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Billing Options *</FormLabel>
          </div>
          <BillingOptionsField form={form} />
        </div>`;

content = content.replace(formFieldsOld, formFieldsNew);

const billingOptionsComponent = `
  const BillingOptionsField = ({ form }: { form: ReturnType<typeof useForm<CatalogEntryFormValues>> }) => {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "billing_options"
    });

    return (
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-4">
            <FormField
              control={form.control}
              name={\`billing_options.\${index}.billing_cycle\` as const}
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
              name={\`billing_options.\${index}.price\` as const}
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
        <FormField
          control={form.control}
          name="billing_options"
          render={() => <FormMessage />}
        />
      </div>
    );
  };
`;

content = content.replace('  const CatalogEntryForm =', billingOptionsComponent + '\n  const CatalogEntryForm =');

fs.writeFileSync(file, content);
console.log('done');
