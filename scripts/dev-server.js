// scripts/dev-server.js
// Lightweight local development server for Berithung (Frontend + /api/chat)

const http = require('http');
const fs = require('fs');
const path = require('path');

// Try loading local .env if present
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const chatHandler = require('../api/chat.js');
const ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function createServer(port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Handle /api/chat
    if (pathname === '/api/chat') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', async () => {
        req.body = bodyStr;
        res.status = function(code) { this.statusCode = code; return this; };
        res.json = function(data) {
          this.setHeader('Content-Type', 'application/json');
          this.end(JSON.stringify(data));
        };
        try {
          await chatHandler(req, res);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      });
      return;
    }

    // Serve static files
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(ROOT, safePath === '/' ? 'index.html' : safePath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(ROOT, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading file');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      createServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`Berithung local dev server running at: http://localhost:${port}`);
  });
}

createServer(3000);
