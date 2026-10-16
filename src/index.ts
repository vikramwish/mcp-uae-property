#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createUaePropertyMcpServer } from './server.js';

async function main() {
  const server = createUaePropertyMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error('mcp-uae-property server running on stdio transport');
}

main().catch((error) => {
  console.error('Fatal error in mcp-uae-property server:', error);
  process.exit(1);
});
