"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, Check, Clock } from "lucide-react";

const formSchema = z.object({
  // Personal Information
  email: z.string().email("Invalid email address"),
  age: z
    .number()
    .min(18, "Must be at least 18 years old")
    .max(100, "Must be less than 100 years old"),
  currentlyLivingIn: z.string().default("Germany"),
  familyStatus: z.string().min(1, "Please select family status"),
  hasKids: z.string().min(1, "Please select if you have kids"),
  numberOfKids: z.number().optional(),
  employmentStatus: z.string().min(1, "Please select employment status"),
  housingStatus: z.string().min(1, "Please select housing status"),

  // Financial Information
  financialKnowledge: z
    .string()
    .min(1, "Please select financial knowledge level"),
  riskComfort: z.string().min(1, "Please select risk comfort level"),
  monthlyIncome: z.string().min(1, "Please select monthly income range"),
  incomeStability: z.string().min(1, "Please select income stability"),
  rentExpenditure: z.number().min(0, "Must be a positive number"),
  electricityExpenditure: z.number().min(0, "Must be a positive number"),
  utilitiesExpenditure: z.number().min(0, "Must be a positive number"),
  transportExpenditure: z.number().min(0, "Must be a positive number"),
  groceriesExpenditure: z.number().min(0, "Must be a positive number"),
  miscellaneousExpenditure: z.number().min(0, "Must be a positive number"),
  additionalYearlyIncome: z.number().min(0, "Must be a positive number"),
  additionalYearlyExpenditure: z.number().min(0, "Must be a positive number"),

  // Goal Information
  goalType: z.string().min(1, "Please select goal type"),
  goalAmount: z
    .number()
    .min(1, "Goal amount must be greater than 0")
    .optional(),
  goalAmountRange: z.string().optional(),
  timeHorizon: z.string().min(1, "Please select time horizon"),
  fundingSource: z.string().min(1, "Please select funding source"),
  goalFlexibility: z.string().min(1, "Please select goal flexibility"),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { title: "Personal", description: "Basic information" },
  { title: "Financial", description: "Income & expenses" },
  { title: "Goals", description: "Your objectives" },
];

const familyStatusOptions = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "other", label: "Other" },
];

