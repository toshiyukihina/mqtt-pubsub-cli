'use strict';

var net = require('net'),
    mqtt = require('mqtt-connection'),
    argv = require('yargs')
      .usage('node $0')
      .options({
        'p': {
          alias: 'port',
          demand: true,
          default: 61613,
          describe: 'Port',
          type: 'number'
        },
        'h': {
          alias: 'host',
          demand: true,
          default: 'localhost',
          describe: 'Host',
          type: 'string'
        },
        'u': {
          alias: 'username',
          demand: false,
          describe: 'Username',
          type: 'string'
        },
        's': {
          alias: 'password',
          demand: false,
          describe: 'Password',
          type: 'string'
        },
        'c': {
          alias: 'clientid',
          demand: true,
          describe: 'Client ID',
          type: 'string'
        },
        'k': {
          alias: 'keepalive',
          demand: false,
          default: 3000,
          describe: 'Keepalive period in seconds',
          type: 'number'
        },
        't': {
          alias: 'topic',
          demand: true,
          describe: 'Topic',
          type: 'string'
        },
        'q': {
          alias: 'qos',
          demand: false,
          default: 0,
          describe: 'QOS',
          type: 'number'
        }
      })
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
    console.log('%s [%s]: %s %s', new Date(), Date.now(), packet.topic, packet.payload);
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
