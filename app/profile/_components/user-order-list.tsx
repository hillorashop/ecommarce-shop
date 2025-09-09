"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { InvoiceOrder } from "@/app/checkout/_components/invoice-order";
import { formatDate } from "@/lib/utils";
import { useCustomQuery } from "@/hooks/use-custom-query";
import { getOrders } from "@/actions/order";
import { useState } from "react";

interface Props {
  tabValue: string;
  userId: string;
}

export const UserOrderList = ({ tabValue, userId }: Props) => {
  const [page,setPage] = useState(1)
  const { data: orders, isLoading, error } = useCustomQuery(
    ["ordersByUser", userId, { page: page, pageSize: 10 }],
    () => getOrders(page, 10, userId),
      {
    staleTime: 2 * 60 * 60 * 1000, // 2 hour
  }
  );

  

  return (
    <TabsContent value={tabValue} className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">My Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-2 md:px-6">
          {isLoading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b pb-3">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && orders?.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You don’t have any orders yet.
            </p>
          )}

          {!isLoading && orders?.data && orders.data.length > 0 && (
            <>
            <Accordion type="single" collapsible className="w-full lg:p-1">
              {orders.data.map((order: any) => (
                <AccordionItem key={order.id} value={`order-${order.id}`}>
                  <AccordionTrigger>
                    <div className="flex flex-col text-left">
                      <p className="font-semibold">Order No: {order.orderId}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(new Date(order.createdAt))}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <InvoiceOrder order={order} hideButton />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
         <div className="flex items-center justify-between mt-4 text-gray-700 text-xs font-semibold">
                <Button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous Page
                </Button>

                <span>
                  Page {orders?.pagination.currentPage || page} of {orders?.pagination.totalPages || 1}
                </span>

                <Button
                  onClick={() => setPage(prev => Math.min(prev + 1, orders?.pagination.totalPages || 1))}
                  disabled={page === orders?.pagination.totalPages}
                >
                  Next Page
                </Button>
              </div>

       
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
