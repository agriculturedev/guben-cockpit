import * as React from "react"

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const FloatInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({onChange, ...props}, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        let value = e.currentTarget.value;

        // Replace comma with a dot for consistency
        value = value.replace(",", ".");

        // Allow empty input (null) to support clearing the field
        if (value === "" || value === "-") {
          onChange(null as any);
          return;
        }

        // Validate input: Allow only numbers and a single decimal point
        if (/^-?\d*\.?\d*$/.test(value)) {
          onChange(value as any); // Pass string to allow incomplete numbers like "10."
        }
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onChange) {
        let value = e.target.value.replace(",", ".");

        // Convert to a number only if it's valid
        const numericValue = value === "" ? null : parseFloat(value);
        onChange(numericValue as any);
      }
    };

    return (
      <Input
        type="text" // `type="text"` prevents auto-correction that blocks incomplete decimals
        inputMode="decimal" // Helps on mobile devices
        ref={ref}
        {...props}
        onChange={handleChange}
        onBlur={handleBlur} // Ensures conversion to number when leaving the input
      />
    );
  }
);
FloatInput.displayName = "FloatInput";

export { Input, FloatInput }
