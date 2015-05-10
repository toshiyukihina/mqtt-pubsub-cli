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
        },
        'm': {
          alias: 'message',
          demand: false,
          describe: 'Message to publish',
          type: 'string'
        },
        'd': {
          alias: 'period',
          demand: false,
          default: 1000,
          describe: 'Publish period in milliseconds',
          type: 'number'
        }
      })
      .argv;

var doPublish = function(conn, topic, message, qos, period) {
  setInterval(function() {
    conn.publish({
      topic: topic,
      payload: message,
      qos: qos,
      messageId: (1 << 16) - 1, // Required if qos > 0.
      retain: false
    });
  }, period);
};

var stream = net.createConnection(argv.port, argv.host),
    conn = mqtt(stream);

conn.connect({
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  keepalive: argv.keepalive,
  clientId: argv.clientid,
  username: argv.username,
  password: argv.password
});

conn
  .on('connack', function(packet) {
    if (packet.returnCode) {
      console.error('Failed to connect.');
      process.exit(1);
    }

    doPublish(conn, argv.topic, argv.message, argv.qos, argv.period);
  })
  .on('puback', function() {
    console.log('* puback');
  })
  .on('error', function(err) {
    console.error(err);
  });
