/**
 * Lightweight Accenture Online Assessment (OA) Simulator Server
 * Zero external dependencies - uses Node.js standard library (http, fs, path, url)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const LOGS_JSON_PATH = path.join(DATA_DIR, 'logs.json');
const LOGS_CSV_PATH = path.join(DATA_DIR, 'logs.csv');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const CSV_HEADER = '"Timestamp","Candidate Name","Email/Roll","Device ID","Device Type","OS","Browser","Screen","CPU Cores","RAM Memory","Touch Points","Timezone","Language","IP Address"\n';

function rebuildCsvFromLogs(logsList) {
  let csvContent = CSV_HEADER;
  for (const log of logsList) {
    csvContent += `"${log.timestamp}","${(log.name || '').replace(/"/g, '""')}","${(log.email || '').replace(/"/g, '""')}","${log.deviceId || ''}","${log.deviceType || ''}","${log.os || ''}","${log.browser || ''}","${log.screen || ''}","${log.cores || log.hardware || ''}","${log.memory || ''}","${log.touchPoints !== undefined ? log.touchPoints : ''}","${log.timezone || ''}","${log.language || ''}","${log.ip || ''}"\n`;
  }
  fs.writeFileSync(LOGS_CSV_PATH, csvContent, 'utf8');
}

// Initialize logs files if not present
if (!fs.existsSync(LOGS_JSON_PATH)) {
  fs.writeFileSync(LOGS_JSON_PATH, '[]', 'utf8');
}
if (!fs.existsSync(LOGS_CSV_PATH)) {
  fs.writeFileSync(LOGS_CSV_PATH, CSV_HEADER, 'utf8');
} else {
  const firstLine = fs.readFileSync(LOGS_CSV_PATH, 'utf8').split('\n')[0] || '';
  if (!firstLine.includes('Touch Points') || !firstLine.includes('Timezone')) {
    let existingLogs = [];
    try { existingLogs = JSON.parse(fs.readFileSync(LOGS_JSON_PATH, 'utf8')); } catch (e) {}
    rebuildCsvFromLogs(existingLogs);
  }
}

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // 1. API: Get Questions
  if (pathname === '/api/questions') {
    const questionsPath = path.join(DATA_DIR, 'questions.json');
    fs.readFile(questionsPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read questions dataset' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
    return;
  }

  // 2. API: Track Candidate Login & Device Telemetry
  if (pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');

        // Extract client IP address
        let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        if (rawIp.includes('::1') || rawIp.includes('127.0.0.1')) {
          rawIp = '127.0.0.1 (Localhost)';
        } else if (rawIp.startsWith('::ffff:')) {
          rawIp = rawIp.replace('::ffff:', '');
        }

        const logEntry = {
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          name: (payload.name || 'Anonymous').trim(),
          email: (payload.email || 'N/A').trim(),
          deviceId: (payload.deviceId || 'unknown').trim(),
          deviceType: payload.deviceType || (payload.touchPoints > 0 ? (payload.touchPoints >= 5 ? 'Mobile/Tablet' : 'Touch PC') : 'Desktop/Laptop'),
          os: payload.os || 'Unknown OS',
          browser: payload.browser || 'Unknown Browser',
          screen: payload.screen || 'N/A',
          cores: payload.cores || 'Unknown',
          memory: payload.memory || 'Unknown',
          touchPoints: payload.touchPoints !== undefined ? payload.touchPoints : 0,
          timezone: payload.timezone || 'Asia/Kolkata',
          language: payload.language || 'en',
          ip: rawIp,
          userAgent: payload.userAgent || ''
        };

        // 1. Append to JSON
        let logsList = [];
        try {
          logsList = JSON.parse(fs.readFileSync(LOGS_JSON_PATH, 'utf8'));
        } catch (e) {
          logsList = [];
        }
        logsList.push(logEntry);
        fs.writeFileSync(LOGS_JSON_PATH, JSON.stringify(logsList, null, 2), 'utf8');

        // 2. Append to CSV
        const csvLine = `"${logEntry.timestamp}","${logEntry.name.replace(/"/g, '""')}","${logEntry.email.replace(/"/g, '""')}","${logEntry.deviceId}","${logEntry.deviceType}","${logEntry.os}","${logEntry.browser}","${logEntry.screen}","${logEntry.cores}","${logEntry.memory}","${logEntry.touchPoints}","${logEntry.timezone}","${logEntry.language}","${logEntry.ip}"\n`;
        fs.appendFileSync(LOGS_CSV_PATH, csvLine, 'utf8');

        console.log(`[LOGIN LOGGED] ${logEntry.name} | ${logEntry.deviceType} | Cores: ${logEntry.cores} | RAM: ${logEntry.memory} | Touch: ${logEntry.touchPoints} | TZ: ${logEntry.timezone} | IP: ${logEntry.ip}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: logsList.length }));
      } catch (err) {
        console.error('Error logging candidate data:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 3. API: Get All Logs (JSON)
  if (pathname === '/api/logs') {
    fs.readFile(LOGS_JSON_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Could not read logs' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data || '[]');
    });
    return;
  }

  // 4. API: Download Logs as Excel/CSV File
  if (pathname === '/api/logs/csv') {
    fs.readFile(LOGS_CSV_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Logs CSV not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="accenture_candidate_device_logs.csv"'
      });
      res.end(data);
    });
    return;
  }

  // Normalize static file path
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security: check path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>Resource could not be located.</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('\n=============================================================');
  console.log('   ACCENTURE ONLINE ASSESSMENT (OA) SIMULATOR PLATFORM');
  console.log('=============================================================');
  console.log(`   Local Server running at: http://localhost:${PORT}`);
  console.log('   Device & Candidate Logging Active:');
  console.log('     -> JSON Logs: http://localhost:' + PORT + '/api/logs');
  console.log('     -> Download Excel/CSV: http://localhost:' + PORT + '/api/logs/csv');
  console.log('   Press Ctrl+C to stop.');
  console.log('=============================================================\n');
});
