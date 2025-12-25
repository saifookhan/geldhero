import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between w-full", className)}
      >
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  index < currentStep
                    ? "border-blue-600 bg-blue-600 text-white"
                    : index === currentStep
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-500"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium",
                    index <= currentStep ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-4 transition-colors",
                  index < currentStep ? "bg-blue-600" : "bg-gray-300"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);
Stepper.displayName = "Stepper";

export { Stepper };
export type { Step, StepperProps };
