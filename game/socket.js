module.exports = function(app, server) {
    var io                = require('socket.io').listen(server);
    var ss                = require('socket.io-stream');
    var util              = require('util');
    var connect           = require('connect');
    var cookie            = require('express/node_modules/cookie');
    var cookieParser      = require('cookie-parser');
    var PlayerModel = require('../models/player');
    var ArenaModel = require('../models/arena');
    var Usermodel = require('../models/user');
    var mongoose = require('mongoose');
    var EventEmitter      = require("events").EventEmitter;
    var ee = new EventEmitter();
    ee.setMaxListeners(100);
    io.use(function(socket, next) {
        var handshakeData = socket.request;
        if (handshakeData.headers.cookie) {
            // save parsedSessionId to handshakeData
            handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
            handshakeData.sessionId = cookieParser.signedCookie(handshakeData.cookie['connect.sid'], 'sfsdf32');
            if (handshakeData.cookie['connect.sid'] == handshakeData.sessionID) {
                return next(new Error('not authorized'));
            }
        }
        next();
    });
    io.on('connection', function (socket) {
        var sessionStore = app.get('sessionStore');
        var handshakeData = socket.request;
        var sessionId    = handshakeData.sessionId;
        sessionStore.get(sessionId, function(err, session) {
            if (!err) {
                if (session.passport.user) {
                    var playerId = session.passport.user;

                    var player  = require('../game/player')(ee, playerId, PlayerModel, ArenaModel);

                    ee.on('enemyAdded:'+playerId, function(data){
                        socket.emit('enemyAdded', data);

                    });
                    ee.on('sendEnemyDeleted:'+playerId, function(data){
                        socket.emit('enemyDeleted', data);
                    });
                    ee.on('setTiles:'+playerId, function(data){
                        socket.emit('setTiles', data);
                    });

                    setTimeout(function () {
                        Usermodel.model.findById(session.passport.user, function(err, user){
                            ArenaModel.findById(user.homeLocation, function(location){
                                socket.emit('connected', {playerId: session.passport.user, x: location.x, y: location.y});
                            })
                        })
                    }, 5000);
                    socket.on('getSectors', function (data) {
                        ee.emit('getTiles:'+playerId, data);
                    });
                    socket.on('addedToGame', function (data) {
                        ee.emit('addedToGame:'+data.playerId+playerId, data);
                    });
                    socket.on('connectionReady', function (data) {
                        ee.emit('connectionReady:'+data.playerId, data);
                    });
                    socket.on('disconnect', function () {
                        ee.emit('disconnect:'+playerId);
                        ee.removeAllListeners('disconnect:'+playerId);
                        ee.removeAllListeners('sendData:'+playerId);
                        ee.removeAllListeners('enemyAdded:'+playerId);
                        ee.removeAllListeners('sendEnemyDeleted:'+playerId);
                        ee.removeAllListeners('setTiles:'+playerId);
                        playerId = null;
                        player = null;
                    });
                    socket.on('getData', function (data) {
                        ee.emit('updateData:'+playerId, data);
                    });
                    socket.on('hit', function (data) {
                        ee.emit('wasHit:'+data.enemyPlayerId);
                    });
                    ee.on('sendData:'+playerId, function(data){
                        socket.emit('dataReceived', data);
                    });
                }
            }
        });
    });
}