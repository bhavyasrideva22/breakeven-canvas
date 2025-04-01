
import { RunwayData, MonthlyProjection } from "@/types/calculator";

export function calculateRunway(
  totalCash: number,
  monthlyBurn: number,
  additionalFunding: number = 0,
  growthRate: number = 0,
  monthlyRevenue: number = 0
): RunwayData {
  // Adjust total cash with additional funding
  const adjustedTotalCash = totalCash + additionalFunding;

  // Calculate monthly projections
  const projections: MonthlyProjection[] = [];
  let remainingCash = adjustedTotalCash;
  let currentRevenue = monthlyRevenue;
  let month = 0;
  const today = new Date();

  // While we still have cash, or up to 60 months maximum (5 years)
  while (remainingCash > 0 && month < 60) {
    // Calculate burn rate after considering revenue
    const netBurn = Math.max(0, monthlyBurn - currentRevenue);
    
    // Create projection for this month
    const date = new Date(today);
    date.setMonth(today.getMonth() + month);
    
    projections.push({
      month,
      remaining: remainingCash,
      revenue: currentRevenue,
      burn: monthlyBurn,
      date
    });
    
    // Update remaining cash
    remainingCash -= netBurn;
    
    // Update revenue for next month by applying growth rate
    currentRevenue = currentRevenue * (1 + growthRate / 100);
    
    // Increment month
    month++;
  }
  
  // If we exited because we ran out of cash, we need to calculate the exact end date
  const runwayMonths = projections.length - 1;
  const runwayDate = new Date(today);
  runwayDate.setMonth(today.getMonth() + runwayMonths);
  
  return {
    totalCash,
    monthlyBurn,
    additionalFunding,
    growthRate,
    monthlyRevenue,
    runwayMonths,
    runwayDate,
    projectedData: projections
  };
}
