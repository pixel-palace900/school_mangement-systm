import * as React from "react"
// Temporarily comment out external dependencies until they are fixed
// import * as LabelPrimitive from "@radix-ui/react-label"
// import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

// Simple implementation of labelVariants
const labelVariants = () => "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

// Simple implementation of Label
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
