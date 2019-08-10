
var Game = {

    Nickname: "",

    PlayerSize: 25,
    DistanceOfHands: 18,

    ReduceFood: false,
    ReduceThirst: false,
    FoodReductionRate: 4,
    ThirstReductionRate: 3,
    ThirstThereshold: 100,
    FoodThereshold: 100,

    sandDunes: [[214,268], [200, 1182], [1739, 1194], [1470, 871], [653, 500], [497, 1520],[1826, 1372], [456, 601], [1823, 170], [528, 666], [1867, 71], [1745,1490], [1000, 1000], [344, 1238]],

    StartGame: false,

    timeTabWentInactive: 0,
    hpLossPerFrame: 0.04, //When starving or dying of thirst.

    lakesxy: [],


    Key: {
        left_arrow: 37,
        up_arrow: 38,
        right_arrow: 39,
        down_arrow: 40,
        w: 87,
        s: 83,
        a: 65,
        d: 68,
    },


    Mobs: {
        HyenaSize: 100,
    },

    MobType: {
        hyena: 1,
        scorpion: 2,
    },


    SocketID:undefined,

    counter: 0,

    F: {
        night_filter : "rgba(0, 0, 0, 0.85)",
        night_filter2: "#183f43ff",
        blue: "rgba(10, 51, 155, 0.15)",
        orange: "rgba(255, 165, 0, 0.05)",
        o: "#0b0b00",
        white_orange: "#BB9",
        orange2: "#FD8824",
        orange3: "#F22F1C"
    },
    DAY: true,
    //very useful you can modify this very very easy and in the HUD you will just render a proper visual of this
    //One way to deal with this is to keep in the inventory also the cx, cy and slot_size.
    inv: {
        //"stonesword": [1, 0, 0],
        //"goldsword": [1, 0, 0],
        "stonesword": [1, 0, 0],
        
        //"woodenpickaxe": [1, 0, 0],
        //"stonepickaxe": [1, 0, 0],
        //"goldpickaxe": [1, 0, 0],
        //"fire_placeable": [2,0 ,0],
        "rock": [1000, 0, 0],
        "wood": [400, 0, 0],
        "gold": [300, 0, 0],
        //"leather": [20, 0, 0],
        "cactus_flesh" : [40, 0, 0],
    },
    SlotSize: 85,
    CraftingSlotSize: 60,
    NumberOfSlots: 7,
    hp: 100,
    food: 100,
    thirst: 100,
    bodytemp: 36.0,
    player_hitting: false,

    heatConstant: 1/1200,
    //food, thirst, temp
    regen: {
        "cactus_flesh": [3, 2],
        "cooked_meat": [6, 0],
        "raw_meat": [4, 0],
    },
    highlightSlot: {
        cx: 0,
        cy: 0,
        counter: 0,
        maxCounter: 3,
        draw: false,
    },
    //Need to expose the player object since it is crucial to all the other elements of the game
    player: {
        x: 0,
        y: 0,
        width: 0,
        heigh: 0,
        equipped: "none",

        xR: 0,
        yR: 0,
        xL: 0,
        yL: 0,

        toolSwing: false,
        alpha: 0,
        DefaultPlayerSpeed: 1.5, 
        PlayerSpeedInWater: 0.6,
        points: 0,


    },

    scores: [],

    //wood, rock, gold, cactus
    miningAmount: [[1, 2, 3, 4], [0, 1, 2, 3],[0, 0, 1, 2], [1, 1, 1, 1]],

    //hyena, scorpion
    MobDamage: {
        "hyena": 30,
        "scorpion": 20,
    },

    MaxScorpions: 5,
    MaxHyenas: 15,

    assets: {},


    WeaponDamage: {
        "none": 1,
        "woodenpickaxe": 1.5,
        "stonepickaxe" : 1.7,
        "goldenpickaxe": 2, 
        "stonesword": 4,
        "goldsword" : 7,
    },

    Points: {
        ForCrafting: {
            "woodenpickaxe": 25, 
            "stonepickaxe": 75, 
            "goldpickaxe": 125, 
            "stonesword": 200,
            "goldsword": 1000,
            "fire_placeable": 50,
        },
        ForMining: {
            "tree": 1,
            "rock": 2,
            "gold": 5,
            "cactus": 3
        },
        ForKillingMobs: {
            "hyena": 100,
            "scorpion": 75, 

        }
    },

    infire: false,
    inwater: false,

    FirePlaceable: false,
    playerinwater: false,

    //wood, rock, gold, leather
    Recipes: {
        "woodenpickaxe": [30, 0, 0, 0],
        "stonepickaxe": [30, 30, 0, 0],
        "goldpickaxe": [50, 20, 20, 0, 0],
        "stonesword": [100, 40, 0, 0],
        "goldsword": [100, 30, 40, 0],
        "fire_placeable": [30, 10, 0, 0],
        //"leather_bottle": [20, 10, 0, 10],
    },

    //Client gets these stuff from the server.
    other_players: {},
    mobs: [],
    ResourceLocations: {},
    
    
    defaultSelection:  'Server: <span id="triangle"></span> ',
    
    toggleSelections: function(event) {
        //console.log("toggleSelections");
        
        let containerOfSelections = document.getElementsByClassName("options")[0];
        //console.log("Current visibility" +containerOfSelections.style.visibility);
        
        if(containerOfSelections.style.visibility === "hidden") {
            containerOfSelections.style.visibility = "visible";
        }
        else {
            containerOfSelections.style.visibility = "hidden";
        };
    },
    
    chooseServer: function(event) {
        let containerOfSelections = document.getElementsByClassName("options")[0];
        //console.log(event.target.id);
        
        if(event.target.id === "elem") {
            document.getElementById("selection").innerHTML = event.target.innerHTML.slice(0, 4);
            containerOfSelections.style.visibility = "hidden";
        }
        
        else {
            
            containerOfSelections.style.visibility = "hidden";
            document.getElementById("selection").innerHTML = this.defaultSelection;
        }
        
    }
};



//if you are drawing a 400 for 1280 for canvas.width draw something else.
//let x = (window.innerWidth * 400) / 1280;

//Frame rate dependant code.

var V = {
    w: (window.innerWidth * 400) / 1280,
    h: ((window.innerWidth * 400) / 1280) / (window.innerWidth/window.innerHeight)
};


const W = {
    w: 2000,
    h: 2000
};

var canvas = document.querySelector('canvas');

console.assert(canvas !== undefined, "canvas is undef.");

var socket = io();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');


function getAsset(type) {
    console.assert(assets !== undefined, "assets is undefined in getAsset()");
    return {day: assets['assets/' + type], night: assets['assets/' + 'n' + type]};
};

