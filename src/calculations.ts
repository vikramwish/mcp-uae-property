import {
  RentalYieldInput,
  RentalYieldResult,
  DubaiFeesInput,
  DubaiFeesResult,
  MortgageInput,
  MortgageResult,
} from './types.js';

/**
 * Calculates Dubai rental yield including gross yield, net operating income,
 * and 5-year cash-flow estimates.
 */
export function calculateRentalYield(input: RentalYieldInput): RentalYieldResult {
  const {
    purchasePriceAED,
    expectedAnnualRentAED,
    serviceChargePerSqFtAED = 15,
    propertySizeSqFt = 850,
    annualMaintenanceAED = 2000,
    vacancyWeeksPerYear = 2,
    managementFeePercent = 5,
  } = input;

  if (purchasePriceAED <= 0) {
    throw new Error('purchasePriceAED must be greater than zero');
  }
  if (expectedAnnualRentAED < 0) {
    throw new Error('expectedAnnualRentAED cannot be negative');
  }

  const vacancyFraction = Math.min(Math.max(vacancyWeeksPerYear, 0), 52) / 52;
  const effectiveGrossRentAED = expectedAnnualRentAED * (1 - vacancyFraction);

  const annualServiceCharge = serviceChargePerSqFtAED * propertySizeSqFt;
  const managementFee = effectiveGrossRentAED * (managementFeePercent / 100);
  const totalAnnualExpensesAED = annualServiceCharge + annualMaintenanceAED + managementFee;

  const netAnnualOperatingIncomeAED = Math.max(0, effectiveGrossRentAED - totalAnnualExpensesAED);

  const grossYieldPercent = Number(((expectedAnnualRentAED / purchasePriceAED) * 100).toFixed(2));
  const netYieldPercent = Number(((netAnnualOperatingIncomeAED / purchasePriceAED) * 100).toFixed(2));

  // 5-year estimated cumulative cashflow assuming 3% annual rent growth and 2% expense inflation
  let fiveYearCumulativeCashFlow = 0;
  let curRent = effectiveGrossRentAED;
  let curExpenses = totalAnnualExpensesAED;

  for (let year = 1; year <= 5; year++) {
    fiveYearCumulativeCashFlow += Math.max(0, curRent - curExpenses);
    curRent *= 1.03;
    curExpenses *= 1.02;
  }

  return {
    purchasePriceAED,
    annualGrossRentAED: expectedAnnualRentAED,
    effectiveGrossRentAED: Math.round(effectiveGrossRentAED),
    totalAnnualExpensesAED: Math.round(totalAnnualExpensesAED),
    netAnnualOperatingIncomeAED: Math.round(netAnnualOperatingIncomeAED),
    grossYieldPercent,
    netYieldPercent,
    fiveYearEstimatedCashFlowAED: Math.round(fiveYearCumulativeCashFlow),
  };
}

/**
 * Calculates standard Dubai Land Department (DLD) and auxiliary transaction fees.
 */
export function calculateDubaiFees(input: DubaiFeesInput): DubaiFeesResult {
  const {
    purchasePriceAED,
    isOffPlan = false,
    hasMortgage = false,
    mortgageAmountAED = 0,
  } = input;

  if (purchasePriceAED <= 0) {
    throw new Error('purchasePriceAED must be greater than zero');
  }

  // DLD Transfer Fee: 4% of purchase price + 580 AED title deed admin fee
  const dldTransferFeeAED = purchasePriceAED * 0.04;
  const dldAdminFeeAED = isOffPlan ? 0 : 580;

  // Real estate agent fee: 2% + 5% UAE VAT
  const agencyFeeAED = purchasePriceAED * 0.02;
  const agencyFeeVATAED = agencyFeeAED * 0.05;

  // Registration trustee fee: AED 4,000 + 5% VAT if >= 500k AED, else AED 2,000 + VAT
  let trusteeFeeAED = 0;
  let trusteeFeeVATAED = 0;
  if (!isOffPlan) {
    trusteeFeeAED = purchasePriceAED >= 500000 ? 4000 : 2000;
    trusteeFeeVATAED = trusteeFeeAED * 0.05;
  }

  // Mortgage registration fee: 0.25% of loan amount + AED 290 fee
  let mortgageRegistrationFeeAED = 0;
  if (hasMortgage && mortgageAmountAED > 0) {
    mortgageRegistrationFeeAED = mortgageAmountAED * 0.0025 + 290;
  }

  // Oqood (pre-title registration for off-plan)
  const oqoodFeeAED = isOffPlan ? 3000 : 0;

  const totalUpfrontFeesAED = Math.round(
    dldTransferFeeAED +
    dldAdminFeeAED +
    agencyFeeAED +
    agencyFeeVATAED +
    trusteeFeeAED +
    trusteeFeeVATAED +
    mortgageRegistrationFeeAED +
    oqoodFeeAED
  );

  const totalAcquisitionCostAED = purchasePriceAED + totalUpfrontFeesAED;
  const feesAsPercentOfPrice = Number(((totalUpfrontFeesAED / purchasePriceAED) * 100).toFixed(2));
  const isGoldenVisaEligible = purchasePriceAED >= 2000000;

  return {
    purchasePriceAED,
    dldTransferFeeAED: Math.round(dldTransferFeeAED),
    dldAdminFeeAED,
    agencyFeeAED: Math.round(agencyFeeAED),
    agencyFeeVATAED: Math.round(agencyFeeVATAED),
    trusteeFeeAED,
    trusteeFeeVATAED,
    mortgageRegistrationFeeAED: Math.round(mortgageRegistrationFeeAED),
    oqoodFeeAED,
    totalUpfrontFeesAED,
    totalAcquisitionCostAED,
    feesAsPercentOfPrice,
    isGoldenVisaEligible,
  };
}

