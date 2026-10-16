# PLAN: mcp-uae-property

1. **Task 1: Package & Build Setup**
   - Files: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `LICENSE`
   - Install dependencies: `@modelcontextprotocol/sdk`, `zod`, `vitest`, `typescript`
   - Verification: `npm run build` exits 0.

2. **Task 2: Financial & Regulatory Engine (TDD)**
   - Files: `src/calculations.ts`, `tests/calculations.test.ts`
   - Implement math: `calculateRentalYield`, `calculateDubaiFees`, `calculateMortgageEligibility`
   - Verification: `npx vitest run tests/calculations.test.ts` passes 100%.

3. **Task 3: Market Data Store & Search Tools**
   - Files: `src/data.ts`, `src/tools.ts`, `tests/tools.test.ts`
   - Implement developments database, area stats, search tools with Zod input validation
   - Verification: `npx vitest run tests/tools.test.ts` passes 100%.

4. **Task 4: MCP Server Interface & Transport**
   - Files: `src/server.ts`, `src/index.ts`, `tests/mcp-server.test.ts`
   - Wire tools into `@modelcontextprotocol/sdk/server` using `StdioServerTransport`
   - Verification: `npx vitest run tests/mcp-server.test.ts` passes 100%.

5. **Task 5: GitHub Actions CI & Linting**
   - Files: `.github/workflows/ci.yml`
   - Test, typecheck, and build steps
   - Verification: Local dry run passes.

6. **Task 6: Portfolio Documentation & Publishing**
   - Files: `README.md` (recruiter-grade with Claude Desktop & Cursor config snippets, badges, diagrams)
   - Git init, branch `autopilot/feat-mcp-uae-property`, secret scan, PR, review, merge, deploy/publish.
