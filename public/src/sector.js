var Sector = Class.extend({
    init: function(_map) {
        this.map = _map;
        this.tiles = [];
        this.sprites = [];
        this.rendered = false;
        this.state = false;
        this.wallSprites = [];
        this.roadSprites = [];
        this.mineSprites = [];
    },
    changeState: function(newState){
        if(this.state == newState)
            return;
        else {
            if(true == newState && false == this.rendered){
                this.render();
            } else {
                this.hide(newState);
            }
            this.state = newState;
        }
    },
    addTile: function(tile){
        for(var i in this.tiles){
            if(this.tiles[i].x == tile.x && this.tiles[i].y == tile.y)
                return;
        }
        this.tiles.push(tile);
    },
    render: function(){
        for(var i in this.tiles){
            if(this.tiles[i].sprite == 'wall'){
                var wall = map.walls.add(new Phaser.TileSprite(map.game, this.tiles[i].x, this.tiles[i].y, this.tiles[i].width, this.tiles[i].height, 'tiles', 'wall'));
                wall.body.immovable = true;
                wall.body.bounce.setTo(1, 1);
                wall.anchor.setTo(0, 0);
                this.wallSprites.push(wall);
            } else if(this.tiles[i].sprite == 'road'){
                var roadSprite = map.road.add(new Phaser.TileSprite(map.game, this.tiles[i].x, this.tiles[i].y, this.tiles[i].width, this.tiles[i].height, 'tiles', 'road'));
                roadSprite.anchor.setTo(0, 0);
                this.roadSprites.push(roadSprite);
            } else if(this.tiles[i].type == 6){
                var mine = map.mines.add(new Phaser.Sprite(map.game, this.tiles[i].x-32, this.tiles[i].y-32, this.map.mineBackground));
                mine.id = this.tiles[i]._id;
                this.mineSprites.push(mine);
            }
        }
        this.state = true;
        this.rendered= true;
    },
    hide: function(flag){
        for(var i in this.wallSprites){
            if(this.wallSprites[i]){
                this.wallSprites[i].exists = flag;
            }
        }
        for(var i in this.roadSprites){
            if(this.roadSprites[i]){
                this.roadSprites[i].exists = flag;
            }
        }
        for(var i in this.mineSprites){
            if(this.mineSprites[i]){
                this.mineSprites[i].exists = flag;
            }
        }
        if(false == flag)
            this.state = false;
        else
            this.state = true;
    }
});