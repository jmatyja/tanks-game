var Player = function(){
    var mongoose = require('mongoose');
    var PlayerSchema = new mongoose.Schema({
        playerId: String,
        x: Number,
        y: Number,
        peerId: String,
        updated: { type: Date, default: Date.now },
        loc: {
            type: [Number],
            index: '2d'
        }
    });
    var PLAYER_CONST = {
        TILE: 2
    };
    var DIVIDE_NUMBER = 100000;
    var SUBTRACT_MINUTES_DATABASE = 1;
    var MS_PER_MINUTE = 60000;
    var PlayerModel = mongoose.model('Player', PlayerSchema);

    var getCoordinate = function(coordinate){
        return coordinate/DIVIDE_NUMBER;
    };
    var findPlayersInSquare = function(y1, x1, y2, x2, playerId, currentPlayerIds, callback){
        var currentDate = new Date();
        var subtractedDate = new Date(currentDate.valueOf() - SUBTRACT_MINUTES_DATABASE * MS_PER_MINUTE);
        PlayerModel.find( { loc :
                { $geoWithin :
                { $box : [ [ y1 , x1 ] ,
                    [ y2 , x2 ] ]
                } },
                playerId: {$ne: playerId },
                updated: {
                    $gte: subtractedDate
                }, playerId: {$not: {$in: currentPlayerIds}} })

            .select( {"playerId": 1, peerId: 1, "x": 1, "y": 1, "_id": 0})
            .exec(function(err, result){
                callback( result);
            });
    }
    var addLocation = function(obj, callback){
        PlayerModel.remove({ playerId: obj.playerId}, function(err){
            var location = new PlayerModel(
                {
                    x: obj.x,
                    y: obj.y,
                    playerId: obj.playerId,
                    peerId: obj.peerId,
                    loc: [getCoordinate(obj.x), getCoordinate(obj.y)]
                }
            );
            location.save(function(err){
                if(err){
                    console.log(err);
                    throw new Exception('error');
                }
                callback(location);
            });
        })
    };
    var getNewPlayers = function(y1, x1, y2, x2, playerId, currentPlayerIds, callback){
        findPlayersInSquare(getCoordinate(y1), getCoordinate(x1), getCoordinate(y2), getCoordinate(x2), playerId, currentPlayerIds,function(data){
            callback(data);
        });
    };
    return {
        playerModel: PlayerModel,
        findPlayersInSquare: findPlayersInSquare,
        addLocation: addLocation,
        getNewPlayers: getNewPlayers,
        getCoordinate: getCoordinate
    }
}();
module.exports = Player;