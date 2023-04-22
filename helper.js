

// Score
var score = 0;
var highscore = 0;
var newhighscore = false;

var ghostys = 0;
var ghostyCounter = 0;
var allSouls = false;

// Game End & Next Level
var levelState = -1;

var finishingLevel = false;
var won = false;
var winTimer = 0;
var gameover = false;
var loadingTimer = 0;
var endTimer = 0;
var bonus = false;
var frameRate = 45;

// Time
var startTime = new Date();
var endTime = 0;
var consoleTimer = 0;

var timeAdd = 0;
var timeAcc = 0;
var pauseTime = 0;
var animationTime = 0;

var maxTime = 240;
var timeUp = false;
var invertTime = maxTime;

// First enter
var first = true;

// Level mangement
var level = 1;


// Row stuff
let sectionNumber = 0;

// Persistent Power ups
var playerHatDuration = 0;
var playerHat = 0;
var playerRats = 0;

var deathMusic = false;

// Enter and leave
var levelEntering = false;
var levelLeaving = false;

// Click state
var click = false;
var buttonClick = false;

// Muted
var muted = false;

// shenanigans
var fromTelegram = ((new URLSearchParams(window.location.search)).get("userId") != null) ? true : false;

// Page focused
var pageFocused = true;

var horizontal = (window.innerWidth > window.innerHeight) ? true : false;

// Mouse Vars
var mouseX = 0, mouseY = 0, mouseClick = false, mouseRelease = false, mouseState = [0, 0, 0];
var hoverGravestone = -1;

// Loading sounds
var trackTimer = -1;
var trackPlaying = -1;

var perfectPlayed = false;



// Important Global Objects
var player;
var death;

// Object Arrays
var drawnableObjects = [];
var buttomObjects = [];

var ghostyObjects = [];
var textObjects = [];
var gravestones = [];
var flowers = [];
var itemObjects = [];
var rats = [];
var backgroundTiles = [];



// Important Bonus Objects
var playerB;

// bonus Object Arrays
var gridObjects = [];
var gravestonesB = [];
var fencesB = [];

// Particle Array
var particles = [];





// Screen Object
function ScreenObj() {
    this.x = 0;
    this.y = 0;

    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeTimer = 0;
    this.shakeRad = 10;

    this.screenShake = function (val) {
        this.shakeTimer = val;
    }

    this.update = function () {
        // Screen Shake
        if (this.shakeTimer <= 0) {
            this.shakeX = 0;
            this.shakeY = 0;
        } else {
            this.shakeTimer--;
            this.shakeX = (Math.random() * this.shakeRad * 2) - this.shakeRad;
            this.shakeY = (Math.random() * this.shakeRad * 2) - this.shakeRad;
        }

        // Position Update
        this.x = this.shakeX;
        this.y = this.shakeY;
    }
}

var view = new ScreenObj();


function Input() {
    this.keyState = [];

    this.init = function () {
        for (var i = 0; i < 256; i++) {
            var vals = [];
            for (var j = 0; j < 3; j++) {
                vals.push(false);
            }
            this.keyState.push(vals);
        }
    }

    this.update = function () {
        for (var i = 0; i < 256; i++) {
            this.keyState[i][1] = false;
        }
    }

}


var input = new Input();
input.init();

// Rain
function Rain(density, dir, spd) {
    this.dens = density;
    this.dir = dir;
    this.hspd = Math.cos(dir) * spd;
    this.vspd = Math.sin(dir) * spd;

    this.fillScreen = function(){
        for (let i = 0; i < this.dens; i++) {
            let spdMult = randomRange(0.75, 1.5);
            let part = new LineParticle(randomRange(0, width), randomRange(0, height), this.hspd * spdMult, this.vspd * spdMult, this.dir, randomRange(10, 20), "rgb(150, 150, 200)", randomRange(20, 70));
            part.z = -10000;
            particles.push(part);
        }
    }


    this.update = function () {
        for (let i = 0; i < this.dens; i++) {
            let spdMult = randomRange(0.75, 1.5);
            let part = new LineParticle(randomRange(0, width), -height + randomRange(0, height), this.hspd * spdMult, this.vspd * spdMult, this.dir, randomRange(10, 20), "rgb(150, 150, 200)", 45 + randomRange(20, 70));
            part.z = -10000;
            particles.push(part);
        }
    }
}