//input: array of strings with location of the images 
//callback animate
function loadAllImages() {


    //initial crop location
    window.assets = {};
    window.key_presses = {};
    window.sx = W.w/2- V.w/2;
    window.sy = W.h/2 - W.h/2;
    window.mouseX = 0, window.mouseY = 0;
    window.cactusArray = [];
    window.fireArray = [];
    window.objectsInDrawingZone = [];

    window.cactiInDrawingZone = [];
    window.treesInDrawingZone = [];


    window.hyenas = [];
    window.scorpions = [];
    window.elephants = [];
    window.trees = [];
    window.lakes = [];
    window.skulls = [];
    window.sanddunes = [];


    let sources = ['assets/player.png', 'assets/cappedplayer.png', 'assets/skull.png', 'assets/nskull.png',
    'assets/nplayer.png', 'assets/terrain.png',
    'assets/terrainblindme.png', 'assets/terrain3.png', 'assets/terrain4.png','assets/terrain5.png','assets/cactus.png', 'assets/fire.png', 'assets/n_cactus.png', 'assets/hyena.png', 'assets/nhyena.png', 'assets/nhand.png',
                'assets/scorpion.png', 'assets/nscorpion.png', 'assets/elephant.png', 'assets/nelephant.png' ,'assets/tree.png', 'assets/ntree.png', 'assets/rock.png', 'assets/gold.png',
                'assets/nrock.png', 'assets/ngold.png', 'assets/tree.png', 'assets/ntree.png', 'assets/health.png', 'assets/food.png', 'assets/thirst.png', 'assets/cactus_flesh.png',
                'assets/woodenpickaxe.png', 'assets/nwoodenpickaxe.png', 'assets/stonepickaxe.png', 'assets/nstonepickaxe.png', 'assets/goldpickaxe.png', 'assets/ngoldpickaxe.png',
                'assets/stonesword.png', 'assets/nstonesword.png', 'assets/goldsword.png', 'assets/ngoldsword.png', 'assets/leather.png', 'assets/fire_placeable.png', 'assets/leather_bottle.png',
                'assets/lake.png', 'assets/nlake.png', "assets/sanddune.png", "assets/nsanddune.png",
         'assets/wood.png', 'assets/nfire.png', 'assets/raw_meat.png', 'assets/cooked_meat.png', 'assets/raw_meat2.png', 'assets/raw_meat3.png', 'assets/player.png', 'assets/hand.png'];
    let imagesLoadedSoFar = 0;
    let totalImagesToLoad = sources.length;
    let len = sources.length;


    for(let i = 0; i < len; i++) {
        var anImage = new Image();
        anImage.src = sources[i];
        let temp = sources[i];
        console.assert(temp !== undefined, i + " is not there");
        temp = temp.substring(0, temp.indexOf('.'));
        assets[temp] = anImage;localStorage
        assets[temp].onload = function () {
            imagesLoadedSoFar++;
            if(imagesLoadedSoFar === totalImagesToLoad){

                player = new Player(assets['assets/player'], assets['assets/nplayer']);

                //all the potential things which can be taken into hand including nothing at all
                Game.tools = {

                    woodenpickaxe : {
                        day: assets['assets/woodenpickaxe'],
                        night: assets['assets/nwoodenpickaxe'],
                    },

                    stonepickaxe: {
                        day: assets['assets/stonepickaxe'],
                        night: assets['assets/nstonepickaxe'],
                    },

                    goldpickaxe: {
                        day: assets['assets/goldpickaxe'],
                        night: assets['assets/ngoldpickaxe'],
                    },

                    stonesword: {
                        day: assets['assets/stonesword'],
                        night: assets['assets/nstonesword'],
                    },

                    goldsword: {
                        day: assets['assets/goldsword'],
                        night: assets['assets/ngoldsword'],
                    },

                };
                let tools = Game.tools;


                Game.assets.fireimg = assets['assets/fire'];
                Game.assets.firenimg = assets['assets/nfire'];

                hand = new Hand(assets['assets/hand'], assets['assets/nhand'], tools);

                hud = new HUD(assets['assets/health'], assets['assets/food'], assets['assets/thirst']);
                
                craftingMenu = new CraftingMenu();

                socket.on('resource_locations', function(data) {


                    Game.ResourceLocations = data;
                    for(let i = 0; i < Game.ResourceLocations.trees.length; i++){
                        //now need to build a tree with set locations
                        let tree = new Cactus(assets['assets/tree'], assets['assets/ntree'], 60, 70, 20, "tree"
                        , Game.ResourceLocations.trees[i][0], Game.ResourceLocations.trees[i][1]);
                        cactusArray.push(tree);
                    };

                    for(let i = 0; i < Game.ResourceLocations.rocks.length; i++){
                        //now need to build a tree with set locations
                        let rock = new Cactus(assets['assets/rock'], assets['assets/nrock'], 50, 20, 30, "rock"
                        , Game.ResourceLocations.rocks[i][0], Game.ResourceLocations.rocks[i][1]);
                        cactusArray.push(rock);
                    };


                    for(let i = 0; i < Game.ResourceLocations.golds.length; i++){
                        //now need to build a tree with set locations
                        let gold = new Cactus(assets['assets/gold'], assets['assets/ngold'], 50, 20, 20, "gold"
                        , Game.ResourceLocations.golds[i][0], Game.ResourceLocations.golds[i][1]);
                        cactusArray.push(gold);
                    };


                    for(let i = 0; i < Game.ResourceLocations.lakes.length; i++){
                        //now need to build a tree with set locations
                        let lake = new Decorator(200, "lake", Game.ResourceLocations.lakes[i][0], Game.ResourceLocations.lakes[i][1]);
                        lakes.push(lake);
                        Game.lakesxy.push([Game.ResourceLocations.lakes[i][0],Game.ResourceLocations.lakes[i][1]]);
                    };

                    for(let i = 0; i < Game.sandDunes.length; i++) {
                        let sanddune = new Decorator(40, "sanddune", Game.sandDunes[i][0], Game.sandDunes[i][1]);
                        sanddunes.push(sanddune);
                    }
                    for(let i = 0; i < Game.ResourceLocations.skulls.length; i++){
                        //now need to build a tree with set locations
                        let skull = new Decorator(40, "skull", Game.ResourceLocations.skulls[i][0], Game.ResourceLocations.skulls[i][1]);
                        skulls.push(skull);
                    };


                    for(let i = 0; i < Game.ResourceLocations.cacti.length; i++){
                        //now need to build a tree with set locations
                        let cactus = new Cactus(assets['assets/cactus'], assets['assets/n_cactus'], 50, 50, 5, "cactus"
                        , Game.ResourceLocations.cacti[i][0], Game.ResourceLocations.cacti[i][1]);
                        cactusArray.push(cactus);
                    };
                });
                
                animate();
            }
        };
    }
};


function StartGame()  {

    Game.Nickname = document.getElementById("nickname").value;

    if(Game.Nickname.length > 0) {

        socket.emit("ingame", 0);
        document.getElementsByClassName("container")[0].style.display = "none";

        Game.running = true;
        
        var assert = console.assert;

        loadAllImages();
        setTimeout(changeInTemp, 1000);
        setTimeout(updateScores, 3 * 1000);

    }
}

StartGame();

//return true if a is between b and c inclusive.
function between(a, b, c) {
    return a >= b && a <= c;
};

function isSword(item) {
    return item === "goldsword" || item === "stonesword";
};

function isPick(item) {
    return item === "goldpickaxe" || item === "stonepickaxe" || item === "woodenpickaxe";
};

function isResource(item) {
    return item === "gold" || item === "rock" || item === "tree" || item === "cactus";
};

function isPlaceable(item) {
    return item === "fire" || item === "fire_placeable";
};

function isPlaceable(item) {
    return item === "fire" || item === "fire_placeable";
};

function enoughResource(resource, amount) {

    if(amount === 0)
        return true;

    else if(Game.inv[resource] === undefined)
        return false;

    else 
        return  Game.inv[resource][0] >= amount;
};

function ReduceInInventory(item, amount) {

    if(Game.inv[item] !== undefined) {
        if(Game.inv[item][0] === amount) {
            delete Game.inv[item];
        }
        else
            Game.inv[item][0] -= amount;
    }
};
function enoughResources(resources) {
    return enoughResource("wood", resources[0]) && enoughResource("rock", resources[1]) 
            && enoughResource("gold", resources[2]) && enoughResource("leather", resources[3]);
};
function canICraft(item, resources) {
    //if(item === "leather") console.log(resources);
    if(requiresLowerItem(item)) {
        return Game.inv[lowerItem(item)] !== undefined && enoughResources(resources);
    }
    else
        return enoughResources(resources);
};
function requiresLowerItem(item) {
    return item === "goldpickaxe" || item === "goldsword" || item === "stonepickaxe";
}
function lowerItem(item) {

    if(item === "goldpickaxe")
        return "stonepickaxe";

    else if(item === "goldsword")
        return "stonesword";

    else /* stonepickaxe */
        return "woodenpickaxe";
};


function giveInventory(item, amount) {

    let inventorySize = Object.keys(Game.inv).length;
    if(Game.inv[item] === undefined){
        if(inventorySize < Game.NumberOfSlots)
            Game.inv[item] = [amount, 0, 0];
    }

    else {
        Game.inv[item][0] += amount;
    }
        
}



function objectInDrawingZone(world_x, world_y, width, height) {

    console.assert(world_x !== undefined, "world_x is undefined in objectInDrawingZone");
    console.assert(world_y !== undefined, "world_y is undefined in objectInDrawingZone");
    console.assert(width !== undefined, "width is undefined in objectInDrawingZone");
    console.assert(height !== undefined, "height is undefined in objectInDrawingZone");

    return between(world_x, sx - width, sx + V.w + width) && between(world_y, sy - height, sy + V.h + height);
};


function convertWorldNumbersToCanvas(x, y, width, height) {


    console.assert(sx !== undefined, "sx is undefined in convertWorldNumbersToCanvas");
    console.assert(sy !== undefined, "sy is undefined in convertWorldNumbersToCanvas");
    console.assert(canvas !== undefined, "canvas is undefined in convertWorldNumbersToCanvas");
    console.assert(V !== undefined, "V is undefined in convertWorldNumbersToCanvas");
    //console.log("Height:" + height);
    return {
        canvas_x: (canvas.width/V.w * (x - sx)) - width/2,
        canvas_y: (canvas.height/V.h * (y - sy)) - height/2,
        canvas_width: width * (canvas.width/V.w),
        canvas_height: height * (canvas.height/V.h),
        center_canvas_x: (canvas.width/V.w * (x - sx)),
        center_canvas_y: (canvas.height/V.h * (y - sy)),
    };
};

window.addEventListener('mousemove', function(event) {
    mouseX = event.x;
    mouseY = event.y;

});

window.addEventListener("click", function(event) {
    if(event.target.id !== "elem" && event.target.id !== "selection"&& event.target.id !== "triangle") {
        //console.log(event.target.id +  "must hide it now");
        let x = document.getElementsByClassName("options")[0];
        x.style.visibility = "hidden";
    }
});


function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function dist(x1, y1, x2, y2) {
        let x_dist = x2 - x1;
        let y_dist = y2 - y1;
        return Math.sqrt(x_dist * x_dist + y_dist * y_dist);
};

//shrinks x for percent amount.
//100 shrank by 25% is 75.
function shrinkForPercent(x, percent) {
        return (x * (100 - percent))/100;
};

//Converts degrees to radians
function toRad(x) {
    return x * Math.PI/180;
};

function DrawNickname() {

    console.assert(Game.nicknamecoords !== undefined, "In DrawNickname() Game.nicknamecoords is undef.");
    c.save();
    c.fillStyle = "white";
    c.font="bold 20px monospace";
    let verticalPadding = 20;
    let horizontalPadding = 10;
    let x = (Game.Nickname.length - 5) * 5.5;
    c.fillText(Game.Nickname, Game.nicknamecoords.x + horizontalPadding - x, Game.nicknamecoords.y - verticalPadding);


    c.restore();

};

