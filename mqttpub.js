'use strict';

var net = require('net'),
    mqtt = require('mqtt-connection'),
    _ = require('lodash');

var opts = _.merge(require('./options').common, {
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
});

var argv = require('yargs')
      .usage('node $0')
      .options(opts)
      .argv;

var doPublish = function(conn, topic, message, qos, period) {
  setInterval(function() {
    conn.publish({
      topic: topic,
      payload: message,
      qos: qos,
      messageId: (1 << 16) - 1, // Required if qos > 0.
      retain: false
    }, function() {
      console.log('PUBLISH: %s [%s]: %s %s', new Date(), Date.now(), topic, message);
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
  .on('puback', function(packet) {
    console.log('* puback');
    console.dir(packet);
  })
  .on('error', function(err) {
    console.error(err);
  });
