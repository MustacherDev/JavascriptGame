// Canvas context
var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

canvas.style.left = ((window.innerWidth - width)/2)+"px";
canvas.style.top  = ((window.innerHeight - height)/2)+"px";
canvas.style.position = "absolute";

// Anti-alising deactivator
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;



// Sprite OBJECT
function Sprite(img, wid, hei, xoff, yoff){
  this.img = img;

  this.width = wid;
  this.height = hei;
  this.xoffset = xoff;
  this.yoffset = yoff;

  this.imgNumX = img.width/wid;
  this.imgNumY = img.height/hei;

  this.imgNum = this.imgNumX*this.imgNumY;
  this.drawSimple = function(x, y, imgx, imgy, scl){
    ctx.drawImage(this.img, imgx*this.width, imgy*this.height, this.width, this.height, x-this.xoffset, y-this.yoffset, this.width*scl, this.height*scl);
  }


  this.draw = function(x, y, imgx, imgy, xscl, yscl, centerTransform){
    // Centralizing Transformations
    let centerTrnsf = centerTransform || false;

    let offx = this.xoffset;
    let offy = this.yoffset;
    if(centerTrnsf){
      offx = this.width/2;
      offy = this.height/2;
    }

    // Actual Transformations
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(xscl, yscl);

    ctx.drawImage(this.img, imgx*this.width, imgy*this.height, this.width, this.height, -offx, -offy, this.width, this.height);

    ctx.restore();
  }

  this.drawRot = function(x, y, imgx, imgy, xscl, yscl, ang, centerTransform){
    // Centralizing Transformations
    let centerTrnsf = centerTransform || false;

    let offx = this.xoffset;
    let offy = this.yoffset;
    if(centerTrnsf){
      offx = this.width/2;
      offy = this.height/2;
    }

    // Actual Transformations
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(xscl, yscl);
    ctx.rotate(ang);

    ctx.drawImage(this.img, imgx*this.width, imgy*this.height, this.width, this.height, -offx, -offy, this.width, this.height);

    ctx.restore();
  }

  this.drawFix = function(x, y, imgx, imgy, xscl, yscl, ang, transfX, transfY, offSetX, offSetY){
    // Centralizing Transformations

    let transX = transfX;
    let transY = transfY;

    let offx = (-offSetX + transX)*Math.abs(xscl);
    let offy = (-offSetY + transY)*Math.abs(yscl);

    // Actual Transformations
    ctx.save();
    ctx.translate(x + offx, y + offy);
    ctx.scale(xscl, yscl);

    if(ang != 0){
      ctx.rotate(ang);
    }

    ctx.drawImage(this.img, imgx*this.width, imgy*this.height, this.width, this.height, -transX, -transY, this.width, this.height);

    ctx.restore();
  }
}





/// SOUND AND TEXTURES LOADER

// Loading Sounds
var soundsArr = [];
var soundsState = [];

var ghostTrack = new Audio("audio/Death Issues.mp3");
soundsArr.push(ghostTrack);

var hit        = new Audio("audio/Hit.mp3");
hit.volume = 0.5;
soundsArr.push(hit);

var blip       = new Audio("audio/BlipSoft.mp3");
blip.volume = 0.1;
soundsArr.push(blip);

var warn       = new Audio("audio/Warn.mp3");
soundsArr.push(warn);

var scythe1    = new Audio("audio/Scythe.wav");
var scythe2    = new Audio("audio/Scythe 2.wav");
scythe1.volume = 0.6;
scythe2.volume = 0.6;
soundsArr.push(scythe1);
soundsArr.push(scythe2);

var pickitem   = new Audio("audio/Pick Item.mp3");
pickitem.volume = 0.5;
soundsArr.push(pickitem);

var explosion  = new Audio("audio/Explosion.mp3");
explosion.volume = 0.8;
var bombfuse   = new Audio("audio/Bomb Fuse.mp3");
soundsArr.push(explosion);
soundsArr.push(bombfuse);

var deathMarch = new Audio("audio/Death March.mp3");
var surviMarch = new Audio("audio/Survival March.mp3");
soundsArr.push(deathMarch);
soundsArr.push(surviMarch);

var crickets1   = new Audio("audio/Crickets 1.mp3");
var crickets2   = new Audio("audio/Crickets 2.mp3");
var crickets3   = new Audio("audio/Crickets 3.mp3");

let vol = 0.04;

crickets1.volume = vol;
crickets2.volume = vol;
crickets3.volume = vol;
soundsArr.push(crickets1);
soundsArr.push(crickets2);
soundsArr.push(crickets3);

var snd_ratHit  = new Audio("audio/ratHit.mp3");
var snd_powerUp = new Audio("audio/powerup.mp3");
soundsArr.push(snd_ratHit);
soundsArr.push(snd_powerUp);

var snd_deathTemptation = new Audio("audio/Death Temptation.mp3");
soundsArr.push(snd_deathTemptation);

var snd_perfect = new Audio("audio/PerfectRun.mp3");
snd_perfect.volume = 0.6;
soundsArr.push(snd_perfect);

var snd_squeak = new Audio("audio/squeak.mp3");
snd_squeak.volume = 0.6;
soundsArr.push(snd_squeak);


var need2Load = 20;
var dataLoaded = 0;
var allDataIsLoaded = false;

var spr_Ghosty;
var spr_Player;
var spr_Gravestone;
var spr_Flower;
var spr_Rat;
var spr_Death;
var spr_Dust;
var spr_Items;
var spr_SpeedIcon;
var spr_Tutorial;
var spr_Tiles;
var spr_Sound;
var spr_ArrowButton;
var spr_Spot;
var spr_Coin;
var spr_Excl;
var spr_Friend;
var spr_Fence;