/*
NOTE: Ensured that length - 1 index is the points element and length - 2 is the name of the player!!!
*/
function updateScores() {
    
    
    // Given a score as a number convert it to a shorter version.
    // 1013 should be converted to 1K.
    // 1200 should be converted to 1.2K.
    
    function formatScore(score) {
        if(score < 1000) 
            return score.toString();
        return (Math.round(score/1000 * 10)/10).toString() + "K";	
    }
    
    console.assert(Game.other_players !== undefined, "Game.other_players is undef.");

    let keys = Object.keys(Game.other_players);
    
    if(keys.length === 0) return;
    
    Game.scores = []; //reset so that I can recompute. 

    let indexOfPoints = Game.other_players[keys[0]].length - 1;

    keys.sort(function(a, b) {
        return Game.other_players[b][indexOfPoints] - Game.other_players[a][indexOfPoints];
    });

    for(let i = 0; i < Math.min(10, keys.length); i++) {	
        let score = [Game.other_players[keys[i]][indexOfPoints - 1], formatScore(Game.other_players[keys[i]][indexOfPoints])];
        Game.scores.push(score);
    };
    
    setTimeout(updateScores, 3 * 1000);
};
/*
The Hand class deals with detecting hits and draws the hands of the player.

@window.objectsInDrawingZone is a GLOBAL variable which keeps track of all the resource nodes and mobs in drawing area.


*/
function Hand(img, n_img, tools) {


    this.rightToHit = true;
    this.d = Game.DistanceOfHands;


    this.fire_width = 30;
    this.fire_height = this.fire_width * (assets['assets/fire_placeable'].naturalHeight/assets['assets/fire_placeable'].naturalWidth);




    this.steps = 0;
    this.maxSteps = 11;

    //alpha is for in-canvas rotation of the tool/weapon
    this.alpha = 0;
    this.rate = 4;
    this.toolSwing = false;


    this.hitSpeed = 1;

    let width = 8;
    let height = (Game.DAY) ? (width * img.naturalHeight/img.naturalWidth) : width * (n_img.naturalHeight/n_img.naturalWidth);

    this.hit = false;

    this.delay = {
        counter: 0,
        delayTime: 15,
        delayCompleted: true
    };

    this.toolData = {
        width: 20,
        height: 0,
        x: 0,
        y: 0,
        hitboxX: 0,
        hitboxY: 0,
    };


    this.width = width * (canvas.width/V.w);
    this.height = height * (canvas.height/V.h);

    this.savedPreviousState = {
        oldPosXR: (Game.player.x - Math.sin(player.angle + Math.PI/3) * this.d),
        oldPosYR: (Game.player.y - Math.cos(player.angle + Math.PI/3) * this.d),
        oldPosXL: (Game.player.x - Math.sin(player.angle - Math.PI/3) * this.d),
        oldPosYL: (Game.player.y - Math.cos(player.angle - Math.PI/3) * this.d),
    };
    this.changeThePreviousState = function(a, b, c, d) {
        this.savedPreviousState.oldPosXR = a;
        this.savedPreviousState.oldPosYR = b;
        this.savedPreviousState.oldPosXL = c;
        this.savedPreviousState.oldPosYL = d;
    }

    this.update = function() {
        this.updateHandPositionBasedOnPlayer();

        Game.player.xR = this.xR;
        Game.player.yR = this.yR;
        Game.player.xL = this.xL;
        Game.player.yL = this.yL;
        Game.player.toolSwing = this.toolSwing;
        Game.player.toolData = this.toolData;
        Game.player.alpha = this.alpha;

        this.draw();
    }

    this.updateHandPositionBasedOnPlayer = function() {


        let changeInHeightR = Math.sin(player.angle + Math.PI/3) * this.d;
        let changeInWidthR = Math.cos(player.angle + Math.PI/3) * this.d;

        let changeInHeightL = Math.sin(player.angle - Math.PI/3) * this.d;
        let changeInWidthL = Math.cos(player.angle - Math.PI/3) * this.d;

        let changeInHeightForFirePlaceable = Math.sin(player.angle + Math.PI/6) * 25;
        let changeInWidthForFirePlaceable = Math.cos(player.angle + Math.PI/6) * 25;

        this.fire_x = Game.player.x + changeInWidthForFirePlaceable;
        this.fire_y = Game.player.y + changeInHeightForFirePlaceable;

        //compute updates a,b,c,d based on the changes in (x,y) position of the player in the World

        var a = (Game.player.x) + changeInWidthR;
        var b = (Game.player.y) + changeInHeightR;
        var c = (Game.player.x) + changeInWidthL;
        var d = (Game.player.y) + changeInHeightL;

        this.updateDelayState();

        if(!this.hit){

            this.xR = a;
            this.yR = b;

            this.xL = c;
            this.yL = d;

            this.updateToolState(this.xR, this.yR);
            this.changeThePreviousState(a, b, c, d);

        }
        else {
            if(this.rightToHit) {
                this.xL = c;
                this.yL = d;
            }
            else {
                this.xR = a;
                this.yR = b;
            }			
            this.updateHitState(a, b, c, d);
        }
    }
    this.whatDidIHit = function(nx, ny) {

        //nx and ny are the new positons of the the Right Hand
        //Go up to the quarter of the sword.


        let cx = nx;
        let cy = ny;
        let cr = (width < height) ? width/2 : height/2;
        /*

        */
        if(isSword(Game.player.equipped) || isPick(Game.player.equipped)) {
            cx = this.toolData.hitboxX;
            cy = this.toolData.hitboxY;
            cr = this.toolData.width/3;
        }

        let len = window.objectsInDrawingZone.length;
        


        for(let i = 0; i < len; i++) {

            let o = window.objectsInDrawingZone[i];

            //if(o.mobtype === Game.MobType.hyena || o.mobtype === Game.MobType.scorpion)
                //console.log("Checking against mob collision as well");


            let dd = dist(cx, cy, o.cx, o.cy);
            if(dd < cr + o.cr)
                return o;
        }
        return -1;
    }

    this.updateDelayState = function() {
        if(!this.delay.delayCompleted)
            this.delay.counter++;
        if(this.delay.counter === this.delay.delayTime)
            this.delay.delayCompleted = true;
    };


    this.updateToolState = function(a, b) {

        if(Game.player.equipped !== "none") {

            let t = Game.player.equipped;
            this.toolData.width = 18;
            this.toolData.height = (Game.DAY) ? (this.toolData.width * tools[t].day.naturalHeight/tools[t].day.naturalWidth) : 
            (this.toolData.width * tools[t].night.naturalHeight/tools[t].night.naturalWidth);

            let d = this.toolData.height/2;
            let opp = Math.sin(player.angle) * d;
            let adj = Math.cos(player.angle) * d;


            this.toolData.x = a + adj;
            this.toolData.y = b + opp;
            
            let dd = this.toolData.height/2 + this.toolData.height/4;
            let oo = Math.sin(player.angle - toRad(this.alpha + 10)) * dd;
            let aa = Math.cos(player.angle - toRad(this.alpha + 10)) * dd;

            this.toolData.hitboxX = a + aa;
            this.toolData.hitboxY= b + oo;


        }
    }
    this.draw = function() {

        console.assert(img !== undefined && n_img !== undefined, "img or n_img is undefined in Hand.draw");
        Game.player_hitting = this.hit;
        let image = (Game.DAY) ? img : n_img;
        let t1 = (canvas.width/V.w * (this.xR - sx)) - this.width/2;
        let t2 = (canvas.height/V.h * (this.yR- sy)) - this.height/2;

        this.centerRightHandX = (canvas.width/V.w * (this.xR - sx));
        this.centerRightHandY = (canvas.height/V.h * (this.yR - sy));

        this.drawPossibleTool();


        c.save();
        c.translate(t1, t2);
        c.translate(this.width/2, this.height/2);
        c.rotate(player.angle + Math.PI/2 + Math.PI/3);
        c.drawImage(image, -this.width/2, -this.height/2, this.width, this.height);
        c.restore();
        


        t1 = (canvas.width/V.w * (this.xL - sx)) - this.width/2;
        t2 = (canvas.height/V.h * (this.yL- sy)) - this.height/2;
        c.save();
        c.translate(t1, t2);
        c.translate(this.width/2, this.height/2);
        c.rotate(player.angle + Math.PI/2 + Math.PI/3);
        c.drawImage(image, -this.width/2, -this.height/2, this.width, this.height);
        c.restore();

        if(Game.FirePlaceable) {
            let canvasData = convertWorldNumbersToCanvas(this.fire_x, this.fire_y, this.fire_width, this.fire_height);
            c.save();
            c.translate(canvasData.center_canvas_x, canvasData.center_canvas_y);
            c.rotate(player.angle - Math.PI/2);
            c.translate(-canvasData.center_canvas_x, -canvasData.center_canvas_y);
            c.drawImage(assets['assets/fire_placeable'], canvasData.canvas_x, canvasData.canvas_y, canvasData.canvas_width, canvasData.canvas_height);
            c.restore();

            
        }	
        
    }

    /*
    How to make the animation smoother?
    
    this.alpha goes from 0 to 10*4.
    0 to 40 and then you are at 40 rotation and you drop back to 0 in a single frame.

    */
    this.drawPossibleTool = function() {

        let angle = 0;
        let adjustX = 0;
        let adjustY = 0;

        if(Game.player.equipped !== "none") {

            if(Game.player.equipped === "goldsword" || Game.player.equipped === "stonesword") {
                angle = -Math.PI/6;
                adjustX = -17;
                adjustY = 8;
            }
            /*
            else {
                angle = Math.PI/6;
                adjustX = 20;
                adjustY = 10;

            }*/
            else {
                adjustX = 0;
                adjustY = 20;
            }

            let image = (Game.DAY) ? (tools[Game.player.equipped].day) : (tools[Game.player.equipped].night);
            let w = this.toolData.width *  (canvas.width/V.w);
            let h = this.toolData.height * (canvas.height/V.h);
            t1 = (canvas.width/V.w * (this.toolData.x - sx)) - w/2;
            t2 = (canvas.height/V.h * (this.toolData.y - sy)) - h/2;


            let rotationX = t1 + w/2;
            let rotationY = t2 + h/2;


            c.save();
            c.translate(rotationX, rotationY);
            c.rotate(player.angle + Math.PI/2 + angle);
            let tipX = -w/2 + 0.1*w;
            let tipY = h/2;

            if(this.toolSwing) {
                c.translate(tipX, tipY);
                c.rotate(-toRad(this.alpha));
                c.translate(-tipX, -tipY);
            }


            c.translate(-rotationX, -rotationY);
            c.drawImage(image, t1 + adjustX, t2 + adjustY, w, h);
            c.restore();

            t1 = (canvas.width/V.w * (this.toolData.hitboxX - sx));
            t2 = (canvas.height/V.h * (this.toolData.hitboxY - sy));


        }
    }

    this.giveInventory = function(item, amount) {

        let inventorySize = Object.keys(Game.inv).length;
        if(Game.inv[item] === undefined){
            if(inventorySize < Game.NumberOfSlots)
                Game.inv[item] = [amount, 0, 0];
        }

        else {
            Game.inv[item][0] += amount;
        }
            
    }
    //Is Ensured to be a valid object
    this.dealWithHit = function(obj) {

        //if the object is a resource and if I have a pick or a hand. Then I can pick resources.
        if(isResource(obj.objType) && (isPick(Game.player.equipped) || Game.player.equipped === "none")) {

            let index = 0;
            let equippedIndex = 0;
            let id = undefined;
    
    
    
            if(obj.objType === "tree") {
                index = 0;
                id = "wood";
            }
    
            else if(obj.objType === "rock"){
                index = 1;
                id = "rock";
    
            }
                
            else if(obj.objType === "gold"){
                index = 2;
                id = "gold";
            }
            else {
                index = 3;
                id = "cactus_flesh";
            }
            Game.player.points += Game.Points.ForMining[obj.objType];

            
            
    
            if(Game.player.equipped === "none")
                equippedIndex = 0;
            else if(Game.player.equipped === "woodenpickaxe")
                equippedIndex = 1;
            else if(Game.player.equipped === "stonepickaxe")
                equippedIndex = 2;
            else
                equippedIndex = 3;
        
    
            
            let amount = Game.miningAmount[index][equippedIndex];
            let inventorySize = Object.keys(Game.inv).length;

            /*


            
            */
            if(Game.inv[id] === undefined){
                if(obj.amount > amount && inventorySize < Game.NumberOfSlots) Game.inv[id] = [amount, 0, 0];	
            }
            else {
                if(obj.amount > amount) {
                    Game.inv[id][0] += amount;
                    obj.amount -= amount;
                }
            }
        }
        else if(obj.mobtype === Game.MobType.hyena || obj.mobtype === Game.MobType.scorpion){

            let damage = Game.WeaponDamage[Game.player.equipped];
            console.assert(obj.index !== undefined, "obj.index is undefined");
            socket.emit("mob_damage", [damage, obj.index]);

        }

        else if(obj.type === "otherplayer"){
            socket.emit('pvp_damage', [Game.WeaponDamage[Game.player.equipped], obj.socketid]);
        }

        //Here code for the player obj.
        
    }
    this.updateHitState = function(a1, b1, c1, d1) {


        if(Game.player.equipped !== "none") {
            this.toolSwing = true;
            this.rightToHit = true;
        }



        if(this.rightToHit)
            x = toRad(-this.alpha);

        else
            x = toRad(this.alpha);

        this.alpha+= this.rate;


        if(Game.player.equipped === "woodenpickaxe" || Game.player.equipped === "stonepickaxe" || Game.player.equipped === "goldpickaxe" || Game.player.equipped === "none") {
            x = -toRad(45);
            if(!this.rightToHit)
                x*=-1;
        }

        let opp = Math.sin(player.angle + x) * this.hitSpeed;
        let adj = Math.cos(player.angle + x) * this.hitSpeed;

        let right = true;
        if(this.steps < this.maxSteps) {
            if(this.rightToHit) {


                this.xR += adj;
                this.yR += opp;

                this.xR += (a1 - this.savedPreviousState.oldPosXR);
                this.yR += (b1 - this.savedPreviousState.oldPosYR);

                this.updateToolState(this.xR, this.yR);
            }
            else {

                this.xL += adj;
                this.yL += opp;

                this.xL += (c1 - this.savedPreviousState.oldPosXL);
                this.yL += (d1 - this.savedPreviousState.oldPosYL);

                right = false;

            }

            this.steps++;

            if(this.steps === this.maxSteps - 1) {
                let theObjectThatWasHit = -1;
                if(right) {

                    theObjectThatWasHit = this.whatDidIHit(this.xR, this.yR);

                    if(theObjectThatWasHit !== -1){
                        this.dealWithHit(theObjectThatWasHit);					
                    }
                }
                    
                else {
                    theObjectThatWasHit = this.whatDidIHit(this.xL, this.yL);
                    if(theObjectThatWasHit !== -1)
                        this.dealWithHit(theObjectThatWasHit);
                }
            }
            this.changeThePreviousState(a1, b1, c1, d1);
        }
        else {

            this.hit = false;

            this.steps = 0;

            this.rightToHit = !this.rightToHit;

            this.delay.delayCompleted = false;
            this.delay.counter = 0;

            console.assert(this.delay.delayCompleted === false, "Hit was completed, however this.delay.delayCompleted couldn't be set to false");

            this.toolSwing = !this.toolSwing;
            this.alpha = 0;
            this.rate = 4;
        }
    }

    this.dealWithClick = function() {
        //only set hit to true if the delay has been completed

        console.assert(this.delay !== undefined, "this.delay is undefined");

        if(this.delay.delayCompleted)
            this.hit = true;
    };

    //canvas.addEventListener("click", this.dealWithClick.bind(this), false);
    canvas.addEventListener("mousedown", function(e) {


        if(e.button !== 0) return;


        const interval = setInterval(this.dealWithClick.bind(this), 100);

        canvas.addEventListener("mouseup", function(u) {
            if(u.button === 0)
            clearInterval(interval);
        })

    }.bind(this));
    //execute something as long you are holding the left mouse button down

}
function Cactus(img, n_img, size, shrink_percentage, maxAmount, type, x_coordinate, y_coordinate) {

    this.objType = type;

    this.maxAmount = maxAmount;
    this.amount = maxAmount;

    this.world_width = size;
    this.world_height = this.world_width * img.naturalHeight/img.naturalWidth;


    this.width = this.world_width * (canvas.width/V.w);
    this.height = this.world_height * (canvas.height/V.h);


    //the cactus can appear anywhere in the world
    this.x = x_coordinate;
    this.y = y_coordinate;

    this.canvas_x = undefined;
    this.canvas_y = undefined;

    this.cx = this.x;
    this.cy = this.y;
    this.cr = Math.min(this.world_width, this.world_height)/2;
    this.cr = shrinkForPercent(this.cr, shrink_percentage);

    this.draw = function() {
        let image = (!Game.DAY) ? n_img : img;
        c.drawImage(image, this.canvas_x, this.canvas_y, this.width, this.height);
    }

    this.update = function(toDraw) {

        if(between(this.x, sx - this.width, sx + V.w + this.width) && between(this.y, sy - this.height, sy + V.h + this.height)){
            let t1 = canvas.width/V.w * (this.x - sx);
            t1 -= this.width/2;
            let t2 = canvas.height/V.h * (this.y - sy);
            t2 -= this.height/2;
            this.canvas_x = t1;
            this.canvas_y = t2;

            window.objectsInDrawingZone.push(this);

            if(this.objType === "cactus")
                cactiInDrawingZone.push(this);
            
            else if(this.objType === "tree")
                treesInDrawingZone.push(this);
            

            if(toDraw)
                this.draw();

            //Use following 2 lines for the collision test
            //c.fillStyle = "green";
            //c.fillRect(this.collidebox_x, this.collidebox_y, this.collidebox_width, this.collidebox_height		
        }
    }
};

