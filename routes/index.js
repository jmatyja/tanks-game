var express = require('express');
var router = express.Router();
var arena = require('../models/arena');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index.ejs', {authenticated: req.isAuthenticated(), user: req.user});
});
router.get('/game', function(req, res, next) {
    var  a = req.user.homeLocation;
    arena.findById(req.user.homeLocation, function(location){
        var a = location.x;
        res.render('game.ejs', {user: req.user});
    })

});
router.get('/arena.json', isLoggedIn, function(req,  res){
    arena.getArena(
        0, 0, 2000, 2000, function(data){
            res.json(data);
        }
    );

});
var checkCanAddRow = function(startRow, column, endRow, sector, tile){
    if(endRow - startRow <1)
        return true;
    for(var i = startRow;i<=endRow;i++){
        if(undefined == sector.tileMap[column][i] || sector.tileMap[column][i].tile != tile){
            return false;
        }
    }
    return true;
}
var checkTilesNext = function(column, row, startRow, startColumn, sector, tile, addedSectors, sprite, nextColumn){
    if(row >=20 && row < 24 && column >= 8 && column < 12){
        var a = 'b';
    }
    var nColumn = parseInt(column) + 1;
    var nRow = parseInt(row)+1;
    if(undefined != sector.tileMap[column][nRow] && sector.tileMap[column][nRow].tile == tile && false == nextColumn ){
        if(undefined == addedSectors[column]){
            addedSectors[column]= [];
        }
        addedSectors[column][nRow] = true;
        return {rowNext: true, colNext: false, lColumn: parseInt(column), lRow: nRow};
    } else if(undefined !=  sector.tileMap[nColumn] && undefined != sector.tileMap[nColumn][startRow] && sector.tileMap[nColumn][startRow].tile == tile && true == checkCanAddRow(startRow, nColumn, parseInt(sprite.rows) +parseInt(startRow)-1, sector, tile)){
        if(undefined == addedSectors[nColumn]){
            addedSectors[nColumn]= [];
        }
        addedSectors[nColumn][startRow] = true;
        return {rowNext: false, colNext: true, lColumn: nColumn, lRow: parseInt(startRow)};
    } else {

        return false;
    }
}

