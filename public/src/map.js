var Map = Class.extend({
    init: function(_game, _width, _height){
        this.game = _game;
        this.width = _width;
        this.height = _height;
        this.sectors = [];
        this.VIEW_SECTORS_LENGTH = 1;
        this.REMOVE_SECTORS_BUFER = 3;
        this.currentSectorX = null;
        this.currentSectorY = null;
        this.firstTilesAdded = false;
        this.tilesDataWaiting = false;
        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.walls.x = 0;
        this.walls.y = 0;
        this.mines = game.add.group();
        this.mines.x = 0;
        this.mines.y = 0;
        this.mines.enableBody = true;
        this.mineBackground = game.add.bitmapData(96,96);
        this.mineBackground.circle(48,48,48,'#ff0000');
        this.road = game.add.group();
        this.road.x = 0;
        this.road.y = 0;
        this.ADD_SECTOR_COUNT = 3;
    },
    setTiles: function(data){

        for(var i in data.tiles){

            var xSector = Math.floor(data.tiles[i].x/this.width);
            var ySector = Math.floor(data.tiles[i].y/this.height);

            if(!this.sectors[xSector]){
                this.sectors[xSector] = [];
            }
            if(!this.sectors[xSector][ySector]){
                this.sectors[xSector][ySector] = new Sector(this);
            }
            this.sectors[xSector][ySector].addTile(data.tiles[i]);
        }
        this.firstTilesAdded = true;
        this.tilesDataWaiting = false;
    },
    checkForTiles: function(xSector, ySector){
        if(this.tilesDataWaiting == false){
            var startX = xSector -this.ADD_SECTOR_COUNT;
            startX = startX<0?0:startX;
            var endX = xSector + this.ADD_SECTOR_COUNT;
            var startY = ySector -this.ADD_SECTOR_COUNT;
            startY = startY<0?0:startY;
            var endY = ySector + this.ADD_SECTOR_COUNT;
            var updatesectors = false;
            var emptySectors = [];
            for(var x = startX; x <= endX; x++){
                for(var y = startY; y <= endY; y++){
                    if(!this.sectors[x] || !this.sectors[x][y]){
                        updatesectors = true;
                        if(!this.sectors[x])
                            this.sectors[x] = [];

                        this.sectors[x][y] = new Sector(this);
                        emptySectors.push(String(x)+String(y));
                    }
                }
            }

            if(updatesectors == true && emptySectors.length>0){
                this.tilesDataWaiting = true;
                socket.emit('getSectors',  emptySectors);
            }
        }
    },
    updateSprites: function(x, y){
        var xSector = Math.floor(x/this.width);
        var ySector = Math.floor(y/this.height);

        if(this.sectors.length > 0 && (this.currentSectorX != xSector || this.currentSectorY != ySector) &&  this.firstTilesAdded == true){
            this.currentSectorX = xSector;
            this.currentSectorY = ySector;
            var startSectorX = this.currentSectorX - this.REMOVE_SECTORS_BUFER;
            startSectorX = startSectorX<0?0:startSectorX;
            var endSectorX = this.currentSectorX + this.REMOVE_SECTORS_BUFER;
            var startSectorY = this.currentSectorY - this.REMOVE_SECTORS_BUFER;
            startSectorY = startSectorY<0?0:startSectorY;
            var endSectorY = this.currentSectorY + this.REMOVE_SECTORS_BUFER;
            var startSectorXview = this.currentSectorX - this.VIEW_SECTORS_LENGTH;
            startSectorXview = startSectorXview<0?0:startSectorXview;
            var endSectorXview = this.currentSectorX + this.VIEW_SECTORS_LENGTH;
            var startSectorYview = this.currentSectorY - this.VIEW_SECTORS_LENGTH;
            startSectorYview = startSectorYview<0?0:startSectorYview;
            var endSectorYview = this.currentSectorY + this.VIEW_SECTORS_LENGTH;

            for(var x = startSectorX; x <= endSectorX; x++){
                for(var y = startSectorY; y <= endSectorY; y++){
                    if(this.sectors[x] && this.sectors[x][y]){
                        this.sectors[x][y].changeState(
                            x >= startSectorXview && x <= endSectorXview &&
                            y >= startSectorYview && y <= endSectorYview
                        )
                    }
                }
            }
            this.checkForTiles(xSector, ySector);
        }
        if(this.sectors.length == 0)
            this.checkForTiles(xSector, ySector);
    },
    getVisibleSectors: function(){
        var startSectorXview = this.currentSectorX - this.VIEW_SECTORS_LENGTH;
        startSectorXview = startSectorXview<0?0:startSectorXview;
        var endSectorXview = this.currentSectorX + this.VIEW_SECTORS_LENGTH;
        var startSectorYview = this.currentSectorY - this.VIEW_SECTORS_LENGTH;
        startSectorYview = startSectorYview<0?0:startSectorYview;
        var endSectorYview = this.currentSectorY + this.VIEW_SECTORS_LENGTH;
        var returnSectors = [];
        for(var x = startSectorXview; x <= endSectorXview; x++){
            for(var y = startSectorYview; y <= endSectorYview; y++){
                if(this.sectors[x] && this.sectors[x][y]){
                    returnSectors.push(this.sectors[x][y]);
                }
            }
        }
        return returnSectors;
    }
});
