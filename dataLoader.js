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

let vol = 0.01;

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



// Loading sprite
var imgGhostBody  = new Image();
imgGhostBody.src  = "sprites/Ghost Body.png";

var ghostSheet = new Image();
ghostSheet.src = "sprites/Ghost Feet Sheet.png";

var imgGhosty     = new Image();
imgGhosty.src     = "sprites/Ghost Icon.png";
var spr_Ghosty = new Sprite(imgGhosty, 16, 16, 0, 0);

var nonPlayerSheet = new Image();
nonPlayerSheet.src = "sprites/nonActualPlayer.png";
var spr_Player     = new Sprite(nonPlayerSheet, 16, 16, 0, 0);

var gravestoneSheet = new Image();
gravestoneSheet.src = "sprites/Gravestone.png";
var spr_Gravestone  = new Sprite(gravestoneSheet, 19, 19, 0, 0);

var flowerSheet     = new Image();
flowerSheet.src     = "sprites/Flower.png";
var spr_Flower      = new Sprite(flowerSheet, 9, 13, 4, 0);

var ratSheet   = new Image();
ratSheet.src   = "sprites/rat.png";
var spr_Rat    = new Sprite(ratSheet, 16, 7, 8, 0);

var deathSheet = new Image();
deathSheet.src = "sprites/Death Sprite Sheet.png";
var spr_Death  = new Sprite(deathSheet, 32, 32, 16, 16);

var dustSheet  = new Image();
dustSheet.src  = "sprites/Dust.png";
var spr_Dust = new Sprite(imgGhosty, 16, 16, 0, 0);
dustSheet.onload = function(){spr_Dust = new Sprite(dustSheet, 16, 16, 8, 8);}


var itemSheet  = new Image();
itemSheet.src  = "sprites/Items.png";
var spr_Items  = new Sprite(itemSheet, 16, 16, 8, 8);

var imgSpeedIcon     = new Image();
imgSpeedIcon.src     = "sprites/Speed Icon.png";
var spr_SpeedIcon = new Sprite(imgSpeedIcon, 16, 16, 0, 0);

var tutorialSheet = new Image();
tutorialSheet.src = "sprites/tutorial.png";
var spr_Tutorial  = new Sprite(tutorialSheet, 17, 17, 0, 0);



var backPropImg  = new Image();
backPropImg.src  = "sprites/backgroundProps.png";
var spr_Tiles    = new Sprite(backPropImg, 16, 16, 8, 8);
backPropImg.onload = function(){spr_Tiles    = new Sprite(backPropImg, 16, 16, 8, 8);}



var imgSoundIcon    = new Image();
imgSoundIcon.src    = "sprites/soundIcon.png"
var spr_Sound    = new Sprite(imgSoundIcon, 16, 16, 0, 0);

var imgArrowButton  = new Image();
imgArrowButton.src  = "sprites/arrowButton.png";
var spr_arrowButton = new Sprite(imgArrowButton, 9, 16, 0, 0);

var spotImg      = new Image();
spotImg.src      = "sprites/Spot.png";
var spr_Spot     = new Sprite(spotImg, 16, 8, 8, 4);

var coinImg      = new Image();
coinImg.src      = "sprites/Coins.png";
var spr_Coin     = new Sprite(coinImg, 16, 16, 0, 0);

var exclImg      = new Image();
exclImg.src      = "sprites/exclamation.png";
var spr_Excl     = new Sprite(exclImg, 16, 16, 0, 0);

var friendImg    = new Image();
friendImg.src    = "sprites/Friend Icon.png";
var spr_Friend   = new Sprite(friendImg, 16, 16, 8, 8);

var fenceImg     = new Image();
fenceImg.src     = "sprites/fence sheet.png";
var spr_Fence    = new Sprite(fenceImg, 16, 16, 0, 0);


