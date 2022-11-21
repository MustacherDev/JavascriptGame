/// Objects Script

function BoundBox(x1, y1, x2, y2){
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;

  this.show = function(x, y){
    ctx.strokeStyle = "rgb(100, 100, 0)";
    ctx.strokeRect(x+x1, y+y1, x2-x1, y2-y1);
  }

  this.translate = function(x, y){
    return new BoundBox(this.x1 + x, this.y1 + y, this.x2 + x, this.y2 + y);
  }

  this.scale = function(x, y){
    return new BoundBox(this.x1 * x, this.y1 * y, this.x2 * x, this.y2 * y);
  }

  this.swapX = function(){
    return new BoundBox(this.x2, this.y1, this.x1, this.y2);
  }
}

function Tile(x, y, sprite, scl, imgX, imgY){
  this.x = x;
  this.y = y;
  this.scl = scl;
  this.sprite = sprite;
  this.imgX = imgX;
  this.imgY = imgY;

  this.facing = sign(Math.random() - 0.5);

  this.show = function(){
    this.sprite.draw(this.x, this.y, this.imgX, this.imgY, this.scl*this.facing, this.scl);
  }
}

function Particle(x, y, sprite, scale, speed, direction, life, animate, imgY){
  this.maxLife = life;
  this.life = life;
  this.x = x;
  this.y = y;
  this.z = 0;
  this.spd = speed;
  this.dir = direction;
  this.hspd =  Math.cos(this.dir)*this.spd;
  this.vspd = -Math.sin(this.dir)*this.spd;
  this.gravity = 0;
  this.fade = false;
  this.fadeLife = this.life;

  this.frames = 0;

  this.sprite = sprite;
  this.imgX = Math.floor(Math.random()*(this.sprite.imgNumX/2));
  this.imgY = imgY;
  this.initImg = this.imgX;
  this.scl = scale;

  this.xscl = this.scl;
  this.yscl = this.scl;

  this.animate = animate;

  this.active = true;

  this.show = function(){
    this.frames++;
    if(this.animate){
      this.imgX = ((Math.floor(this.frames/10) + this.initImg) % this.sprite.imgNumX);
    }
    ctx.save();
    if(this.fade){
      if(this.life < this.fadeLife){
        ctx.globalAlpha = (this.life)/(Math.max(this.fadeLife, 1));
      } else {
        ctx.globalAlpha = 1;
      }
    }
      this.sprite.drawFix(this.x, this.y, this.imgX, this.imgY, this.xscl, this.yscl, 0, this.sprite.width/2, this.sprite.height/2, this.sprite.xoffset, this.sprite.yoffset);
    ctx.restore();

  }

  this.update = function(){
    this.x += this.hspd;
    this.y += this.vspd;

    this.vspd += this.gravity;

    this.life--;

    if(this.life <= 0){
      this.active = false;
    }
  }
}

function LineParticle(x, y, hspd, vspd, dir, ext, color, life){
  this.x = x;
  this.y = y;
  this.z = 0;

  this.hspd = hspd;
  this.vspd = vspd;

  this.ext = ext;
  this.x1 = this.x-ext*Math.cos(dir);
  this.y1 = this.y-ext*Math.sin(dir);

  this.life = life;
  this.maxLife = this.life;
  this.active = true;

  this.color = color;

  this.show = function(){
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    let alph = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(this.life*2/this.maxLife, 1);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }

  this.update = function(){
    this.x += this.hspd;
    this.y += this.vspd;
    this.x1 += this.hspd;
    this.y1 += this.vspd;

    this.life--;

    if(this.life < 0){
      this.active = false;
    }
  }
}

function TextObject(x, y, text){
  this.x = x;
  this.y = y;
  this.text = text;
  this.active = true;
  this.timer  = 40;

  this.update = function(){
    this.y -= 1;
    this.timer--;

    if(this.timer == 0){
      this.active = false;
    }
  }

  this.show = function(){
    ctx.font = "20px Fixedsys";

    let hue = Math.random()*360;
    ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
    ctx.fillText(this.text, this.x + 2, this.y + 2);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(this.text, this.x, this.y);
  }
}

function TextExtraObject(x, y, text){
  this.x = x;
  this.y = y;
  this.vspd = 0;
  this.hspd = 0;

  this.gacc = 0;
  this.ground = 0;

  this.text = text;
  this.font = "40px Fixedsys";
  this.color = "rgb(255, 255, 255)";
  this.align = "center";

  this.active = true;
  this.timer  = -1;

  this.update = function(){
    if(this.y > this.ground){
      this.vspd *= -0.25;
      this.y = this.ground;
    } else {
      this.vspd += this.gacc;
    }

    this.vspd = clamp(this.vspd, -25, 25);

    this.y += this.vspd;
    this.x += this.hspd;

    this.timer--;

    if(this.timer == 0){
      this.active = false;
    }
  }

  this.show = function(){
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;

    ctx.fillText(this.text, this.x, this.y);
  }
}