var rain = new Rain(0, Math.PI * 1, 0);





// Game Command Functions
function muteButton() {
    // Mute Buttom
    if (muted) {
        muted = false;
        trackPlaying.volume = 1;
    } else {
        muted = true;
        trackPlaying.volume = 0;
    }
    this.imgX = (muted == true) ? 1 : 0;
}

function openGravestones() {
    for (let i = 0; i < gravestones.length; i++) {
        let gravestone = gravestones[i];
        if (gravestone.broken == false && gravestone.opened == false) {
            gravestone.open();
        }
    }
}

function createRats() {
    for (let i = 0; i < 5; i++) {
        let randX = (50 * Math.random()) + width / 2;
        let randY = (50 * Math.random()) + height / 2;
        let rat = new Rat(randX, randY);
        rats.push(rat);
        addDrawnable(rat);
    }
}








// Helper functions
function bonusRoomCreate(levelNum) {

    state = bonusStep;
    level = levelNum;

    bonus = true;

    loadingTimer = 2000;

    perfectPlayed = false;

    endTimer = 0;

    timeAcc = 0;
    timeUp = false;

    // Screen Shake Setup
    shakeX = 0;
    shakeY = 0;
    shakeTimer = 0;
    shakeRad = 10;

    // Rain Setup
    rain = new Rain(0, 0, 0);


    // Level States
    finishingLevel = false;
    endTimer = 0;

    // Row reset
    sectionNumber = 0;

    // Emptying Object Arrays
    drawnableObjects = [];
    ghostyObjects = [];
    itemObjects = [];
    textObjects = [];
    gravestones = [];
    particles = [];
    flowers = [];
    rats = [];
    buttomObjects = [];
    backgroundTiles = [];
    gridObjects = [];
    gravestonesB = [];
    fencesB = [];

    playerSpeed = 9;

    playerB = new PlayerB();
    if (playerHatDuration > 0) {
        playerB.hat = playerHat;
    }
    addObj(playerB);

    // Buttoms
    let buttomL = new Button((width / 2) - (12 * spr_arrowButton.width / 2) + 500, (height / 2) - (12 * spr_arrowButton.height / 2), 10, 10);
    buttomL.sprite = spr_arrowButton;
    buttomL.scl = 12;
    buttomL.boundBox = new BoundBox(-1, -1, 10, 17);
    buttomL.onClick = function () {
        playerB.move(1);
    };
    addButton(buttomL);

    let buttomR = new Button((width / 2) - (12 * spr_arrowButton.width / 2) - 500, (height / 2) - (12 * spr_arrowButton.height / 2), 10, 10);
    buttomR.sprite = spr_arrowButton;
    buttomR.scl = 12;
    buttomR.flip = true;
    buttomR.boundBox = new BoundBox(-1, -1, 10, 17);
    buttomR.onClick = function () {
        playerB.move(-1);
    };
    addButton(buttomR);
}










