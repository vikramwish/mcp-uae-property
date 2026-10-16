import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import {
  handleCalculateRentalYield,
  handleCalculateDubaiFees,
  handleCalculateMortgage,
  handleSearchOffPlan,
  handleGetDldAreaAnalytics,
} from './tools.js';
import { DUBAI_DISTRICTS } from './data.js';

export function createUaePropertyMcpServer(): Server {
  const server = new Server(
    {
      name: 'mcp-uae-property',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // 1. List Available Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'calculate_rental_yield',
        description:
          'Calculates Dubai gross and net rental yield percentages, accounting for developer service charges (AED/sq.ft), vacancy allowance, maintenance, and a 5-year cashflow projection.',
        inputSchema: {
          type: 'object',
          properties: {
            purchasePriceAED: {
              type: 'number',
              description: 'Total property purchase price in AED',
            },
            expectedAnnualRentAED: {
              type: 'number',
              description: 'Projected annual gross rent in AED',
            },
            serviceChargePerSqFtAED: {
              type: 'number',
              description: 'Annual service charge in AED per sq.ft (default: 16)',
            },
            propertySizeSqFt: {
              type: 'number',
              description: 'Property built-up area in sq.ft (default: 850)',
            },
            annualMaintenanceAED: {
              type: 'number',
              description: 'Annual maintenance budget in AED (default: 2000)',
            },
            vacancyWeeksPerYear: {
              type: 'number',
              description: 'Estimated vacancy allowance in weeks per year (default: 2)',
            },
            managementFeePercent: {
              type: 'number',
              description: 'Property management fee percentage (default: 5%)',
            },
          },
          required: ['purchasePriceAED', 'expectedAnnualRentAED'],
        },
      },
      {
        name: 'calculate_dubai_fees',
        description:
          'Calculates all official upfront purchase fees: Dubai Land Department (DLD) 4% transfer fee, administration fees, agency commission (2% + VAT), registration trustee fees, mortgage registration fees, and checks 10-year Golden Visa eligibility (>= 2,000,000 AED).',
        inputSchema: {
          type: 'object',
          properties: {
            purchasePriceAED: {
              type: 'number',
              description: 'Agreed purchase price in AED',
            },
            isOffPlan: {
              type: 'boolean',
              description: 'True if buying off-plan from developer; false for secondary market ready property',
            },
            hasMortgage: {
              type: 'boolean',
              description: 'True if financing via mortgage',
            },
            mortgageAmountAED: {
              type: 'number',
              description: 'Mortgage loan principal in AED',
            },
          },
          required: ['purchasePriceAED'],
        },
      },
      {
        name: 'calculate_mortgage_eligibility',
        description:
          'Calculates mortgage affordability per UAE Central Bank regulations: LTV caps for expats (80% / 70%) and UAE nationals (85% / 75%), monthly payment, stress-test interest rate buffer (+2%), and 50% Debt-Burden Ratio (DBR) cap.',
        inputSchema: {
          type: 'object',
          properties: {
            propertyPriceAED: {
              type: 'number',
              description: 'Property valuation/price in AED',
            },
            isUAENational: {
              type: 'boolean',
              description: 'True if borrower is UAE National; false for expats',
            },
            isFirstProperty: {
              type: 'boolean',
              description: 'True if first residential property in UAE',
            },
            annualInterestRatePercent: {
              type: 'number',
              description: 'Annual interest rate (e.g. 4.5)',
            },
            loanTermYears: {
              type: 'number',
              description: 'Loan tenor in years (max 25)',
            },
            monthlyIncomeAED: {
              type: 'number',
              description: 'Monthly salary/income in AED',
            },
            otherMonthlyDebtsAED: {
              type: 'number',
              description: 'Existing monthly debt commitments in AED',
            },
          },
          required: [
            'propertyPriceAED',
            'annualInterestRatePercent',
            'loanTermYears',
            'monthlyIncomeAED',
          ],
        },
      },
      {
        name: 'search_offplan_developments',
        description:
          'Searches curated premier Dubai off-plan developments by budget, district, developer (Emaar, Nakheel, Damac, Sobha, Ellington), and Golden Visa status.',
        inputSchema: {
          type: 'object',
          properties: {
            minBudgetAED: { type: 'number', description: 'Minimum price in AED' },
            maxBudgetAED: { type: 'number', description: 'Maximum budget in AED' },
            district: { type: 'string', description: 'District name (e.g. Marina, Downtown, Palm)' },
            developer: { type: 'string', description: 'Developer name (e.g. Emaar, Damac)' },
            goldenVisaOnly: { type: 'boolean', description: 'Filter only projects >= 2M AED' },
          },
        },
      },
      {
        name: 'get_dld_area_analytics',
        description:
          'Retrieves district-level investment metrics including average price per sq.ft, median 1-bedroom rents, typical gross yields, and 5-year capital appreciation for Dubai sub-markets.',
        inputSchema: {
          type: 'object',
          properties: {
            district: {
              type: 'string',
              description: 'District name or ID (e.g. "downtown-dubai", "Dubai Marina", "palm-jumeirah")',
            },
          },
          required: ['district'],
        },
      },
    ],
  }));

  // 2. Call Tool Execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let resultData: unknown;
      switch (name) {
        case 'calculate_rental_yield':
          resultData = handleCalculateRentalYield(args);
          break;
        case 'calculate_dubai_fees':
          resultData = handleCalculateDubaiFees(args);
          break;
        case 'calculate_mortgage_eligibility':
          resultData = handleCalculateMortgage(args);
          break;
        case 'search_offplan_developments':
          resultData = handleSearchOffPlan(args);
          break;
        case 'get_dld_area_analytics':
          resultData = handleGetDldAreaAnalytics(args);
          break;
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(resultData, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Error executing ${name}: ${err.message || String(err)}`,
          },
        ],
      };
    }
  });

  // 3. Resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: 'property://districts',
        name: 'Dubai Investment Districts Directory',
        mimeType: 'application/json',
        description: 'Comprehensive directory of top Dubai residential investment districts with yield and pricing benchmarks.',
      },
      {
        uri: 'property://golden-visa-rules',
        name: 'UAE Golden Visa Real Estate Guidelines',
        mimeType: 'text/markdown',
        description: 'Official criteria for obtaining the UAE 10-year Golden Visa through property investment.',
      },
    ],
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    if (uri === 'property://districts') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(DUBAI_DISTRICTS, null, 2),
          },
        ],
      };
    }

    if (uri === 'property://golden-visa-rules') {
      const markdown = `# UAE 10-Year Golden Visa (Real Estate Category)

## Eligibility Criteria
- **Minimum Investment**: AED 2,000,000 (Two Million Dirhams) in one or more properties.
- **Property Types**: Ready or Off-plan properties from approved developers.
- **Mortgage Allowance**: Mortgages from specific UAE Central Bank licensed local banks are permitted, provided the investor equity or approved down-payment reaches required thresholds.
- **Joint Ownership**: Spouses may combine property values to reach the AED 2,000,000 threshold with an authenticated marriage certificate.

## Key Benefits
- 10-year renewable residency visa with zero corporate/personal income tax.
- Family sponsorship (spouse, children without age restrictions).
- Unlimited stay outside the UAE without visa invalidation (exempt from standard 6-month rule).
- Domestic staff sponsorship.
`;
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: markdown,
          },
        ],
      };
    }

    throw new McpError(ErrorCode.InvalidRequest, `Unknown resource URI: ${uri}`);
  });

  // 4. Prompts
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: [
      {
        name: 'dubai-investment-memo',
        description: 'Prepare an institutional-grade investment memo evaluating a property in Dubai.',
        arguments: [
          {
            name: 'propertyTitle',
            description: 'Name of the project or property',
            required: true,
          },
          {
            name: 'purchasePriceAED',
            description: 'Agreed or advertised price in AED',
            required: true,
          },
        ],
      },
    ],
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === 'dubai-investment-memo') {
      const title = args?.propertyTitle || 'Target Property';
      const price = args?.purchasePriceAED || '2,000,000';
      return {
        description: `Investment Memo Template for ${title}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please conduct a comprehensive investment analysis for "${title}" priced at AED ${price}. Use the available tools to:
1. Calculate the acquisition cost and fee breakdown using calculate_dubai_fees.
2. Estimate gross and net rental yield using calculate_rental_yield.
3. Check district analytics for the surrounding area with get_dld_area_analytics.
4. Assess mortgage financing scenarios with calculate_mortgage_eligibility.
5. Provide a clear recommendation on cash flow, capital appreciation, and Golden Visa eligibility.`,
            },
          },
        ],
      };
    }

    throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
  });

  return server;
}
