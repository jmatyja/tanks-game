module.exports = function(ee, playerId, playerModelParam, arenaModelParam) {
    var Map = function(){
        var LISTEN_OBJECTS_LENGTH = 5000;
        return {
            getListenObjectsLength: function () {
                return LISTEN_OBJECTS_LENGTH;
             },
            checkIfInListenArea: function (playerX, playerY, objectX, objectY) {
                var t =  playerX - LISTEN_OBJECTS_LENGTH <= objectX &&
                    playerX + LISTEN_OBJECTS_LENGTH >= objectX &&
                    playerY - LISTEN_OBJECTS_LENGTH <= objectY &&
                    playerY + LISTEN_OBJECTS_LENGTH >= objectY;
                var a = t;
                return t;
            }
        }
    }();

    var Player = function (_ee, _playerId, _PlayerModel, _ArenaModel) {
        var playerLocation = null;
        var ee = _ee;
        var playerId = _playerId;
        var PlayerModel = _PlayerModel;
        var ArenaModel = _ArenaModel;
        var data = null;
        var width = 640;
        var height = 640;
        var SECTORE_SIZE = 640;
        var SECTORS_BUFFER_COUNT =0;
        var biggerSideSize = width>height? width:height;
        var sectorsPerScreen = Math.ceil(biggerSideSize/SECTORE_SIZE);
        var sectorCount = Math.ceil((sectorsPerScreen+SECTORS_BUFFER_COUNT)/2);
        var sector = null;
        this.enemiesObjects = {};
        this.currentEnemiesIds = [playerId];
        this.enemiesData = {};

        var self = this;
        var health = 100;
        var HIT_POINTS = 10;

        var listenerNames = {
            updateData : 'updateData:'+playerId,
            disconnect: 'disconnect:'+playerId,
            enemyAdded: 'enemyAdded:'+playerId,
            addedByEnemy: 'addedByEnemy:'+playerId,
            enemyDeleted: 'enemyDeleted:'+playerId,
            sendEnemyDeleted: 'sendEnemyDeleted:'+playerId,
            wasHit: 'wasHit:'+playerId,
            getTiles: 'getTiles:'+playerId,
            playerDataReceived: 'playerDataReceived:'+playerId,
            playerDataReceivedEnemy: 'playerDataReceivedEnemy:'+playerId,
            connectionReady: 'connectionReady:'+playerId
        };
        ee.on(listenerNames.updateData, function(pPdata){
            if(undefined != pPdata['gameData']){
                data = pPdata['playerData'];
            } else {
                data = pPdata;
            }

            if(data.hittedPlayers && data.hittedPlayers.length > 0){
                for(var i in data.hittedPlayers){
                    ee.emit('wasHit:'+data.hittedPlayers[i]);
                }
            }
            //ee.emit('sendData:'+playerId, {enemies: self.enemiesData, me: {health: health}});
        });
        ee.on(listenerNames.addedByEnemy, function(data){
            new Enemy(ee, data, self);
            ee.emit(listenerNames.enemyAdded, data);
        });
        ee.on(listenerNames.connectionReady, function(data){

            self.getNearEnemies(true, data.peerId);
        });
        ee.on(listenerNames.enemyDeleted, function(data){
            ee.emit(listenerNames.sendEnemyDeleted, data);
        });
        ee.on(listenerNames.wasHit, function(){
            if(health > 0)
                health -= HIT_POINTS;
            ee.emit('sendData:'+playerId, {me: {health: health}});
        });
        ee.on(listenerNames.disconnect, function(){
            ee.removeAllListeners(listenerNames.updateData);
            ee.removeAllListeners(listenerNames.enemyAdded);
            ee.removeAllListeners(listenerNames.addedByEnemy);
            ee.removeAllListeners(listenerNames.enemyDeleted);
            ee.removeAllListeners(listenerNames.connectionReady);
            if(playerLocation)
                playerLocation.remove();
            playerLocation = null;
            clearInterval(handleNearEnemies);
            clearInterval(handleStoreData);
        });
        ee.on(listenerNames.getTiles, function(data){
            self.getTilesForSectors(data);

        });
        this.getId = function(){
            return playerId;
        }
        this.storeData = function(){
            if(data && playerLocation) {
                playerLocation.x = data.x;
                playerLocation.y = data.y;
                playerLocation.updated = new Date();
                playerLocation.loc = [PlayerModel.getCoordinate(data.x), PlayerModel.getCoordinate(data.y)];
                playerLocation.save();

            }

        }
        this.getNearEnemies = function(setLocation, peerId){
            if(data && playerLocation) {
                PlayerModel.getNewPlayers(data.y - Map.getListenObjectsLength(),
                    data.x - Map.getListenObjectsLength(),
                    data.y + Map.getListenObjectsLength(),
                    data.x + Map.getListenObjectsLength(),
                    playerId,
                    self.currentEnemiesIds, function (data) {
                        if(data != undefined && data.length>0){
                            for (var i in data) {
                                if(data[i].playerId == playerId)
                                    continue;

                                var sendData = {x: data[i].x, y: data[i].y, playerId: data[i].playerId, peerId: data[i].peerId, isHost: true};

                                new Enemy(ee, sendData, self);
                                ee.emit(listenerNames.enemyAdded, sendData);
                                var enemyData = {x: self.getX(), y: self.getY(), playerId: self.getId(), peerId: self.getPeerId(), isHost: false };
                                ee.emit("addedByEnemy:"+data[i].playerId, enemyData);

                            }
                        }
                    });
            } else if(setLocation == true && peerId != undefined){
                PlayerModel.getNewPlayers(data.y - Map.getListenObjectsLength(),
                    data.x - Map.getListenObjectsLength(),
                    data.y + Map.getListenObjectsLength(),
                    data.x + Map.getListenObjectsLength(),
                    playerId,
                    self.currentEnemiesIds, function (data) {
                        if(data != undefined && data.length>0){
                            for (var i in data) {
                                if(data[i].playerId == playerId)
                                    continue;

                                var sendData = {x: data[i].x, y: data[i].y, playerId: data[i].playerId, peerId: data[i].peerId, isHost: true};

                                new Enemy(ee, sendData, self);
                                ee.emit(listenerNames.enemyAdded, sendData);
                                var enemyData = {x: self.getX(), y: self.getY(), playerId: self.getId(), peerId: peerId, isHost: false };
                                ee.emit("addedByEnemy:"+data[i].playerId, enemyData);

                            }
                        }
                    });
                PlayerModel.addLocation({x: data.x, y: data.y, playerId: playerId, peerId:peerId }, function (data) {
                    playerLocation = data;
                    playerLocation.x = data.x;
                    playerLocation.y = data.y;
                    playerLocation.updated = new Date();
                    playerLocation.loc = [PlayerModel.getCoordinate(data.x), PlayerModel.getCoordinate(data.y)];
                    playerLocation.save();
                });
            }
        }

        this.getTilesForSectors = function(data){
            ArenaModel.getArenaBySectors(data, function (data) {
                ee.emit('setTiles:' + playerId, { tiles: data});
            });
        }
        this.getTiles = function(){

        }
        this.getX = function(){
            return data.x;
        }
        this.getY = function(){
            return data.y;
        }
        this.getPeerId = function(){
            return data.peerId;
        }
        var handleNearEnemies = setInterval( function(){
            self.getNearEnemies();
        }, 5000);
        var handleStoreData = setInterval( function(){
            self.storeData();
        }, 1000);

    };
    var Enemy = function(_ee, _data, _player){
        var data = _data;
        var ee = _ee;
        var player = _player;
        var playerId = data.playerId;
        var health = 100;
        var HIT_POINTS = 10;
        var self = this;
        var listenerNames = {
            updateData : 'updateData:'+playerId,
            addedToGame: 'addedToGame:'+playerId+player.getId(),
            disconnect: 'disconnect:'+playerId,
            enemyDeleted: 'enemyDeleted:'+player.getId(),
            sendEnemyDeleted: 'sendEnemyDeleted:'+player.getId(),
            wasHit: 'wasHit:'+playerId,
            sendDeleted: '',
            playerDataReceived: 'playerDataReceivedEnemy:'+playerId

        }
        player.enemiesData[playerId] =data;
        player.currentEnemiesIds.push(playerId);
        player.enemiesObjects[playerId] = this;
        ee.on(listenerNames.addedToGame, function(){
            ee.on(listenerNames.updateData, self.updateData);
            ee.removeAllListeners(listenerNames.addedToGame);
        });

        ee.on(listenerNames.disconnect, function(){
            self.selfRemove();
        });
        ee.on(listenerNames.wasHit, function(){
            if(health > 0)
                health -= HIT_POINTS;

        });
        this.updateData = function(newData){
            data = newData;
            player.enemiesData[playerId] = {browser: newData, server: {health: health}};
            if(false == Map.checkIfInListenArea(player.getX(), player.getY(), self.getX(), self.getY())){
              //  self.selfRemove();
            }
        }
        this.selfRemove = function(){
            ee.removeListener(listenerNames.updateData, self.updateData);
            ee.emit(listenerNames.enemyDeleted, data);
            delete player.enemiesData[playerId];
            var index = player.currentEnemiesIds.indexOf(playerId);
            player.currentEnemiesIds.splice(index, 1);
            delete player.enemiesObjects[playerId];
        }
        this.getData = function(){
            return data;
        }
        this.getX = function(){
            return data.x;
        }
        this.getY = function(){
            return data.y;
        }
    }


    return new Player(ee, playerId, playerModelParam, arenaModelParam);
}
