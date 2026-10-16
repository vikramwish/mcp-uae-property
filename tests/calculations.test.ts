import { describe, it, expect } from 'vitest';
import {
  calculateRentalYield,
  calculateDubaiFees,
  calculateMortgageEligibility,
} from '../src/calculations.js';

describe('calculateRentalYield', () => {
  it('correctly calculates gross and net yields for a standard Dubai 1-bedroom apartment', () => {
    const result = calculateRentalYield({
      purchasePriceAED: 1200000,
      expectedAnnualRentAED: 90000,
      serviceChargePerSqFtAED: 16,
      propertySizeSqFt: 800, // 12,800 AED service charges
      annualMaintenanceAED: 2000,
      vacancyWeeksPerYear: 2, // ~3,461 AED vacancy loss
      managementFeePercent: 5,
    });

    expect(result.grossYieldPercent).toBe(7.5); // 90,000 / 1,200,000 = 7.5%
    expect(result.effectiveGrossRentAED).toBeLessThan(90000);
    expect(result.netYieldPercent).toBeGreaterThan(5.0);
    expect(result.netYieldPercent).toBeLessThan(7.5);
    expect(result.fiveYearEstimatedCashFlowAED).toBeGreaterThan(0);
  });

  it('throws error for invalid purchase prices', () => {
    expect(() =>
      calculateRentalYield({
        purchasePriceAED: 0,
        expectedAnnualRentAED: 50000,
      })
    ).toThrow('purchasePriceAED must be greater than zero');
  });
});

describe('calculateDubaiFees', () => {
  it('calculates exact 4% DLD + trustee + agency fees for ready property', () => {
    const result = calculateDubaiFees({
      purchasePriceAED: 2500000,
      isOffPlan: false,
      hasMortgage: true,
      mortgageAmountAED: 1800000,
    });

    expect(result.dldTransferFeeAED).toBe(100000); // 4% of 2.5M
    expect(result.dldAdminFeeAED).toBe(580);
    expect(result.agencyFeeAED).toBe(50000); // 2% of 2.5M
    expect(result.agencyFeeVATAED).toBe(2500); // 5% of agency fee
    expect(result.trusteeFeeAED).toBe(4000);
    expect(result.trusteeFeeVATAED).toBe(200);
    expect(result.mortgageRegistrationFeeAED).toBe(1800000 * 0.0025 + 290);
    expect(result.isGoldenVisaEligible).toBe(true); // >= 2,000,000 AED
  });

  it('marks sub-2M property as not Golden Visa eligible', () => {
    const result = calculateDubaiFees({
      purchasePriceAED: 1500000,
      isOffPlan: true,
    });
    expect(result.isGoldenVisaEligible).toBe(false);
    expect(result.oqoodFeeAED).toBe(3000);
  });
});

describe('calculateMortgageEligibility', () => {
  it('enforces UAE Central Bank 80% LTV for expat first property under 5M AED', () => {
    const result = calculateMortgageEligibility({
      propertyPriceAED: 2000000,
      isUAENational: false,
      isFirstProperty: true,
      annualInterestRatePercent: 4.5,
      loanTermYears: 25,
      monthlyIncomeAED: 35000,
      otherMonthlyDebtsAED: 2000,
    });

    expect(result.maxLTVPercent).toBe(80);
    expect(result.maxLoanAmountAED).toBe(1600000);
    expect(result.minDownPaymentAED).toBe(400000);
    expect(result.monthlyPaymentAED).toBeGreaterThan(8000);
    expect(result.monthlyPaymentAED).toBeLessThan(10000);
    expect(result.stressTestedMonthlyPaymentAED).toBeGreaterThan(result.monthlyPaymentAED);
    expect(result.debtBurdenRatioPercent).toBeLessThan(50);
    expect(result.isEligibleUnderDBRCap).toBe(true);
  });

  it('flags ineligibility when Debt Burden Ratio exceeds 50%', () => {
    const result = calculateMortgageEligibility({
      propertyPriceAED: 4000000,
      isUAENational: false,
      isFirstProperty: true,
      annualInterestRatePercent: 5.5,
      loanTermYears: 20,
      monthlyIncomeAED: 20000, // Insufficient for a 3.2M AED mortgage
      otherMonthlyDebtsAED: 5000,
    });

    expect(result.debtBurdenRatioPercent).toBeGreaterThan(50);
    expect(result.isEligibleUnderDBRCap).toBe(false);
  });
});
