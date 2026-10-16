import { describe, it, expect } from 'vitest';
import {
  handleCalculateRentalYield,
  handleCalculateDubaiFees,
  handleCalculateMortgage,
  handleSearchOffPlan,
  handleGetDldAreaAnalytics,
} from '../src/tools.js';

describe('MCP Tools Unit Tests', () => {
  it('handles search_offplan_developments with budget and golden visa filter', () => {
    const result = handleSearchOffPlan({
      minBudgetAED: 2000000,
      goldenVisaOnly: true,
    });

    expect(result.totalMatches).toBeGreaterThan(0);
    for (const dev of result.developments) {
      expect(dev.startingPriceAED).toBeGreaterThanOrEqual(2000000);
      expect(dev.goldenVisaEligible).toBe(true);
    }
  });

  it('filters offplan by developer', () => {
    const result = handleSearchOffPlan({ developer: 'Emaar' });
    expect(result.totalMatches).toBeGreaterThan(0);
    expect(result.developments.every((d) => d.developer.includes('Emaar'))).toBe(true);
  });

  it('retrieves district analytics for Downtown Dubai', () => {
    const result = handleGetDldAreaAnalytics({ district: 'Downtown' });
    expect(result).toHaveProperty('avgPricePerSqFtAED');
    expect(result).toHaveProperty('typicalGrossYieldPercent');
    expect((result as any).district).toBe('Downtown Dubai');
  });

  it('returns graceful error with suggestions when district is not found', () => {
    const result = handleGetDldAreaAnalytics({ district: 'ImaginaryZone' });
    expect(result).toHaveProperty('error');
    expect((result as any).availableDistricts.length).toBeGreaterThan(3);
  });

  it('validates rental yield inputs with Zod and catches invalid types', () => {
    expect(() =>
      handleCalculateRentalYield({
        purchasePriceAED: -500, // Invalid negative
        expectedAnnualRentAED: 50000,
      })
    ).toThrow();
  });
});
