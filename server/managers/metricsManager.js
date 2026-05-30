/**
 * Real-time Distributed Metrics & Observability Manager
 * Monitors cluster performance, memory, reconnects, latency, and Pub/Sub lags.
 */

const { subClient } = require('./redisClient');

// Local metric accumulators
const stats = {
  reconnectAttempts: 0,
  reconnectSuccess: 0,
  reconnectFailures: 0,
  broadcastSuccess: 0,
  broadcastFailures: 0,
  eventCount: 0,
  startPeriod: Date.now()
};

let pubSubPingSent = 0;
let pubSubLag = 0;

// Subscribe to dedicated metrics heartbeat channel
subClient.subscribe('metrics-ping').then(() => {
  subClient.on('message', (channel, message) => {
    if (channel === 'metrics-ping') {
      const receivedTime = Date.now();
      const sentTime = parseInt(message, 10);
      if (!isNaN(sentTime)) {
        pubSubLag = receivedTime - sentTime;
      }
    }
  });
}).catch(err => {
  console.error('[Metrics] Failed to subscribe to metrics-ping:', err);
});

function increment(metricName) {
  if (stats[metricName] !== undefined) {
    stats[metricName]++;
  }
}

async function measureRedisLatency(redis) {
  const start = Date.now();
  try {
    await redis.get('metrics:latency-ping');
    return Date.now() - start;
  } catch (err) {
    return -1;
  }
}

async function triggerPubSubPing(redis) {
  pubSubPingSent = Date.now();
  try {
    await redis.publish('metrics-ping', String(pubSubPingSent));
  } catch (err) {
    // Ignore pub/sub send errors in stats ping
  }
}

async function getActiveRoomsCount(redis) {
  try {
    // Retrieve all active room keys matching 'room:*'
    const keys = await redis.keys('room:*');
    if (!keys) return 0;
    // Filter out presence mappings and circular event queues to count unique rooms
    const uniqueRooms = keys.filter(key => {
      return !key.endsWith(':players') && !key.endsWith(':events');
    });
    return uniqueRooms.length;
  } catch (err) {
    return 0;
  }
}

async function generateReport(redis) {
  // Trigger an asynchronous Pub/Sub lag measurement for the next polling cycle
  await triggerPubSubPing(redis);
  
  const redisLatency = await measureRedisLatency(redis);
  const activeRooms = await getActiveRoomsCount(redis);
  
  const mem = process.memoryUsage();
  const uptimeSeconds = Math.floor((Date.now() - stats.startPeriod) / 1000);
  const eventThroughput = uptimeSeconds > 0 ? (stats.eventCount / uptimeSeconds).toFixed(2) : 0;
  
  return {
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    performance: {
      redisLatencyMs: redisLatency,
      pubSubLagMs: pubSubLag
    },
    counters: {
      activeRooms,
      eventThroughputPerSec: parseFloat(eventThroughput),
      totalEventsHandled: stats.eventCount
    },
    reconnects: {
      attempts: stats.reconnectAttempts,
      success: stats.reconnectSuccess,
      failures: stats.reconnectFailures
    },
    broadcasts: {
      success: stats.broadcastSuccess,
      failures: stats.broadcastFailures
    },
    memory: {
      rssMB: parseFloat((mem.rss / 1024 / 1024).toFixed(2)),
      heapTotalMB: parseFloat((mem.heapTotal / 1024 / 1024).toFixed(2)),
      heapUsedMB: parseFloat((mem.heapUsed / 1024 / 1024).toFixed(2))
    }
  };
}

module.exports = {
  increment,
  generateReport
};