function roomCreate(levelNum) {

    // Updating Level number
    level = levelNum;

    bonus = false;

    loadingTimer = 2000;

    perfectPlayed = false;
    levelEntering = true;
    levelLeaving = false;

    // Maybe Pleonastic Variable Setup
    finishingLevel = false;
    won = false;
    winTimer = 0;
    gameover = false;
    ghostys = 0;
    ghostyCounter = 0;
    endTimer = 0;

    timeAcc = 0;
    timeUp = false;

    // Screen Shake Setup
    shakeX = 0;
    shakeY = 0;
    shakeTimer = 0;
    shakeRad = 10;

    // Emptying Object Arrays
    drawnableObjects = [];
    ghostyObjects = [];
    itemObjects = [];
    textObjects = [];
    gravestones = [];
    particles = [];
    flowers = [];
    rats = [];
    buttomObjects = [];
    backgroundTiles = [];
    gridObjects = [];
    gravestonesB = [];
    fencesB = [];







    // Object Instantiation

    // Player
    player = new Player((width / 2) - (spr_Player.width * 4.5 / 2) + 1, height + 70);
    player.setTarget(width / 2, height - 80, 4);
    player.facing = 1;
    if (playerHatDuration > 0) {
        playerHatDuration--;
        player.hat = playerHat;
    }



    /// Death
    death = new Death(Math.random() < 0.5 ? width + 200 : -360, height / 6, level);







    // Gravestone Number and Layout





    // Random Layout
    let graveNumber = Math.floor(randomRange(16, 22));
    let graveDestroy = 32 - graveNumber;
    let graveIndex = [];
    for (let i = 0; i < 32; i++) {
        graveIndex.push(i);
    }


    for (let i = 0; i < graveDestroy; i++) {
        let randInd = Math.floor(Math.random() * graveIndex.length);
        graveIndex.splice(randInd, 1);
    }





    // Gravestone Content List Creator
    let gravContents = [];

    let bombRatio = (1 / Math.sqrt(level));
    let itemProportions = [Math.ceil(16 * bombRatio), Math.floor(16 * (1 - bombRatio)), 2, 14, 2, 1];

    let layouts = ["normal", "normal", "normal", "normal", "normal", "creeper", "rat", "border", "chess"];
    let graveLayout = layouts[Math.floor(Math.random() * layouts.length)];

    switch (graveLayout) {
        case "normal":
            break;

        case "creeper":
            graveIndex = [1, 2, 5, 6, 9, 10, 13, 14, 19, 20, 26, 27, 28, 29];
            itemProportions = [0, 20, 2, 8, 5, 1];
            break;

        case "rat":
            itemProportions = [2, 2, 2, 28, 1, 1];
            break;

        case "border":
            graveIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31];
            break;

        case "chess":
            graveIndex = [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22, 25, 27, 29, 31];
            itemProportions = [5, 2, 2, 15, 1, 10];
            break;

    }

    for (let i = 0; i < itemProportions.length; i++) {
        let itemNum = itemProportions[i];
        for (let j = 0; j < itemNum; j++) {
            if (i == 0) {
                gravContents.push("nothing");
            } else {
                gravContents.push(i - 1);
            }
        }
    }

    // Gravestone Creation
    for (let i = 0; i < 32; i++) {
        if (graveIndex[0] == i) {
            graveIndex.splice(0, 1);
            let randx = (Math.random() * 16) - 8;
            let randy = (Math.random() * 14) - 7;

            let ix = i % 8;
            let iy = Math.floor(i / 8);

            let xborder = width / 10;
            let xoffset = (width - (xborder * 2)) / 7;

            let xx = xborder + (ix * xoffset) - 10;

            let yborder = height / 10;
            let ystart = height / 12;
            let yoffset = (height - (yborder * 2) - ystart) / 3;
            let yy = ystart + yborder + (iy * yoffset) - 20;


            let cInd = Math.floor(Math.random() * gravContents.length);
            let c = gravContents[cInd];
            gravContents.splice(cInd, 1);

            // Gravestone Typing
            let gravType = Math.random();
            if (gravType < 0.77) {
                gravType = 0;
            } else if (gravType < 0.97) {
                gravType = 1;
            } else {
                gravType = 2;
            }

            let obj = new Gravestone(xx + randx, yy + randy, gravType, c);
            if (graveLayout == "rat") {
                obj.rat = true;
            }
            gravestones.push(obj);
            drawnableObjects.push(obj);

            let hasFlower = (Math.random() < 0.1) ? true : false;
            if (hasFlower) {
                let randType = (level > 1) ? Math.floor(Math.abs((Math.random() * 3) - 0.2)) : Math.floor(Math.abs((Math.random() * 2) - 0.7));
                let flower = new Flower(obj.x + (obj.sprite.width * obj.scl) + randomRange(-40, 20), obj.y + (obj.sprite.height * obj.scl) - randomRange(50, 30), randType);
                flowers.push(flower);
                drawnableObjects.push(flower);
            }
        }
        if (graveIndex.length == 0) {
            i = 32;
        }
    }





    // Background Tiles
    let tilesAvailable = [];
    let tileScl = 4;
    let tiles = Math.floor(randomRange(4, 6));
    let tilesX = Math.ceil(width / (16 * tileScl));
    let tilesY = Math.ceil(height / (16 * tileScl));
    for (let i = 0; i < tilesX * tilesY; i++) {
        tilesAvailable.push(i);
    }

    for (let i = 0; i < tiles; i++) {
        let selectedIndex = Math.floor(Math.random() * tilesAvailable.length);
        let val = tilesAvailable[selectedIndex];
        tilesAvailable.splice(selectedIndex, 1);

        let tileType = Math.floor(Math.random() * 4);
        let xx = ((val % tilesX) * 16 * tileScl) + randomRange(-4, 4);
        let yy = (Math.floor(val / tilesX) * 16 * tileScl) + randomRange(-4, 4);
        let tileNew = new Tile(xx - tileScl * 8, yy - tileScl * 8, spr_Tiles, tileScl, (tileType % spr_Tiles.imgNumX), Math.floor(tileType / spr_Tiles.imgNumY));
        backgroundTiles.push(tileNew);
    }





    // Flower Creation
    let flowerNum = Math.min(level + 6, 15) + 8;

    for (let i = 0; i < flowerNum; i++) {
        let randx = Math.random() * width;
        let randy = Math.random() * height;
        let randType = (level > 1) ? Math.floor(Math.abs((Math.random() * 3) - 0.2)) : Math.floor(Math.abs((Math.random() * 2) - 0.7));
        let obj = new Flower(randx, randy, randType);
        flowers.push(obj);
        drawnableObjects.push(obj);
    }








    // Buttons
    let buttonSound = new Button(width - 66, 20, 16, 16);
    buttonSound.scl = 3;
    buttonSound.sprite = spr_Sound;
    buttonSound.onClick = muteButton;
    addButton(buttonSound);

    // Dev Buttons
    // Open Gravestones
    let buttonGrave = new Button(width - 66, 80, 48, 48);
    buttonGrave.fill = "rgb(50, 60, 20)";
    buttonGrave.onClick = openGravestones;
    addButton(buttonGrave);

    // Open Gravestones
    let buttonRat = new Button(width - 66, 140, 48, 48);
    buttonRat.fill = "rgb(70, 60, 50)";
    buttonRat.onClick = createRats;
    addButton(buttonRat);

    // Bonus Level
    let buttonBonus = new Button(width - 66, 198, 48, 48);
    buttonBonus.fill = "rgb(255, 150, 150)";
    buttonBonus.onClick = function () { bonusRoomCreate(level); }
    addButton(buttonBonus);







    // Rain Starting

    if (Math.random() < 0.25) {
        rain = new Rain(10, Math.PI / 2, 10);
    }



    // Organizing Drawnable Objects by Depth
    sortDrawnable();

    state = loadScreen;
}
// Helper functions
function gameRestart() {
    // Restarts Score
    score = 0;
    newhighscore = false;

    // Persistent Power Ups
    playerHatDuration = 0;
    playerHat = 0;
    playerRats = 0;

    // Creates room of the level 1
    roomCreate(1);
}

