'use strict';

var net = require('net'),
    mqttConn = require('mqtt-connection'),
    stream = net.createConnection('61613', 'localhost'),
    conn = mqttConn(stream);

conn.connect({
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: 'foo',
  username: 'admin',
  password: 'password'
});

conn.on('connack', function(packet) {
  if (packet.returnCode) {
    console.error('Failed to connect.');
    return;
  }
  console.log('Connected!');
});

conn.on('error', function(err) {
  console.error(err);
});