// Item Object
function ItemObject(id, x, y, z){
  this.id = id;
  this.x = x;
  this.y = y;

  this.ground = y;
  this.active = true;
  this.imunityTimer = 35;
  this.maxLife = 500;
  this.life = this.maxLife;
  this.fadeLife = 100;

  this.points = 0;
  switch(this.id){
    case 0:
      this.points = 0;
      this.fadeLife = 1;
      break;

    case 1:
      this.points = 4000;
      break;

    case 2:
      this.points = 500;
      break;

    case 3:
      this.points = 300;
      break;

    case 4:
      this.points = 1000;
      break;

    case 5:
      this.points = 400;
      break;
  }

  this.scl = 2.5;
  this.z = z;
  this.sprite = spr_Items;

  this.hspd = sign(Math.random()-0.5) * randomRange(4, 9);
  this.vspd = randomRange(-5, -2);
  this.angSpd = 0;
  if(this.id == 0){
    this.hspd = sign(Math.random()-0.5) * ((Math.random()*3) +3);
    this.angSpd = randomRange(0.2, 0.5)*sign(this.hspd);
  }

  this.angle = 0;

  this.frames = 0;
  this.boundBox = new BoundBox(-7, -7, 7, 7).scale(this.scl, this.scl);

  this.getBound = function(){
    return this.boundBox.translate(this.x, this.y);
  }

  this.collect = function(){
    // TODO Add sound

    addPoints(this.points, this.x + this.sprite.xoffset*this.scl, this.y);
    // If this is a coffee item add speed boost to player
    if(this.id == 3){
      player.spdBoostTimer = 150;
      snd_powerUp.currentTimer = 0;
      snd_powerUp.play();
      addText("+SPEED", this.x + this.sprite.xoffset*this.scl, this.y - 20);
    } else if(this.id == 4){
      player.hat += 1;
      playerHatDuration = 1;
      playerHat = player.hat;
      snd_powerUp.currentTimer = 0;
      snd_powerUp.play();
      addText("+LOOKS", this.x + this.sprite.xoffset*this.scl, this.y - 20);
    } else if(this.id == 5){
      player.goggles = true;
      snd_powerUp.currentTimer = 0;
      snd_powerUp.play();
      addText("+SIGHT", this.x + this.sprite.xoffset*this.scl, this.y - 20);
    } else {
      pickitem.play();
    }
    this.active = false;
  }

  this.explode = function(){
    this.active = false;
    explosion.play();
    let radius = 70;
    let xCenter = this.x;
    let yCenter = this.y;
    let exploBound = new BoundBox(xCenter - radius, yCenter - radius, xCenter + radius, yCenter + radius);

    // Player Bomb intersection
    if(boundIntersect(exploBound, player.getBound())){
      let xPCenter = player.x + player.xOffset;
      let yPCenter = player.y + player.yOffset;
      let pRad  = (player.sprite.width*player.scl)/2.5;

      let dx = xPCenter - xCenter;
      let dy = yPCenter - yCenter;
      let sqrDist = dx*dx + dy*dy;

      if(sqrDist < (radius + pRad)*(radius + pRad)){
        let dist = Math.sqrt(sqrDist);

        let hImpulse = (6*dx/dist);
        let vImpulse = (6*dy/dist);

        player.hit(hImpulse, vImpulse, "kill");
      }
    }


    // Rat Bomb intersection
    for(let i = 0; i < rats.length; i++){
      let rat = rats[i];
      if(boundIntersect(exploBound, rat.getBound())){
        let ratRad  = (rat.sprite.width*rat.scl/2);

        let dx = rat.x - xCenter;
        let dy = rat.y - yCenter;
        let sqrDist = dx*dx + dy*dy;

        if(sqrDist < (radius + ratRad)*(radius + ratRad)){
          rat.hit();
        }
      }
    }

    view.screenShake(15);

    for(let i = 0; i < 8; i++){
      let part = new Particle(this.x + randomRange(-16, 16)*this.scl, this.y + randomRange(-16, 16)*this.scl, spr_Dust, 4, Math.random() + 1.5, Math.random()*Math.PI*2, randomRange(30, 50), true, 0);
      part.fade = true;
      part.fadeLife = part.life/2;
      particles.push(part);
    }
  }

  this.show = function(){
    this.frames++;

    let imgY = this.id;
    let imgX = (Math.floor(this.frames/6)) % 4;
    if(this.id == 0){
      this.sprite.drawRot(this.x, this.y, imgX, imgY, this.scl, this.scl, this.angle, true);
    } else {
      ctx.save();
      ctx.globalAlpha = Math.min(1, (this.life/this.fadeLife));
      this.sprite.draw(this.x, this.y, imgX, imgY, this.scl, this.scl);
      ctx.restore();
    }
  }

  this.update = function(){

    this.x += this.hspd;
    this.y += this.vspd;
    this.angle += this.angSpd;

    this.vspd += 0.2;
    this.angSpd *= 0.95;

    // Y Boundary Bounce
    if(this.y-this.sprite.yoffset*this.scl > this.ground){
      this.y = this.ground+this.sprite.yoffset*this.scl;
      this.vspd *= -0.6;
      if(Math.abs(this.vspd) < 0.3){
        this.vspd = 0;
      }
    }

    // X Boundary Bounce
    if(this.x > width-(14*this.scl)){
      this.x = width-(14*this.scl);
      this.hspd *= -1;
    }

    if(this.x < 0){
      this.x = 0;
      this.hspd *= -1;
    }

    this.imunityTimer--;

    // Bomb expansion
    if(this.id == 0){
      if(this.frames == 20){
        bombfuse.play();
      }
      if(this.frames > 50){
        this.scl += 0.05;
        let posCompensation = 0.05*8;
        this.y -= posCompensation;
        if(this.frames > 80){
          this.explode();
          bombfuse.pause();
          bombfuse.currentTime = 0;
        }
      }
    } else {
      this.life--;
      if(this.life < this.fadeLife){
        this.scl -= 0.01;
        let posCompensation = 0.01*16;
        this.y -= posCompensation;
        if(this.life <= 0){
          this.active = false;
        }
      }
    }


    this.hspd *= 0.95;
  }
}

/// Ghosty Object
function Ghosty(x, y){
  this.x = x;
  this.y = y;
  this.hspd = 0;
  this.vspd = 0;
  this.frames = 0;
  this.active = true;
  this.xAt = 0;
  this.yAt = 0;
  this.xxAt = 0;
  this.yyAt = 0;

  this.scl = 2;

  this.show = function(){
    this.frames++;
      ctx.drawImage(ghosty, 0, 0, 16, 16, this.x, this.y + (Math.sin(this.frames/10)*8),  16*this.scl, 16*this.scl);
  }

  this.update = function(){
    // Ghosty Stuff Probably should separate it into different
    if(this.active){
      if(finishingLevel){
        if(this.attached){
          this.xxAt += this.hspd + randomRange(-3, 3);
          this.yyAt += this.vspd + randomRange(-3, 3);

          this.x = death.x + this.xAt + this.xxAt;
          this.y = death.y + this.yAt + this.yyAt;

          this.hspd += -2*(this.xxAt);
          this.hspd = clamp(this.hspd, -8, 8);

          this.vspd += -2*(this.yyAt);
          this.vspd = clamp(this.vspd, -8, 8);

          this.hspd *= 0.98;
          this.vspd *= 0.98;
        } else {
          let dx = death.x + death.xOffset - this.x;
          let dy = death.y + death.yOffset - this.y;

          let dist = dx*dx + dy*dy;

          // Scarying death
          if(dist < 400){
            death.ghostyAttached++;
            death.runningAway = true;
            death.attacking = false;
            this.attached = true;

            this.xAt = death.x - this.x;
            this.yAt = death.y - this.y;
          }

          this.hspd += 40*dx/dist;
          this.vspd += 40*dy/dist;

          this.hspd = clamp(this.hspd, -20, 20);
          this.vspd = clamp(this.vspd, -20, 20);

          this.hspd *= 0.98;
          this.vspd *= 0.98;

          this.x += this.hspd;
          this.y += this.vspd;

          if(this.x > width || this.x < -16*this.scl){
            this.active = false;
          }
        }
      }
    }
  }
}