function nextLevel() {

    // Difficulty Add
    if (level % 2 == 0 && !bonus) {
        bonusRoomCreate(level);
    } else {
        if (level + 1 < 10) {
            roomCreate(level + 1);
        } else {
            gameOver();
        }
    }
}






function gameOver() {
    // Gameover Text
    var textInst = new TextExtraObject(width / 2, -400, "GAME OVER");
    textInst.gacc = 0.4;
    textInst.ground = height / 2;
    textInst.font = "Bold 80px Fixedsys";
    textInst.align = "center";
    textInst.color = "rgb(255, 255, 255)";

    textObjects.push(textInst);


    deathMusic = false;

    gameover = true;
    levelState = 2;

    trackPlaying.pause();
    trackPlaying.currentTime = 0;


    if (newhighscore) {
        highscoreUpdate();
    }

}




function levelFinish() {
    // Next Level Text

    var textInst = new TextExtraObject(width / 2, -400, "LEVEL CLEARED");
    textInst.gacc = 0.4;
    textInst.ground = height / 2;
    textInst.font = "Bold 80px Fixedsys";
    textInst.align = "center";
    textInst.color = "rgb(200, 255, 200)";

    textObjects.push(textInst);

    won = true;
    levelState = 1;
    winTimer = (surviMarch.duration * 1000) + 6000;

    trackPlaying.pause();
    trackPlaying.currentTime = 0;
    surviMarch.play();
}



