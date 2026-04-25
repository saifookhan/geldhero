import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface ScoringMatrixRow {
  id: string;
  factor: string;
  factor_slug: string;
  max_points: number;
  weight: number;
  type: "range" | "enum";
  condition: string;
  condition_slug: string;
  range_min: number | null;
  range_max: number | null;
  enum_value: string | null;
  score: number;
}

interface UserResponse {
  age: number;
  family_status: string;
  has_kids: string;
  employment_status: string;
  housing_status: string;
  income_stability: string;
  monthly_income: string;
  risk_comfort: string;
  rent_expenditure: number;
  electricity_expenditure: number;
  utilities_expenditure: number;
  transport_expenditure: number;
  groceries_expenditure: number;
  miscellaneous_expenditure: number;
  additional_yearly_income: number;
  additional_yearly_expenditure: number;
  avg_monthly_income?: number | string;
  avg_monthly_expenditures?: number | string;
  current_savings?: number | string;
  current_liabilities?: number | string;
  [key: string]: any;
}

interface DerivedMetrics {
  monthly_surplus: number | null;
  expense_ratio: number | null;
  net_additional_cash_flow: number | null;
  savings_coverage: number | null;
  liabilities_annual_income_ratio: number | null;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.-]/g, "");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function resolveMonthlyIncome(userResponse: UserResponse): number | null {
  const directIncome = toNumber(userResponse.avg_monthly_income);
  if (directIncome !== null) {
    return directIncome;
  }

  const parsedMonthlyIncome = toNumber(userResponse.monthly_income);
  if (parsedMonthlyIncome !== null) {
    return parsedMonthlyIncome;
  }

  const incomeRangeMap: Record<string, { min: number; max: number }> = {
    "500-1000": { min: 500, max: 1000 },
    "1000-2000": { min: 1000, max: 2000 },
    "2000-3000": { min: 2000, max: 3000 },
    "3000-4000": { min: 3000, max: 4000 },
    "4000-5000": { min: 4000, max: 5000 },
    "5000-6000": { min: 5000, max: 6000 },
    "6000+": { min: 6000, max: 99999 },
  };
  const incomeRange = incomeRangeMap[userResponse.monthly_income];
  if (!incomeRange) {
    return null;
  }

  return (incomeRange.min + incomeRange.max) / 2;
}

function calculateDerivedMetrics(userResponse: UserResponse): DerivedMetrics {
  const monthlyExpenses =
    (toNumber(userResponse.rent_expenditure) || 0) +
    (toNumber(userResponse.electricity_expenditure) || 0) +
    (toNumber(userResponse.utilities_expenditure) || 0) +
    (toNumber(userResponse.transport_expenditure) || 0) +
    (toNumber(userResponse.groceries_expenditure) || 0) +
    (toNumber(userResponse.miscellaneous_expenditure) || 0);

  const monthlyIncome = resolveMonthlyIncome(userResponse);
  const avgMonthlyExpenditures =
    toNumber(userResponse.avg_monthly_expenditures) ?? monthlyExpenses;
  const additionalYearlyIncome = toNumber(
    userResponse.additional_yearly_income,
  );
  const additionalYearlyExpenditure = toNumber(
    userResponse.additional_yearly_expenditure,
  );
  const currentSavings = toNumber(userResponse.current_savings);
  const currentLiabilities = toNumber(userResponse.current_liabilities);

  const monthlySurplus =
    monthlyIncome === null ? null : monthlyIncome - avgMonthlyExpenditures;
  const expenseRatio =
    monthlyIncome === null || monthlyIncome === 0
      ? null
      : avgMonthlyExpenditures / monthlyIncome;
  const netAdditionalCashFlow =
    additionalYearlyIncome === null || additionalYearlyExpenditure === null
      ? null
      : additionalYearlyIncome - additionalYearlyExpenditure;
  const savingsCoverage =
    currentSavings === null ||
    avgMonthlyExpenditures === null ||
    avgMonthlyExpenditures === 0
      ? null
      : currentSavings / avgMonthlyExpenditures;
  const liabilitiesAnnualIncomeRatio =
    currentLiabilities === null || monthlyIncome === null || monthlyIncome === 0
      ? null
      : currentLiabilities / (12 * monthlyIncome);

  return {
    monthly_surplus: monthlySurplus,
    expense_ratio: expenseRatio,
    net_additional_cash_flow: netAdditionalCashFlow,
    savings_coverage: savingsCoverage,
    liabilities_annual_income_ratio: liabilitiesAnnualIncomeRatio,
  };
}

interface CalculatedScore {
  factor: string;
  factor_slug: string;
  userValue: string | number;
  matchedCondition: string;
  score: number;
  maxPoints: number;
}

function normalizeEnumValue(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}



const enumValueAliases: Record<string, Record<string, string[]>> = {

  housing: {
    owner: ["owner_paid", "owner_mortgage", "owned", "owner"],
    owned: ["owner_paid", "owner_mortgage", "owner", "owned"],
    living_with_parents: ["parents_shared", "living_with_parents", "shared"],
  },
};

function getMatchingRowsByFactorSlug(
  scoringMatrix: ScoringMatrixRow[],
  factorSlug: string,
): ScoringMatrixRow[] {
  const normalizedRequested = normalizeEnumValue(factorSlug);
  return scoringMatrix.filter((row) =>
    normalizedRequested.includes(normalizeEnumValue(row.factor_slug)),
  );
}

