const net = require('net');

class RedisRESPClient {
  constructor(port = 6379, host = '127.0.0.1') {
    this.port = port;
    this.host = host;
    this.client = null;
    this.queue = [];
    this.buffer = Buffer.alloc(0);
    this.connected = false;
    this.messageListeners = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.client) return resolve();
      
      this.client = net.connect({ port: this.port, host: this.host }, () => {
        this.connected = true;
        console.log(`[RedisRESPClient] Connected to Redis server at ${this.host}:${this.port}`);
        resolve();
      });

      this.client.on('data', (data) => {
        this.buffer = Buffer.concat([this.buffer, data]);
        this.parseResponses();
      });

      this.client.on('error', (err) => {
        console.error('[RedisRESPClient] Socket error:', err.message);
        // Resolve queue items with rejection
        while (this.queue.length > 0) {
          const { reject: reqReject } = this.queue.shift();
          reqReject(err);
        }
        reject(err);
      });

      this.client.on('close', () => {
        this.connected = false;
        this.client = null;
        console.log('[RedisRESPClient] Connection closed.');
      });
    });
  }

  sendCommand(args) {
    return new Promise(async (resolve, reject) => {
      if (!this.connected) {
        try {
          await this.connect();
        } catch (err) {
          return reject(err);
        }
      }

      // Build RESP protocol request frame
      let payload = `*${args.length}\r\n`;
      for (const arg of args) {
        const strArg = String(arg);
        payload += `$${Buffer.byteLength(strArg, 'utf8')}\r\n${strArg}\r\n`;
      }

      this.queue.push({ resolve, reject });
      this.client.write(payload);
    });
  }

  parseResponses() {
    while (true) {
      const parsed = this.parseNext(0);
      if (!parsed) break; // Incomplete response buffer

      const { value, bytesConsumed } = parsed;

      // Intercept unsolicited Pub/Sub message pushes
      if (Array.isArray(value) && value[0] === 'message') {
        this.buffer = this.buffer.slice(bytesConsumed);
        const channel = value[1];
        const message = value[2];
        this.messageListeners.forEach(listener => {
          try {
            listener(channel, message);
          } catch (e) {
            console.error('[RedisRESPClient] Error in message listener callback:', e);
          }
        });
        
        // Remove SUBSCRIBE confirmation from queue if it matched
        if (this.queue.length > 0) {
          // If we just subscribed, the confirmation event was ['subscribe', channel, count].
          // Standard message triggers have no matching queue item.
        }
        continue;
      }

      // Intercept subscription confirmation response
      if (Array.isArray(value) && value[0] === 'subscribe') {
        this.buffer = this.buffer.slice(bytesConsumed);
        if (this.queue.length > 0) {
          const { resolve } = this.queue.shift();
          resolve(value);
        }
        continue;
      }

      // Standard command reply
      this.buffer = this.buffer.slice(bytesConsumed);
      if (this.queue.length > 0) {
        const { resolve, reject } = this.queue.shift();
        if (value instanceof Error) {
          reject(value);
        } else {
          resolve(value);
        }
      } else {
        console.warn('[RedisRESPClient] Warning: Received command response with empty queue:', value);
      }
    }
  }

  parseNext(offset) {
    if (this.buffer.length <= offset) return null;

    const type = String.fromCharCode(this.buffer[offset]);
    const lineEnd = this.buffer.indexOf('\r\n', offset);
    if (lineEnd === -1) return null;

    const line = this.buffer.toString('utf8', offset + 1, lineEnd);
    const bytesBeforeValue = lineEnd + 2 - offset;

    switch (type) {
      case '+': // Simple String
        return { value: line, bytesConsumed: bytesBeforeValue };
      case '-': // Error
        return { value: new Error(line), bytesConsumed: bytesBeforeValue };
      case ':': // Integer
        return { value: parseInt(line, 10), bytesConsumed: bytesBeforeValue };
      case '$': { // Bulk String
        const len = parseInt(line, 10);
        if (len === -1) {
          return { value: null, bytesConsumed: bytesBeforeValue };
        }
        const valStart = lineEnd + 2;
        const valEnd = valStart + len;
        if (this.buffer.length < valEnd + 2) return null; // Incomplete payload

        const value = this.buffer.toString('utf8', valStart, valEnd);
        return { value, bytesConsumed: valEnd + 2 - offset };
      }
      case '*': { // Array
        const count = parseInt(line, 10);
        if (count === -1) {
          return { value: null, bytesConsumed: bytesBeforeValue };
        }
        let currentOffset = lineEnd + 2;
        const array = [];
        for (let i = 0; i < count; i++) {
          const parsed = this.parseNext(currentOffset);
          if (!parsed) return null; // Incomplete element

          array.push(parsed.value);
          currentOffset += parsed.bytesConsumed;
        }
        return { value: array, bytesConsumed: currentOffset - offset };
      }
      default:
        return { value: new Error(`Unknown RESP type: ${type}`), bytesConsumed: lineEnd + 2 - offset };
    }
  }

  // Pub/Sub events registration
  on(event, callback) {
    if (event === 'message') {
      this.messageListeners.push(callback);
    }
  }

  async subscribe(channel) {
    return this.sendCommand(['SUBSCRIBE', channel]);
  }

  async publish(channel, message) {
    return this.sendCommand(['PUBLISH', channel, message]);
  }

  // Redis Commands mapping
  async get(key) {
    return this.sendCommand(['GET', key]);
  }

  async set(key, value, ...extraArgs) {
    const cmd = ['SET', key, value, ...extraArgs];
    return this.sendCommand(cmd);
  }

  async del(key) {
    return this.sendCommand(['DEL', key]);
  }

  async keys(pattern) {
    return this.sendCommand(['KEYS', pattern]);
  }

  async hset(key, field, value) {
    return this.sendCommand(['HSET', key, field, value]);
  }

  async hget(key, field) {
    return this.sendCommand(['HGET', key, field]);
  }

  async hdel(key, field) {
    return this.sendCommand(['HDEL', key, field]);
  }

  async hgetall(key) {
    const arr = await this.sendCommand(['HGETALL', key]);
    if (!arr) return {};
    const obj = {};
    for (let i = 0; i < arr.length; i += 2) {
      obj[arr[i]] = arr[i + 1];
    }
    return obj;
  }
}

// Smart Hybrid Client Exporter
let clientInstance;
let subClientInstance;

try {
  const ioredis = require('ioredis');
  const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  clientInstance = new ioredis(url);
  subClientInstance = new ioredis(url);
  console.log('[Redis] Loaded production ioredis client & subClient successfully.');
} catch (e) {
  console.warn('[Redis] ioredis package not found offline. Falling back to native RESP TCP Clients...');
  clientInstance = new RedisRESPClient();
  subClientInstance = new RedisRESPClient();
}

module.exports = {
  client: clientInstance,
  subClient: subClientInstance
};
