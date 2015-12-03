var MineContainer = Class.extend({
    init: function(){
        this.STATE_INACTIVE = 0;
        this.STATE_LOADING_MINE = 1;
        this.minesContainer = [];
        this.actvieMinesContainer = [];
        this.enemiesMinesLoading = [];
        this.enemiesMinesActive = [];
        this.activeMine = null;
        this.state = this.STATE_INACTIVE;
    },
    overlapMine: function(mineSprite){
        if(this.state == this.STATE_INACTIVE && (this.activeMine == null || this.activeMine.id != mineSprite.id)){
            var mine = this.getNotActiveMineById(mineSprite.id);
            if(mine != null){
                this.state = this.STATE_LOADING_MINE;
                mine.loadingStartTime = new Date;
                mine.state = mine.STATE_LOADING;
                this.activeMine = mine;
            }
        } else if(this.state == this.STATE_LOADING_MINE && this.activeMine != null && this.activeMine.id == mineSprite.id && this.activeMine.state == this.activeMine.STATE_LOADING){
            this.activeMine.update();
        }
    },
    getNotActiveMineById: function(id){
        var activeMine = this.getActiveMineById(id);
        if(activeMine != null){
            return null;
        }
        var mine = this.getMineById(id);
        if(null != mine){
            return mine;
        }
        return this.getMineFromSectors(id);
    },
    getMineFromSectors: function(id){
        var visibleSectors = map.getVisibleSectors();
        if(visibleSectors.length > 0){
            for(var i in visibleSectors){
                for(var s in visibleSectors[i].mineSprites){
                    if(visibleSectors[i].mineSprites[s].id == id){
                        var mine = new Mine(visibleSectors[i].mineSprites[s], visibleSectors[i].mineSprites[s].id)
                        this.minesContainer.push(mine);
                        return mine;
                    }
                }
            }
        }
        return null;
    },
    getMineById: function(id){
        for(var i in this.minesContainer){
            if(this.minesContainer[i].id == id){
                return this.minesContainer[i];
            }
        }
        return null;
    },
    getActiveMineById: function(id){
        for(var i in this.actvieMinesContainer){
            if(this.actvieMinesContainer[i].id == id){
                return this.actvieMinesContainer[i];
            }
        }
        return null;
    },
    getActiveMineData: function(){
        if(this.state != this.STATE_LOADING_MINE || null == this.activeMine || this.activeMine.state != this.activeMine.STATE_LOADING){
            return null;
        }
        return  this.activeMine.getData();
    },
    updateEnemyMine: function(eMineData){
        console.log('m');
        var enemyMine = this.getEnemyMineByIdFromLoadingMines(eMineData.id);
        if(null != enemyMine){
            enemyMine.mine.setDataFromEnemy(eMineData);
            if(eMineData.state == enemyMine.mine.STATE_ACTIVE &&  enemyMine.mine.state == enemyMine.mine.STATE_OCCUPY_LOADING){
                this.enemiesMinesActive.push(enemyMine.mine);
                this.enemiesMinesLoading.splice(enemyMine.index, 1);
            }
            return;
        }
        var enemyMine = this.getEnemyMineByIdFromActiveMines(eMineData.id);
        if(null != enemyMine){
            enemyMine.mine.setDataFromEnemy(eMineData.mine);
            if(eMineData.state == enemyMine.mine.STATE_LOADING &&  enemyMine.mine.state == enemyMine.mine.STATE_OCCUPIED){
                this.enemiesMinesLoading.push(enemyMine.mine);
                this.enemiesMinesActive.splice(enemyMine.index, 1);
            }
            return;
        }
        var enemyMine = this.getMineById(eMineData.id);

        if(null == enemyMine){
            var enemyMine = this.getMineFromSectors(eMineData.id);
        }
        if(null != enemyMine){
            enemyMine.setDataFromEnemy(eMineData);
            if(eMineData.state == enemyMine.STATE_LOADING){
                this.enemiesMinesLoading.push(enemyMine.mine);
            } else if(eMineData.state == enemyMine.STATE_ACTIVE){
                this.enemiesMinesActive.push(enemyMine.mine);
            }
        }
    },
    getEnemyMineByIdFromLoadingMines: function(id){
        if(this.enemiesMinesLoading.length == 0)
            return null;
        for(var i in this.enemiesMinesLoading){
            if(this.enemiesMinesLoading[i] && this.enemiesMinesLoading[i].id == id){
                return {index: i, mine: this.enemiesMinesLoading[i]};
            }
        }
        return null;
    },
    getEnemyMineByIdFromActiveMines: function(id){
        if(this.enemiesMinesActive.length == 0)
            return null;
        for(var i in this.enemiesMinesActive){
            if(this.enemiesMinesActive[i] && this.enemiesMinesActive[i].id == id){
                return {index: i, mine: this.enemiesMinesActive[i]};
            }
        }
        return null;
    }
});
var Mine = Class.extend({
    init: function(mineSprite, id){
        this.STATE_INACTIVE = 0;
        this.STATE_LOADING = 1;
        this.STATE_ACTIVE = 2;
        this.STATE_OCCUPY_LOADING = 3;
        this.STATE_OCCUPIED = 4;
        this.LOADING_TIME = 10000;
        this.state = this.STATE_INACTIVE;
        this.mineSprite = mineSprite;
        this.id = id;
        this.loadingStartTime = null;
        this.texture = game.add.bitmapData(96, 96);
        this.texture.circle(48,48,48,'#ff0000');
        this.mineSprite.loadTexture(this.texture);
        this.loadingdegs = 0;
        this.colorNotOccupied = "#ff0000";
        this.colorLoading = "#000000";
        this.colorActive = "#0A12FA";
        this.colorOccupyLoading = "#21B8EB";
        this.colorOccupied = "#21B8EB";
    },
    getLoadingDegs: function(){
        var date = new Date;
        var miliseconds = date - this.loadingStartTime;
        return Math.floor((360 * miliseconds)/this.LOADING_TIME);
    },
    update: function(isOverloapping){
        if(true == isOverloapping ){
           if(this.state == this.STATE_LOADING){
                this.loadingDegs = this.getLoadingDegs();
                if(this.loadingDegs >= 360){
                    this.state = this.STATE_ACTIVE;
                    mineContainer.actvieMinesContainer.push(this);
                    mineContainer.state = mineContainer.STATE_INACTIVE;
                    this.loadingDegs = 0;
                    this.update(true);
                    return;
                } else {
                    this.draw();
                }
            } else if(this.state == this.STATE_ACTIVE){
                this.draw();
            } else if(this.state == this.STATE_INACTIVE){
                this.draw();
            }
        } else {
            if(this.state != this.STATE_OCCUPY_LOADING){
                this.setNotActive();
            }
        }
    },
    setNotActive: function(){
        this.state = this.STATE_INACTIVE;
        this.loadingDegs = 0;
        mineContainer.activeMine = null;
        mineContainer.state = mineContainer.STATE_INACTIVE;
        this.update(true);

    },
    getData: function(){
        return {
            id: this.id,
            loadingDegs: this.loadingDegs,
            state: this.state
        };
    },
    setDataFromEnemy: function(data){
        switch(data.state){
            case this.STATE_LOADING:
                this.state = this.STATE_OCCUPY_LOADING;
                this.loadingDegs = data.loadingDegs;
                break;
            case this.STATE_ACTIVE:
                this.state = this.STATE_OCCUPIED;
                this.loadingDegs = 0;
                break;
        }
        this.draw();

    },
    drawCircle: function(color){
        this.texture.context.clearRect(0, 0, 96, 96);
        this.texture.circle(48,48,48,color);
        this.mineSprite.loadTexture(this.texture);
    },
    drawArc: function(color, degs){
        this.texture.context.clearRect(0, 0, 96, 96);
        this.texture.context.fillStyle = color;
        this.texture.context.beginPath();
        this.texture.context.arc(48, 48, 48, 0, game.math.degToRad(degs), false);
        this.texture.context.closePath();
        this.texture.context.fill();
        this.mineSprite.loadTexture(this.texture);
    },
    draw: function(){
        switch(this.state){
            case this.STATE_ACTIVE:
                this.drawCircle(this.colorActive);
                break;
            case this.STATE_INACTIVE:
                this.drawCircle(this.colorNotOccupied);
                break;
            case this.STATE_LOADING:
                this.drawArc(this.colorLoading, this.loadingDegs);
                break
            case this.STATE_OCCUPY_LOADING:
                this.drawArc(this.colorOccupyLoading, this.loadingDegs);
                break;
        }
    }
});