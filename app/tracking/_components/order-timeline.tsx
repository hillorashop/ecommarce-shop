"use client"


import {
  Check,
  Clock,
  Package,
  Truck,
  MapPin,
  XCircle,
  CircleCheckIcon,
  CheckCircle,
} from "lucide-react"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dbOrder } from "@/types/type"
import { CancelMessage } from "./cancel-message"
import { ReturnMessage } from "./return-message"



interface TimelineStep {
  label: string
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "NEARBY" | "COMPLETED" | "CANCELLED" | "RETURNED" | "CONFIRM"
  timestamp: string
  description: string
  icon: React.ReactNode
  displayStatus?: "completed" | "active" | "upcoming" | "cancelled" 

}

const formatDate = (
  value: Date | string,
) => {
  const date = new Date(value)

  return date
    .toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " --")
}

const addDays = (value: Date | string, days: number) => {
  const date = new Date(value)
  date.setDate(date.getDate() + days)
  return date
}

interface Props {
  order: dbOrder
}

const getSteps = (order: dbOrder): TimelineStep[] => {
  const baseDate = order.createdAt

return [
  {
    label: "Pending",
    status: "PENDING",
    timestamp: formatDate(order.createdAt),
    description: "আপনার অর্ডারটি গ্রহণ করা হয়েছে।",
    icon: <Clock className="size-3" />,
  },
    {
    label: "Confirm",
    status: "CONFIRM",
    timestamp: formatDate(order.createdAt),
   description: "আপনার অর্ডারটি নিশ্চিত করা হয়েছে।",
   icon: <CheckCircle className="size-3" />, 
  },
  {
    label: "Processing",
    status: "PROCESSING",
    timestamp: order.updatedAt
      ? formatDate(order.updatedAt)
      : formatDate(addDays(baseDate, 1)),
    description: "আপনার অর্ডার প্রস্তুত করা হচ্ছে।",
    icon: <Package className="size-3" />,
  },
  {
    label: "Shipped",
    status: "SHIPPED",
    timestamp: order.updatedAt
      ? formatDate(order.updatedAt)
      : formatDate(addDays(baseDate, 2)),
    description: "আপনার অর্ডারটি পথে রয়েছে।",
    icon: <Truck className="size-3" />,
  },
  {
    label: "Nearby",
    status: "NEARBY",
    timestamp: order.updatedAt
      ? formatDate(order.updatedAt)
      : formatDate(addDays(baseDate, 3)),
    description: "প্যাকেজটি আপনার নিকটবর্তী ডেলিভারি হাবে পৌঁছেছে এবং আজই ডেলিভারি হবে।",
    icon: <MapPin className="size-3" />,
  },
  {
    label: "Completed",
    status: "COMPLETED",
    timestamp: order.updatedAt
      ? formatDate(order.updatedAt)
      : formatDate(addDays(baseDate, 3)),
    description: "আপনার অর্ডার সফলভাবে ডেলিভারি সম্পন্ন হয়েছে।",
    icon: <CircleCheckIcon className="size-3" />,
  },
]

}


const getStepsWithDisplayStatus = (steps: TimelineStep[], currentStatus: TimelineStep["status"]): TimelineStep[] => {
  const currentIndex = steps.findIndex(step => step.status === currentStatus)

  return steps.map((step, index) => {
    if (currentStatus === "CANCELLED") 
      return { ...step, displayStatus: step.status === "CANCELLED" ? "cancelled" : "upcoming" }
    if (index < currentIndex) return { ...step, displayStatus: "completed" }
    if (index === currentIndex) return { ...step, displayStatus: "active" }
    return { ...step, displayStatus: "upcoming" }
  })
}


const StepIndicator = ({ status, size = "default" }: { status: "completed" | "active" | "upcoming" | "cancelled"; size?: "default" | "small" }) => {
  const sizeClasses = size === "small" ? "h-8 w-8" : "h-8 w-8 md:h-10 md:w-10"
  const checkSize = size === "small" ? "h-4 w-4" : "h-4 w-4 md:h-5 md:w-5"
  const dotSize = size === "small" ? "h-2.5 w-2.5" : "h-2.5 w-2.5 md:h-3 md:w-3"
  const emptyDotSize = size === "small" ? "h-2 w-2" : "h-2 w-2 md:h-2.5 md:w-2.5"

  switch (status) {
    case "completed":
      return (
        <div className={`relative z-10 flex ${sizeClasses} items-center justify-center rounded-full bg-green-600 text-white shadow-md`}>
          <Check className={checkSize} strokeWidth={3} />
        </div>
      )
    case "cancelled":
      return (
        <div className={`relative z-10 flex ${sizeClasses} items-center justify-center rounded-full border-[3px] border-foreground/40 bg-background shadow-sm`}>
          <XCircle className={`${checkSize} text-foreground/60`} />
        </div>
      )
    case "active":
      return (
        <div className={`relative z-10 flex ${sizeClasses} items-center justify-center rounded-full bg-green-600 text-white shadow-md`}>
           <Check className={checkSize} strokeWidth={3} />
        </div>
      )
    default:
      return (
        <div className={`relative z-10 flex ${sizeClasses} items-center justify-center rounded-full border-2 border-border bg-secondary text-muted-foreground`}>
          <div className={`${emptyDotSize} rounded-full bg-border`} />
        </div>
      )
  }
}

