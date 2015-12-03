var GameState = Class.extend({
    init: function(){
        this.data = null;
    },
    applyServerData: function(_data, callback){
        this.data = _data;
        if(this.data.me) {
            playerTank.setServerData(this.data.me);
        }

        if(this.data.enemies && Object.keys(this.data.enemies).length > 0){
            this.setEnemiesState(this.data.enemies, function(){
                callback();
            });
        } else {
            callback();
        }
    },
    setEnemiesState: function(data, callback){
        for(var i in data){
            if(!data[i] || data[i].playerId == playerTank.getId())
                continue;
            if(data[i].browser){
                window.dispatchEvent(new CustomEvent("update:"+data[i].browser.playerId, {'detail': data[i]}));
            } else {
                window.dispatchEvent(new CustomEvent("update:"+data[i].playerId, {'detail': data[i]}));
            }
        }
        callback();
    },
    getDataForServer: function(){
        return playerTank.getData();
    },
    preload: function() {
        game.time.advancedTiming = true;
        game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
        game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
        game.load.image('logo', 'assets/logo.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('earth', 'assets/scorched_earth.png');
        game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
        game.load.atlas('tiles', 'assets/tiles.png', 'assets/tilemap.json');
        game.load.image('healthbar', 'assets/healthbarr.png');
        game.load.image('aiming', 'assets/aiming.png');
    },
    create: function() {
        land = game.add.tileSprite(0, 0, w, h, 'earth');
        land.fixedToCamera = true;
        game.world.setBounds(0, 0, 9248, 9504);
        explosions = game.add.group();
        for (var i = 0; i < 10; i++)
        {
            var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('kaboom');
        }
        cursors = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
    },
    update: function() {
        if(playerTank != null) {
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].isAlive()) {
                    enemies[i].update();
                }
            }
        }
        if(playerTank){
            playerTank.update();
        }
        if(map && playerTank){
            map.updateSprites(playerTank.getTank().x, playerTank.getTank().y);
        }
        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;
    },
    render: function() {
        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    }
});