function Spot(x,y,life){
  this.x = x;
  this.y = y;
  this.scl = 3;

  this.z = this.y;

  this.maxLife = life;
  this.life = life;

  this.active = true;

  this.sprite = spr_Spot;

  this.show = function(){
    this.life--;
    if(this.life <= 0){
      this.active = false;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0,this.life/this.maxLife);
    this.sprite.draw(this.x, this.y, 0, 0, this.scl, this.scl);
    ctx.restore();

  }
}


/// Player OBJECT

function Player(x, y){
  this.x = x;
  this.y = y;
  this.scl = 4.5;
  this.z = this.y + 8*this.scl;

  this.sprite = spr_Player;
  this.frames = 0;

  this.width  = 16*this.scl;
  this.height = 16*this.scl;

  this.boundBox = (new BoundBox(4, 2, 12, 14)).scale(this.scl, this.scl);

  this.spd  = 4;
  this.hspd = 0;
  this.vspd = 0;

  // Powerups
  this.spdBoost = 0;
  this.spdBoostTimer = 0;

  this.hat = 0;
  this.flowers = [];
  this.flowersUsed = 0;

  this.target = -1;
  this.targetX = this.y;
  this.targetY = this.x;

  // Following Rats
  this.list = [];

  this.targetSpot = null;

  this.xOffset = 8*this.scl;
  this.yOffset = 16*this.scl;

  this.moving = false;
  this.hidding = false;
  this.hidden = false;
  this.alive = true;
  this.deadTime = 0;
  this.offscreen = false;

  this.facing = 0;

  this.centerX = function(){
    return this.x + (this.sprite.width*this.scl/2);
  }

  this.centerY = function(){
    return this.y + (this.sprite.height*this.scl/2);
  }

  this.getCenter = function(){
    return {x:this.x + (this.sprite.width*this.scl/2), y:this.y + (this.sprite.height*this.scl/2)};
  }

  this.pickFlower = function(flowerType){
    if(this.flowers.length > 0){
      let flowerTexts = ["Another Flower", "FlOwEr", "It is indeed a flower", "So many flowers, where are the bees?", "Re wolf", "An other flower", "One more flower", "Why do these rats like flowers?", "A flower again", "More flowers!"];
      addText(flowerTexts[Math.floor(Math.random()*flowerTexts.length)], this.x + randomRange(-20, 20), this.y + randomRange(-20, -10));
    } else {
      addText("A Flower...", this.x + randomRange(-20, 20), this.y + randomRange(-20, -10));
    }
    this.flowers.push({x:randomRange(this.scl, this.sprite.width*this.scl), y:randomRange(-this.scl, this.scl), ang:randomRange(-Math.PI/4, Math.PI/4), type:flowerType});
  }

  this.setTarget = function(xx, yy, spd){
    this.target  = -1;
    this.targetX = xx;
    this.targetY = yy;

    this.moving = true;
    this.hidden = false;
    this.hidding = false;

    let xCenter = this.x + this.xOffset;
    let yCenter = this.y + this.yOffset;

    let dx = this.targetX - xCenter;
    let dy = this.targetY - yCenter;
    let dist = Math.sqrt(dx*dx + dy*dy);
    dx /= dist;
    dy /= dist;

    this.hspd = dx*spd;
    this.vspd = dy*spd;
  }

  this.getBound = function(){
    return this.boundBox.translate(this.x, this.y);
  }

  this.findPossibleFollower = function(){
    if(this.flowers.length > this.flowersUsed){
      for(let i = 0; i < rats.length; i++){
        let rat = rats[i];
        if(rat.following == false){
          let center = this.getCenter();
          let dx = rat.x - center.x;
          let dy = rat.y - center.y;

          if(Math.max(Math.abs(dx), Math.abs(dy)) < 200){
            this.addFollower(rat);
            this.flowersUsed++;
            i = rats.length;
          }
        }
      }
    }
  }

  this.addFollower = function(objectFollower){
    // Add object to follower list
    if(objectFollower){
      objectFollower.following = true;

      if(this.list.length == 0){
        objectFollower.target = this;
      } else {
        objectFollower.target = this.list[this.list.length -1];
      }

      this.list.push(objectFollower);
      playerRats++;
    }
  }

  for(let i = 0; i < playerRats; i++){
    let yRat = this.y + (i+1)*(this.sprite.height*this.scl);
    let newRat = new Rat(this.x, yRat);
    addDrawnable(newRat);
    rats.push(newRat);
    this.addFollower(newRat);
    playerRats--;
  }


  this.hit = function(hforc, vforc, damage){
    if(this.hat > 0){
      for(let i = 0; i < this.hat; i++){
        let part = new Particle(this.x+(this.sprite.width*this.scl/2), this.y - spr_Items.height/2 -(spr_Items.height*i*this.scl/2.2), spr_Items, this.scl/2, 6, randomRange(Math.PI/2.4, Math.PI -(Math.PI/2.4)), randomRange(40, 60), false, 4);
        part.gravity = 0.3;
        part.fade = true;
        part.fadeLife = part.life/2;
        particles.push(part);
      }
      this.hat = 0;
      playerHatDuration = 0;
      playerHat = 0;

      if(damage == "kill"){
        this.hspd += hforc;
        this.vspd += vforc;
        this.alive = false;
      }

    } else {
      this.hspd += hforc;
      this.vspd += vforc;
      this.alive = false;
    }
  }

  this.show = function(){
    this.frames++;

    let scl = this.scl;
    let imgX = 0;
    let imgY = this.facing;
    if(this.alive){
      // Setting The sprite location on sprite sheet
      if(this.moving){
        imgX = 1 + ((Math.floor(this.frames/5)) % (2));
      }
    } else {
      imgX = Math.min(Math.floor(this.deadTime/12), 2);
      imgY = 4;
      this.deadTime++;
    }
    this.sprite.draw(this.x, this.y, imgX, imgY, scl, scl);

    for(let i = 0; i < this.hat; i++){
      spr_Items.draw(this.x+(this.sprite.width*this.scl/2), this.y - (spr_Items.height/2) -(spr_Items.height*i*this.scl/2.2), 0, 4, this.scl/2, this.scl/2);
    }

    /*
    for(let i = 0; i < this.flowers.length; i++){
      let flower = this.flowers[i];
      spr_Flower.drawFix(this.x + flower.x, this.y + flower.y, flower.type, 2, this.scl/2, this.scl/2, flower.ang, 5, 3, 5, 3);
    }
    */
  }

  this.update = function(){

    this.findPossibleFollower();

    // Updating Follow Objects
    for(let i = this.list.length; i > 0; i--){
      let index = i-1;
      let obj = this.list[index];
      if(!obj.active){
        if(index != this.list.length-1){
          this.list[index+1].target = this.list[index].target;
        }
        this.list.splice(index, 1);
      }
    }

    if(this.alive){
      if(won){
        if(playerHatDuration == 0){
          if(this.hat > 0){
            this.hit(0, 0);
          }
        }
      }
      if(this.spdBoostTimer > 0){
        this.spdBoostTimer--;
        this.spd = 7;
      } else {
        this.spd = 4;
      }

      // Checking for items to collect
      let iLen = itemObjects.length;

      for(let i = 0; i < iLen; i++){
        let item = itemObjects[i];
        if(item.id != 0 && item.imunityTimer < 0){
          if(boundIntersect(this.getBound(), item.getBound())){
            item.collect();
          }
        }
      }

      iLen = flowers.length;
      for(let i = 0; i < iLen; i++){
        let flower = flowers[i];
        if(flower.cutted && !flower.collected){
          if(boundIntersect(this.getBound(), flower.getBoundPart())){
            flower.collect();
          }
        }
      }

      if(click && !buttonClick){

        let grvStn = -1;
        let canAccessGrave = false;
        buttonClick = true;
        if(hoverGravestone != -1){
          grvStn = gravestones[hoverGravestone];
          if(!grvStn.broken){
            canAccessGrave = true;
          }
        }

        levelEntering = false;

        if(canAccessGrave){
            if(this.target == grvStn && !grvStn.opened && !grvStn.broken && this.hidden){
              // Opening a gravestone
              grvStn.open();
              hit.play();
              death.playerNoise();
              view.screenShake(5);
            } else {
              // Hiding in a gravestone
              this.target  = grvStn;
              this.targetX = grvStn.x + 7*grvStn.scl;
              this.targetY = grvStn.y + 16*grvStn.scl;

              this.moving = true;
              this.hidden = false;
              this.hidding = true;
            }
        } else {
          this.target  = -1;
          this.targetX = mouseX;
          this.targetY = mouseY + 6;

          let dist = Math.hypot(this.x - this.targetX, this.y - this.targetY);

          if(this.targetSpot){
            this.targetSpot.active = false;
          }

          this.targetSpot = new Spot(this.targetX, this.targetY, (dist/this.spd));
          addDrawnable(this.targetSpot);

          this.moving = true;
          this.hidden = false;
          this.hidding = false;
        }

        let xCenter = this.x + this.xOffset;
        let yCenter = this.y + this.yOffset;

        let dx = this.targetX - xCenter;
        let dy = this.targetY - yCenter;
        let dist = Math.sqrt(dx*dx + dy*dy);
        dx /= dist;
        dy /= dist;

        this.hspd = dx*this.spd;
        this.vspd = dy*this.spd;

        // Facing setup
        this.facing = 0;
        if(Math.abs(this.hspd) > Math.abs(this.vspd)){
          if(this.hspd > 0){
            this.facing = 3;
          } else {
            this.facing = 2;
          }
        } else {
          if(this.vspd < 0){
            this.facing = 1;
          }
        }

      }

      if(this.moving){
        this.x += this.hspd;
        this.y += this.vspd;

        let xCenter = this.x + this.xOffset;
        let yCenter = this.y + this.yOffset;

        let dx = this.targetX - xCenter;
        let dy = this.targetY - yCenter;

        if((dx/this.hspd) < 1){
          levelEntering = false;
          this.facing = 0;
          this.moving = false;
          if(this.hidding){
            this.hidding = false;
            this.hidden = true;
          }
        }
      }
    } else {
      if(!gameover){
        gameOver();
      }

      // Corpse sliding effect
      this.moving = false;

      if(!this.offscreen){
        this.hspd *= 0.9;
        this.vspd *= 0.9;

        this.x += this.hspd;
        this.y += this.vspd;

        if(this.x < -16 || this.x > width || this.y < -16 || this.y > (height - (this.scl*6))){
          this.offscreen = true;
          this.x = width/2;
          this.y = -400;
        }
      } else {
        // Ground fall wiggle
        this.vspd += 0.2;
        this.y += this.vspd;

        if(this.y > height/2){
          this.vspd *= -0.25;
          this.y = height/2;
        }
      }
    }

    // Updating the z value
    this.z = this.y + 15*this.scl;
  }
}