const employmentStatusOptions = [
  { value: "self-employed", label: "Self-Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "employed", label: "Employed" },
];

const housingStatusOptions = [
  { value: "owner", label: "Owner" },
  { value: "renting", label: "Renting" },
  { value: "living-with-parents", label: "Living with Parents" },
];

const financialKnowledgeOptions = [
  { value: "naive", label: "Naïve" },
  { value: "beginner", label: "Beginner" },
  { value: "somewhat-confident", label: "Somewhat Confident" },
  { value: "confident", label: "Confident" },
];

const riskComfortOptions = [
  {
    value: "conservative",
    label:
      "Conservative: Low Risk (I prefer certainty and stability, even if returns are lower)",
  },
  {
    value: "balanced",
    label: "Balance: Middle Risk (I am able to bear with gradual ups and down)",
  },
  {
    value: "growth",
    label:
      "Growth: High Risk (I can tolerate high volatility for greater returns)",
  },
];

const monthlyIncomeOptions = [
  { value: "500-1000", label: "€500 - €1,000" },
  { value: "1000-2000", label: "€1,000 - €2,000" },
  { value: "2000-3000", label: "€2,000 - €3,000" },
  { value: "3000-4000", label: "€3,000 - €4,000" },
  { value: "4000-5000", label: "€4,000 - €5,000" },
  { value: "5000-6000", label: "€5,000 - €6,000" },
  { value: "6000+", label: "€6,000+" },
];

const incomeStabilityOptions = [
  { value: "regular", label: "Regular (Permanent Job)" },
  { value: "stable", label: "Stable" },
  { value: "unstable", label: "Unstable/Variable" },
];

const goalTypeOptions = [
  { value: "travel", label: "Travel / Holidays" },
  { value: "marriage", label: "Marriage" },
  { value: "home-furnishing", label: "Home Furnishing" },
  { value: "education", label: "Education" },
  { value: "emergency-fund", label: "Emergency Fund" },
  { value: "car", label: "Purchase a Car" },
  { value: "investment", label: "Investment" },
];

const timeHorizonOptions = [
  { value: "short-term", label: "Short-Term (3 Months – 1 Year)" },
  { value: "medium-term", label: "Medium Term (1 Year – 5 Years)" },
];

const fundingSourceOptions = [
  { value: "monthly-savings", label: "Monthly Savings" },
  {
    value: "combination",
    label: "Combination (Monthly Savings + Already Saved, etc.)",
  },
];

const goalFlexibilityOptions = [
  { value: "fixed", label: "Fixed (Time-based)" },
  { value: "somewhat-flexible", label: "Somewhat Flexible" },
  { value: "flexible", label: "Flexible" },
];

export function CalculatorForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showKidsNumber, setShowKidsNumber] = useState(false);
  const [showGoalAmount, setShowGoalAmount] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentlyLivingIn: "Germany",
      rentExpenditure: 0,
      electricityExpenditure: 0,
      utilitiesExpenditure: 0,
      transportExpenditure: 0,
      groceriesExpenditure: 0,
      miscellaneousExpenditure: 0,
      additionalYearlyIncome: 0,
      additionalYearlyExpenditure: 0,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const watchHasKids = watch("hasKids");
  const watchGoalAmount = watch("goalAmount");

  React.useEffect(() => {
    setShowKidsNumber(watchHasKids === "yes");
  }, [watchHasKids]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("calculator_responses").insert([
        {
          email: data.email,
          age: data.age,
          currently_living_in: data.currentlyLivingIn,
          family_status: data.familyStatus,
          has_kids: data.hasKids,
          number_of_kids: data.numberOfKids,
          employment_status: data.employmentStatus,
          housing_status: data.housingStatus,
          financial_knowledge: data.financialKnowledge,
          risk_comfort: data.riskComfort,
          monthly_income: data.monthlyIncome,
          income_stability: data.incomeStability,
          rent_expenditure: data.rentExpenditure,
          electricity_expenditure: data.electricityExpenditure,
          utilities_expenditure: data.utilitiesExpenditure,
          transport_expenditure: data.transportExpenditure,
          groceries_expenditure: data.groceriesExpenditure,
          miscellaneous_expenditure: data.miscellaneousExpenditure,
          additional_yearly_income: data.additionalYearlyIncome,
          additional_yearly_expenditure: data.additionalYearlyExpenditure,
          goal_type: data.goalType,
          goal_amount: data.goalAmount,
          goal_amount_range: data.goalAmountRange,
          time_horizon: data.timeHorizon,
          funding_source: data.fundingSource,
          goal_flexibility: data.goalFlexibility,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
        <p className="text-gray-600 max-w-md">
          Your financial assessment has been submitted successfully. Our team
          will analyze your information and provide personalized
          recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Clock className="h-4 w-4" />
          This will only take 7 minutes
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Financial Assessment
        </h1>
        <p className="text-gray-600">
          Help us understand your financial situation to provide personalized
          recommendations
        </p>
      </div>

      <div className="mb-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="currentlyLivingIn">Currently living in</Label>
                <Input
                  id="currentlyLivingIn"
                  value="Germany"
                  disabled
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="familyStatus">Family Status *</Label>
                <Select
                  onValueChange={(value) => setValue("familyStatus", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select family status" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.familyStatus && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.familyStatus.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="hasKids">Do you have kids? *</Label>
                <Select onValueChange={(value) => setValue("hasKids", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                {errors.hasKids && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hasKids.message}
                  </p>
                )}
              </div>

              {showKidsNumber && (
                <div>
                  <Label htmlFor="numberOfKids">Number of Kids</Label>
                  <Input
                    id="numberOfKids"
                    type="number"
                    {...register("numberOfKids", { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select
                  onValueChange={(value) => setValue("employmentStatus", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employmentStatus && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.employmentStatus.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="housingStatus">Housing Status *</Label>
                <Select
                  onValueChange={(value) => setValue("housingStatus", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select housing status" />
                  </SelectTrigger>
                  <SelectContent>
                    {housingStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.housingStatus && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.housingStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Financial Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Financial Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="financialKnowledge">
                  Financial Knowledge *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("financialKnowledge", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select knowledge level" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialKnowledgeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.financialKnowledge && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.financialKnowledge.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="riskComfort">Risk Comfort *</Label>
                <Select
                  onValueChange={(value) => setValue("riskComfort", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select risk comfort level" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskComfortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.riskComfort && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.riskComfort.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="monthlyIncome">
                  Average Monthly Income (€) *
                </Label>
                <Select
                  onValueChange={(value) => setValue("monthlyIncome", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthlyIncomeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.monthlyIncome && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.monthlyIncome.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="incomeStability">Income Stability *</Label>
                <Select
                  onValueChange={(value) => setValue("incomeStability", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select income stability" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeStabilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.incomeStability && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.incomeStability.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Average Monthly Expenditures (€)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rentExpenditure">Rent</Label>
                  <Input
                    id="rentExpenditure"
                    type="number"
                    {...register("rentExpenditure", { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="electricityExpenditure">Electricity</Label>
                  <Input
                    id="electricityExpenditure"
                    type="number"
                    {...register("electricityExpenditure", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="utilitiesExpenditure">Utilities</Label>
                  <Input
                    id="utilitiesExpenditure"
                    type="number"
                    {...register("utilitiesExpenditure", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="transportExpenditure">Transport</Label>
                  <Input
                    id="transportExpenditure"
                    type="number"
                    {...register("transportExpenditure", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="groceriesExpenditure">Groceries</Label>
                  <Input
                    id="groceriesExpenditure"
                    type="number"
                    {...register("groceriesExpenditure", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="miscellaneousExpenditure">
                    Miscellaneous
                  </Label>
                  <Input
                    id="miscellaneousExpenditure"
                    type="number"
                    {...register("miscellaneousExpenditure", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="additionalYearlyIncome">
                  Additional Yearly Income (€)
                </Label>
                <Input
                  id="additionalYearlyIncome"
                  type="number"
                  {...register("additionalYearlyIncome", {
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                  placeholder="Bonus + Tax Refunds etc."
                />
              </div>
              <div>
                <Label htmlFor="additionalYearlyExpenditure">
                  Additional Yearly Expenditures (€)
                </Label>
                <Input
                  id="additionalYearlyExpenditure"
                  type="number"
                  {...register("additionalYearlyExpenditure", {
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                  placeholder="Travel + Shopping"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goal Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Goal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="goalType">Goal Type *</Label>
                <Select onValueChange={(value) => setValue("goalType", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.goalType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.goalType.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="goalAmount">Goal Amount (€)</Label>
                  <button
                    type="button"
                    onClick={() => setShowGoalAmount(!showGoalAmount)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showGoalAmount ? "Not Sure?" : "Enter Amount"}
                  </button>
                </div>
                {showGoalAmount ? (
                  <Input
                    id="goalAmount"
                    type="number"
                    {...register("goalAmount", { valueAsNumber: true })}
                    className="mt-1"
                    placeholder="Enter amount"
                  />
                ) : (
                  <Select
                    onValueChange={(value) =>
                      setValue("goalAmountRange", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select amount range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-5000">€0 - €5,000</SelectItem>
                      <SelectItem value="5000-10000">
                        €5,000 - €10,000
                      </SelectItem>
                      <SelectItem value="10000-25000">
                        €10,000 - €25,000
                      </SelectItem>
                      <SelectItem value="25000-50000">
                        €25,000 - €50,000
                      </SelectItem>
                      <SelectItem value="50000+">€50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label htmlFor="timeHorizon">Time Horizon *</Label>
                <Select
                  onValueChange={(value) => setValue("timeHorizon", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select time horizon" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeHorizonOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timeHorizon && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.timeHorizon.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="fundingSource">Funding Sources *</Label>
                <Select
                  onValueChange={(value) => setValue("fundingSource", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select funding source" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingSourceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fundingSource && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fundingSource.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="goalFlexibility">Goal Flexibility *</Label>
                <Select
                  onValueChange={(value) => setValue("goalFlexibility", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select goal flexibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalFlexibilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.goalFlexibility && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.goalFlexibility.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