export const OrderTimeline = ({ order }: Props) => {

  const steps = getSteps(order)

  const stepsWithStatus = getStepsWithDisplayStatus(steps, order.status)


const currentIndex = steps.findIndex(
  step => step.status === order.status
)

const progressPercent =
  order.status === "COMPLETED"
    ? 100
    : order.status === "CANCELLED"
      ? 0
      : Math.max(0, (currentIndex / (steps.length - 1)) * 100)

  return (
   <section className="mt-4 lg:mt-6 overflow-hidden">
    {order.status === "CANCELLED" ? <CancelMessage/> : order.status === "RETURNED" ? <ReturnMessage/> : (
     <>
          <div className="hidden md:block">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-5 h-[2px] bg-border" />
              <div className="absolute left-0 top-5 h-[2px] bg-green-600 transition-all duration-700" style={{ width: `calc(${progressPercent}% + 80px )` }} />
              {stepsWithStatus.map(step => (
                <div key={step.label} className="relative flex flex-col items-center" style={{ width: `${100 / stepsWithStatus.length}%` }}>
                  <StepIndicator status={step.displayStatus!} />
                  <span className={`mt-3 text-xs font-semibold uppercase tracking-wider ${
                    step.displayStatus === "upcoming" ? "text-muted-foreground/50" : step.displayStatus === "completed" ? "text-foreground/60" : "text-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-3" style={{ gridTemplateColumns: `repeat(${stepsWithStatus.length}, 1fr)` }}>
              {stepsWithStatus.map(step => (
                <div key={step.label} className={`rounded-xl p-3 transition-all ${
                 step.displayStatus === "active" ? "border-2 border-green-600 bg-secondary shadow-sm" : step.displayStatus === "completed" ? "bg-secondary/50" : step.displayStatus === "upcoming" ? "opacity-50" : "bg-red-100"
                }`}>
                  <div className="flex items-center gap-x-1 w-full mb-2">
                    <div className={` inline-flex rounded-lg p-1.5 ${
                    step.displayStatus === "active" ? "text-foreground" : step.displayStatus === "completed" ? "bg-accent text-foreground" : "bg-accent text-muted-foreground"
                  }`}>
                    {step.icon}
                  </div>
                       <h3 className={`text-sm font-semibold ${
                          step.displayStatus === "upcoming" ? "text-muted-foreground" : step.displayStatus === "completed" ? "text-foreground/60" : "text-foreground"
                        }`}>
                          {step.label}
                        </h3>
                  </div>
              
                  <p className="text-xs  font-semibold text-muted-foreground">{step.timestamp}</p>
                  <p className={`mt-1 text-xs md:text-sm font-semibold text-muted-foreground leading-relaxed ${step.displayStatus === "upcoming" ? "text-muted-foreground/60" : "text-foreground"}`}>
                    {step.description}
                  </p>
               
                </div>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <div className="relative">
              <div className="absolute bottom-0 left-[15px] top-4 w-[2px] bg-border" />
              <div className="absolute left-[15px] top-0 w-[2px] bg-green-600 transition-all duration-700" style={{ height: `${progressPercent}%` }} />
              <div className="flex flex-col gap-6">
                {stepsWithStatus.map(step => (
                  <div key={step.label} className="relative flex gap-3.5">
                    <StepIndicator status={step.displayStatus!} size="small" />
                    <div className={`min-w-0 flex-1 rounded-xl p-3 transition-all ${
                      step.displayStatus === "active" ? "border-2 border-green-600 bg-secondary shadow-sm" : step.displayStatus === "completed" ? "bg-secondary/50" : step.displayStatus === "upcoming" ? "opacity-50" : "bg-red-100"
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex shrink-0 rounded-lg p-1.5 ${
                          step.displayStatus === "active" ? "text-foreground" : step.displayStatus === "completed" ? "bg-accent text-foreground" : "bg-accent text-muted-foreground"
                        }`}>
                          {step.icon}
                        </div>
                        <h3 className={`text-sm font-semibold ${
                          step.displayStatus === "upcoming" ? "text-muted-foreground" : step.displayStatus === "completed" ? "text-foreground/60" : "text-foreground"
                        }`}>
                          {step.label}
                        </h3>
                      </div>
                      <p className="mt-1 text-[10px] font-medium text-muted-foreground">{step.timestamp}</p>
                      <p className={`mt-0.5 text-[11px] leading-relaxed ${step.displayStatus === "upcoming" ? "text-muted-foreground/60" : "text-foreground/80"}`}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
    )}
   
  
    </section>
        
 
  )
}