// Event Handlers
canvas.addEventListener("mousemove", function (event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
});

canvas.addEventListener("mousedown", function (event) {
    mouseState[event.button] = true;
    mouseClick = true;
});

canvas.addEventListener("mouseup", function (event) {
    mouseState[event.button] = false;
    mouseRelease = true;
});


document.addEventListener('keydown', function (event) {
    input.keyState[event.keyCode][0] = true;
});

document.addEventListener('keyup', function (event) {
    input.keyState[event.keyCode][0] = false;
});

document.addEventListener('keypress', function (event) {
    input.keyState[event.keyCode][1] = true;
});






document.addEventListener("visibilitychange", function (event) {
    if (document.visibilityState == "visible") {
        // When page is visible set time to time before pause
        pauseTime = (new Date()) - pauseTime;

        // Play all sounds that were paused
        let soundsStateLen = soundsState.length;
        for (let i = 0; i < soundsStateLen; i++) {
            soundsState[i].play();
        }
        soundsState = [];
        pageFocused = true;
    } else {
        // Saves time before pausing
        pauseTime = new Date();

        // Pauses all sounds currently playing
        for (let i = 0; i < soundsArr.length; i++) {
            let soundI = soundsArr[i];
            if (soundI.currentTime != 0 && !soundI.paused) {
                soundI.pause();
                soundsState.push(soundI);
            }
        }

        pageFocused = false;
    }
});



function Button(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.sprite = null;
    this.fill = "rgb(100, 100, 20)";
    this.onClick = null;
    this.imgX = 0;
    this.scl = 1;
    this.flip = false;
    this.boundBox = new BoundBox(0, 0, this.w, this.h);

    this.active = true;

    this.z = 10000;

    this.clicked = false;

    this.getBound = function () {
        let bound = this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
        return bound;
    }

    this.show = function () {
        if (this.sprite) {
            let xscl = this.scl;
            if (this.flip) {
                xscl *= -1;
            }
            this.sprite.drawFix(this.x, this.y, this.imgX, 0, xscl, this.scl, 0, this.sprite.width / 2, this.sprite.height / 2, 0, 0);
        } else {
            ctx.fillStyle = this.fill;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }

        //this.getBound().show(0, 0);
    }

    this.update = function () {
        this.clicked = false;
        if (click) {
            if (!buttonClick) {
                if (pointInBound(mouseX, mouseY, this.getBound())) {
                    if (this.onClick) {
                        this.onClick();
                        buttonClick = true;
                        blip.currentTime = 0;
                        blip.play();
                    }
                    this.clicked = true;
                }
            }
        }
    }
}





function getHoverGravestone() {
    let maxZ = 0;
    let gravIndex = -1;
    let gravLength = gravestones.length;

    for (let i = 0; i < gravLength; i++) {
        if (gravestones[i].pointInside(mouseX, mouseY)) {
            let gravZ = gravestones[i].z;
            if (maxZ < gravZ) {
                gravIndex = i;
                maxZ = gravZ;
            }
        }
    }

    return gravIndex;
}

function randomRange(min, max) {
    return (Math.random() * (max - min)) + min;
}

function clamp(val, min, max) {
    if (val < min) {
        return min;
    }

    if (val > max) {
        return max;
    }

    return val;
}

function gravestoneCheck() {
    let len = gravestones.length;
    allSouls = true;
    for (let i = 0; i < len; i++) {
        let grav = gravestones[i];
        if (!grav.opened) {
            if (!grav.broken) {
                return false;
            }
            allSouls = false;
        }
    }

    return true;
}

