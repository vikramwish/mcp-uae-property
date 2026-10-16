import { describe, it, expect, beforeAll } from 'vitest';
import { createUaePropertyMcpServer } from '../src/server.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

describe('MCP Server Integration Tests', () => {
  let server: ReturnType<typeof createUaePropertyMcpServer>;

  beforeAll(() => {
    server = createUaePropertyMcpServer();
  });

  it('lists all 5 required tools with schemas', async () => {
    // Send ListToolsRequest through server internal handler
    const handler = (server as any)._requestHandlers.get(ListToolsRequestSchema.shape.method.value);
    expect(handler).toBeDefined();

    const response = await handler({ method: 'tools/list' }, {});
    expect(response.tools).toHaveLength(5);

    const toolNames = response.tools.map((t: any) => t.name);
    expect(toolNames).toContain('calculate_rental_yield');
    expect(toolNames).toContain('calculate_dubai_fees');
    expect(toolNames).toContain('calculate_mortgage_eligibility');
    expect(toolNames).toContain('search_offplan_developments');
    expect(toolNames).toContain('get_dld_area_analytics');
  });

  it('executes calculate_dubai_fees tool request', async () => {
    const handler = (server as any)._requestHandlers.get(CallToolRequestSchema.shape.method.value);
    expect(handler).toBeDefined();

    const response = await handler(
      {
        method: 'tools/call',
        params: {
          name: 'calculate_dubai_fees',
          arguments: {
            purchasePriceAED: 2000000,
            isOffPlan: false,
          },
        },
      },
      {}
    );

    expect(response.isError).toBeFalsy();
    expect(response.content[0].type).toBe('text');
    const parsed = JSON.parse(response.content[0].text);
    expect(parsed.purchasePriceAED).toBe(2000000);
    expect(parsed.dldTransferFeeAED).toBe(80000); // 4%
    expect(parsed.isGoldenVisaEligible).toBe(true);
  });

  it('lists and reads property://districts resource', async () => {
    const listHandler = (server as any)._requestHandlers.get(
      ListResourcesRequestSchema.shape.method.value
    );
    const listRes = await listHandler({ method: 'resources/list' }, {});
    expect(listRes.resources.length).toBeGreaterThanOrEqual(2);

    const readHandler = (server as any)._requestHandlers.get(
      ReadResourceRequestSchema.shape.method.value
    );
    const readRes = await readHandler(
      {
        method: 'resources/read',
        params: { uri: 'property://districts' },
      },
      {}
    );

    expect(readRes.contents[0].uri).toBe('property://districts');
    const districts = JSON.parse(readRes.contents[0].text);
    expect(Array.isArray(districts)).toBe(true);
    expect(districts.length).toBeGreaterThan(5);
  });
});
