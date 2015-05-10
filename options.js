module.exports.common = {
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
};