// 🔥 MAIN FUNCTION
function calculateScores(
  userResponse: UserResponse,
  scoringMatrix: ScoringMatrixRow[],
): CalculatedScore[] {
  const results: CalculatedScore[] = [];

  
  // Derived values
  
  const monthlyExpenses =
    (userResponse.rent_expenditure || 0) +
    (userResponse.electricity_expenditure || 0) +
    (userResponse.utilities_expenditure || 0) +
    (userResponse.transport_expenditure || 0) +
    (userResponse.groceries_expenditure || 0) +
    (userResponse.miscellaneous_expenditure || 0);

  const monthlyIncome = resolveMonthlyIncome(userResponse) ?? 0;

  const expenseRatio =
    monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;

  const netMonthlyCashFlow =
    monthlyIncome +
    (userResponse.additional_yearly_income || 0) / 12 -
    (userResponse.additional_yearly_expenditure || 0) / 12 -
    monthlyExpenses;
  const derivedMetrics = calculateDerivedMetrics(userResponse);

  
  // Mapping
  
  const fieldToFactorMap: Record<string, { value: any; type: string }> = {
    age: { value: userResponse.age, type: "range" },
    family_status: { value: userResponse.family_status, type: "enum" },
    kids: { value: userResponse.has_kids, type: "enum" },
    housing: { value: userResponse.housing_status, type: "enum" },
    income_stability: { value: userResponse.income_stability, type: "enum" },
    monthly_income: { value: monthlyIncome, type: "range" },
    risk_comfort: { value: userResponse.risk_comfort, type: "enum" },
    expense_ratio: { value: expenseRatio, type: "range" },
    net_cash_flow: { value: netMonthlyCashFlow, type: "range" },
    savings_coverage: {
      value: derivedMetrics.savings_coverage ?? 0,
      type: "range",
    },
    liabilities_load: {
      value: derivedMetrics.liabilities_annual_income_ratio ?? 0,
      type: "range",
    },
  };

  console.log("=== FIELD MAP ===", fieldToFactorMap);

  
  // Process factors
  
  for (const [factorSlug, { value, type }] of Object.entries(
    fieldToFactorMap,
  )) {
    const matchingRows = getMatchingRowsByFactorSlug(scoringMatrix, factorSlug);

    let matchedRow: ScoringMatrixRow | null = null;

    if (type === "enum") {    
      const normalizedMappedValue = normalizeEnumValue(value);
      const aliasCandidates =
        enumValueAliases[factorSlug]?.[normalizedMappedValue] || [];
      const candidateValues = [
        normalizedMappedValue,
        ...aliasCandidates.map(normalizeEnumValue),
      ];

      matchedRow =
        matchingRows.find((row) =>
          candidateValues.includes(normalizeEnumValue(row.enum_value)),
        ) ||
        // Last fallback: allow partial token match for legacy enum naming.
        matchingRows.find((row) => {
          const enumVal = normalizeEnumValue(row.enum_value);
          return candidateValues.some(
            (candidate) =>
              enumVal.includes(candidate) || candidate.includes(enumVal),
          );
        }) ||
        null;
    } else {
      matchedRow = matchingRows.find((row) => {
        const min = row.range_min ?? -Infinity;
        const max = row.range_max ?? Infinity;
        return value >= min && value <= max;
      }) || null;
    }

    // Debug
    if (!matchedRow) {
      console.log("❌ No match:", {
        factorSlug,
        originalValue: value,
        matchingRows,
      });
    }

    // ALWAYS PUSH
    results.push({
      factor: matchedRow?.factor || factorSlug,
      factor_slug: factorSlug,
      userValue:
        typeof value === "number" ? Math.round(value * 100) / 100 : value,
      matchedCondition: matchedRow?.condition || "No match found",
      score: matchedRow?.score ?? 0,
      maxPoints: matchedRow?.max_points ?? 0,
    });
  }

  console.log("=== FINAL RESULTS ===", results);

  return results;
}


// API ROUTE
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, scoreId } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data: scoringMatrix, error: matrixError } = await supabase
      .from("scoring_matrix")
      .select("*");

    if (matrixError) {
      return NextResponse.json({ error: matrixError.message }, { status: 500 });
    }

    const { data: userResponse, error: responseError } = await supabase
      .from("calculator_responses")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

      console.log("user response from backend", userResponse);

    if (responseError) {
      return NextResponse.json(
        { error: responseError.message },
        { status: 500 },
      );
    }

    const calculatedScores = calculateScores(userResponse, scoringMatrix || []);
    const derivedMetrics = calculateDerivedMetrics(userResponse);

    const totalScore = calculatedScores.reduce(
      (sum, item) => sum + item.score,
      0,
    );

    const maxPossibleScore = calculatedScores.reduce(
      (sum, item) => sum + item.maxPoints,
      0,
    );

    const payload = {
      user_email: email,
      calculator_response_id: userResponse.id,
      total_score: totalScore,
      max_possible_score: maxPossibleScore,
      score_breakdown: calculatedScores,
      derived_metrics: derivedMetrics,
      calculated_at: new Date().toISOString(),
    };

    let upsertError = null;

    if (scoreId) {
      const { error } = await supabase
        .from("risk_capacity_scores")
        .update(payload)
        .eq("id", scoreId);
      upsertError = error;
    } else {
      const { error } = await supabase
        .from("risk_capacity_scores")
        .insert([payload]);
      upsertError = error;
    }

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      totalScore,
      maxPossibleScore,
      scoreBreakdown: calculatedScores,
      derivedMetrics,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
