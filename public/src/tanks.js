var Tank = Class.extend({
    init: function(_game, _data, _socket, _config) {
        this.RELEASE_SPEED = 4;
        this.config = $.extend({}, {
            maxSpeed: 500,
            maxSpeedBack: -450,
            accelerationUp: this.RELEASE_SPEED * 5,
            accelerationDown: this.RELEASE_SPEED * 4,
            fireRate: 200,
            maxHealth: 100,
            healthBarWidth: 131
        }, _config);
        this.activeMine = null;
        this.health = this.config.maxHealth;
        this.currentSpeed = 0;
        this.alive = true;
        this.game = _game;
        this.id = _data['playerId'];
        this.socket = _socket;
        this.tank = game.add.sprite(_data['x'], _data['y'], 'tank', 'tank1');
        this.nextFire = 0;
        this.peerId = null;
        this.peer = new Peer({host: 'localhost', port: 5000, path: '/myapp'});
        this.peer.on("error", function(e){
            console.log(e);
            console.log(e.stack + ': ' + e.message);
        });
        var self = this;
        this.peer.on("open", function(connectionId){
            self.peerId = connectionId;
            self.socket.emit('connectionReady', { playerId: self.id, peerId: self.peerId});
        })
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        var i = 0;
        this.bullets.forEach(function (bullet) {
            bullet.playerId = _data['playerId'];
            bullet.id = i++;
        }, this);
        this.tank.anchor.setTo(0.5, 0.5);
        this.tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
        this.game.physics.enable(this.tank, Phaser.Physics.ARCADE);
        this.tank.body.drag.set(0.2);
        this.tank.body.maxVelocity.setTo(400, 400);
        this.tank.body.collideWorldBounds = true;
        this.turret = this.game.add.sprite(0, 0, 'tank', 'turret');
        this.turret.anchor.setTo(0.3, 0.5);
        this.tank.bringToTop();
        this.turret.bringToTop();
        this.shadow = this.game.add.sprite(0, 0, 'tank', 'shadow');
        this.shadow.anchor.setTo(0.5, 0.5);
        this.healthbar = this.game.add.sprite(0, 0, 'healthbar');
        this.aiming = game.add.sprite(0, 0, 'aiming');
        this.aiming.anchor.set(0.5);
        this.game.camera.follow(this.tank);
        this.game.camera.focusOnXY(0, 0);
        this.hittedPlayers = [];
    },
    getBullets: function(){
        return this.bullets;
    },
    getId: function(){
        return this.id;
    },
    getTank: function(){
        return this.tank;
    },
    getPeer: function(){
        return this.peer;
    },
    update: function(){
        if (cursors.left.isDown)
        {
            this.tank.angle -= 4;
        }
        else if (cursors.right.isDown)
        {
            this.tank.angle += 4;
        }
        if (cursors.up.isDown)
        {
            if(this.currentSpeed < this.config.maxSpeed){
                this.currentSpeed += this.config.accelerationUp;
            }

        } else if(cursors.down.isDown){

            if(this.currentSpeed > this.config.maxSpeedBack){
                this.currentSpeed -= this.config.accelerationDown;
            }
        }
        else
        {
            if(this.currentSpeed < 10 && this.currentSpeed > -10){
                this.currentSpeed = 0;
            }
            if (this.currentSpeed > 0)
            {
                this.currentSpeed -= this.RELEASE_SPEED*3;
            } else if(this.currentSpeed < 0){
                this.currentSpeed += this.RELEASE_SPEED*2;
            }
        }
        if(this.currentSpeed != 0)
            this.game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);
        else{
            this.tank.body.velocity.setTo(0, 0)
        }

        this.game.physics.arcade.collide(playerTank.getTank(),  map.walls);
        this.game.physics.arcade.overlap(this.bullets, map.walls, this.bulletHitWall, null, this);
        if(mineContainer.state == mineContainer.STATE_INACTIVE){
            this.game.physics.arcade.overlap(this.tank, map.mines, this.overlapMine, null, this);
        } else if(mineContainer.state == mineContainer.STATE_LOADING_MINE && null != mineContainer.activeMine) {
            mineContainer.activeMine.update(this.game.physics.arcade.overlap(this.tank, mineContainer.activeMine.mineSprite, null, null, this))
        }

        this.game.physics.arcade.overlap(this.bullets, this.tank, this.bulletHitMe, null, this);
        this.shadow.x = this.tank.x;
        this.shadow.y = this.tank.y;
        this.shadow.rotation = this.tank.rotation;
        this.turret.x = this.tank.x;
        this.turret.y = this.tank.y;
        this.turret.rotation = this.game.physics.arcade.angleToPointer(this.turret);
        this.healthbar.x = this.tank.x - 68;
        this.healthbar.y = this.tank.y - 70;
        this.healthbar.crop({x: 0, y:0, width:(this.health / this.config.maxHealth) * this.config.healthBarWidth, height: this.healthbar.height});
        this.aiming.x = this.game.input.activePointer.worldX;
        this.aiming.y = this.game.input.activePointer.worldY;

        if (this.game.input.activePointer.isDown)
        {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
            {
                this.nextFire = this.game.time.now + this.config.fireRate;
                var data = { playerId: this.id, x: this.turret.x, y: this.turret.y, targetX: this.game.input.activePointer.worldX, targetY: this.game.input.activePointer.worldY};
                this.fire(data);
            }
        }
        this.bullets.forEachExists(function(bullet){
            var _dx = bullet.startX - bullet.x;
            var _dy = bullet.startY - bullet.y;
            var distance = Math.sqrt(_dx * _dx + _dy * _dy);
            if(distance > 600){
                bullet.kill();
            }
        }, this);

    },
    fire: function(data){
        var bullet = this.bullets.getFirstExists(false);
        bullet.reset(this.turret.x, this.turret.y);
        bullet.startX = this.turret.x;
        bullet.startY = this.turret.y;
        bullet.distance = 200;

        bullet.rotation = this.game.physics.arcade.moveToXY(bullet, data.targetX, data.targetY, 1000);
    },
    bulletHitWall: function(bullet, wall){
        bullet.kill();
    },
    overlapMine: function(tank, mine) {
        mineContainer.overlapMine(mine);
    },

    damage: function() {
        this.health -= 1;
        if (this.health <= 0)
        {
            this.alive = false;
            this.shadow.kill();
            this.tank.kill();
            this.turret.kill();
            return true;
        }
        return false;
    },
    getData: function(){
        var bulletsData = [];
        this.bullets.forEachExists(function(bullet){
            bulletsData.push({x: bullet.x, y: bullet.y, rotation: bullet.rotation, id: bullet.id});
        }, this);

        return {
            playerId: this.id,
            peerId: this.peerId,
            currentSpeed: this.currentSpeed,
            angle: this.tank.angle,
            x: this.tank.x,
            y: this.tank.y,
            rotation: this.tank.rotation,
            turretRotation: this.turret.rotation,
            bulletsData: { bullets: bulletsData },
            health: this.health,
            loadingMine: mineContainer.getActiveMineData()
        };
    },
    setServerData: function(data){
        if(data.health){
            this.health = data.health;
        }
    }
});

