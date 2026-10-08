import { MCP_PATH, SERVER_INFO, DATASET } from './_lib/mcp-server.js';

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    mcp_path: MCP_PATH,
    server: SERVER_INFO,
    dataset: DATASET,
    timestamp: new Date().toISOString()
  });
}