/// Gravestone OBJECT

function Gravestone(x, y, type, content){
  this.x = x;
  this.y = y;

  this.type = type;
  this.broken = false;

  this.scl = 5;

  this.sprite = spr_Gravestone;
  this.yOffset = 16*this.scl;

  this.frames = 0;

  this.z = this.y + this.yOffset;

  this.highlight = false;

  this.opened = false;
  this.content = content;
  this.rat = false;

  this.active = true;

  this.partFinished = false;
  this.partX = this.x + (this.scl*this.sprite.width/2);
  this.partY = this.y + (this.scl*this.sprite.height/2);
  this.partAng = 0;
  this.partHspd = 0;
  this.partVspd = 0;

  this.boundBox = null;
  switch(type){
    case 0:
      this.boundBox = (new BoundBox(0, 1, 17, 18)).scale(this.scl, this.scl);
      break;

    case 1:
      this.boundBox = (new BoundBox(0, 1, 17, 18)).scale(this.scl, this.scl);
      break;

    case 2:
      this.boundBox = (new BoundBox(0, 1, 18, 18)).scale(this.scl, this.scl);
      break;
  }

  this.getBoundBox = function(){
    return this.boundBox.translate(this.x, this.y);
  }

  this.open = function(){
    this.opened = true;
    ghostyObjects.push(new Ghosty(this.x + 30, this.y - 40));
    ghostys++;
    if(this.content != "nothing"){
      let itemX = this.x + (this.sprite.width*this.scl)/2 + randomRange(-10, 10);
      let itemY = this.z - 42 + (Math.random()*10);
      let item  = new ItemObject(this.content, itemX, itemY, itemY + 10*this.scl);
      itemObjects.push(item);
      addDrawnable(item);
    }

    let rand = Math.random();
    if(rand < 0.1 || this.rat){
      let rat = new Rat(this.x + this.scl*4, this.y + (this.scl*10));
      rats.push(rat);
      addDrawnable(rat);
    }

    if(gravestoneCheck()){
        finishingLevel = true;
    }
  }

  this.break = function(hforce, vforce){
    this.broken = true;

    addPoints(300, this.x + (Math.random()*this.sprite.width), this.y + (Math.random()*this.sprite.height/2));
    this.partHspd = hforce;
    this.partVspd = vforce;

    if(gravestoneCheck()){
        finishingLevel = true;
    }
  }


  this.pointInside = function(x, y){
    let x1 = this.x + this.boundBox.x1;
    let x2 = this.x + this.boundBox.x2;
    let y1 = this.y + this.boundBox.y1;
    let y2 = this.y + this.boundBox.y2;

    if(x > x2 || x < x1 || y > y2 || y < y1) return false;
    return true;
  }

  this.show = function(){
    let scl = this.scl;
    let imgX = type;
    let imgY = 0;


    if(!this.broken){
      if(this.highlight){
        imgY = 1;
        this.highlight = false;
      }
    } else {
      imgY = 2;
    }

    this.sprite.draw(this.x, this.y, imgX, imgY, scl, scl);

    if((!this.partFinished) && this.broken){

      this.partVspd += 0.2;

      this.partX += this.partHspd;
      this.partY += this.partVspd;
      this.partAng += 0.2*sign(this.partHspd);
      this.sprite.drawRot(this.partX, this.partY, imgX, 3, scl, scl, this.partAng, true);

      if(this.partX > width+(this.sprite.width*this.scl) || this.partX < -(this.sprite.width*this.scl) || this.partY > height + (this.sprite.height*this.scl) || this.partY < -(this.sprite.height*this.scl)){
        this.partFinished = true;
      }
    }
  }
}



