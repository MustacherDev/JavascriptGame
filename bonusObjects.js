function FlowerB(x, y, type){
  this.x = x;
  this.y = y;
  this.sprite = spr_Flower;
  this.type = type;

  this.scl = 2.5 + randomRange(-0.1, 0.1);
  this.flip = (Math.random() > 0.5) ?true:false;

  this.active = true;

  this.z = this.y + (this.scl * (this.sprite.height - 4));

  this.update = function(){
    if(this.y > height) {
      this.active = false;
    }

    this.y += playerSpeed;

    this.z = this.y + (this.scl * (this.sprite.height - 2));
  }

  this.show = function(){
    let xscl = this.scl;
    if(this.flip){
      xscl *= -1;
    }
    this.sprite.drawFix(this.x, this.y, this.type, 0, xscl, this.scl, 0, spr_Flower.width/2, spr_Flower.height/2, 0, 0);
  }
}

function Fence(x, y, state){
  this.x = x;
  this.y = y;
  this.z = y;
  this.up = false;
  this.down = false;
  this.sprite = spr_Fence;
  this.active = true;

  this.scl = 4;

  this.state = 3;

  this.boundBox = new BoundBox(0, 0, 16, 16);

  this.getBound = function(){
    // Translates and Scale the boundBox
    let bound = this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
    return bound;
  }

  this.stateUpdate = function(){
    if(this.up){
      this.state = 2;
      if(this.down){
        this.state = 1;
      }
    } else if(this.down){
      this.state = 0;
    }
  }

  this.stateCheck = function(){

    for(let i = 0; i < fencesB.length; i++){
      let other = fencesB[i];
      this.y--;
      if(boundIntersect(other.getBound(), this.getBound())){
        other.down = true;
        this.up = true;
        other.stateUpdate();
        this.stateUpdate();
      } else {
        this.y += 2;
        if(boundIntersect(other.getBound(), this.getBound())){
          other.up = true;
          this.down = true;
          other.stateUpdate();
          this.stateUpdate();
        }
        this.y -=2;
      }
      this.y++;
    }

  }

  this.show = function(){
    this.sprite.draw(this.x, this.y, 0, this.state, this.scl, this.scl);
  }

  this.update = function(){
    if(this.y > height) {
      this.active = false;
    }

    this.y += playerSpeed;

    this.z = this.y + (this.scl * (this.sprite.height - 2));

  }
}

function GravestoneB(x, y, type){
  this.x = x;
  this.y = y;
  this.sprite = spr_Gravestone;
  this.type = type;

  this.scl = 4;

  this.partFinished = false;
  this.partX = this.x + (this.scl*this.sprite.width/2);
  this.partY = this.y + (this.scl*this.sprite.height/2);
  this.partAng = 0;
  this.partHspd = 0;
  this.partVspd = 0;

  this.active = true;
  this.broken = false;

  this.z = this.y + (this.scl * (this.sprite.height - 4));


  let border = 4;
  this.boundBox = new BoundBox(4, 14, 14, 16);
  this.boundBoxBreak = new BoundBox(2, 2, 17, 16);

  this.getBound = function(){
    // Translates and Scale the boundBox
    let bound = this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
    return bound;
  }

  this.getBoundBreak = function(){
    // Translates and Scale the boundBox
    let bound = this.boundBoxBreak.scale(this.scl, this.scl).translate(this.x, this.y);
    return bound;
  }

  this.break = function(hforce, vforce){
    this.broken = true;

    addPoints(100, this.x + (Math.random()*this.sprite.width*this.scl), this.y + (Math.random()*this.sprite.height*this.scl/2));
    this.partHspd = hforce;
    this.partVspd = vforce;
  }

  this.update = function(){
    if(this.y > height) {
      this.active = false;
    }

    this.y += playerSpeed;

    this.z = this.y + (this.scl * (this.sprite.height - 4));
  }

  this.show = function(){
    let imgY = 0;
    if(this.broken){
      imgY = 2;
    }
    this.sprite.draw(this.x, this.y, this.type, imgY, this.scl, this.scl);

    // Broken Piece Animation
    if((!this.partFinished) && this.broken){

      this.partVspd += 0.2;

      this.partX += this.partHspd;
      this.partY += this.partVspd + playerSpeed;
      this.partAng += 0.2*sign(this.partHspd);
      this.sprite.drawRot(this.partX, this.partY, this.type, 3, this.scl, this.scl, this.partAng, true);

      if(this.partX > width+(this.sprite.width*this.scl) || this.partX < -(this.sprite.width*this.scl) || this.partY > height + (this.sprite.height*this.scl) || this.partY < -(this.sprite.height*this.scl)){
        //this.partFinished = true;
      }
    }

    // Bounding Box Draw
    //this.getBound().show(0,0);
  }
}