/*

@fire_x - the x-coordinate of the world location of the fire.
@fire_y - the y-coordinate of the world location of the fire.

*/
function Fire(fire_x, fire_y, angle) {
    

    this.natHeight = 573;
    this.natWidth = 605;

    this.world_width = 30;

    //console.log(Game.assets.fireimg.naturalHeight); //573
    //console.log(Game.assets.fireimg.naturalWidth); //605

    this.world_height = this.world_width * this.natHeight/this.natWidth;

    //both undefined, 

    this.angle = angle;

    this.width = this.world_width * canvas.width/V.w;
    this.height = this.world_height * canvas.height/V.h;

    //this will be the center
    this.x = fire_x;
    this.y = fire_y;

    this.rate = 0.3;
    this.expand = 0;
    this.expansionLimit = 20;
    this.fireSize = 200;

    this.inFire = function() {
        return (dist(this.x, this.y, Game.player.x, Game.player.y) <= 60);
    }

    this.draw = function() {

        if(between(this.x, sx - this.width, sx + V.w + this.width) && between(this.y, sy - this.height, sy + V.h + this.height)){


            let drawX = canvas.width/V.w * (this.x - sx);
            drawX -= this.width/2;
            let drawY = canvas.height/V.h * (this.y - sy);
            drawY -= this.height/2;

            let rotCenterX = drawX + this.width/2;
            let rotCenterY = drawY + this.height/2;


            c.save();
            c.translate(rotCenterX, rotCenterY);
            c.rotate(this.angle);
            c.translate(-rotCenterX, -rotCenterY);
            let image = (!Game.DAY) ? Game.assets.firenimg : Game.assets.fireimg;
            c.drawImage(image, drawX, drawY, this.width, this.height);
            c.restore();

        
            


            c.save();

            let x = drawX + this.width/2;

            let y = drawY + this.height/2;

            c.globalCompositeOperation = 'lighter';

            this.expand += this.rate;
            var radialGradient = c.createRadialGradient(x, y, 10, x, y, this.fireSize + this.expand);



            radialGradient.addColorStop(0, Game.F.orange);
            radialGradient.addColorStop(1, 'black');

            c.fillStyle = radialGradient;
            c.beginPath();

            c.arc(x, y, this.fireSize + this.expand + this.rate, 0, 2*Math.PI);

            c.fill();


            c.restore();


            if(this.expand > this.expansionLimit || this.expand < 0) {
                this.rate *= -1;
            }
        }
    }
    this.update = function() {
        this.draw();
    }
};

function Mob(cx, cy, mobtype, index) {

    this.cx = cx;
    this.cy = cy;
    this.mobtype = mobtype;	

    let world_width = Game.Mobs.HyenaSize * V.w/W.w;
    let world_height = Game.Mobs.HyenaSize * V.h/W.h;
    this.cr = (world_width < world_height) ? world_width/2 : world_height/2;

    this.index = index;
};
/*
 * you start with current_angle which is 0
 * choose a new_angle which is [0, Math.PI]
 * theta is set to a small angle
 *
*/