/// Flower OBJECT

function Flower(x, y, type){
  this.x = x;
  this.y = y;
  this.type = type;

  this.facing = sign(Math.random()-0.5);

  this.scl = 3;

  this.z = this.y + 12*this.scl;

  this.partX = this.x;
  this.partY = this.y;
  this.partAng  = 0;
  this.partHspd = 0;
  this.partVspd = 0;

  this.boundBox     = new BoundBox(-3, 0, 4, 13);
  this.boundBoxPart = new BoundBox(-3, 0, 4, 7 );

  this.sprite = spr_Flower;
  this.active = true;

  this.cutted = false;
  this.collected = false;

  this.collectCooldown = 30;

  this.collect = function(){
    if(!this.collected && this.collectCooldown <= 0){
      player.pickFlower(this.type);
      this.collected = true;
    }
  }

  this.cut = function(){
    this.cutted   = true;
    this.partX    = this.x;
    this.partY    = this.y;
    this.partAng  = 0;
    this.partHspd = randomRange(1, 3)*sign(Math.random()-0.5);
    this.partVspd = -randomRange(3, 5);
  }

  this.getBound = function(){
    return this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
  }

  this.getBoundPart = function(){
    return this.boundBoxPart.scale(this.scl, this.scl).translate(this.partX, this.partY);
  }

  this.show = function(){
    let imgX = this.type;
    let imgY = (this.cutted == true)?1:0;
    this.sprite.draw(this.x, this.y, imgX, imgY, this.scl*this.facing, this.scl);

    if(this.cutted && !this.collected){
      this.sprite.drawFix(this.partX, this.partY, imgX, 2, this.scl*this.facing, this.scl, this.partAng, 5, 3, 4, 0);
    }

    //this.getBoundPart().show(0,0);
    //this.getBound().show(0,0);
  }

  this.update = function(){
    if(this.cutted && !this.collected){
      this.partX += this.partHspd;
      this.partY += this.partVspd;

      this.partHspd *= 0.96;

      if(this.partY > this.y){
        if(this.partVspd > 0){
          this.partVspd -= 0.3;
        } else {
          this.partVspd *= 0.9;
        }
        this.partY = Math.min(this.partY, this.y+(5*this.scl));
      } else {
        this.partVspd += 0.2;
      }


      let dir = sign(this.partHspd);
      /*
      if(dir > 0){
        if(this.partAng > -Math.PI/2){
          this.partAng -= dir*0.2;
        }
      } else {
        if(this.partAng < Math.PI/2){
          this.partAng -= dir*0.2;
        }
      }
      */

      this.partAng -= ((this.partHspd/2) + (this.partVspd/10))/10;

      this.collectCooldown--;
    }
  }
}


