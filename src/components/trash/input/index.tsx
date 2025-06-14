import {forwardRef} from "react"

import {type VariantProps, cva} from "class-variance-authority"

import {cn} from "../../../utils/cn"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive"
      },
      inputSize: {
        default: "h-10",
        sm: "h-9 px-2",
        lg: "h-11 px-4"
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default"
    }
  }
)

interface InputProps extends Omit, VariantProps {
  error?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({className, variant, inputSize, error, type, ...props}, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({variant: error ? "error" : variant, inputSize, className}))}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export {Input}