function HUD(himg, fimg, timg) {
    
    this.slots = [];

    this.hp = Game.hp;
    this.thirst = Game.thirst;
    this.food = Game.food;
    this.isClick = false;

    this.draw = function() {
        this.drawHealth();
        this.drawFood();
        this.drawThirst();
        this.drawInventory();
        this.drawBodyTemp();
        this.drawLeaderboard();

    }
    this.drawLeaderboard = function() {
        
        let x = canvas.width - 275;
        let y = 25;
        let padding = 25;
        
        //Need to draw elegant gray rectangle to keep the scores in.
        
        for(let i = 0; i < Game.scores.length; i++) {
            c.save();
            c.fillStyle = "white";
            c.font="bold 17px monospace";
            let spaces = " ".repeat((15 - Game.scores[i][0].length) + 3);
            c.fillText((i + 1).toString()+"." + " " + Game.scores[i][0] + spaces + Game.scores[i][1], x, y);
            y += padding;
            c.restore();	
        }

    }	
    
    this.drawInventory = function() {
        let slot_number = Game.NumberOfSlots;
        let slot_size = Game.SlotSize;
        let padding_between = 10;
        let total_width = slot_number * slot_size + (slot_number - 1) * padding_between;
        let left = (canvas.width - total_width)/2;
        this.drawHighlightedSlot();
        c.fillStyle = 'rgba(119,136,153, 0.7)';
        for(let i = 0; i < slot_number; i++) {
            let t1 = left;
            let t2 = canvas.height - slot_size - 10;
            c.fillRect(t1, t2, slot_size, slot_size);

            let key = Object.keys(Game.inv)[i];
            let val = Game.inv[key];

            if(key !== undefined && val[0] !== 0) {

                

                let val = Game.inv[key];

                let img = assets["assets/" + key];

                let wimg = 0, himg = 0;


                if(img.naturalWidth > img.naturalHeight) {
                    wimg = slot_size;
                    himg = slot_size * img.naturalHeight/img.naturalWidth;
                }

                else {
                    himg = shrinkForPercent(slot_size, 25);
                    wimg = himg * img.naturalWidth/img.naturalHeight;
                }



                Game.inv[key][1] = t1;
                Game.inv[key][2] = t2;
                c.drawImage(img, t1 + (slot_size - wimg)/2, t2 + (slot_size - himg)/2, wimg, himg);
                c.font = "bold 14px Bree Serif";
                c.save();
                c.fillStyle = "white";
                c.fillText(val[0], t1 + slot_size - (val[0]).toString().length * 8, t2 + slot_size);
                c.restore();

            }
            left += (slot_size + padding_between);
        }
        
    }
    /*
    There is some repetition.
    You can create a method drawBar with pass in img, t1, t2, 
    */
    this.drawHealth = function() {

        this.hp = Game.hp;

        let img = himg;
        let size_width = 110;
        let size_height = size_width * img.naturalHeight/img.naturalWidth;
        
        let t1 = 60;

        let t2 = 60;
        
        let center_x = t1 + size_width/2;
           let center_y = t2 + size_height/2;
        c.beginPath();
        let startingAngle = 3*Math.PI/2 + (100 - this.hp)/100 * Math.PI;
        let endingAngle =  3*Math.PI/2 - (100 - this.hp)/100 * Math.PI;
        c.arc(center_x, center_y, size_height/2 - 5, startingAngle, endingAngle + 2 * Math.PI);

        let gradientHealth = c.createRadialGradient(center_x, center_y, 5, center_x, center_y, size_height/2 - 5);
        gradientHealth.addColorStop(0, "white");
        gradientHealth.addColorStop(1, "green");
        c.fillStyle = gradientHealth;



        //c.fillStyle = "#00C82B";
        c.strokeStyle = "black";
        c.stroke();
        c.fill();
        c.drawImage(img, t1, t2, size_width, size_height);
    }

    //What we want to do right now is have some lower value that we want to get down to slowly.

    this.update = function() {


        this.food = Game.food;
        this.thirst = Game.thirst;

        
        if(Game.ReduceFood) {
            if(Game.food > Game.FoodTheresHold) {
                Game.food-= 0.15;
            }
            else{
                Game.ReduceFood = false;
                Game.FoodThereshold = Game.food;
            }
        }

        if(Game.ReduceThirst) {
            if(Game.thirst > Game.ThirstThereshold)
                Game.thirst-=0.15;

            else {

                Game.ReduceThirst = false;
                Game.ThirstThereshold = Game.thirst;

            }
        }

        

        if(Game.food < 0 || Game.thirst < 0) {
            Game.hp -= 0.04;
            if(Game.hp < 0)
                document.location.reload();
        }


        if(Game.food < 0) Game.food = 0;
        if(Game.thirst < 0) Game.thirst = 0;

        this.draw();
    }
    this.drawFood = function() {
        this.food = Game.food;		
        let img = fimg, size_width = 110,  size_height = size_width * img.naturalHeight/img.naturalWidth, t1 = 60, t2 = 170,  center_x = t1 + size_width/2, center_y = t2 + size_height/2;

        c.beginPath();
        let startingAngle = 3*Math.PI/2 + (100 - this.food)/100 * Math.PI;
        let endingAngle =  3*Math.PI/2 - (100 - this.food)/100 * Math.PI;
        c.arc(center_x, center_y, size_height/2 -  4, startingAngle, endingAngle + 2 * Math.PI);

        c.fillStyle = "#BD884F";
        c.strokeStyle = "black";
        c.stroke();
        c.fill();
        c.drawImage(img, t1, t2, size_width, size_height);

    }
    this.drawThirst = function() {
        this.thirst = Game.thirst;

        let img = timg, size_width = 110, size_height = size_width * img.naturalHeight/img.naturalWidth, t1 = 60, t2 = 280, center_x = t1 + size_width/2, center_y = t2 + size_height/2;

        c.beginPath();
        let startingAngle = 3*Math.PI/2 + (100 - this.thirst)/100 * Math.PI;
        let endingAngle =  3*Math.PI/2 - (100 - this.thirst)/100 * Math.PI;
        c.arc(center_x, center_y, size_height/2 - 6, startingAngle, endingAngle + 2 * Math.PI);
        c.fillStyle = "aqua";
        c.strokeStyle = "black";
        c.stroke();
        c.fill();
        c.drawImage(img, t1, t2, size_width, size_height);
    }


    this.drawBodyTemp = function() {

        c.font = "bold 20px Bree Serif";
        if(Game.bodytemp <= 33) 
            c.fillStyle = "#49e8ff";
        else if(Game.bodytemp >= 39)
            c.fillStyle = "red";
        else 
            c.fillStyle = "green";



        c.fillText("" + Game.bodytemp.toFixed(1).toString() + "C", 90, 44);
    }

    this.dealWithClick = function(button) {


        

        //console.log("This is in HUD");
        //console.log(event.x + " " + event.y);
        this.isClick = true;
        let tileClick = false;
        //iterate the dict find which inv slot does the click correspond to and print out what was clicked
        for(key in Game.inv) {
            let val = Game.inv[key];
            if(between(event.x, val[1], val[1] + Game.SlotSize) && between(event.y, val[2], val[2] + Game.SlotSize)) {
                tileClick = true;

                if(button === 0){
                    //process clicking of food
                    if(this.isEdible(key)) {

                        Game.food += Game.regen[key][0];
                        Game.thirst += Game.regen[key][1];

                        if(key === "cactus_flesh" && Game.bodytemp > 36.5) {
                            Game.bodytemp -= 0.5;
                        }
    
                        val[0] -= 1;
                        if(val[0] === 0) {
                            //console.log("should be deld");
                            delete Game.inv[key];
                        }
                    }
                    else if(this.isEquipable(key)) {
    
                        if(key === Game.player.equipped)
                            Game.player.equipped = "none";
                        else
                            Game.player.equipped = key;

                    }

                    else if(isPlaceable(key)) {

                        if(Game.FirePlaceable){
                            Game.FirePlaceable = false;
                        }

                        else Game.FirePlaceable = true;
                    }

                    Game.highlightSlot.draw = true;
                    Game.highlightSlot.cx = val[1];
                    Game.highlightSlot.cy = val[2];
                }

                else if(button === 2) {

                    if(key === Game.player.equipped)
                        Game.player.equipped = "none";

                    delete Game.inv[key];
                }


            }
        }

        //Code for placing the fire

        if(Game.FirePlaceable && !tileClick) {

            //console.log("Should place fire now");
            let n = fireArray.len;
            var canIPlace = true;
            let llen = lakes.length;
            for(let i = 0; i < llen; i++) {
                if(dist(hand.fire_x, hand.fire_y, lakes[i].x, lakes[i].y) < 100){
                    canIPlace = false;
                    break;
                }
            };
            //Optimize.
            //This can be optimized by only checking for elements in the drawingZone.
            var arr = Game.ResourceLocations.rocks.concat(Game.ResourceLocations.trees).
            concat(Game.ResourceLocations.golds).concat(Game.ResourceLocations.cacti);
            let arrlen = arr.length;
            for(let i = 0; i < arrlen; i++) {
                let d = dist(hand.fire_x, hand.fire_y, arr[i][0], arr[i][1]);
                if(d < 30) {
                    canIPlace = false;
                    break;
                }
            }
            
            if(canIPlace) {


                //fireArray.push(new Fire(assets['assets/fire'], assets['assets/nfire'], hand.fire_x, hand.fire_y, n));


                let angle = (Game.FirePlaceable) ? player.angle - Math.PI/2 -Math.PI/5 : 0;

                //We are passing (x, y, and angle) to the server.

                socket.emit('place_fire', [hand.fire_x, hand.fire_y, angle]);

                Game.FirePlaceable = false;

                Game.inv["fire_placeable"][0]--;
    
                if(Game.inv["fire_placeable"][0] === 0) {
                    //console.log("Deleting fire from the inventory");
                    delete Game.inv["fire_placeable"];
                }
    
            }
        }
        

        

    }

    this.drawHighlightedSlot = function() {

        if(Game.highlightSlot.draw === true && Game.highlightSlot.counter < Game.highlightSlot.maxCounter) {

            c.fillStyle = 'rgba(100, 100, 100, 0.9)';

            c.fillRect(Game.highlightSlot.cx, Game.highlightSlot.cy, Game.SlotSize, Game.SlotSize)
            Game.highlightSlot.counter++;
        }
        else {
            Game.highlightSlot.draw = false;
            Game.highlightSlot.counter = 0;
            this.isClick = false;
        }
    }

    this.isEdible = function(item) {
        return item === "cactus_flesh" || item === "raw_meat3" || item === "cooked_meat" || item === "raw_meat";

    };

    this.isEquipable = function(item) {
        return item === "stonepickaxe" || item === "goldpickaxe" || item === "woodenpickaxe" || item === "stonesword" || item === "goldsword";
    }

    //canvas.addEventListener("click", this.dealWithClick.bind(this), false);

    canvas.addEventListener("mousedown", function(e) {
        this.dealWithClick(e.button);
    }.bind(this));
}

