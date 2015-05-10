'use strict';

var net = require('net'),
    mqtt = require('mqtt-connection');

var opts = require('./options').common,
    argv = require('yargs')
      .usage('node $0')
      .options(opts)
      .argv;

var stream = net.createConnection(argv.port, argv.host),
    conn = mqtt(stream);

var doSubscribe = function(conn, topic, qos) {
  conn.subscribe({
    messageId: (1 << 16) - 1,
    dup: false,
    subscriptions: [{
      topic: topic,
      qos: qos
    }]
  });
};

conn
  .on('connack', function(packet) {
    if (packet.returnCode) {
      console.error('Failed to connect.');
      process.exit(1);
    }

    doSubscribe(conn, argv.topic, argv.qos);
  })
  .on('publish', function(packet) {
    console.log('SUBSCRIBE: %s [%s]: %s %s', new Date(), Date.now(), packet.topic, packet.payload);
  })
  .on('error', function(err) {
    console.error(err);
  });

conn.connect({
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  keepalive: argv.keepalive,
  clientId: argv.clientid,
  username: argv.username,
  password: argv.password
});
