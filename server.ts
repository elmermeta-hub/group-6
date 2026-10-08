import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import { mcpHandler, MCP_PATH, SERVER_INFO, DATASET } from './api/_lib/mcp-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // API JSON Parser with 1mb limit
  app.use('/api', express.json({ limit: '1mb' }));

  // Express error handler for /api turning JSON errors into JSON-RPC responses
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32700,
          message: 'Parse error: Invalid JSON was received by the server.'
        },
        id: null
      });
    }
    if (err) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request: ' + (err.message || 'Malformed body')
        },
        id: null
      });
    }
    next();
  });

  // /api/health reporting MCP_PATH, SERVER_INFO, and DATASET
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      mcp_path: MCP_PATH,
      server: SERVER_INFO,
      dataset: DATASET,
      timestamp: new Date().toISOString()
    });
  });

  // MCP Handler for /api/mcp and /api
  app.all(['/api/mcp', '/api'], mcpHandler);

  if (!isProd) {
    // In development mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve static build files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NutriSafe Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[MCP Server] Available at ${MCP_PATH}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