function CraftingMenu() {

    this.whatAmICrafting = "nothing";


    this.CraftingDuration = {
        "woodenpickaxe" : 600,
        "stonepickaxe": 900, 
        "goldpickaxe": 1200, 
        "stonesword": 900,
        "goldsword": 1600,
        "fire_placeable": 60,
        "leather_bottle": 200,
    };

    this.counter = 0;
    this.update = function() {
        //pass in an array of items I can craft to draw?
        this.draw(this.whatCanICraft());
    }

    this.whatCanICraft = function() {

        //check the inventory and get all of the things which I can craft
        let thingsICanCraft = [];
        let keys = Object.keys(Game.Recipes);
        let len = keys.length;
        for(let i = 0; i < len; i++) {
            let item = keys[i];
            //4 values, and item 
            //console.log("Checking if I can craft +  " + keys[i] + " " + Game.Recipes);
            if(canICraft(item, Game.Recipes[item])) {
                

                thingsICanCraft.push(item);
            }
                
        }
        return thingsICanCraft;
    }


    this.draw = function(thingsICanCraft) {

        //Should I do it with percentage?
        this.things = [];
        let len = thingsICanCraft.length;
        let padding = 10;
        let space = canvas.height - (Game.CraftingSlotSize * thingsICanCraft.length) - (padding * (thingsICanCraft.length - 1)) - padding;

        c.save();
        c.fillStyle = "white";
        c.font="bold 15px monospace";
        
        if(len > 0)
            c.fillText("Craftables", canvas.width - Game.SlotSize - padding, space - padding);
        
        c.restore();
        for(let i = 0; i < len; i++) {


            let x = canvas.width - Game.SlotSize;
            let y = space;

            c.fillStyle = 'rgba(119,136,153, 0.6)';

            let img = assets['assets/' + thingsICanCraft[i]];

            let wimg = 0, himg = 0;


            if(img.naturalWidth > img.naturalHeight) {
                wimg = Game.CraftingSlotSize;
                himg = Game.CraftingSlotSize * img.naturalHeight/img.naturalWidth;
            }

            else {
                himg = shrinkForPercent(Game.CraftingSlotSize, 25);
                wimg = himg * img.naturalWidth/img.naturalHeight;
            }

            if(this.whatAmICrafting === thingsICanCraft[i]) {
                c.fillStyle = 'rgba(119,136,153, 0.9)';
                if(this.counter === this.CraftingDuration[this.whatAmICrafting]) {
                    //console.log("Crafting done");
                    this.giveItem();
                    this.counter = 0;
                    this.whatAmICrafting = "nothing";
                }
                else {
                    //console.log("Crafting in progress");
                    this.counter++;
                }
            }
            c.fillRect(x, y, Game.CraftingSlotSize, Game.CraftingSlotSize);
        

            this.things.push([x, y, thingsICanCraft[i]]);
            c.drawImage(img, x + (Game.CraftingSlotSize - wimg)/2, y + (Game.CraftingSlotSize - himg)/2, wimg, himg);


            if(this.whatAmICrafting === thingsICanCraft[i]) {

                c.font = "bold 13px Bree Serif";
                c.save();
                c.fillStyle = "white";
                let percentage = Math.floor((this.counter/this.CraftingDuration[this.whatAmICrafting]) * 100);
                c.fillText(percentage + "%", x + Game.SlotSize - 50, y + Game.CraftingSlotSize - 4);
                c.restore();
            }

            space += Game.CraftingSlotSize + padding;


        }
    }

    this.giveItem = function() {


        //Give the item to the inventory
        //I already know I have a slot
        let item = this.whatAmICrafting;
        let amount = 1;
        if(Game.inv[item] === undefined)
            Game.inv[item] = [amount, 0, 0];
        else
            Game.inv[item][0] += amount;
        
        if(requiresLowerItem(item)) {
            let lower = lowerItem(item);
            Game.inv[lower][0]--;
            if(Game.inv[lower][0] <= 0)
                delete Game.inv[lower];
        }

        let x = Game.Recipes[item];

        ReduceInInventory("wood", x[0]);
        ReduceInInventory("rock", x[1]);
        ReduceInInventory("gold", x[2]);
        
        ReduceInInventory("leather", x[3]);
        Game.player.points += Game.Points.ForCrafting[item];

    }
    this.dealWithClick = function(){
        let len = this.things.length;

        for(let i = 0; i < len; i++) {
            let rect = this.things[i];
            //if(between(event.x, val[1], val[1] + Game.SlotSize) && between(event.y, val[2], val[2] + Game.SlotSize))
            if(between(event.x, rect[0], rect[0] + Game.CraftingSlotSize) && between(event.y, rect[1], rect[1] + Game.CraftingSlotSize)) {
                //If I am not crafting anything currently and if I have an empty slot...
                //what I want to craft is rect[2]
                if(this.whatAmICrafting === "nothing") {

                    let canICraft = false;
                    let itemsInInventory = Object.keys(Game.inv).length;
                    let item = rect[2];

                    if(!requiresLowerItem(item) && Game.inv[item] !== undefined)
                        canICraft = true;
                    else if(!requiresLowerItem(item) && itemsInInventory < Game.NumberOfSlots)
                        canICraft = true;
                    else if(requiresLowerItem(item) && (Game.inv[lowerItem(item)] !== undefined && Game.inv[lowerItem(item)][0] >= 1))
                        canICraft = true;
                    else if(requiresLowerItem(item) && (Game.inv[lowerItem(item)] !== undefined && itemsInInventory < Game.NumerOfSlots))
                        canICraft = true;
                    else
                        canICraft = false;
                    
                    if(canICraft)
                        this.whatAmICrafting = item;
                }
            }
        }
    }
    canvas.addEventListener("click", this.dealWithClick.bind(this), false);
};

class Decorator {

    constructor(size, type, x_coordinate, y_coordinate) {
        
        
        this.objType = type;

        this.world_width = size;

        let returnedAsset = getAsset(type);

        console.assert(returnedAsset !== undefined, "returnedAsset is undefined in constructor() of Decorator");
        console.assert(returnedAsset.day !== undefined && returnedAsset.night !== undefined, "returnedAsset.day or returnedAsset.night is undefined");

        this.image = {day: returnedAsset.day, night: returnedAsset.night};

        this.world_height = this.world_width * this.image.day.naturalHeight/this.image.day.naturalWidth;
        



           this.width = this.world_width * (canvas.width/V.w);
        this.height = this.world_height * (canvas.height/V.h);


        //the cactus can appear anywhere in the world
        this.x = x_coordinate;
        this.y = y_coordinate;
    }

    draw() {

        console.assert(this.canvas_x !== undefined && this.canvas_y !== undefined, "canvas_x and canvas_y are undef. in Decorator.draw");

        let image = (Game.DAY) ? this.image.day : this.image.night;
        c.drawImage(image, this.canvas_x, this.canvas_y, this.width, this.height);
    }
    update() {

        if(between(this.x, sx - this.width, sx + V.w + this.width) && between(this.y, sy - this.height, sy + V.h + this.height)){

            if(dist(this.x, this.y, Game.player.x, Game.player.y) <= 50 && this.objType === "lake") Game.playerinwater = true;

            let t1 = canvas.width/V.w * (this.x - sx);
            t1 -= this.width/2;
            let t2 = canvas.height/V.h * (this.y - sy);
            t2 -= this.height/2;
            this.canvas_x = t1;
            this.canvas_y = t2;
            this.draw();
        }
    }
};