/**
 * Calculates UAE Central Bank mortgage limits, monthly amortization, and Debt-Burden Ratio (DBR).
 */
export function calculateMortgageEligibility(input: MortgageInput): MortgageResult {
  const {
    propertyPriceAED,
    isUAENational = false,
    isFirstProperty = true,
    annualInterestRatePercent,
    loanTermYears,
    monthlyIncomeAED,
    otherMonthlyDebtsAED = 0,
  } = input;

  if (propertyPriceAED <= 0) throw new Error('propertyPriceAED must be greater than zero');
  if (annualInterestRatePercent <= 0) throw new Error('annualInterestRatePercent must be positive');
  if (loanTermYears <= 0 || loanTermYears > 25) throw new Error('loanTermYears must be between 1 and 25');
  if (monthlyIncomeAED <= 0) throw new Error('monthlyIncomeAED must be greater than zero');

  // UAE Central Bank LTV Regulations
  let maxLTVPercent = 80;
  if (isUAENational) {
    if (isFirstProperty) {
      maxLTVPercent = propertyPriceAED <= 5000000 ? 85 : 75;
    } else {
      maxLTVPercent = 65;
    }
  } else {
    // Expat
    if (isFirstProperty) {
      maxLTVPercent = propertyPriceAED <= 5000000 ? 80 : 70;
    } else {
      maxLTVPercent = 60;
    }
  }

  const maxLoanAmountAED = propertyPriceAED * (maxLTVPercent / 100);
  const minDownPaymentAED = propertyPriceAED - maxLoanAmountAED;

  // Monthly payment calculation: M = P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
  const calculateMonthlyAmortization = (principal: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12 / 100;
    const numPayments = years * 12;
    const factor = Math.pow(1 + monthlyRate, numPayments);
    return principal * ((monthlyRate * factor) / (factor - 1));
  };

  const monthlyPaymentAED = calculateMonthlyAmortization(maxLoanAmountAED, annualInterestRatePercent, loanTermYears);

  // Central Bank stress test (+2% interest rate buffer)
  const stressTestedMonthlyPaymentAED = calculateMonthlyAmortization(
    maxLoanAmountAED,
    annualInterestRatePercent + 2.0,
    loanTermYears
  );

  const numPayments = loanTermYears * 12;
  const totalRepaymentAED = monthlyPaymentAED * numPayments;
  const totalLoanInterestAED = totalRepaymentAED - maxLoanAmountAED;

  // Debt-Burden Ratio (DBR) = (Total monthly obligations / Gross monthly income) * 100
  const totalMonthlyDebtObligations = monthlyPaymentAED + otherMonthlyDebtsAED;
  const debtBurdenRatioPercent = Number(((totalMonthlyDebtObligations / monthlyIncomeAED) * 100).toFixed(2));

  // UAE Central Bank maximum DBR limit is 50%
  const isEligibleUnderDBRCap = debtBurdenRatioPercent <= 50.0;
  const maxAffordableMonthlyPaymentAED = Math.max(0, monthlyIncomeAED * 0.50 - otherMonthlyDebtsAED);

  return {
    propertyPriceAED,
    maxLTVPercent,
    minDownPaymentAED: Math.round(minDownPaymentAED),
    maxLoanAmountAED: Math.round(maxLoanAmountAED),
    monthlyPaymentAED: Math.round(monthlyPaymentAED),
    stressTestedMonthlyPaymentAED: Math.round(stressTestedMonthlyPaymentAED),
    totalLoanInterestAED: Math.round(totalLoanInterestAED),
    totalRepaymentAED: Math.round(totalRepaymentAED),
    debtBurdenRatioPercent,
    isEligibleUnderDBRCap,
    maxAffordableMonthlyPaymentAED: Math.round(maxAffordableMonthlyPaymentAED),
  };
}
