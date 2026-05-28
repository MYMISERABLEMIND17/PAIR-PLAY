const crypto = require('crypto');

function encodeFrame(text) {
  const payload = Buffer.from(text, 'utf8');
  const len = payload.length;
  let header;
  
  if (len <= 125) {
    header = Buffer.alloc(2);
    header[0] = 0x81;
    header[1] = len;
  } else if (len <= 65535) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  
  return Buffer.concat([header, payload]);
}

function decodeFrame(buffer) {
  if (buffer.length < 2) return null;
  
  const byte1 = buffer[0];
  const opcode = byte1 & 0x0f;
  
  if (opcode === 8) {
    return { type: 'close' };
  }
  
  const byte2 = buffer[1];
  const isMasked = (byte2 & 0x80) !== 0;
  let payloadLen = byte2 & 0x7f;
  let offset = 2;
  
  if (payloadLen === 126) {
    if (buffer.length < 4) return null;
    payloadLen = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLen === 127) {
    if (buffer.length < 10) return null;
    payloadLen = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }
  
  if (!isMasked) return null;
  
  if (buffer.length < offset + 4 + payloadLen) return null;
  
  const mask = buffer.slice(offset, offset + 4);
  const rawPayload = buffer.slice(offset + 4, offset + 4 + payloadLen);
  
  const payload = Buffer.alloc(payloadLen);
  for (let i = 0; i < payloadLen; i++) {
    payload[i] = rawPayload[i] ^ mask[i % 4];
  }
  
  return {
    type: 'message',
    opcode,
    data: payload.toString('utf8')
  };
}

function sendTo(sockets, socketId, event, data) {
  const sock = sockets[socketId];
  if (sock && !sock.destroyed) {
    const frame = encodeFrame(JSON.stringify({ event, data }));
    if (frame) sock.write(frame);
  }
}

module.exports = {
  encodeFrame,
  decodeFrame,
  sendTo
};