function DrawMob(x, y, mobtype, angle, expand, toDraw, index) {

    var img = null;

    if(mobtype === 1) {
        img = (Game.DAY) ? assets['assets/hyena'] : assets['assets/nhyena'];
    }
    else if(mobtype === 2) {
        img = (Game.DAY) ? assets['assets/scorpion'] : assets['assets/nscorpion'];
    }

    var mob_width = 100;

    if(mobtype === Game.MobType.scorpion)
        mob_width = 80;

    var mob_height = mob_width * img.naturalHeight/img.naturalWidth;
    if(objectInDrawingZone(x, y, mob_width, mob_height)) {

        if(toDraw) {

            let t1 = canvas.width/V.w * (x - sx);
            t1 -= mob_width/2;
            let t2 = canvas.height/V.h * (y - sy);
            t2 -=mob_height/2;
            canvas_x = t1;
            canvas_y = t2;
    
            c.save();
            c.translate(t1, t2);
            c.translate(mob_width/2,mob_height/2);
            c.rotate(angle);
            c.drawImage(img, -mob_width/2, -mob_height/2, mob_width + expand,mob_height + expand);
            c.restore();
        }

        //Those mobs which are in drawing zone need added to window.objectsInDrawingZone so that I can test for hits in the Hand() func.
        else {
            let obj = new Mob(x, y, mobtype, index);
            window.objectsInDrawingZone.push(obj);
        }
    }
}
function OtherPlayer(x, y, type, socketid) {

    //Here we need to figure out cx, cy and cr
    this.cx = x;
    this.cy = y;
    this.type = type;

    this.natWidth = 563;
    this.natHeight = 457;
    this.socketid = socketid;


    this.world_width = Game.PlayerSize;
    this.world_height = this.world_width * this.natHeight/this.natWidth;

    this.cr = Math.min(this.world_width, this.world_height)/2;
    
    this.cr = shrinkForPercent(this.cr, 10);

};
function DrawOtherPlayer(arr, tools, toDraw) {

    let x = arr[0];
    let y = arr[1];
    let player_angle = arr[2];
    let xR = arr[3];
    let yR = arr[4];
    let xL = arr[5];
    let yL = arr[6];
    let equipped = arr[7];
    let toolSwing = arr[8];
    let toolData = arr[9];
    var passed_alpha = arr[10];
    var socketid = arr[11];
    let name = arr[12];
    


    var img = (Game.DAY) ? assets['assets/player'] : assets['assets/nplayer'];
    var world_width = 25;
    var world_height = world_width * img.naturalHeight/img.naturalWidth;

    if(objectInDrawingZone(x, y, world_width, world_height) && !toDraw) {
        console.assert(x !== undefined, "x is undefined");
        console.assert(y !== undefined, "y is undefined");
        window.objectsInDrawingZone.push(new OtherPlayer(x, y, "otherplayer", socketid));
    }

    if(objectInDrawingZone(x, y, world_width, world_height) && toDraw) {

        let w = world_width *  (canvas.width/V.w);
        let h = world_height * (canvas.height/V.h);
        let t1 = (canvas.width/V.w * (x - sx)) - w/2;
        let t2 = (canvas.height/V.h * (y - sy)) - h/2;
        let posNicknameX = t1, posNicknameY = t2;


    


        c.save();
        c.translate(t1 + w/2, t2 + h/2);
        c.rotate(player_angle + Math.PI/2);
        c.translate(-t1 - w/2, -t2 - h/2);
        c.drawImage(img, t1, t2, w, h);
        c.restore();

        //done with the player, now draw the tool.
        let angle = 0;
        let adjustX = 0;
        let adjustY = 0;

        if(equipped !== "none") {

            if(equipped === "goldsword" || equipped === "stonesword") {
                angle = -Math.PI/6;
                adjustX = -17;
                adjustY = 8;
            }
            /*
            else {
                angle = Math.PI/6;
                adjustX = 20;
                adjustY = 10;

            }*/
            else {
                adjustX = 0;
                adjustY = 20;
            }

            let image = (Game.DAY) ? (tools[equipped].day) : (tools[equipped].night);
            let w = toolData.width *  (canvas.width/V.w);
            let h = toolData.height * (canvas.height/V.h);
            t1 = (canvas.width/V.w * (toolData.x - sx)) - w/2;
            t2 = (canvas.height/V.h * (toolData.y - sy)) - h/2;


            let rotationX = t1 + w/2;
            let rotationY = t2 + h/2;


            c.save();
            c.translate(rotationX, rotationY);
            c.rotate(player_angle + Math.PI/2 + angle);
            let tipX = -w/2 + 0.1*w;
            let tipY = h/2;

            if(toolSwing) {
                c.translate(tipX, tipY);
                c.rotate(-toRad(passed_alpha));
                c.translate(-tipX, -tipY);
            }


            c.translate(-rotationX, -rotationY);
            c.drawImage(image, t1 + adjustX, t2 + adjustY, w, h);
            c.restore();

        }
        //now draw the hands
        Game.player_hitting = this.hit;
        img = (Game.DAY) ? (assets['assets/hand']) : assets['assets/nhand'];
        let width = 8;
        let height = width * img.naturalHeight/img.naturalWidth;
        this.width = width * (canvas.width/V.w);
        this.height = height * (canvas.height/V.h);
        t1 = (canvas.width/V.w * (xR - sx)) - this.width/2;
        t2 = (canvas.height/V.h * (yR- sy)) - this.height/2;

        this.centerRightHandX = (canvas.width/V.w * (this.xR - sx));
        this.centerRightHandY = (canvas.height/V.h * (this.yR - sy));



        c.save();
        c.translate(t1, t2);
        c.translate(this.width/2, this.height/2);
        c.rotate(player_angle + Math.PI/2 + Math.PI/3);
        c.drawImage(img, -this.width/2, -this.height/2, this.width, this.height);
        c.restore();
        


        t1 = (canvas.width/V.w * (xL - sx)) - this.width/2;
        t2 = (canvas.height/V.h * (yL- sy)) - this.height/2;
        c.save();
        c.translate(t1, t2);
        c.translate(this.width/2, this.height/2);
        c.rotate(player_angle + Math.PI/2 + Math.PI/3);
        c.drawImage(img, -this.width/2, -this.height/2, this.width, this.height);
        c.restore();
        
        
        //Draw the name of the other players.
        c.save();
        c.fillStyle = "white";
        c.font="bold 20px monospace";
        let verticalPadding = 20;
        let horizontalPadding = 10;
        let xx = (name.length - 5) * 5.5;
        
        c.fillText(name, posNicknameX + horizontalPadding - xx, posNicknameY - verticalPadding);
        c.restore();
    }
}

function Player(img, n_img) {
    //console.log(img.naturalWidth); //563
    //console.log(img.naturalHeight); //457
    this.isMoving = false;
    let world_width = Game.PlayerSize;
    Game.player.width = world_width;

    let world_height = world_width * img.naturalHeight/img.naturalWidth;
    Game.player.height = world_height;

    let d = 1;

    let width = world_width * (canvas.width/V.w);
    let height = world_height * (canvas.height/V.h);

    let world_x = W.w/2;
    let world_y = W.h/2;


    Game.player.x = world_x;
    Game.player.y = world_y;



    let cx = undefined;
    let cy = undefined;
    let cr = undefined;

    this.angle = undefined;
    
    this.collidesWithAny = function(nx, ny) {
            cx = nx;
            cy = ny;
            cr = (world_width < world_height) ? world_width/2 : world_height/2;
            let len = window.objectsInDrawingZone.length;
            for(let i = 0; i < len; i++) {
                    let o = window.objectsInDrawingZone[i];

                    if(o.mobtype === Game.MobType.hyena || o.mobtype === Game.MobType.scorpion || o.type === "otherplayer")
                        return false;

                    let dd = dist(cx, cy, o.cx, o.cy);
                    if(dd < cr + o.cr)
                            return true;
            }
            return false;
    }


    this.draw = function() {


        let image = (!Game.DAY) ? n_img : img;

        let t1 = canvas.width/V.w * (world_x - sx);
        t1-= width/2;
        let t2 = canvas.height/V.h * (world_y - sy);
        t2 -= height/2;
        t1 = Math.max(0, t1);
        t2 = Math.max(0, t2);
        Game.nicknamecoords = {x : t1, y : t2};


        var centerX = t1 + width/2;
        var centerY = t2 + height/2;
        this.rotX = centerX;
        this.rotY = centerY;
        var opp = mouseX - centerX;
        var adj = mouseY - centerY;
        this.angle = Math.atan2(adj, opp);

        //move to origin t1, t2 where we want to draw
        
        c.save();
        c.translate(t1, t2);
        c.translate(width/2, height/2);
        c.rotate(this.angle + Math.PI/2);
        c.drawImage(image, -width/2, -height/2, width, height);
        c.restore();
        c.save();

    }
    this.withinWorld = function(x, y) {

        return (x >= 0 && x < W.w) && (y >= 0 && y < W.h);
    }
    this.update = function() {

        if(Game.playerinwater) {
            //console.log("player in water dec speed");
            d = Game.player.PlayerSpeedInWater;
            Game.playerinwater = false;
        }
        else d = Game.player.DefaultPlayerSpeed;
        this.isMoving = Object.keys(key_presses).length !== 0;
        let thetas = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
        let index = -1;
        //Up Right
        if((key_presses[Game.Key.up_arrow] || key_presses[Game.Key.w]) && (key_presses[Game.Key.right_arrow] || key_presses[Game.Key.d])) {
                        index = 1;
        }
        //Up Left
        else if((key_presses[Game.Key.up_arrow] || key_presses[Game.Key.w]) && (key_presses[Game.Key.left_arrow] || key_presses[Game.Key.a])) {
                        index = 7;
        }

        //Down Right
        else if((key_presses[Game.Key.down_arrow] || key_presses[Game.Key.s]) && (key_presses[Game.Key.right_arrow] || key_presses[Game.Key.d])) {
                        index = 3;
        }

        //Down Left
        else if((key_presses[Game.Key.down_arrow] || key_presses[Game.Key.s]) && (key_presses[Game.Key.left_arrow] || key_presses[Game.Key.a])) {
                        index = 5;
        }
        else if(key_presses[Game.Key.right_arrow] || key_presses[Game.Key.d]){
                        index = 2;
        }

        else if(key_presses[Game.Key.left_arrow] || key_presses[Game.Key.a]){
                        index = 6;
        }
        else if(key_presses[Game.Key.up_arrow] || key_presses[Game.Key.w]) {
                        index = 0;
        }

        else if(key_presses[Game.Key.down_arrow] || key_presses[Game.Key.s] ) {
                        index = 4;
        }



        let theta = Math.PI - thetas[index];
        let dx = Math.sin(theta) * d;;
        let dy = Math.cos(theta) * d;
        let nx = world_x + dx;
        let ny = world_y + dy;


        //As long as I am colliding with an object in the new position and as long as the new position
        //isn't within the confines of the world generate a new position.
        //The new position is guaranteed to be within the world and on that new position no collision will happen.

        while(this.collidesWithAny(nx, ny)) {

            //We can't move with that angle so choose new
            theta += Math.PI/16;
            dx = Math.sin(theta) * d;
            dy = Math.cos(theta) * d;
            nx = world_x + dx;
            ny = world_y + dy;
        }

        index = -1;
        if(!isNaN(theta) && this.withinWorld(nx, ny)) {

            world_x = nx;
            world_y = ny;

            Game.player.x = world_x;
            Game.player.y = world_y;
        }
        window.objectsInDrawingZone = [];

        //Calculate World crop positions sx,sy based on current player world_x, world_y positions
        calc(world_x, world_y);
        socket.emit('client_data', [Game.player.x, Game.player.y, this.angle, Game.player.xR, Game.player.yR, 
        Game.player.xL, Game.player.yL, Game.player.equipped, Game.player.toolSwing, Game.player.toolData, Game.player.alpha,
    Game.SocketID, Game.Nickname, Game.player.points]);
        socket.on('server_data', function(data) {

            //Update the points of client based on the server's version of it.
            //The server updates the points if PvP kill happens so the client should capture the score.
            Game.other_players = data;
        });

        socket.on('mobs', function(data) {
            Game.mobs = data;
        });

        socket.on('socket_id', function(data) {
            Game.SocketID = data;
        });

    

        this.draw();
    }
};