function DeathB(x, y, facing){
  this.x = x;
  this.y = y;
  this.scl = 5;
  this.sprite = spr_Death;

  this.z = this.y +this.sprite.height*this.scl;

  this.facing = facing;

  this.active = true;
  this.frames = 0;
  this.attacking = false;
  this.attacked = false;
  this.attackDuration = 20;
  this.attackTimer = 0;

  this.hspd = 0;

  this.cooldown = 20;

  this.boundBox = new BoundBox(-18, -10, 0, 8);
  this.boundBoxSight = new BoundBox(0, 0, -20, 56);

  this.getAttackBound = function(){
    if(this.facing == 1){
      return this.boundBox.scale(-this.scl, this.scl).translate(this.x, this.y).swapX();
    }

    return this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
  }

  this.getSightBound = function(){
    if(this.facing == 1){
      return this.boundBoxSight.scale(-this.scl, this.scl).translate(this.x, this.y)
    }

    return this.boundBoxSight.scale(this.scl, this.scl).translate(this.x, this.y).swapX();;
  }

  this.show = function(){
    this.frames++;

    let imgX = 0;
    let imgY = 0;

    let yAdd = Math.sin(this.frames/6)*4*this.scl;
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

    this.sprite.draw(this.x, this.y + yAdd, imgX, imgY, -this.scl*this.facing, this.scl, true);

    this.getSightBound().show(0, 0);
    this.getAttackBound().show(0, 0);

  }

  this.update = function(){

    this.x += this.hspd;

    this.y += playerSpeed;
    this.z = this.y +this.sprite.height*this.scl;

    if(!this.attacked){
      if(boundIntersect(this.getSightBound(), playerB.getBoundCollect()) || (this.y+16 >= playerB.y)){
        this.attacking = true;
        this.attacked = true;
      }

    } else {
      if(!this.attacking){
        if(this.cooldown == 0){
          this.facing *= -1;
          this.hspd = this.facing*3;
          this.cooldown--;
        } else {
          this.cooldown--;
        }
      }
    }

    // Attacking State
    // Timers
    if(this.attacking){
      this.attackTimer++;

      // Attacking Player
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

        if(this.attackTimer == Math.ceil(this.attackDuration/1.5)){
          if(boundIntersect(this.getAttackBound(), playerB.getBound())){
            let xCenter = this.x;
            let yCenter = this.y;

            let dx = playerB.x + (player.sprite.width*playerB.scl/2) - xCenter;
            let dy = 5 + playerB.y + (player.sprite.height*playerB.scl/2) - yCenter;

            let dist = Math.sqrt(dx*dx + dy*dy);
            playerB.hit(5*dx/dist, 5*dy/dist);
          }

          for(let i = 0; i < gravestonesB.length; i++){
            let grave = gravestonesB[i];
            if(!grave.broken){
              if(boundIntersect(this.getAttackBound(), grave.getBoundBreak())){
                let dx = (grave.x + (grave.sprite.width *grave.scl/2)) - this.x;
                let dy = (grave.y + (grave.sprite.height*grave.scl/2)) - this.y;

                let dist = Math.sqrt(dx*dx + dy*dy);

                let hforce = 6*dx/dist;
                let vforce = 6*dy/dist;

                grave.break(hforce, vforce);
              }
            }
          }
        }

      }


    // Ends attacking state
    if(this.attackTimer >= this.attackDuration){
      this.attacking = false;
      this.attackTimer = 0;
    }
  }
}
}