function createSprites(){
  spr_Ghosty = new Sprite(imgGhosty, 16, 16, 0, 0);
  spr_Player = new Sprite(nonPlayerSheet, 16, 16, 0, 0);
  spr_Gravestone = new Sprite(gravestoneSheet, 19, 19, 0, 0);
  spr_Flower = new Sprite(flowerSheet, 9, 13, 4, 0);
  spr_Rat = new Sprite(ratSheet, 16, 7, 8, 0);
  spr_Death = new Sprite(deathSheet, 32, 32, 16, 16);

  spr_Dust = new Sprite(dustSheet, 16, 16, 0, 0);
  spr_Items = new Sprite(itemSheet, 16, 16, 8, 8);
  spr_SpeedIcon = new Sprite(imgSpeedIcon, 16, 16, 0, 0);
  spr_Tutorial = new Sprite(tutorialSheet, 17, 17, 0, 0);
  spr_Tiles = new Sprite(backPropImg, 16, 16, 8, 8);
  spr_Sound = new Sprite(imgSoundIcon, 16, 16, 0, 0);

  spr_ArrowButton = new Sprite(imgArrowButton, 9, 16, 0, 0);
  
  spr_Spot = new Sprite(spotImg, 16, 8, 8, 4);

  spr_Coin = new Sprite(coinImg, 16, 16, 0, 0);

  spr_Excl = new Sprite(exclImg, 16, 16, 0, 0);

  spr_Friend = new Sprite(friendImg, 16, 16, 8, 8);

  spr_Fence = new Sprite(fenceImg, 16, 16, 0, 0);

}

function testLoad() {
    dataLoaded++;
    if (dataLoaded >= need2Load) {
        allDataIsLoaded = true;
    }
}

// Loading sprite
var imgGhostBody  = new Image();
imgGhostBody.onLoad = testLoad;
imgGhostBody.src = "sprites/Ghost Body.png";

var ghostSheet = new Image();
ghostSheet.onLoad = testLoad;
ghostSheet.src = "sprites/Ghost Feet Sheet.png";

var imgGhosty = new Image();
imgGhosty.onLoad = testLoad;
imgGhosty.src     = "sprites/Ghost Icon.png";


var nonPlayerSheet = new Image();
nonPlayerSheet.onLoad = testLoad;
nonPlayerSheet.src = "sprites/nonActualPlayer.png";


var gravestoneSheet = new Image();
gravestoneSheet.onLoad = testLoad;
gravestoneSheet.src = "sprites/Gravestone.png";


var flowerSheet = new Image();
flowerSheet.onLoad = testLoad;
flowerSheet.src = "sprites/Flower.png";



var ratSheet   = new Image();
ratSheet.onLoad = testLoad;
ratSheet.src = "sprites/rat.png";


var deathSheet = new Image();
deathSheet.onLoad = testLoad;
deathSheet.src = "sprites/Death Sprite Sheet.png";


var dustSheet  = new Image();
dustSheet.onLoad = testLoad;
dustSheet.src = "sprites/Dust.png";



var itemSheet  = new Image();
itemSheet.onLoad = testLoad;
itemSheet.src = "sprites/Items.png";

var imgSpeedIcon     = new Image();
imgSpeedIcon.onLoad = testLoad;
imgSpeedIcon.src = "sprites/Speed Icon.png";


var tutorialSheet = new Image();
tutorialSheet.onLoad = testLoad;
tutorialSheet.src = "sprites/tutorial.png";



var backPropImg  = new Image();
backPropImg.onLoad = testLoad;
backPropImg.src = "sprites/backgroundProps.png";

var imgSoundIcon    = new Image();
imgSoundIcon.onLoad = testLoad;
imgSoundIcon.src = "sprites/soundIcon.png";

var imgArrowButton  = new Image();
imgArrowButton.onLoad = testLoad;
imgArrowButton.src = "sprites/arrowButton.png";


var spotImg      = new Image();
spotImg.onLoad = testLoad;
spotImg.src = "sprites/Spot.png";

var coinImg      = new Image();
coinImg.onLoad = testLoad;
coinImg.src = "sprites/Coins.png";

var exclImg      = new Image();
exclImg.onLoad = testLoad;
exclImg.src = "sprites/exclamation.png";


var friendImg    = new Image();
friendImg.onLoad = testLoad;
friendImg.src = "sprites/Friend Icon.png";

var fenceImg     = new Image();
fenceImg.onLoad = testLoad;
fenceImg.src = "sprites/fence sheet.png";


function checkCompleteImages(){

if(!imgGhostBody.complete) return false;

if(!ghostSheet.complete) return false;

if(!imgGhosty.complete) return false;

if(!nonPlayerSheet.complete) return false;



if(!gravestoneSheet.complete) return false;

if(!flowerSheet.complete) return false;


if(!ratSheet.complete) return false;

if(!deathSheet.complete) return false;

if(!dustSheet.complete) return false;


if(!itemSheet.complete) return false;

if(!imgSpeedIcon.complete) return false;


if(!tutorialSheet.complete) return false;

if(!backPropImg.complete) return false;

if(!imgSoundIcon.complete) return false;

if(!imgArrowButton.complete) return false;

if(!spotImg.complete) return false;

if(!coinImg.complete) return false;

if(!exclImg.complete) return false;


if(!friendImg.complete) return false;

if(!fenceImg.complete) return false;

return true;

}