function fixNumber(num, digits) {
    num = num.toString();
    return num.length < digits ? fixNumber("0" + num, digits) : num;
}

function sortDrawnable() {
    drawnableObjects.sort(function (a, b) {
        if (a.z > b.z) return 1;
        if (a.z < b.z) return -1;
        return 0;
    });
}

function addDrawnable(obj) {
    drawnableObjects.push(obj);
    sortDrawnable();
}

function addObj(obj) {
    gridObjects.push(obj);

    drawnableObjects.push(obj);
    sortDrawnable();
}

function addPoints(points, x, y) {
    textObjects.push(new TextObject(x, y, "" + points));
    score += points;
    // Highscore stuff
    if (score > highscore) {
        highscore = score;
        newhighscore = true;
    }
}

function addButton(obj) {
    buttomObjects.push(obj);

    drawnableObjects.push(obj);
    sortDrawnable();
}

function addText(text, x, y) {
    textObjects.push(new TextObject(x, y, text));
}

function sign(val) {
    if (val > 0) return 1;
    if (val < 0) return -1;
    return 0;
}











function rectIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (x1 > x4 || x2 < x3 || y1 > y4 || y2 < y3) {
        return false;
    }
    return true;
}

function pointInRect(x, y, x1, y1, x2, y2) {
    if (x > x1 && x < x2 && y > y1 && y < y2) {
        return true;
    }
    return false;
}

function pointInBound(x, y, box1) {
    return pointInRect(x, y, box1.x1, box1.y1, box1.x2, box1.y2);
}

function boundIntersect(box1, box2) {
    let x1 = box1.x1, y1 = box1.y1, x2 = box1.x2, y2 = box1.y2, x3 = box2.x1, y3 = box2.y1, x4 = box2.x2, y4 = box2.y2;
    if (x1 > x4 || x2 < x3 || y1 > y4 || y2 < y3) {
        return false;
    }
    return true;
}





function highscoreUpdate() {
    var scoreSendData = { userId: "", score: "", chatId: "", messageId: "", inlineMessageId: "" };

    let searchParameters = new URLSearchParams(window.location.search);
    let str = searchParameters.get("userId");
    if (str != "" && str != null) {
        let arr = str.split("_");
        scoreSendData.userId = arr[0];
        scoreSendData.chatId = arr[1];
        scoreSendData.messageId = arr[2];
        scoreSendData.inlineMessageId = arr[3];
        scoreSendData.score = (score * 100) + level;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "scoreUpdate.php", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(scoreSendData));
    }
}



function browserScaling() {
    // View scaling
    let windW = Math.min(window.innerWidth, window.screen.availWidth);
    let windH = Math.min(window.innerHeight, window.screen.availHeight);

    let horizontalUpdate = (windW > windH) ? true : false;

    if (horizontal != horizontalUpdate) {
        horizontal = horizontalUpdate;

        if (fromTelegram) {
            if (horizontal) {
                document.getElementById("view").setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=0.4, user-scalable=no");
            } else {
                document.getElementById("view").setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=0.3, user-scalable=no");
            }
        } else {
            let viewScale = 1;

            let canvW = 1280;
            let canvH = 720;

            let wRat = windW / windH;
            let cRat = canvW / canvH;
            if (horizontal) {
                if (wRat > cRat) {
                    viewScale = (windH / canvH);
                } else {
                    viewScale = (windW / canvW);
                }
                document.getElementById("view").setAttribute("content", "width=device-width, initial-scale=" + (viewScale + 0.1) + ", maximum-scale=" + viewScale + ", user-scalable=no");
            } else {
                if (wRat > cRat) {
                    viewScale = (windH / canvH);
                } else {
                    viewScale = (windW / canvW);
                }
                document.getElementById("view").setAttribute("content", "width=device-width, initial-scale=" + (viewScale + 0.1) + ", maximum-scale=" + viewScale + ", user-scalable=no");
            }
        }
    }


    // Canvas position update
    canvas.style.left = ((window.innerWidth - width) / 2) + "px";
    canvas.style.top = ((window.innerHeight - height) / 2) + "px";
}
