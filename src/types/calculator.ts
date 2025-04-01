
export interface RunwayData {
  totalCash: number;
  monthlyBurn: number;
  additionalFunding: number;
  growthRate: number;
  monthlyRevenue: number;
  
  // Calculated fields
  runwayMonths: number;
  runwayDate: Date;
  projectedData: MonthlyProjection[];
}

export interface MonthlyProjection {
  month: number;
  remaining: number;
  revenue: number;
  burn: number;
  date: Date;
}

export interface BreakEvenData {
  fixedCost: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
}