var isInArray = function(array, columnRow){
    for(var i in array){
        if(array[i] == columnRow)
            return true;
    }
    return false;
}
router.get('/generate', function(req, res, next) {
    var SECTORE_SIZE = 640;
    arena.locationModel.remove(function(err){
        var arenaData = require('../public/assets/arenabase3');
        var row = -1;
        var column = 0;
        var counter = 1;
        var arenaD = [];
        var r = 1;
        var c = 1;
        var tmp = [];
        var cnt = 1;
        for(var i in arenaData.file){
            if( r <= 289 && c <297){
                tmp.push(arenaData.file[i]);
            }
            if(cnt++ > 599){
                arenaD.push(tmp);
                r = 0;
                c++;
                tmp=[];
                cnt = 1;
            }
            r++;
        }
        var sectors = [];
        for(var column in arenaD){
            for(var row in arenaD[column]){
                var x = 32*row;
                var y = 32*column;

                var xSector = Math.floor(x/SECTORE_SIZE);
                var ySector = Math.floor(y/SECTORE_SIZE);
                if(undefined == sectors[ySector]){
                    sectors[ySector] = [];
                }
                if(xSector == 4 && ySector == 7){
                    var a = 'b'
                }
                if(row >=28 && row <= 32 && column >= 16 && column <= 20){
                    var a = 'b';
                }
                if(undefined == sectors[ySector][xSector]){
                    var sector = {};
                    sector.tileMap = [];
                    sector.tiles = [];
                    sectors[ySector][xSector] = sector;
                }
                else {
                    var sector = sectors[ySector][xSector];
                }
                if(undefined == sector.tileMap[column]){
                    sector.tileMap[column] = [];
                }
                sector.tileMap[column][row] = {tile: arenaD[column][row], row: row, column:column};
            }
        }
        for(var sColumn in sectors){
            for(var sRow in sectors[sColumn]){

                var sector = sectors[sColumn][sRow];
                sector.sprites = [];
                var addedSectors = [];
                for(var column in sector.tileMap){
                    for(var row in sector.tileMap[column]){
                        var tileObj = sector.tileMap[column][row];

                        if(tileObj.tile != 0 && !(undefined != addedSectors[column] && undefined != addedSectors[column][row] && addedSectors[column][row] == true)){
                            var sprite = {};
                            sprite.column = column;
                            sprite.row = row;
                            sprite.tile = tileObj.tile;
                            sprite.rows = 1;
                            sprite.columns = 1;
                            var lColumn = column;
                            var lRow = row;
                            var loopColumn = column;
                            var loopRow = row;
                            var tile = tileObj.tile;
                            var tileo = false;
                            if(undefined == addedSectors[column]){
                                addedSectors[column]= [];
                            }
                            addedSectors[column][row] = true;
                            sector.tileMap[lColumn][lRow].added = true;
                            var nextColumn = false;
                            while( false != ( tileo = checkTilesNext(lColumn, lRow, row, column, sector, tile, addedSectors, sprite, nextColumn) )){
                                if(tileo.rowNext == true){
                                    if(false == nextColumn)
                                        sprite.rows++;
                                    sector.tileMap[tileo.lColumn][tileo.lRow].added = true;
                                    addedSectors[tileo.lColumn][tileo.lRow] = true;
                                } else if(tileo.colNext == true){
                                    nextColumn = true;
                                    sprite.columns++;
                                    for(var i = row; i<= parseInt(row) + parseInt(sprite.rows)-1; i++){
                                        sector.tileMap[tileo.lColumn][i].added = true;
                                        addedSectors[tileo.lColumn][i] = true;
                                    }
                                }
                                lColumn = tileo.lColumn;
                                lRow = tileo.lRow;

                            }
                            if(row >=20 && row < 24 && column >= 8 && column < 12){
                                var a = 'b';
                            }
                            sector.sprites.push(sprite);
                        }
                    }
                }
            }
        }
        for(var sColumn in sectors) {
            for (var sRow in sectors[sColumn]) {

                var sector = sectors[sColumn][sRow];
                for(var i in sector.sprites ){
                    var sprite = sector.sprites[i];
                    var tile = sprite.tile;
                    var spritePic = '';
                    if(tile == 1){
                        spritePic = 'wall'
                    } else if( tile == 3){
                        spritePic = 'road';
                    } else if(tile == 4){
                        spritePic = 'fog'
                    }
                    if(tile == 1 || tile == 3){
                        arena.addLocation({
                            row: sprite.row,
                            column: sprite.column,
                            sectorX: sRow,
                            sectorY: sColumn,
                            sector: String(sRow) + String(sColumn),
                            x: 32 * parseInt(sprite.row),
                            y: 32 * parseInt(sprite.column),
                            width: 32*sprite.rows,
                            height: 32*sprite.columns,
                            type: tile,
                            sprite: spritePic
                        }, function(){

                        });
                    }
                }
            }
        }
        //dodajemy puste domki dla userow
        var addedHouses = [];
        for(var column in arenaD){
            for(var row in arenaD[column]){
                if((arenaD[column][row] == 5 || arenaD[column][row] == 6) && false == isInArray(addedHouses, column+row)){
                    addedHouses.push(column+row.toString());
                    addedHouses.push(column+(parseInt(row)+1).toString());
                    addedHouses.push((parseInt(column)+1)+row.toString());
                    addedHouses.push((parseInt(column)+1).toString()+(parseInt(row)+1).toString());
                    var x = 32 * parseInt(row);
                    var y = 32 * parseInt(column);
                    var xSector = Math.floor(x/SECTORE_SIZE);
                    var ySector = Math.floor(y/SECTORE_SIZE);

                    arena.addLocation({
                        row: row,
                        column: column,
                        sectorX: xSector,
                        sectorY: ySector,
                        sector: String(xSector) + String(ySector),
                        x: x,
                        y: y,
                        width: 64,
                        height: 64,
                        type: arenaD[column][row],
                        sprite: ''
                    }, function(){

                    });
                }

            }
        }
        res.json({success:true});

    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
module.exports = router;
