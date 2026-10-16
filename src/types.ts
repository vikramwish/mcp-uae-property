export interface RentalYieldInput {
  purchasePriceAED: number;
  expectedAnnualRentAED: number;
  serviceChargePerSqFtAED?: number;
  propertySizeSqFt?: number;
  annualMaintenanceAED?: number;
  vacancyWeeksPerYear?: number;
  managementFeePercent?: number;
}

export interface RentalYieldResult {
  purchasePriceAED: number;
  annualGrossRentAED: number;
  effectiveGrossRentAED: number;
  totalAnnualExpensesAED: number;
  netAnnualOperatingIncomeAED: number;
  grossYieldPercent: number;
  netYieldPercent: number;
  fiveYearEstimatedCashFlowAED: number;
}

export interface DubaiFeesInput {
  purchasePriceAED: number;
  isOffPlan?: boolean;
  hasMortgage?: boolean;
  mortgageAmountAED?: number;
}

export interface DubaiFeesResult {
  purchasePriceAED: number;
  dldTransferFeeAED: number;
  dldAdminFeeAED: number;
  agencyFeeAED: number;
  agencyFeeVATAED: number;
  trusteeFeeAED: number;
  trusteeFeeVATAED: number;
  mortgageRegistrationFeeAED: number;
  oqoodFeeAED: number;
  totalUpfrontFeesAED: number;
  totalAcquisitionCostAED: number;
  feesAsPercentOfPrice: number;
  isGoldenVisaEligible: boolean;
}

export interface MortgageInput {
  propertyPriceAED: number;
  isUAENational?: boolean;
  isFirstProperty?: boolean;
  annualInterestRatePercent: number;
  loanTermYears: number;
  monthlyIncomeAED: number;
  otherMonthlyDebtsAED?: number;
}

export interface MortgageResult {
  propertyPriceAED: number;
  maxLTVPercent: number;
  minDownPaymentAED: number;
  maxLoanAmountAED: number;
  monthlyPaymentAED: number;
  stressTestedMonthlyPaymentAED: number;
  totalLoanInterestAED: number;
  totalRepaymentAED: number;
  debtBurdenRatioPercent: number;
  isEligibleUnderDBRCap: boolean;
  maxAffordableMonthlyPaymentAED: number;
}
