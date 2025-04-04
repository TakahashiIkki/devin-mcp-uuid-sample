import { MCP } from '@modelcontextprotocol/sdk';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function main() {
  const uuid = generateUUID();
  console.log(`Generated UUID: ${uuid}`);
  
  try {
    console.log('Using MCP SDK...');
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
