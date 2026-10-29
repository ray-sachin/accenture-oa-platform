'use strict';
const path = require('node:path');
try { process.loadEnvFile(path.join(__dirname, '.env')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const { createApp } = require('./server/app');
const port = Number(process.env.PORT || 3000);
const server = createApp();
server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`CampusReady is running at http://localhost:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