var EnemyTank = Class.extend({
    init: function( game, data, _config, peer) {
        this.config = $.extend({}, {
            maxHealth: 100,
            healthBarWidth: 131
        }, _config);
        this.isHost = data.isHost;
        this.currentSpeed = 0;
        this.peer = peer;
        this.peerId = data.peerId;

        this.connectionId = null;
        this.id = data.playerId;
        this.socket = data.socket;
        this.x = data.x;
        this.y = data.y;
        this.game = game;
        this.health = 3;
        this.alive = true;
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        var i = 0;
        this.bullets.forEach(function (bullet) {
            bullet.playerId = this.id;
            bullet.id = i++;
        }, this);
        this.shadow = game.add.sprite(this.x, this.y, 'enemy', 'shadow');
        this.tank = game.add.sprite(this.x, this.y, 'enemy', 'tank1');
        this.game.physics.enable(this.tank, Phaser.Physics.ARCADE);
        this.tank.id = this.id;
        this.tank.body.immovable = true;
        this.tank.body.bounce.setTo(1, 1);
        this.turret = game.add.sprite(this.x, this.y, 'enemy', 'turret');
        this.shadow.anchor.set(0.5);
        this.tank.anchor.set(0.5);
        this.turret.anchor.set(0.3, 0.5);
        this.healthbar = game.add.sprite(0, 0, 'healthbar');
        window.addEventListener("update:" + this.id, this.eventHandler, false);

        this.connect();
    },
    getConnection: function(){
        if(this.conn == null){

        }
        return this.conn;
    },
    connect: function(){

        if(this.isHost){
            this.conn = this.peer.connect(this.peerId);
            this.conn.on('error', function (er) {
                console.log(er);
            });
            this.setIncomeDataHandler();


        } else {
            var self = this;

            this.peer.on("connection", function(conn){

                if(conn.peer == self.peerId){

                    self.conn = conn;
                    self.setIncomeDataHandler();
                }
            });
        }
    },
    setIncomeDataHandler: function(){
        var connection = this.getConnection();
        var self = this;
        if(!connection){
            setTimeout(function(){self.connect()}, 1000);
            return;
        }
        connection.on('open', function (id) {
            if(self.isHost){
                self.sendData(playerTank.getData());
            }
            connection.on('data', function (data) {
                self.sendData(playerTank.getData());
                self.updateFromServer(data);
            });
        });
    },
    sendData: function(data){
        if(this.getConnection() && this.getConnection().open == true){
            this.getConnection().send(data);
        }
    },
    eventHandler: function(e){
        this.updateFromServer(e.detail);
    },
    removeListener: function(){
        window.removeEventListener("update:"+this.id, this.eventHandler, false);
    },
    getId: function(){
        return this.id;
    },
    isAlive: function(){
        return this.alive;
    },
    update: function() {
        this.game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity)
        this.shadow.x = this.tank.x;
        this.shadow.y = this.tank.y;
        this.shadow.rotation = this.tank.rotation;
        this.turret.x = this.tank.x;
        this.turret.y = this.tank.y;
        this.game.physics.arcade.overlap(playerTank.getBullets(), this.tank, this.bulletHitMe, null, this);
        this.game.physics.arcade.collide(playerTank.getTank(),  this.tank);
        ;
    },
    bulletHitMe: function (tank, bullet) {
        bullet.kill();
        this.socket.emit('hit', { enemyPlayerId: this.id});
        this.health -= this.health;
    },
    updateFromServer: function(data){
        this.tank.angle = data.angle;
        this.currentSpeed = data.currentSpeed;
        this.health = data.health;
        this.tank.x = data.x;
        this.tank.y = data.y;
        this.tank.rotation = data.rotation;
        this.shadow.x = this.tank.x;
        this.shadow.y = this.tank.y;
        this.shadow.rotation = data.rotation;
        this.turret.x = this.tank.x;
        this.turret.y = this.tank.y;
        this.turret.rotation = data.turretRotation;
        if(data.bulletsData){
            if(data.bulletsData.bullets.length <1){
                this.bullets.forEachExists(function(bullet){
                    bullet.kill();
                }, this);
            } else {
                for(var i in data.bulletsData.bullets){
                    var bulletData = data.bulletsData.bullets[i];
                    var bullet = this.bullets.getAt(bulletData.id);
                    if(bullet.exists){
                        bullet.x = bulletData.x;
                        bullet.y = bulletData.y;
                    } else {
                        bullet.reset(bulletData.x, bulletData.y);
                        bullet.rotation = bulletData.rotation;
                    }
                }
            }
        } else {
            this.bullets.forEachExists(function(bullet){
                bullet.kill();
            }, this);
        }
        this.healthbar.x = this.tank.x - 68;
        this.healthbar.y = this.tank.y - 70;
        this.healthbar.crop({x: 0, y:0, width:(this.health / this.config.maxHealth) * this.config.healthBarWidth, height: this.healthbar.height});
        if(eData.loadingMine != null){
            mineContainer.updateEnemyMine(eData.loadingMine);
        }
    },
    remove: function(){
        this.tank.kill();
        this.shadow.kill();
        this.turret.kill();
        this.healthbar.kill();
        if(this.conn)
            this.conn.close();
        this.removeListener();
    }
});