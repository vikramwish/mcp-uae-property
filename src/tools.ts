import { z } from 'zod';
import {
  calculateRentalYield,
  calculateDubaiFees,
  calculateMortgageEligibility,
} from './calculations.js';
import { DUBAI_DISTRICTS, OFF_PLAN_DEVELOPMENTS } from './data.js';

export const CalculateRentalYieldSchema = z.object({
  purchasePriceAED: z.number().positive().describe('Total acquisition price in AED (United Arab Emirates Dirham)'),
  expectedAnnualRentAED: z.number().nonnegative().describe('Expected annual gross rental income in AED'),
  serviceChargePerSqFtAED: z.number().nonnegative().optional().default(16).describe('Annual service charge per square foot in AED (default: 16)'),
  propertySizeSqFt: z.number().positive().optional().default(850).describe('Total internal plus external property area in sq.ft (default: 850)'),
  annualMaintenanceAED: z.number().nonnegative().optional().default(2000).describe('Contingency budget for annual maintenance/chiller in AED (default: 2000)'),
  vacancyWeeksPerYear: z.number().min(0).max(52).optional().default(2).describe('Estimated vacancy allowance in weeks per year (default: 2)'),
  managementFeePercent: z.number().min(0).max(30).optional().default(5).describe('Property management agency percentage fee (default: 5%)'),
});

export const CalculateDubaiFeesSchema = z.object({
  purchasePriceAED: z.number().positive().describe('Total property agreed purchase price in AED'),
  isOffPlan: z.boolean().optional().default(false).describe('True if off-plan direct from developer; false for secondary market resale'),
  hasMortgage: z.boolean().optional().default(false).describe('Whether property purchase is financed via a bank mortgage'),
  mortgageAmountAED: z.number().nonnegative().optional().default(0).describe('Mortgage financing amount in AED if applicable'),
});

export const CalculateMortgageSchema = z.object({
  propertyPriceAED: z.number().positive().describe('Agreed valuation/price of the UAE property in AED'),
  isUAENational: z.boolean().optional().default(false).describe('True if borrower is a UAE Citizen; false if Expatriate / Foreign resident'),
  isFirstProperty: z.boolean().optional().default(true).describe('True if this is the borrower’s first residential property purchase in UAE'),
  annualInterestRatePercent: z.number().positive().describe('Annual mortgage interest rate (e.g. 4.75 for 4.75%)'),
  loanTermYears: z.number().int().min(1).max(25).describe('Tenor of mortgage in years (maximum 25 years in the UAE)'),
  monthlyIncomeAED: z.number().positive().describe('Verified gross monthly salary/income in AED'),
  otherMonthlyDebtsAED: z.number().nonnegative().optional().default(0).describe('Existing monthly credit card / auto loan commitments in AED'),
});

export const SearchOffPlanSchema = z.object({
  maxBudgetAED: z.number().positive().optional().describe('Maximum budget in AED'),
  minBudgetAED: z.number().nonnegative().optional().describe('Minimum budget in AED'),
  district: z.string().optional().describe('Filter by district name or substring (e.g. Marina, Downtown, Palm)'),
  developer: z.string().optional().describe('Filter by developer name (e.g. Emaar, Nakheel, Damac, Sobha)'),
  goldenVisaOnly: z.boolean().optional().describe('Filter strictly for properties >= 2M AED qualifying for the UAE 10-year Golden Visa'),
});

export const GetDldAreaAnalyticsSchema = z.object({
  district: z.string().describe('District name or ID (e.g. "downtown-dubai", "Dubai Marina", "palm-jumeirah")'),
});

// Implementation functions
export function handleCalculateRentalYield(args: unknown) {
  const validated = CalculateRentalYieldSchema.parse(args);
  return calculateRentalYield(validated);
}

export function handleCalculateDubaiFees(args: unknown) {
  const validated = CalculateDubaiFeesSchema.parse(args);
  return calculateDubaiFees(validated);
}

export function handleCalculateMortgage(args: unknown) {
  const validated = CalculateMortgageSchema.parse(args);
  return calculateMortgageEligibility(validated);
}

export function handleSearchOffPlan(args: unknown) {
  const params = SearchOffPlanSchema.parse(args || {});
  let results = [...OFF_PLAN_DEVELOPMENTS];

  if (params.minBudgetAED !== undefined) {
    results = results.filter((d) => d.startingPriceAED >= params.minBudgetAED!);
  }
  if (params.maxBudgetAED !== undefined) {
    results = results.filter((d) => d.startingPriceAED <= params.maxBudgetAED!);
  }
  if (params.district) {
    const q = params.district.toLowerCase();
    results = results.filter(
      (d) => d.districtName.toLowerCase().includes(q) || d.districtId.toLowerCase().includes(q)
    );
  }
  if (params.developer) {
    const q = params.developer.toLowerCase();
    results = results.filter((d) => d.developer.toLowerCase().includes(q));
  }
  if (params.goldenVisaOnly) {
    results = results.filter((d) => d.goldenVisaEligible);
  }

  return {
    totalMatches: results.length,
    developments: results,
  };
}

export function handleGetDldAreaAnalytics(args: unknown) {
  const { district } = GetDldAreaAnalyticsSchema.parse(args);
  const q = district.toLowerCase().trim();

  const found = DUBAI_DISTRICTS.find(
    (d) => d.id === q || d.name.toLowerCase().includes(q)
  );

  if (!found) {
    return {
      error: `District '${district}' not found in database.`,
      availableDistricts: DUBAI_DISTRICTS.map((d) => d.name),
    };
  }

  return {
    district: found.name,
    avgPricePerSqFtAED: found.avgPricePerSqFtAED,
    medianRent1BedAED: found.medianRent1BedAED,
    typicalGrossYieldPercent: found.typicalGrossYieldPercent,
    historicalAppreciation5YrPercent: found.historicalAppreciation5YrPercent,
    metroConnected: found.metroConnected,
    highlights: found.popularFor,
  };
}
