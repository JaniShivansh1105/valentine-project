import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white shadow hover:bg-neutral-800",
        secondary: "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200",
        outline: "border border-neutral-300 bg-transparent shadow-sm hover:bg-neutral-50",
        ghost: "hover:bg-neutral-100",
        destructive: "bg-red-600 text-white shadow hover:bg-red-700",
        calm: "bg-emerald-600 text-white shadow hover:bg-emerald-700",
        reflective: "bg-amber-600 text-white shadow hover:bg-amber-700",
        spicy: "bg-violet-600 text-white shadow hover:bg-violet-700",
        nuclear: "bg-red-600 text-white shadow hover:bg-red-700",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