function RowB(x, y, graves){
  this.x = x;
  this.y = y;

  this.boundBox = null;

  this.graves = graves;
}

function chanceArr(arr){
  let rand = Math.random();
  let num = 0;
  for(let i = 0; i < arr.length; i++){
    let chance = arr[i];
    num += chance;
    if(rand < num){
      return i;
    }
  }

  let max = 0;
  let maxI = null;

  for(let i = 0; i < arr.length; i++){
    let chance = arr[i];
    if(chance > max){
      max = chance;
      maxI = i;
    }
  }
  return maxI;
}

function chanceScaling(arr){
  let num = 0;
  for(let i = 0; i < arr.length; i++){
    num += arr[i];
  }

  num = 1/num;

  for(let i = 0; i < arr.length; i++){
    arr[i] *= num;
  }
}
function arrCopy(arr){
  let newArr = [];
  for(let i = 0; i < arr.length; i++){
    newArr.push(arr[i]);
  }
  return newArr;
}


function arrNewShuffled(arr){
  let arrC = arrCopy(arr);
  let newArr = [];
  for(let i = 0; i < arr.length; i++){
    let randInd = Math.floor(arrC.length*Math.random());
    newArr.push(arrC[randInd]);
    arrC.splice(randInd, 1);
  }
  return newArr;
}




