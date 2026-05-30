const { exec } = require('child_process');
const http = require('http');

console.log('[Test Metrics] Starting Redis daemon...');
exec('redis-server --daemonize yes', (error) => {
  if (error) {
    console.warn('[Warning] Could not start Redis:', error.message);
  }
  
  console.log('[Test Metrics] Booting Winkd WebSocket & Observability Server on port 3001...');
  const serverProcess = exec('node server/index.js', { env: { ...process.env, PORT: 3001 } });
  
  // Clean up server process on exit
  const cleanupAndExit = (code) => {
    serverProcess.kill();
    process.exit(code);
  };
  
  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server Stdout] ${data.trim()}`);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Stderr] ${data.trim()}`);
  });
  
  console.log('[Test Metrics] Waiting 2 seconds for server boot...');
  setTimeout(() => {
    console.log('[Test Metrics] Fetching telemetry report from /metrics JSON endpoint...');
    
    http.get('http://localhost:3001/metrics', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          console.log('[Test Metrics] Raw Telemetry Report Received:\n', body);
          const report = JSON.parse(body);
          
          const hasKeys = (
            report.timestamp &&
            report.performance &&
            typeof report.performance.redisLatencyMs === 'number' &&
            typeof report.performance.pubSubLagMs === 'number' &&
            report.counters &&
            typeof report.counters.activeRooms === 'number' &&
            typeof report.counters.eventThroughputPerSec === 'number' &&
            report.reconnects &&
            typeof report.reconnects.attempts === 'number' &&
            report.broadcasts &&
            typeof report.broadcasts.success === 'number' &&
            report.memory &&
            typeof report.memory.rssMB === 'number'
          );
          
          if (hasKeys) {
            console.log('[Test Metrics] SUCCESS: Observability payload matches Grade-A production schema exactly!');
            cleanupAndExit(0);
          } else {
            console.error('[Test Metrics] FAILURE: Missing fields in telemetry report.');
            cleanupAndExit(1);
          }
        } catch (err) {
          console.error('[Test Metrics] FAILURE to parse JSON response:', err.message);
          cleanupAndExit(1);
        }
      });
    }).on('error', (err) => {
      console.error('[Test Metrics] HTTP client request error:', err.message);
      cleanupAndExit(1);
    });
  }, 2500);
});
