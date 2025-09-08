"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { CustomForm } from "@/components/ui/custom-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceOrder } from "../checkout/_components/invoice-order";
import { dbOrder } from "@/types/type";
import { getOrders } from "@/actions/order";
import { Zap } from "lucide-react";

// Zod schema
const trackSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
});

type TrackFormValues = z.infer<typeof trackSchema>;

const TrackingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<dbOrder | null>(null);

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: { orderId: "" },
  });

  const onSubmit = async (values: TrackFormValues) => {
    setIsLoading(true);
    setOrder(null);

   

    try {
      let page = 1;
      let found = false;
      let fetchedOrder: dbOrder | null = null;

      while (!found) {
        const res = await getOrders(page, 20); // pageSize = 20
        fetchedOrder = res.data.find((o) => o.orderId === values.orderId.trim()) || null;

        if (fetchedOrder) {
          found = true;
          setOrder(fetchedOrder);
          break;
        }

        if (page >= res.pagination.totalPages) break;
        page++;
      }

      if (!found) {
        toast.error("Order not found. Please check your Order ID.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center  justify-center py-10 w-full px-4">
      <Card className="max-w-4xl w-full">
        <CardHeader className="w-full flex-col flex items-center">
          <CardTitle className="text-xl font-bold">Tracking your order</CardTitle>
          <CardDescription className="text-sm font-semibold">
            See full order details
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="input"
                    label="Order No"
                    placeHolder="Enter your order no."
                    important
                  />
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                       <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 animate-spin" />
                     Tracking...
                    </div>
                ): "Track Order"}
              </Button>
            </form>
          </Form>

          {order && <InvoiceOrder order={order}/>}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingPage;