function createRows(rowNum, time){
  // List of Rows (Section)
  let rowList = [];
  sectionNumber++;

  // Last gravestone row pattern
  let last = null;

  // Max number of coins
  let coins = 12;
  let types =     ["GNG", "GGN", "NGG", "NGN", "NNG", "GNN", "NNN"];

  // Spacing and Positioning
  let gravScl = new GravestoneB(0, 0, 0).scl;

  let gravW = spr_Gravestone.width*gravScl;
  let gravH = spr_Gravestone.height*gravScl;
  // Space between grave slots
  let spacing = gravW/4;

  let xx = (width/2) - (gravW/2);
  let yy = (-gravH*2);
  let sectionSize = rowNum*(gravW*3);

  let spaceW = (spacing + gravW*2)*2;
  let spaceH = gravH*3;

  // Section Slots functions
  function getSlotX(slot){
    return (slot*(spacing+gravW)) - (gravW/2) + width/2;
  }

  function getSlotY(slot){
    return (-slot*3*gravH) - gravH*2;
  }

  function getMidSlotX(slot){
    return getSlotX(slot) + gravW/2;
  }

  function getMidSlotY(slot){
    return getSlotY(slot) + gravH/2;
  }

  // Row creation
  for(let i = 0; i < rowNum; i++){
    // Y pos of the actual row
    let yyy = getSlotY(i);

    // Chance array
    let chances = [0.05  , 0.3 , 0.3 , 0.1  , 0.1  , 0.1  , 0.05  ];
    if(last == "NNN"){
      chances[6] = 0.01;
      chanceScaling(chances)
    } else if(last == "GGN"){
      chances[2] = 0;
      chances[1] = 0.025;
      chanceScaling(chances)
    } else if(last == "NGG"){
      chances[1] = 0;
      chances[3] = 0.025;
      chanceScaling(chances)
    }
    let ind = chanceArr(chances);
    let type = types[ind];
    rowList.push(type);

    // Adding Gravestones of the Row
    if(type.charAt(0) == "G"){
      let grav = new GravestoneB(getSlotX(1), yyy, Math.floor(randomRange(0, 3)));
      if(Math.random() < 0.2){
        grav.broken = true;
        grav.partFinished = true;
      }
      addGravestone(grav);
    }

    if(type.charAt(1) == "G"){
      let grav = new GravestoneB(getSlotX(0), yyy, Math.floor(randomRange(0, 3)));
      if(Math.random() < 0.2){
        grav.broken = true;
        grav.partFinished = true;
      }
      addGravestone(grav);
    }

    if(type.charAt(2) == "G"){
      let grav = new GravestoneB(getSlotX(-1), yyy, Math.floor(randomRange(0, 3)));
      if(Math.random() < 0.2){
        grav.broken = true;
        grav.partFinished = true;
      }
      addGravestone(grav);
    }



    /// Flower Placement
    // lots of complicated shenanigans that only past me would understand
    let flowerNum = Math.floor(randomRange(1, 3));
    let flowerAvailPos = [];
    let flowersH = 4;
    let flowersV = 8;


    let flowerSpacing = 10;
    for(let i = 0; i < flowersV; i++){
      for(let j = 0; j < flowersH; j++){
        let xFlower = ((width/2) - spacing - (gravW*2)) + (j*spaceW/flowersH) + (0.5*spaceW/flowersH);
        let yFlower = yyy + gravW - (i*spaceH/flowersV) - (0.5*spaceH/flowersV);

        flowerAvailPos.push({x:xFlower, y:yFlower});
      }
    }

    for(let i = 0; i < flowerNum; i++){
      let randPosIndex = Math.floor(Math.random()*flowerAvailPos.length);
      let posFlower = flowerAvailPos[randPosIndex];
      flowerAvailPos.splice(randPosIndex, 1);

      let flower1 = new FlowerB(posFlower.x + randomRange(-flowerSpacing, flowerSpacing), posFlower.y + randomRange(-flowerSpacing, flowerSpacing), Math.floor(randomRange(0, 3)));
      addObj(flower1);
    }

    last = types[ind];


  }

  // Fence Placement
  let fenceScl = (new Fence(0, 0, 0)).scl;
  let fenceHeight = fenceScl*spr_Fence.height;
  let fencesY = Math.floor(sectionSize/fenceHeight);
  for(let i = 0; i < fencesY; i++){
    // Left Fence

    if(Math.random() < 0.25) {
      if(Math.random() < 0.3){
        let fenceNew = new Fence(getMidSlotX(-2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- i*fenceHeight, 3);
        addFence(fenceNew);
      } else {
        if(Math.random() < 0.4){
          let fenceNew = new Fence(getMidSlotX(-2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- i*fenceHeight, 3);
          addFence(fenceNew);
          fenceNew = new Fence(getMidSlotX(-2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- (i+1)*fenceHeight, 3);
          addFence(fenceNew);
          i++;
        } else {
          let fenceNew = new Fence(getMidSlotX(-2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- i*fenceHeight, 3);
          addFence(fenceNew);
          fenceNew = new Fence(getMidSlotX(-2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- (i+1)*fenceHeight, 3);
          addFence(fenceNew);
          fenceNew = new Fence(getMidSlotX(-2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- (i+2)*fenceHeight, 3);
          addFence(fenceNew);
          i+= 2;
        }
      }
    }
  }

  for(let i = 0; i < fencesY; i++){
    // Right Fence

    if(Math.random() < 0.25) {
      if(Math.random() < 0.3){
        let fenceNew = new Fence(getMidSlotX(2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- i*fenceHeight, 3);
        addFence(fenceNew);
      } else {
        if(Math.random() < 0.4){
          let fenceNew = new Fence(getMidSlotX(2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- i*fenceHeight, 3);
          addFence(fenceNew);
          fenceNew = new Fence(getMidSlotX(2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- (i+1)*fenceHeight, 3);
          addFence(fenceNew);
          i++;
        } else {
          let fenceNew = new Fence(getMidSlotX(2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- i*fenceHeight, 3);
          addFence(fenceNew);
          fenceNew = new Fence(getMidSlotX(2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- (i+1)*fenceHeight, 3);
          addFence(fenceNew);
          fenceNew = new Fence(getMidSlotX(2) - (spr_Fence.width*fenceScl/2), getMidSlotY(0)- (i+2)*fenceHeight, 3);
          addFence(fenceNew);
          i+= 2;
        }
      }
    }
  }


  // Random events and Coin Placement
  let randRows = [];
  let rowSlots = [];
  for(let i = 0; i < rowList.length; i++){
    randRows.push(i);
    rowSlots.push(i*3);
    rowSlots.push((i*3) + 1);
    rowSlots.push((i*3) + 2);
  }

  // Searching for slots coins can be in
  let coinSlots = [];
  for(let i = 0; i < rowList.length; i++){
    if(Math.random() < 0.5){
      coinSlots.push(i*3);
    } else {
      coinSlots.push((i*3)+2);
    }
    coinSlots.push((i*3)+1);
  }

  // Randomizing arrays
  randRows = arrNewShuffled(randRows);
  coinSlots = arrNewShuffled(coinSlots);

  let infoCoin = new CoinB(0,0);
  let coinWidth = infoCoin.sprite.width*infoCoin.scl;

  // Coin Placement
  for(let i = 0; i < coinSlots.length; i++){
    let ind = coinSlots[i];
    let xInd  = (ind%3)-1;
    let coinNew = new CoinB(getMidSlotX(xInd) - (coinWidth/2) , getMidSlotY(ind) - gravH - (coinWidth/2));
    addObj(coinNew);
    coins--;
    if(!coins > 0){
      i = coinSlots.length;
    }
  }

  // TO LATER IMPROVE
  // NEEDS LOTS OF ATENTION
  let deathInd = Math.floor((rowList.length/2));

  let deathInfo = new DeathB(0, 0);
  let deathW = deathInfo.scl*deathInfo.sprite.width;

  let deathFacing = sign(Math.random() - 0.5);
  let death = new DeathB(getMidSlotX(deathFacing*2), getMidSlotY(deathInd) + randomRange(-20, 0), -deathFacing);
  let diamond = new DiamondB(getMidSlotX(deathFacing) - (coinWidth/2), getMidSlotY(deathInd) - gravH - (coinWidth/2));
  addObj(death);
  addObj(diamond);
}

function CoinB(x, y){
  this.x = x;
  this.y = y;
  this.scl = 2;

  this.sprite = spr_Coin;

  this.boundBox = new BoundBox(0, 0, 16, 16);

  this.frames = 0;

  this.z = this.y + ((this.sprite.height - 4)*this.scl);

  this.active = true;

  this.getBound = function(){
    return this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
  }

  this.collect = function(){
    pickitem.currentTime = 0;
    pickitem.play();
    addPoints(100, this.x, this.y);
    playerB.coinsB++;
    this.active = false;
  }

  this.show = function(){
    this.frames++;
    let imgX = (Math.floor(this.frames/4) % 4);
    this.sprite.draw(this.x, this.y, imgX, 0, this.scl, this.scl);
  }

  this.update = function(){
    this.y += playerSpeed;
    this.z = this.y + ((this.sprite.height - 4)*this.scl);

    if(this.y > height){
      this.active = false;
    }

    if(boundIntersect(this.getBound(), playerB.getBoundCollect())){
      this.collect();
    }
  }
}

function DiamondB(x, y){
  this.x = x;
  this.y = y;
  this.scl = 2;

  this.sprite = spr_Items;

  this.boundBox = new BoundBox(0, 0, 16, 16);

  this.frames = 0;

  this.z = this.y + ((this.sprite.height - 4)*this.scl);

  this.active = true;

  this.getBound = function(){
    return this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
  }

  this.collect = function(){
    pickitem.currentTime = 0;
    pickitem.play();
    addPoints(2000, this.x, this.y);
    playerB.coinsB++;
    playerB.diamondsB++;
    this.active = false;
  }

  this.show = function(){
    this.frames++;
    let imgX = (Math.floor(this.frames/4) % 4);
    this.sprite.draw(this.x, this.y, imgX, 1, this.scl, this.scl);
  }

  this.update = function(){
    this.y += playerSpeed;
    this.z = this.y + ((this.sprite.height - 4)*this.scl);

    if(this.y > height){
      this.active = false;
    }

    if(boundIntersect(this.getBound(), playerB.getBoundCollect())){
      this.collect();
    }
  }
}


/// Rat OBJECT
function RatB(x, y){
  this.x = x;
  this.y = y;
  this.hspd = 0;
  this.vspd = 0;
  this.spd = 7;

  this.scl = 3 + (Math.floor(randomRange(0, 12))/10);
  this.z = this.y + 3*this.scl;

  this.sprite = spr_Rat;

  this.targetX = 0;

  this.moving = false;
  this.target = null;

  this.idleTimer = 0;

  this.moveDist = 20;

  this.timer = 0;

  this.facing = sign(Math.random()-0.5);
  this.active = true;

  this.frames = 0;

  this.centerX = function(){
    return this.x;
  }

  this.getTarget = function(){
    // Sets the target
	// Only for following state
    if(this.target == -1 || this.target == null){
	     this.target = playerB;
    }


    let _dx = this.target.centerX() - this.centerX();

    // Checks if Object is distant enough from the target to start Moving
    // If too close the object simply doesn't move
    if(Math.abs(_dx) > this.moveDist){
  	  let radMin = 20;
  	  let radMax = 40;
  	  let xdir = randomRange(radMin, radMax)*sign(Math.random()-0.5);

  	  // Updating target
  	  this.targetX = this.target.x + xdir;

  	  let dx = this.targetX - this.x;

      this.hspd = this.spd*sign(dx);
      this.moving = true;
      this.idleTimer = Math.floor(randomRange(100, 160));
    }

	// Facing update
    if(this.hspd != 0){
      this.facing = sign(this.hspd);
    }
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
    ctx.fillStyle = "rgb(200, 100, 0)";
    //ctx.fillRect(this.x, this.y-20, 10, 10);
    spr_Friend.draw(this.x, this.y-(this.scl*8) + (Math.sin(this.frames/15)*this.scl*2), 0, 0, this.scl/2, this.scl/2);
    //spr_Flower.drawFix(this.x, this.y+(this.scl*2), 0, 2, this.scl*this.facing, this.scl, 0, 5, 3, 0, 0);

  }

  this.update = function(){

    // Position update
    this.x += this.hspd;
    this.y += this.vspd;

	  // Updates the targeting position
	  if((this.timer % 2) == 0 && Math.random() < 0.75){
      this.getTarget();
    }

      this.timer++;

      let dx = this.targetX - this.x;

      if(this.moving){
        // Checks if destination is reached
        // If distance is zero
        if(dx == 0){
          this.moving = false;
          this.hspd = 0;
        } else  if(dx/this.hspd < 1){
            this.moving = false;
            this.hspd = 0;
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

	this.z = this.y + 3*this.scl;
  }
}




function PlayerB(){
  this.sprite = spr_Player;
  this.scl = 4;

  this.x = (width/2) - (this.scl*this.sprite.width/2);
  this.y =  height -200;

  this.yy = 0;

  this.frames = 0;

  this.active = true;
  this.alive = true;

  this.hspd = 0;
  this.vspd = 0;

  this.moving = false;
  this.moveTime = 5;
  this.moveTimer = this.moveTime;

  this.hat = 0;
  this.coinsB = 0;
  this.finished = false;

  this.deadTime = 0;

  this.z = this.y + this.yy + (this.scl * this.sprite.height);

  this.slot = 0;
  this.lastSlot = 0;

  this.stop = false;

  this.centerX = function(){
    return this.x + (this.sprite.width*this.scl/2);
  }

  this.centerY = function(){
    return this.y + (this.sprite.height*this.scl/2);
  }


  // Follow Rats setup
  // -=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  this.list = [];

  this.addFollower = function(objectFollower){
    // Add object to follower list
    if(objectFollower){

      if(this.list.length == 0){
        objectFollower.target = this;
      } else {
        objectFollower.target = this.list[this.list.length -1];
      }

      this.list.push(objectFollower);
    }
  }

  for(let i = 0; i < playerRats; i++){
    let yy = this.centerY() + (i+1)*30;
    let ratBFollow = new RatB(this.centerY(), yy);
    this.addFollower(ratBFollow);
    gridObjects.push(ratBFollow);
    addDrawnable(ratBFollow);
  }
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


  let border = 4;
  this.boundBox = new BoundBox(6, 11, 10, 15);
  this.boundBoxCollect = new BoundBox(2, 4, 14, 15);

  this.getBound = function(){
    // Translates and Scale the boundBox
    let bound = this.boundBox.scale(this.scl, this.scl).translate(this.x, this.y);
    return bound;
  }

  this.getBoundCollect = function(){
    return this.boundBoxCollect.scale(this.scl, this.scl).translate(this.x, this.y);
  }

  this.hit = function(hforc, vforc){
    this.hspd += hforc;
    this.vspd += vforc;
    this.alive = false;
    hit.play();
    playerSpeed = 0;
  }

  this.show = function(){
    let yFloat = 0;
    let imgY = 1;
    let imgX = 0;
    if(this.alive){
      this.frames++;
      yFloat = 2*(Math.floor((this.frames/8))%2);
    } else {
      imgY = 4;
      imgX = 0;
    }
    this.sprite.draw(this.x, this.y + this.yy + yFloat, imgX, imgY, this.scl, this.scl);
    for(let i = 0; i < this.hat; i++){
      spr_Items.draw(this.x+(this.sprite.width*this.scl/2), this.y + yFloat + this.yy - (spr_Items.height/2) -(spr_Items.height*i*this.scl/2.2), 0, 4, this.scl/2, this.scl/2);
    }

    //this.getBound().show(0, 0);
  }

  this.move = function(dir){
    if(this.alive && !this.moving){
      this.lastSlot = this.slot;
      this.slot = clamp(this.slot + dir, -1, 1);

      if(this.lastSlot != this.slot){
        this.moving = true;
        this.moveTimer = 0;
      }
    }
  }

  this.update = function(){

    // General movement
    this.x += this.hspd;
    this.y += this.vspd;

    this.z = this.y + this.yy + (this.scl * this.sprite.height);

    if(!this.alive && !this.stop){
      this.vspd += 0.2;
    }

    if(this.y < -this.sprite.height*this.scl*3){
      this.finished = true;
      addPoints(2000, width/2, height/2);
      endBonusScreen();
    }



    // Movement from slot to slot
    if(this.alive){
      if(this.moving){
        this.moveTimer++;
        let moveProgress = (this.moveTimer/this.moveTime);

        this.x =  (width/2) - (this.scl*this.sprite.width/2) + (sign(this.slot - this.lastSlot)*moveProgress*100) + (this.lastSlot*100);

        if(this.moveTimer >= this.moveTime){
          this.moving = false;
          this.x = (width/2) - (this.scl*this.sprite.width/2) + this.slot*100;
        }
      }
      if(this.moveTimer > 3){
        for(let i = 0; i < gravestonesB.length; i++){
          let grav = gravestonesB[i];
          if(!grav.broken){
            if(boundIntersect(this.getBound(), grav.getBound())){
              this.alive = false;
              this.stop  = true;
              playerSpeed = 0;
              view.screenShake(5);
              hit.play();
            }
          }
        }
      }
    } else {
      this.deadTime++;

      if(this.deadTime > 100){
        endBonusScreen();
      }
    }
  }
}
