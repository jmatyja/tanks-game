var PeerServer = require('peer').PeerServer;
console.log('t');
var server = PeerServer({port: 5000, path: '/myapp'});