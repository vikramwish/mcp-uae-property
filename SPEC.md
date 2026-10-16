# SPEC: mcp-uae-property

## Problem
AI agents (Claude, Gemini, Antigravity, Cursor) currently lack native, real-time structured tools to reason about the United Arab Emirates (UAE) property market, Dubai Land Department (DLD) fee calculations, Golden Visa real estate criteria, off-plan payment plans, and net rental yields.

## Users
1. AI coding & research agents needing structured UAE real estate math and market intelligence.
2. Property investors, expats, and wealth advisors using LLM clients to evaluate Dubai property investments.
3. Recruiters evaluating Vikram's proficiency in building Model Context Protocol (MCP) servers with TypeScript, Zod schema validation, and unit test suites.

## Core Scope & Capabilities
1. **Yield & ROI Calculator Tool (`calculate_rental_yield`)**:
   - Gross Rental Yield (%)
   - Net Rental Yield (%) accounting for service charges (AED/sq.ft), vacancy allowance, management fees
   - 5-year cash-on-cash return forecast
2. **Transaction Fee Breakdown (`calculate_dubai_fees`)**:
   - Dubai Land Department (DLD) 4% transfer fee + AED 580 admin fee
   - Real estate agency commission (standard 2% + VAT)
   - Property registration trustee fee (AED 4,000 + VAT for >500k AED)
   - Oqood fee for off-plan registrations
   - Golden Visa eligibility flag (threshold AED 2,000,000)
3. **Mortgage & Affordability Tool (`calculate_mortgage_eligibility`)**:
   - Central Bank of the UAE LTV limits: Expats (80% for <= AED 5M, 70% for > AED 5M); UAE Nationals (85% / 75%)
   - Monthly amortization calculation + 2% stress-test interest rate buffer
   - Debt-Burden Ratio (DBR) cap (50% of monthly income)
4. **Off-Plan Development Query Tool (`search_offplan_developments`)**:
   - Query curated developments across prime zones (Downtown, Marina, Palm, Hills Estate, Creek Harbour)
   - Filter by budget, developer (Emaar, Nakheel, Damac, Sobha), completion timeline
5. **DLD District Analytics Tool (`get_dld_area_analytics`)**:
   - Average price per sq.ft, historical annual appreciation, typical rental yield range

## Non-Goals
- Direct scraping of gated MLS portals (no auth bypass).
- Payment processing or real estate brokerage execution.

## Testing & Verification
- 100% test coverage on all mathematical calculations (yields, fees, mortgage amortization, DBR).
- Zod schema validation test cases for valid and malformed inputs.
- Integration tests simulating the MCP JSON-RPC protocol over StdioServerTransport.
