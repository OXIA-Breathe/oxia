import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border border-border/60 bg-card text-card-foreground shadow-[0_8px_24px_-12px_hsl(213_81%_19%_/_0.18)]",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Tile-style stats card used on the home/breathing screen and stat strips.
const StatsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label: string;
    value: string | number;
    fullWidth?: boolean;
  }
>(({ className, label, value, fullWidth = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center text-center rounded-2xl bg-card/90 backdrop-blur-sm border border-border/50 px-3 py-3 shadow-[0_4px_14px_-8px_hsl(213_81%_19%_/_0.20)]",
      fullWidth ? "w-full" : "flex-1",
      className
    )}
    {...props}
  >
    <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
    <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wide">{label}</p>
  </div>
))
StatsCard.displayName = "StatsCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatsCard }
