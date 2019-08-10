/*
Code that handles the server-side aspect of the game. 
@players - all the player locations and related data is sent to players.
@Locations - all the resource locations.
The server emits the data of all the remaining players to each player individually.
*/

var path = require('path');
var app = require('express')();
var express = require('express');
var server = require('http').Server(app);


var io = require('socket.io')(server);

var day = true;

var fires = [];

var players = {

};

var Game = {
    MaxScorpions: 5,
    MaxHyenas: 15,
};

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function shrinkForPercent(x, percent) {
    return (x * (100 - percent))/100;
};


var mobs = [];

var MobType = {
    hyena: 1,
    scorpion: 2,
    hyenaSize: 100,
    scorpionSize: 100,
};

function secondsToFrames(x) {
    return x * 60;
};

var FoodAndThirstRate = {

    food: 5,
    thirst: 7,

};
var Resources = {

    MaxTreeNodes: 16,
    MaxRockNodes: 12,
    MaxGoldNodes: 6,
    MaxLakes: 3,
    MaxCacti: 30,
    MaxSkulls: 10,
    tree: 1, 
    rock: 2,
    gold: 3, 
    lake: 4, 
    cactus: 5,

    "tree": [60, 70],
    "rock": [50, 20],
    "cactus": [50, 50],
    "gold": [50, 20],

    treeSize: 60,
    rockSize: 50, 
    cactusSize: 50, 
    goldSize: 50,

    treeShrinkPercentage: 70,
    rockShrinkPercentage: 20,
    cactusShrinkPercentage: 50, 
    goldShrinkPercentage: 20, 

};

var MobDamage = {
    1 : 30,
    2: 20,
};

/*

Hardcoded locations for all the resources appearing in the game.
If you want another tree or another rock just expand the array with the new resource coordinates.

*/
function sendFoodTick(socket) {
    if(socket.connected) socket.emit('food_tick', 0);
    setTimeout(sendFoodTick.bind(null, socket), FoodAndThirstRate.food * 1000);
};

function sendThirstTick(socket) {
    if(socket.connected) socket.emit('thirst_tick', 0);
    setTimeout(sendThirstTick.bind(null, socket), FoodAndThirstRate.thirst * 1000);
};

var ResourceLocations = {

    trees: [[250, 350], [302, 1275], [1551, 921], [286, 798], [776, 1636], [1031, 1433], [1075, 237],
    [1297, 1289], [817, 950], [171, 833], [613, 123], [1127, 919], [716, 1549], [1100, 1808], [856, 698], [1479, 870]],

    rocks: [[593,1143], [805, 185], [1286, 707], [1679,69], [895, 183], [40, 887], [1943, 55], [1423, 855], [656, 1026],
    [606, 171], [274, 300], [1900,1552]],

    golds: [[1054, 1546], [1159, 532], [1091, 601], [832, 1089], [1024, 1042], [279, 450]],

    lakes: [[450, 450], [1800, 300], [1000, 1800]],

    skulls: [[550, 500], [1700, 200], [900, 1600], [1200, 1400], [123, 1423], [712,496], [1900, 1900]],

    cacti: [[1030, 1419], [974, 1048], [875, 1935], [1430, 1694], [265, 209], [1234, 29], [1708, 1675]],

};

// Tree, Gold, Rock, Cactus
// The Mob() uses the information computed below to check for collisions.

function CollidableResource(x, y, type) {

    //Here we need to figure out cx, cy and cr
    this.cx = x;
    this.cy = y;
    this.type = type;

    this.world_width = Resources[type][0];
    this.world_height = this.world_width;

    this.cr = Math.min(this.world_width, this.world_height)/2;

    this.cr = shrinkForPercent(this.cr, Resources[type][1]);

};

var CollidableResources = [];

function computeCollidables() {

    for(let i = 0; i < ResourceLocations.trees.length; i++) {
        let x = new CollidableResource(ResourceLocations.trees[i][0], ResourceLocations.trees[i][1], "tree");
        CollidableResources.push(x);
    }

    for(let i = 0; i < ResourceLocations.rocks.length; i++) {
        let x = new CollidableResource(ResourceLocations.rocks[i][0], ResourceLocations.rocks[i][1], "rock");
        CollidableResources.push(x);
    }

    for(let i = 0; i < ResourceLocations.golds.length; i++) {
        let x = new CollidableResource(ResourceLocations.golds[i][0], ResourceLocations.golds[i][1], "gold");
        CollidableResources.push(x);
    }

    for(let i = 0; i < ResourceLocations.cacti.length; i++) {
        let x = new CollidableResource(ResourceLocations.cacti[i][0], ResourceLocations.cacti[i][1], "cactus");
        CollidableResources.push(x);
    }

};

computeCollidables();

var MobSpawnPoints = [[580, 432], [1500, 500], [500, 1500], [1500, 1500], [970, 965]];

var V = {
    w: 400,
	h: 400,
};


const W = {
	w: 2000,
    h: 2000
};

function dist(x1, y1, x2, y2) {
    let x_dist = x2 - x1;
    let y_dist = y2 - y1;
    return Math.sqrt(x_dist * x_dist + y_dist * y_dist);
};

function Fire(x, y, index, angle) {

    this.x = x;
    this.y = y;
    this.index = index;
    this.angle = angle;

    //Minute and half duration for the fire
    this.totalDuration = 40 * 60 * 1000;

    this.extinguish = function() {

        fires.splice(this.index, 1);

        let slen = fires.length;

        for(let i = 0; i < slen; i++)
            fires[i].index = i;

        let arr = [];

        for(let i = 0; i < fires.length; i++) {
            arr.push([fires[i].x, fires[i].y, fires[i].angle]);
        };

        io.sockets.emit('fires_update', arr);

    };

    setTimeout(this.extinguish.bind(this), this.totalDuration);
};


function Mob(mob_type, index) {

    let maxWalkingDistance = randomBetween(50, 500);
    let steps = 0;
    this.current_angle = 0;
    let new_angle = Math.random() * Math.PI;
    this.index = index;
    this.mobtype = mob_type;

    this.hp = (this.mobtype === MobType.hyena ? 60 : 40);

    this.waitToNomCounter = 0;
    this.waitTimeToNom = 30;
    this.whoAmIChasing = undefined;

    this.chase = false;
    this.stuck = false;

    //In World units, if you are within this radius the mob will start chasing you
    //this.chaseRadius = 120;

    this.chaseRadius = 120; //Changed from 120 tto debug.

    let theta = Math.PI/32;
    let theta_tiny = Math.PI/64;

    let rotation_complete = false;

    let scale = MobType.hyenaSize;
    this.width = scale;
    this.height = scale;

    let time = 0;
    let maxWaitTime = randomBetween(50, 500);
    let move = false;

    let rate = 0.05;
    this.expand = 0;
    let expansionLimit = 4;

    //Pick a random spawn point from MobSpawnPoints
    let rollDice = randomBetween(0, MobSpawnPoints.length - 1);

    this.world_x = MobSpawnPoints[rollDice][0];
    this.world_y = MobSpawnPoints[rollDice][1];

    let d = 0.5;
    let dy = Math.sin(this.current_angle) * d;
    let dx = Math.cos(this.current_angle) * d;

    let canvas_x = undefined;
    let canvas_y = undefined;

    let world_width = this.width * V.w/W.w;
    let world_height = this.height * V.h/W.h;

    this.cx = this.world_x;
    this.cy = this.world_y;
    this.cr = (world_width < world_height) ? world_width/2 : world_height/2;

    this.reset = function() {
            rotation_complete = false;
            steps = 0;
            this.current_angle = new_angle;

            let maxAngle = Math.random() * Math.PI;

            if(this.stuck) {
                maxAngle = Math.PI + Math.random() * Math.PI;
            }
            new_angle = maxAngle;

            maxWalkingDistance = randomBetween(50, 500);

            if(this.current_angle < new_angle){
                theta = Math.PI/32;
                theta_tiny = Math.PI/64;
            }
            else {
                theta = -Math.PI/32;
                theta_tiny = -Math.PI/64;
            }
            time = 0;
            maxWaitTime = randomBetween(100, 600);
            move = false;
            
    }

    this.findWhoToChase = function() {
        for(var key in players) {

            let d = dist(this.world_x, this.world_y, players[key][0], players[key][1]);

            if(d <= this.chaseRadius){
                this.chase = true;
                //this.processChase(players[key][0],players[key][1], d, key);
                this.whoAmIChasing = key;
                maxWaitTime = 0;
                break;
            }
    
    
            else {
                this.chase = false;
                this.waitToNomCounter = 0;
                maxWaitTime = randomBetween(100, 600);
            }

        }
    }
    //Update the state of the object including rotation angle, steps already taken by the mob, time elapsed that the mob was waiting etc.
    this.updateState = function() {
        if(this.whoAmIChasing !== undefined && players[this.whoAmIChasing] !== undefined && !this.stuck) {

            let d = dist(this.world_x, this.world_y, players[this.whoAmIChasing][0], players[this.whoAmIChasing][1]);

            if(d <= this.chaseRadius){
                this.chase = true;
                this.processChase(players[this.whoAmIChasing][0],players[this.whoAmIChasing][1], d, this.whoAmIChasing);
                maxWaitTime = 0;
            }

            else {
                this.chase = false;
                this.waitToNomCounter = 0;
                maxWaitTime = randomBetween(100, 600);
                this.whoAmIChasing = undefined;

            }
        }

        else if(!this.stuck){
            this.findWhoToChase();
        }

        this.expand += rate;

        let walk_complete = (steps > maxWalkingDistance);
        let wait_complete = (time > maxWaitTime);


        //If you are within Math.PI/8 increament/decreament by a tiny amount to smooth rotations
        if((this.current_angle < new_angle && theta > 0) || (this.current_angle > new_angle && theta < 0)){

            if(Math.abs(this.current_angle - new_angle) <= Math.PI/4)
                this.current_angle += theta_tiny;
            else
                this.current_angle += theta;
        }
        else {
            this.current_angle = new_angle;
            rotation_complete = true;
        }

        if(rotation_complete) {
            move = true;
            steps++;
        }

        if(walk_complete){
            move = false;
            time++;
        }

        


        if(rotation_complete && walk_complete && wait_complete)
            this.reset();

        if(this.expand > expansionLimit || this.expand < 0)
            rate *= -1;
        //I should be moving but I can't
        if(move && this.stuck) {
            this.reset();
        }

    }

    this.processChase = function(playerx, playery, distance, key) {

        move = true;

        var opp = playerx - this.world_x;
        var adj = playery - this.world_y;

        //Game.player, but the All Seeing server sees all players
        //
        new_angle = Math.floor(Math.atan2(adj, opp) + Math.PI/2);
        this.maxSteps = 10000;


        if(distance < 10) {
            if(this.waitToNomCounter >= this.waitTimeToNom) {

                io.to(key).emit('biten', MobDamage[this.mobtype]);
                
                this.waitToNomCounter = 0;
            }
            else
                this.waitToNomCounter++;
        }


    }
    this.doesItCollide = function(nx, ny) {

            let len = CollidableResources.length;
            for(let i = 0; i < len; i++) {
                    let o = CollidableResources[i];
                    
                    console.assert(this.cr !== undefined, "The radius of the Mob is undefined");
                    if(dist(nx, ny,o.cx, o.cy) < this.cr + o.cr) {
                            return true;
                    }
            }

            return false;
    }
    this.maybeDead = function() {
        if(this.hp <= 0) {

            //A scorpion or a hyena has died, I need to create a new one.
            //so I reindex it first. [0, 1, 2, 3] 
            //mobs is [0, maxH + maxS]
            mobs.splice(this.index, 1);
            let slen = mobs.length;
            for(let i = 0; i < slen; i++)
                mobs[i].index = i;
            
            createNewMob(this.mobtype);

        }
    }
    this.update = function(socket) {

        this.maybeDead();
        if(this.chase) d = 0.7;
        else d = 0.5;

        dx = Math.sin(Math.PI - this.current_angle) * d;
        dy = Math.cos(Math.PI - this.current_angle) * d;

        while(this.doesItCollide(this.world_x + dx, this.world_y + dy)) {
            this.current_angle += Math.PI/200;
            dx = Math.sin(Math.PI - this.current_angle) * d;
            dy = Math.cos(Math.PI - this.current_angle) * d;
        }

        if((this.world_x + dx < W.w && this.world_x + dx >= 0) && (this.world_y + dy < W.h && this.world_y + dy >= 0) && move && !this.doesItCollide(this.world_x + dx, this.world_y + dy)) {
                this.world_x += dx;
                this.world_y += dy;
                this.cx = this.world_x;
                this.cy = this.world_y;
        }
        this.updateState();
    }
};


initMobs();

//When the server starts mobs are created at random locations(for now).
//Add them to the mobs array which is going to be sent to every connected party.

function initMobs() {

    //We want to have the hyenas and scorpions array separately because we need to check each
    //and add a new element if there are not enough hyenas in the world.

    for(let i = 0; i < Game.MaxHyenas; i++) {
        let newHyena = new Mob(MobType.hyena, i);
        mobs.push(newHyena);
    };

    for(let i = 0; i < Game.MaxScorpions; i++) {
        let newScorpion = new Mob(MobType.scorpion, i);
        mobs.push(newScorpion);
    };
};

//When a mob is killed we need to create a new one.
//Why keep separate hyenas and scorpions array?

function createNewMob(mobtype) {
    if(mobtype === MobType.hyena) {
        //console.log("Creating new hyena.");
        let newHyena = new Mob(MobType.hyena, mobs.length);
        mobs.push(newHyena);
    }
    else if(mobtype === MobType.scorpion) {
        //console.log("Creating new scorpion.");
        let newScorpion = new Mob(MobType.scorpion, mobs.length);
        mobs.push(newScorpion);
    }
};

function transition() {
    setTimeout(doTransition, 3 * 60 * 1000);
    function doTransition() {
        day = !day;
        io.sockets.emit('c', day);
        setTimeout(doTransition, 3 * 60 * 1000);
    };
};

//Game-tick, 60fps.

function updateGame() {

    io.sockets.emit('server_data', players);
    io.sockets.emit('mobs', mobs);

    for(let i = 0; i < mobs.length; i++)
        mobs[i].update();
    setTimeout(updateGame, 1000/60);
};

function regenResources() {
    setTimeout(regen, 60 * 1000/Math.max(Object.keys(players).length, 1));
    function regen() {
        console.log("resources are regenerated");
        io.sockets.emit("regen_res");
        setTimeout(regen, 60 * 1000/Math.max(Object.keys(players).length, 1));
    }
};

//Given a socketID find the correponding player's points.
function getPoints(socketID) {
    console.assert(players[socketID] !== undefined, "players[socketID] is undefined in getPoints().");
    let arr = players[socketID];
    return arr[arr.length - 1];
};

transition();
updateGame(); //Just starts ticking.
regenResources();
server.listen(80);

var sentSocketId = false;

app.get('/', function(req, res) {
	
    app.use(express.static(__dirname));
    res.sendFile(path.join(__dirname + '/index.html'));
	
	/*
    console.log(req.query.id);
    if(req.query.id === super_secret_code) {
        app.use(express.static(__dirname));
        res.sendFile(path.join(__dirname + '/index.html'));
    }
    else{
        console.log("parking page");
        res.sendFile(path.join(__dirname + '/parking_page.html'));
    }
	*/


});
var sent_socket_id = {};

io.on('connection', function (socket) {

    console.log(socket.id + " connected.");

    socket.on('ingame', function(data) {

        console.log(socket.id + " in game.");
        socket.emit('socket_id', socket.id);
        socket.emit('c', day);

        setTimeout(sendFoodTick.bind(null, socket), FoodAndThirstRate.food);
        setTimeout(sendThirstTick.bind(null, socket), FoodAndThirstRate.thirst);

        sent_socket_id[socket.id] = true;


        let arr = [];

        for(let i = 0; i < fires.length; i++) {
            arr.push([fires[i].x, fires[i].y, fires[i].angle]);
        };

        if(arr.length > 0)
            io.sockets.emit('fires_update', arr);

    });


    
    socket.on('client_data', function (data) {

        players[socket.id] = data;
        if(sent_socket_id[socket.id]) {
            socket.emit('socket_id', socket.id);
            socket.emit('resource_locations', ResourceLocations);

            sent_socket_id[socket.id] = !sent_socket_id[socket.id];
        }
    });  
    
    socket.on('mob_damage', function(data) {


        let damage = data[0];
        let indexOfMob = data[1];
        let obj = mobs[indexOfMob];
        obj.hp -= damage;

        if(obj.hp <= 0) {
            socket.emit('give_stuff', obj.mobtype);
        };
    

    });

    //When client does PvP damage to another player.
    socket.on('pvp_damage', function(data) {
        let damageDealt = data[0];
        let victim = data[1];

        let socketid = data[1];
        io.to(victim).emit('got_whacked', [damageDealt, socket.id]);
    });

    socket.on("pointsforkill", function(data) {
        //[Game.socketid, whackedBySocketID]);
        let victim = data[0];

        let murderer = data[1];

        let indexOfPoints = players[victim].length - 1;

        console.assert(players[victim] !== undefined, "players[victim] is undef.");

        console.log("points of victim " + players[victim][indexOfPoints]);
        console.log(murderer);


        io.to(murderer).emit('3', players[victim][indexOfPoints]/2);


    });
    socket.on('place_fire', function(data) {

        console.log("place_fire");

        //data[0] is the x-coordinate of the fire
        //data[1] is the y-coordinate of the fire
        //data[2] is the angle of the fire
        //function Fire(x, y, index, angle, socket)




        let newFire = new Fire(data[0], data[1], fires.length, data[2], socket);
        //As soon as a new Fire() obj is created the timer for it has started.
        fires.push(newFire);

        console.log(fires.length + "fires length");



        let arr = [];

        for(let i = 0; i < fires.length; i++) {
            arr.push([fires[i].x, fires[i].y, fires[i].angle]);
        };

        io.sockets.emit('fires_update', arr);
        

    });

    socket.on('disconnect', function() {
        console.log(socket.id + " disconnected.");
        delete players[socket.id];
    });
  });