/// Rat OBJECT
function Rat(x, y){
  this.x = x;
  this.y = y;
  this.hspd = 0;
  this.vspd = 0;
  this.spd = 7;

  this.scl = 3 + (Math.floor(randomRange(0, 12))/10);
  this.z = this.y + 3*this.scl;

  this.life = Math.floor(randomRange(200, 400));

  this.sprite = spr_Rat;

  this.targetX = 0;
  this.targetY = 0;

  this.idleTimer = 1;
  this.moving = false;
  this.following = false;
  this.target = null;

  this.moveDist = 60;

  this.timer = 0;

  this.boundBox = new BoundBox(-6, 2, 5, 6);

  this.facing = 0;
  this.active = true;
  this.leaving = false;

  this.alive = true;

  this.frames = 0;

  this.centerX = function(){
    return this.x;
  }

  this.centerY = function(){
    return this.y + (this.sprite.height*this.scl/2);
  }



  this.getBound = function(){
    return this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
  }


  this.getTarget = function(){
    // Sets the target
	// Only for following state
    if(this.target == -1 || this.target == null){
	  this.target = player;
    }


    let _dx = this.target.centerX() - this.centerX();
    let _dy = this.target.centerY() - this.centerY();

    // Checks if Object is distant enough from the target to start Moving
    // If too close the object simply doesn't move
    if(Math.max(Math.abs(_dx), Math.abs(_dy)) > this.moveDist){
   	  // Setting up Direction and Radius
	  let dir = Math.random()*Math.PI*2;
	  let radMin = 20;
	  let radMax = 40;
	  let xdir = Math.cos(dir);
	  let ydir = Math.sin(dir);

	  // Random Radius
	  let randomRad = randomRange(radMin, radMax);

	  // Updating target
	  this.targetX = this.target.x + (xdir*randomRad);
	  this.targetY = this.target.y + (ydir*randomRad);

	  let dx = this.targetX - this.x;
	  let dy = this.targetY - this.y;
	  let dist = Math.sqrt(dx*dx + dy*dy);

	  // Checks if distance is zero
	  // Because we don't want to be dividing
	  // by zero
	  if(dist != 0){
	    this.hspd = this.spd*dx/dist;
	    this.vspd = this.spd*dy/dist;
	    this.moving = true;
	    this.idleTimer = Math.floor(randomRange(100, 160));
	  } else {
	    this.hspd = 0;
	    this.vspd = 0;
	    this.moving - false;
	  }
    }

	// Facing update
    if(this.hspd != 0){
      this.facing = sign(this.hspd);
    }
  }



  this.hit = function(){
    this.alive = false;
    let part = new Particle(this.x, this.y, spr_Rat, this.scl, 6, Math.PI/3, 100, false, 0);
    part.gravity = 0.4;
    part.fade = true;
    part.fadeLife = part.life/2;
    part.initImg = (this.facing == 1)?0:1;
    part.yscl *= -1;
    particles.push(part);

    snd_ratHit.currentTime = 0;
    snd_ratHit.play();
    addPoints(100, this.x, this.y);
    this.active = false;
  }

  this.show = function(){
    this.frames++;
    let imgY = 0;
    let imgX = 0;
    if(this.idleTimer > 0){
      imgY = (Math.floor(this.frames/30))%3;
    } else {
      imgY = (Math.floor(this.frames/4))%3;
    }

    this.sprite.draw(this.x, this.y, imgX, imgY, this.scl*this.facing, this.scl, true);
    if(this.following){
      ctx.fillStyle = "rgb(200, 100, 0)";
      //ctx.fillRect(this.x, this.y-20, 10, 10);
      spr_Friend.draw(this.x, this.y-(this.scl*8) + (Math.sin(this.frames/15)*this.scl*2), 0, 0, this.scl/2, this.scl/2);
      //spr_Flower.drawFix(this.x, this.y+(this.scl*2), 0, 2, this.scl*this.facing, this.scl, 0, 5, 3, 0, 0);
    }
  }

  this.update = function(){

	  if(!this.following){
		if(this.idleTimer > 0){
		  // If idle
		  this.idleTimer--;

		  // Last idle Frame
		  if(this.idleTimer == 0){
			// Sets target position
			let rand = Math.random();

			// Chooses between heading towards a flower
			// or a random position
			if(rand < 0.3){
			  // Chooses a flower to go
			  let randFlower = flowers[Math.floor(Math.random()*flowers.length)];
			  // Checks if flower is cut
			  if(!randFlower.cutted){
				let flowerX = randFlower.x;
				let flowerY = randFlower.y + (randFlower.sprite.height*randFlower.scl);
				let face = sign(flowerX-this.x);
				this.targetX = flowerX - face*(((this.sprite.width*this.scl)+(randFlower.sprite.width*randFlower.scl))/2) + randomRange(-8, 8);
				this.targetY = flowerY + randomRange(-8, 4);
			  } else {
				// In case the flower was cut choose a random position
				let border = 80;
				this.targetX = randomRange(border, width-border);
				this.targetY = randomRange(border, height-border);
			  }
			} else {
			  // Targets a random position
			  let border = 80;
			  this.targetX = randomRange(border, width-border);
			  this.targetY = randomRange(border, height-border);

			  if(this.frames > this.life){
				this.targetX = (Math.random() > 0.5)?-100:width+100;
				this.targetY = Math.random()*height;
				this.leaving = true;
			  }
			}

			// Determine speeds towards target
			let dx = this.targetX - this.x;
			let dy = this.targetY - this.y;
			let dist = Math.sqrt(dx*dx + dy*dy);

			this.hspd = dx*this.spd/dist;
			this.vspd = dy*this.spd/dist;
		  }
		} else {
		  // If not Idle

		  // Position update
		  this.x += this.hspd;
		  this.y += this.vspd;

		  // Facing Management
		  if(this.hspd > 0){
			this.facing = 1;
		  } else {
			this.facing = -1;
		  }

		  // Target reach check
		  let dx = this.targetX - this.x;

		  if(dx/this.hspd < 1){
  			if(this.leaving){
  			  this.active = false;
  			} else {
  			  this.idleTimer = Math.floor(randomRange(30, 70));
  			}
		  }
		}
	} else {
	  // In case the RAT is in Following state

    // Position update
    this.x += this.hspd;
    this.y += this.vspd;

	  // Updates the targeting position
	  if((this.timer % 4) == 0 && Math.random() < 0.75){
      this.getTarget();
    }

      this.timer++;

      let dx = this.targetX - this.x;
      let dy = this.targetY - this.y;

      if(this.moving){
        // Checks if destination is reached
        // If distance is zero
        if(dx == 0 && dy == 0){
          this.moving = false;
          this.hspd = 0;
          this.vspd = 0;
          // If Horizontal speed is zero check for Vertical Speed
        } else if(this.hspd == 0){
          // If Vertical speed is zero Then Stop Moving
          if(this.vspd == 0){
            this.moving = false;
          } else if((dy/this.vspd) < 1){
              this.moving = false;
              this.vspd = 0;
          }
        } else {
          if(this.vspd == 0){
            if((dx/this.hspd) < 1){
              this.moving = false;
              this.vspd = 0;
              this.hspd = 0;
            }
          } else {
            if(Math.max(dx/this.hspd, dy/this.vspd) < 1){
              this.moving = false;
              this.vspd = 0;
              this.hspd = 0;
            }
          }
        }
        // If Not Moving
      } else {
        // Checks if not idle
        // Then the program runs the getTarget method
        // To update the destination
        if(this.idleTimer <= 0){
          this.getTarget();
        } else {
          this.idleTimer--;
        }
      }
    }

	this.z = this.y + 3*this.scl;
  }
}


/// Death OBJECT

