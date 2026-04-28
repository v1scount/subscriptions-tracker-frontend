"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Check, Calendar as CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDictionary } from "@/components/dictionary-provider";
import {
  useCatalogEntries,
  useCreateSubscription,
} from "@/src/hooks/useSubscriptions";
import { CatalogEntry, CatalogPlan, CatalogBillingOption } from "@/src/types/catalog";
import { Badge } from "@/components/ui/badge";
import { DatePickerDemo } from "@/components/ui/date-picker";
import { cn } from "@/src/lib/utils";

function TrackSubscriptionModal() {
  const dict = useDictionary();
  const [isOpen, setIsOpen] = useState(false);
  const { data: catalog, isLoading: isLoadingCatalog } = useCatalogEntries();
  const createMutation = useCreateSubscription();

  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<string>("");
  const [nextBillingDate, setNextBillingDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const selectedCatalog = useMemo(
    () => catalog?.find((c) => c.id === selectedCatalogId),
    [catalog, selectedCatalogId]
  );

  const selectedPlan = useMemo(
    () => selectedCatalog?.plans.find((p) => p.id === selectedPlanId),
    [selectedCatalog, selectedPlanId]
  );

  const selectedBillingOption = useMemo(
    () =>
      selectedPlan?.billing_options.find(
        (o) => o.billing_cycle === selectedBillingCycle
      ),
    [selectedPlan, selectedBillingCycle]
  );

  const handleCatalogChange = (id: string) => {
    setSelectedCatalogId(id);
    setSelectedPlanId("");
    setSelectedBillingCycle("");
  };

  const handlePlanChange = (id: string) => {
    setSelectedPlanId(id);
    setSelectedBillingCycle("");
  };

  const handleTrack = () => {
    if (!selectedCatalog || !selectedPlan || !selectedBillingOption) {
      toast.error(dict.dashboard.toast_required_fields);
      return;
    }

    createMutation.mutate(
      {
        catalog_id: selectedCatalog.id,
        plan_name: selectedPlan.name,
        billing_cycle: selectedBillingOption.billing_cycle,
        price: Number(selectedBillingOption.price),
        next_billing_date: nextBillingDate,
      },
      {
        onSuccess: () => {
          toast.success(
            dict.dashboard.toast_success.replace("{{service}}", selectedCatalog.service_name)
          );
          setIsOpen(false);
          resetForm();
        },
        onError: (error: any) => {
          console.log(error);
          toast.error(
            dict.dashboard.toast_error.replace("{{message}}", error.message)
          );
        },
      }
    );
  };

  const resetForm = () => {
    setSelectedCatalogId("");
    setSelectedPlanId("");
    setSelectedBillingCycle("");
    setNextBillingDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          {dict.dashboard.add_new_subscription}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-md border-muted/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {dict.dashboard.add_new_subscription}
          </DialogTitle>
          <DialogDescription>
            {dict.dashboard.track_subscription_description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Service Selection */}
          <div className="grid gap-2">
            <Label htmlFor="service" className="text-sm font-medium">
              {dict.dashboard.service_label}
            </Label>
            <Select value={selectedCatalogId} onValueChange={handleCatalogChange}>
              <SelectTrigger id="service" className="h-12 bg-muted/50">
                <SelectValue placeholder={dict.dashboard.select_service_placeholder} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCatalog ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    {dict.dashboard.loading_services}
                  </div>
                ) : (
                  catalog?.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      <div className="flex items-center gap-2">
                        {entry.logo_url && (
                          <img
                            src={entry.logo_url}
                            alt={entry.service_name}
                            className="w-5 h-5 rounded-sm object-cover"
                          />
                        )}
                        <span>{entry.service_name}</span>
                        {entry.category && (
                          <Badge variant="outline" className="text-[10px] ml-1">
                            {entry.category}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedCatalog && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 grid gap-6">
              {/* Plan Selection */}
              <div className="grid gap-2">
                <Label htmlFor="plan" className="text-sm font-medium">
                  {dict.dashboard.plan_label}
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {selectedCatalog.plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanChange(plan.id!)}
                      className={cn(
                        "relative flex flex-col p-3 border rounded-lg cursor-pointer transition-all hover:bg-muted/30",
                        selectedPlanId === plan.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-muted"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{plan.name}</span>
                        {selectedPlanId === plan.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      {plan.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Cycle Selection */}
              {selectedPlan && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 grid gap-2">
                  <Label className="text-sm font-medium">{dict.dashboard.billing_cycle_label}</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.billing_options.map((option) => (
                      <Button
                        key={option.billing_cycle}
                        type="button"
                        variant={
                          selectedBillingCycle === option.billing_cycle
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedBillingCycle(option.billing_cycle)}
                        className="capitalize h-10 px-4"
                      >
                        {option.billing_cycle}
                        <span className="ml-2 text-xs opacity-70">
                          ${option.price}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Billing Date */}
              {selectedBillingCycle && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 grid gap-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    {dict.dashboard.next_billing_date_label}
                  </Label>
                  <div className="relative">
                    <DatePickerDemo
                      date={nextBillingDate ? new Date(nextBillingDate + "T12:00:00") : undefined}
                      onSelect={(date) => setNextBillingDate(date ? format(date, "yyyy-MM-dd") : "")}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {dict.dashboard.notification_hint}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="hover:bg-muted"
          >
            {dict.dashboard.cancel}
          </Button>
          <Button
            onClick={handleTrack}
            disabled={
              !selectedCatalogId ||
              !selectedPlanId ||
              !selectedBillingCycle ||
              createMutation.isPending
            }
            className="bg-primary text-primary-foreground"
          >
            {createMutation.isPending ? dict.dashboard.tracking : dict.dashboard.confirm_track}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TrackSubscriptionModal;