socket.on('give_stuff', function(data) {

    if(data === Game.MobType.hyena) {
        Game.player.points += Game.Points.ForKillingMobs["hyena"];
        giveInventory("raw_meat", 1);
        giveInventory("leather", 1);
    }
    else if(data === Game.MobType.scorpion) {
        Game.player.points += Game.Points.ForKillingMobs["scorpion"];
        giveInventory("raw_meat", 1);
    }
});



socket.on('biten', function(data) {
    Game.hp -= data;
     if(Game.hp < 0){ 
        Game.hp = 0;
        document.location.reload();
     }
});


socket.on('food_tick', function(data) {

    Game.ReduceFood = true;
    Game.FoodTheresHold = Game.food - Game.FoodReductionRate;


});

//Update the client's points if they killed someone.
socket.on('3', function(data) {

    console.log("will update points");

    Game.player.points += data;
});

socket.on('thirst_tick', function(data) {
    Game.ReduceThirst = true;
    Game.ThirstThereshold = Game.thirst - Game.ThirstReductionRate;
});



socket.on('got_whacked', function(data) {

    Game.hp -= data[0];

    let whackedBySocketID = data[1];

    if(Game.hp < 0){ 

        Game.hp = 0;

        //If you die you need to update the points of the player that killed you.
        console.log("Got killed by:  " + whackedBySocketID);
        
        socket.emit("pointsforkill", [Game.SocketID, whackedBySocketID]);
        document.location.reload();
     }
});
socket.on("regen_res", function() {
    if(!Game.running) return;
    for(let i = 0; i < cactusArray.length; i++) {
        let obj = cactusArray[i];
        if(obj.amount < obj.maxAmount) {
            let r = randomBetween(obj.amount, obj.maxAmount - obj.amount);
            obj.amount += r;
        }
    }
});
socket.on('c', function(data) {
    Game.DAY = data;
});

socket.on('fires_update', function(data) {

    console.log("fires_update");
    //Server:Fire(x, y, index, angle, socket)
    //Client: Fire(fire_x, fire_y, angle)
    
    window.fireArray = [];

    let len = data.length;

    if(len !== 0) {
        for(let i = 0; i < len; i++) {
            let x = new Fire(data[i][0], data[i][1], data[i][2]); 
            window.fireArray.push(x);
        }	
    }

    

});

function calc(a, b) {

    //if left there is room then it's fine
    if(a - V.w/2 >= 0)
        window.sx = a - V.w/2;
    else window.sx = 0;

    //if right no room then choose worldWidth - viewportWidth
    if(a + V.w/2 > W.w)
        window.sx = W.w - V.w;


    if(b - V.h/2 >= 0)
        window.sy = b - V.h/2;
    else window.sy = 0;


    if(b + V.h/2 >= W.h)
        window.sy = W.h - V.h;
}


document.addEventListener("keydown", function(event) {
    if(Game.running) key_presses[event.keyCode] = true;
});

document.addEventListener("keyup", function(event) {
    if(Game.running) delete key_presses[event.keyCode];
});

document.addEventListener("visibilitychange", function() {

    if(document.hidden) {
        Game.wentinactive = true;
        Game.state = {inwater: Game.inwater, infire: Game.infire, day: Game.day, bodytemp: Game.bodytemp, thirst: Game.thirst, food: Game.food};
        Game.timeTabWentInactive = Date.now();
    }

    else{
        if(Game.wentinactive) computeChangeInTempAndHPWhileTabWasInactive(Game.state, (Date.now() - Game.timeTabWentInactive)/1000);
        Game.wentinactive = false;
    }

});

window.addEventListener("resize", function() {

});

//@state - State of the game when the player entered the inactive period.
//@duration - in seconds, the amount of time the Tab was inactive.

function computeChangeInTempAndHPWhileTabWasInactive(state, duration) {

    if(state.infire) {
        console.log("infire");
        if(state.day) Game.temp += duration * 0.2;
        else Game.temp = Math.max(36, Game.temp + duration * 0.2);
    }

    if(state.inwater) {
        console.log("inwater");
        if(state.bodytemp > 34) Game.bodytemp -= duration * 0.2;
        if(state.thirst < 100) Game.thirst += duration * 0.2;
    }

    Game.food -= Game.FoodReductionRate/5 * duration;
    Game.thirst -= Game.ThirstReductionRate/7 * duration;

    let howMany = 0;
    if(Game.food <= 0) howMany ++;
    if(Game.thirst <= 0) howMany ++;
    if(Game.bodytemp < 33 || Game.bodytemp > 39) howMany++;
    Game.hp -= howMany * duration  * (Game.hpLossPerFrame * 60);

    if(Game.hp < 0) {
        document.location.reload();
    }
};

function changeInTemp() {

    let infire = false, inwater = false;


    let len = window.fireArray.length;

    for(let i = 0; i < len; i++) {
        if(window.fireArray[i].inFire() === true){
            infire = true;
            break;
        }
    }
    Game.infire = infire;
    len = Game.lakesxy.length;

    for(let i = 0; i < len; i++) {
        if(dist(Game.lakesxy[i][0], Game.lakesxy[i][1], Game.player.x, Game.player.y) <= 50) {
            inwater = true;
        }
    }
    Game.inwater = inwater;



    if(Game.DAY)
        Game.bodytemp += 0.05;

    else Game.bodytemp -= 0.05;

    if(inwater) {
        console.log("in water");
        if(Game.bodytemp > 34) Game.bodytemp -= 0.2;
        if(Game.thirst < 100) Game.thirst += 0.2;
    }

    if(infire) {
        console.log("in fire");
        if(Game.DAY)  Game.bodytemp += 0.2;
        else {
            if(Game.bodytemp < 36) Game.bodytemp += 0.2;
        }
    }
    if(Game.bodytemp < 33 || Game.bodytemp > 39) Game.hp -= (Game.hpLossPerFrame * 60);

    if(Game.hp < 0) {
        document.location.reload();
    }
    setTimeout(changeInTemp, 1 * 1000);
};

function animate() {

    requestAnimationFrame(animate);
    W.w = assets['assets/terrain5'].naturalWidth;
    W.h = assets['assets/terrain5'].naturalHeight;


    let sWidth = V.w;
    let sHeight = V.h;
    let dx = 0;
    let dy = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;



    V.w = (window.innerWidth * 400) / 1280;
    V.h = ((window.innerWidth * 400) / 1280) / (window.innerWidth/window.innerHeight);

    dWidth = canvas.width;
    dHeight = canvas.height;


    c.clearRect(0, 0, innerWidth, innerHeight);

    c.drawImage(assets['assets/terrain5'], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    if(Game.DAY === false) {
        c.fillStyle = Game.F.night_filter2;
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = Game.F.blue;
        c.fillRect(0, 0, canvas.width, canvas.height);
    }

    for(let i = 0; i < sanddunes.length; i++)
        sanddunes[i].update();

    for(let i = 0; i < lakes.length; i++) 
        lakes[i].update();
    
    for(let i = 0; i < skulls.length; i++)
        skulls[i].update();


    for(let i = 0; i < fireArray.length; i++) {
        fireArray[i].update();
    }



    player.update();



    for(let i = 0; i < cactusArray.length; i++)
        cactusArray[i].update(false);

    

    for(let i = 0; i < Game.mobs.length; i++) {
        if(Game.mobs[i] !== undefined) {
            DrawMob(Game.mobs[i].world_x, Game.mobs[i].world_y, Game.mobs[i].mobtype, Game.mobs[i].current_angle, Game.mobs[i].expand, false, i);
        }
    }

    for(var key in Game.other_players) {
        if(key !== Game.SocketID) {
            DrawOtherPlayer(Game.other_players[key], Game.tools, false);
        }
    }

    hand.update();
    
    
    for(var key in Game.other_players) {
        if(key !== Game.SocketID) {
            DrawOtherPlayer(Game.other_players[key], Game.tools, true);
        }
    }

    for(let i = 0; i < Game.mobs.length; i++) {
        if(Game.mobs[i] !== undefined) {
            DrawMob(Game.mobs[i].world_x, Game.mobs[i].world_y, Game.mobs[i].mobtype, Game.mobs[i].current_angle, Game.mobs[i].expand, true, i);
        }
    }

    for(let i = 0; i < cactusArray.length; i++)
        cactusArray[i].update(true);


    hud.update();
    craftingMenu.update();

    DrawNickname();


};