function Death(x, y, level){
  this.x = x;
  this.y = y;
  this.scl = 5.5;
  this.frames = 0;
  this.sprite = deathSheet;
  this.sprWidth  = 32;
  this.sprHeight = 32;
  this.xOffset = this.scl*this.sprWidth/2;
  this.yOffset = this.scl*this.sprHeight/2;

  this.attackBox = (new BoundBox(2, 4, 22, 32)).scale(this.scl, this.scl);

  this.spd  = 5.5 + Math.min(4, (level-1)*0.3);
  this.hspd = 0;
  this.vspd = 0;

  this.startTime      = 100 - Math.min(100, Math.ceil(level-1)*10);

  this.attacking      = false;
  this.attackTimer    = 0;
  this.attackDuration = 40;
  this.minCooldown    = 40  - Math.min(20, Math.ceil((level-1)*0.5));
  this.gravCooldown   = 80  - Math.min(60, Math.ceil((level-1)*4));
  this.attackCooldown = this.minCooldown
  this.attacked       = false;

  this.tracking        = false;
  this.toleranceTimer  = 0;
  this.toleranceMax    = 400;
  this.toleranceAbsMax = 600;
  this.shortRange      = 70;
  this.longRange       = 150;
  this.inRange         = false;

  this.wandering = false;

  this.idleTimer = 0;
  this.minIdle = 80;
  this.maxIdle = 120;

  this.targetX = 0;
  this.targetY = 0;

  this.exclTimer = 0;

  this.runningAway = false;
  this.ghostyAttached = 0;

  this.finished = false; // Muahahahahaha!!!
  this.active = true;

  this.facing = 1;

  this.alert = function(){
    this.exclTimer = 50;
  }

  this.getAttackBound = function(){

    let xCenter = this.x + this.xOffset;
    let yCenter = this.y + this.yOffset;

    if(this.facing == -1){
      return this.attackBox.scale(-1, 1).translate(xCenter, this.y).swapX();
    }
    return this.attackBox.scale(1, 1).translate(xCenter, this.y);
  }

  this.range = function(){
    let xCenter = this.x + this.xOffset;
    let yCenter = this.y + this.yOffset;

    ctx.beginPath();
    ctx.arc(xCenter, yCenter, this.shortRange, 0, 2*Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgb(200, 100, 0)";
    ctx.arc(xCenter, yCenter, 80, 0, 2*Math.PI, false);
    ctx.stroke();

    ctx.fillStyle = "rgb(200, 10, 50)";
    ctx.fillRect(xCenter-1, yCenter-1, 2, 2);
    let rd =this.longRange;
    ctx.strokeRect(xCenter - rd, yCenter - rd, 2*rd, 2*rd);
  }

  this.playerNoise = function(){
    let xCenter = this.x + this.xOffset;
    let yCenter = this.y + this.yOffset;

    let dx = player.x + player.xOffset - xCenter;
    let dy = player.y + player.yOffset - yCenter;

    let dist = Math.sqrt(dx*dx + dy*dy);

    let noiseVal = 170*(width-dist)/width;

    if(this.facing == sign(dx)){
      noiseVal = Math.floor(noiseVal*1.5);
    }

    this.toleranceTimer += noiseVal;

    if(this.toleranceTimer > 260){
      if(!this.tracking){
        this.exclTimer = 20;
      }
      this.tracking = true;
      this.attackCooldown = Math.max(this.minCooldown, this.attackCooldown);
    }
  }

  this.show = function(){
    this.frames++;

    let imgX = 0;
    let imgY = 0;

    let yAdd = Math.sin(this.frames/24)*4*this.scl;
    let xAdd = 0;

    if(!this.attacking){
      imgX = (Math.floor(this.frames/24)) % 2;
    } else {
      let imgN = this.attackTimer*4/this.attackDuration;

      if(imgN < 2) {imgX = 0; imgY = 1;}
      else if(imgN < 2.4) {imgX = 1, imgY = 1;}
      else if(imgN < 2.6) {imgX = 0; imgY = 2;}
      else {imgX = 1; imgY = 2;}
    }

    // Sprite Flip
    if(this.facing == 1){
      ctx.save();
      ctx.scale(-1, 1);
      xAdd = 32*this.scl;
      ctx.drawImage(this.sprite, imgX*this.sprWidth, imgY*this.sprHeight, this.sprWidth, this.sprHeight, -(this.x+xAdd)*this.facing, this.y + yAdd, this.sprWidth*this.scl, this.sprHeight*this.scl);
      ctx.restore();
    } else {
      ctx.drawImage(this.sprite, imgX*this.sprWidth, imgY*this.sprHeight, this.sprWidth, this.sprHeight, -(this.x+xAdd)*this.facing, this.y + yAdd, this.sprWidth*this.scl, this.sprHeight*this.scl);
    }

    if(this.exclTimer > 0){
      spr_Excl.drawFix(this.x + (this.sprite.width*this.scl/4), this.y - (this.scl*8), Math.floor(this.frames/3)%2, 0, 4, 4, 0, 8, 8, 8, 8);
    }

    //this.range();
    //(this.getAttackBound()).show(0, 0);
  }

  this.update = function(){
    // Tolerance Timer
    // Increases with player exposure

    if(this.exclTimer > 0){
      this.exclTimer--;
    }

    if(this.active){
      if(this.startTime > 0){
        this.startTime--;
      }
      if(!this.runningAway){
        if(!this.finished){
          if(!player.hidden){

            if(this.startTime <= 0){
              let dxx = player.x - this.x;

              // Player gets noticed by moving
              if(player.moving){
                this.toleranceTimer++;
              }

              // Player gets noticed if Death is facing him
              if(this.facing == sign(dxx)){
                if(this.tracking){
                  this.toleranceTimer--;
                }
                this.toleranceTimer += 3;
              }

              // Player gets noticed if not hidden
              this.toleranceTimer++;

              if(this.toleranceTimer > 180){
                let xCenter = this.x + this.xOffset;
                let yCenter = this.y + this.yOffset;

                let dx = Math.abs(player.x + player.xOffset - xCenter);
                let dy = Math.abs(player.y + player.yOffset - yCenter);
                let dist = Math.max(dx, dy);

                // If in longRange or Tolerance too high
                if(dist < this.longRange + Math.random()*10 || this.toleranceTimer > 300 + 50*(dist/width)){
                  this.wandering = false;
                  if(!this.tracking){
                    this.attackCooldown = Math.max(this.minCooldown, this.attackCooldown);
                    this.exclTimer = 20;
                  }
                  this.tracking = true;
                }
              }

              // Tolerance Cap
              this.toleranceTimer = Math.min(this.toleranceTimer, this.toleranceAbsMax);

              if(this.toleranceTimer > this.toleranceMax) {
                this.toleranceTimer -= 5;
              }
            }
          } else if(this.toleranceTimer > 0){
            this.toleranceTimer -= 4;
            if(this.toleranceTimer < 0) {this.toleranceTimer = 0;}
          }

          if(!this.attacking){
            if(this.tracking){

              let xCenter = this.x + this.xOffset;
              let yCenter = this.y + this.yOffset;

              let dx = player.x + player.xOffset - xCenter;
              let dy = player.y + player.yOffset - yCenter;

              let dist = Math.sqrt(dx*dx + dy*dy);

              let spdChange = 0.5*Math.sin(this.frames/200);

              if(dist > this.shortRange*0.5){
                this.hspd = (this.spd + spdChange)* dx/dist;
                this.vspd = (this.spd + spdChange)* dy/dist;
              }

              // Facing Setup
              if(this.hspd > 0){
                this.facing = 1;
              } else {
                this.facing = -1;
              }

              // Cancels Tracking State if player is hidden
              // I should change this sometime soon
              if(player.hidden && this.toleranceTimer < 260){
                this.tracking = false;
                this.idleTimer = this.minIdle + Math.floor(Math.random()*(this.maxIdle - this.minIdle));
                this.idleTimer /= 3;
              }

              // Attacking State Trigger
              if(dist < this.shortRange || this.inRange) {
                // High Trigger Timer Penalty
                let tolPenalty = 30*Math.max((this.toleranceTimer-220)/(this.toleranceAbsMax-180), 0);
                let tolExtraPenalty = 10*Math.max((this.toleranceTimer-this.toleranceMax)/(this.toleranceAbsMax-this.toleranceMax), 0);
                let totalPenalty = tolPenalty + tolExtraPenalty;

                if(this.attackCooldown - totalPenalty <= 0){
                  this.attackCooldown = 0;
                  this.attacking = true;
                  this.tracking  = false;
                }

                this.inRange = true;

                if(dist < this.shortRange*0.75){
                 this.hspd *= 0.5;
                 this.vspd *= 0.5;
               }
              }

              if (dist > this.shortRange*1.2){
                this.inRange = false;
              }

              // Getting ready for an attack
              this.attackCooldown--;

              // Movement
              this.x += this.hspd;
              this.y += this.vspd;

            } else {
              // Wandering state
              // Idle      state

              this.attackCooldown--;
              // Wandering State
              if(this.wandering){
                let xCenter = this.x + this.xOffset;
                let dx = this.targetX - xCenter;

                // Destination check
                if((dx/this.hspd) < 1){
                  this.wandering = false;
                  this.idleTimer = this.minIdle + Math.floor(Math.random()*(this.maxIdle - this.minIdle));
                }

                // Movement
                this.x += this.hspd;
                this.y += this.vspd;

              } else {

                // Idle Timer
                if(this.idleTimer <= 0){

                  // Wandering State Setup
                  this.wandering = true;
                  let chance = Math.random();
                  if(chance < 0.01){
                    this.targetX = player.x + player.xOffset + randomRange(-100, 100);
                    this.targetY = player.y + player.yOffset + randomRange(-100, 100);
                  } else {
                    let border = 50;
                    this.targetX = randomRange(border, width-border);
                    this.targetY = randomRange(border, height-border)
                  }

                  let xCenter = this.x + this.xOffset;
                  let yCenter = this.y + this.yOffset;

                  let dx = this.targetX - xCenter;
                  let dy = this.targetY - yCenter;

                  let dist = Math.sqrt(dx*dx + dy*dy);

                  this.hspd = (this.spd * dx/dist)*0.7;
                  this.vspd = (this.spd * dy/dist)*0.7;

                  // Facing Setup
                  if(this.hspd > 0){
                    this.facing = 1;
                  } else {
                    this.facing = -1;
                  }

                } else {
                  this.idleTimer--;
                }

              }

            }
          } else {
            // Attacking State
            // Timers
            this.attackTimer++;

            // Attacking Player
            if(!this.attacked){
              if(this.attackTimer >= this.attackDuration/2){
                // Play audio
                if(this.attackTimer == Math.ceil(this.attackDuration/2)){
                  let rand = Math.random();
                  if(rand > 0.5){
                   scythe1.play();
                 } else {
                   scythe2.play();
                 }
                }
                if(!player.hidden){
                  if(boundIntersect(this.getAttackBound(), player.getBound())){
                    let xCenter = this.x + this.xOffset;
                    let yCenter = this.y + this.yOffset;

                    let dx = player.x + player.xOffset - xCenter;
                    let dy = 20 + player.y + player.yOffset - yCenter;

                    let dist = Math.sqrt(dx*dx + dy*dy);

                    player.hit(20*dx/dist, 20*dy/dist);

                    this.attacked = true;

                  }
                } else {
                  if(boundIntersect(this.getAttackBound(), player.target.getBoundBox())){
                    let grave = player.target;
                    let xCenter = this.x + this.xOffset;
                    let yCenter = this.y + this.yOffset;

                    let dx = grave.x + (grave.sprite.width/2) - xCenter;
                    let dy = -20 + grave.y + (grave.sprite.height/2) - yCenter;

                    let dist = Math.sqrt(dx*dx + dy*dy);

                    let gHspd = (20*dx/dist);
                    let gVspd = (20*dy/dist);

                    grave.break(gHspd, gVspd);
                    player.hidden = false;
                    this.toleranceTimer = Math.floor(this.toleranceTimer/1.5);
                    this.attacked = true;
                    this.attackCooldown += this.gravCooldown;

                    for(let i = 0; i < rats.length; i++){
                      let rat = rats[i];
                      if(!rat.following){
                        let ratBounds = (new BoundBox(-7, 1, 7, 6)).scale(rat.scl, rat.scl).translate(rat.x, rat.y);

                        if(boundIntersect(this.getAttackBound(), ratBounds)){
                          rat.hit();
                        }
                      }
                    }

                  }
                }
                for(let i = 0; i < flowers.length; i++){
                  let flower = flowers[i];
                  if(!flower.cutted){
                    if(boundIntersect(this.getAttackBound(),flower.getBound())){
                        flower.cut();
                    }
                  }
                }
              }
            }

            // Ends attacking state
            if(this.attackTimer >= this.attackDuration){
              if(!player.alive){
                this.finished = true;
              }
              this.attacking = false;
              this.attacked = false;
              this.attackTimer = 0;
              this.attackCooldown += this.minCooldown;
            }
          }
        } else {

          // Floats until being OffScreen
          this.x += this.facing*(this.spd+Math.sin(this.frames/24))/2;
          if(this.x > width + 100 || this.x < -(100 + (this.sprWidth*this.scl))){
            this.active = false;
          }
        }
      } else {
        // Shakes Trying to Flee Offscreen
        if((width-this.x) > width/2){
          this.facing = -1;
          this.x -= this.spd*0.85;
          if(this.x < -(100 + (this.sprWidth*this.scl))){
            this.active = false;
            if(!gameover){
              levelFinish();
            }
          }
        } else {
          this.facing = 1;
          this.x += this.spd*0.85;
          if(this.x > width + 100){
            this.active = false;
            if(!gameover){
              levelFinish();
            }
          }
        }

        // Shaking
        this.x += (Math.random()*5 +(-2.5))*this.ghostyAttached;
        this.y += (Math.random()*5 +(-2.5))*this.ghostyAttached;
      }
    }
  }
}
