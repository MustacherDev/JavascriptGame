
// Bonus stage functions
let gravScl = 4;
let sectionMax = 10;
let newRowTimer = 0;

function addGravestone(obj){
  gravestonesB.push(obj);

  drawnableObjects.push(obj);
  sortDrawnable();
}

function addFence(obj){
  addObj(obj);

  obj.stateCheck();
  fencesB.push(obj);
}


function endBonusScreen(){
  finishingLevel = true;
  endTimer = 1000*5;
}


function bonusStep(){
  if(loadingTimer <= 0){
    if(!finishingLevel){


      if(input.keyState[65][0]){
        playerB.move(-1);
      }

      if(input.keyState[68][0]){
        playerB.move(1);
      }




      sortDrawnable();

      // Grid management
      for(let i = 0; i < gridObjects.length; i++){
        let obj = gridObjects[i];
        obj.update();

        if(!obj.active){
          gridObjects.splice(i, 1);
          i--;
        }
      }

      // Gravestones Bonus
      for(let i = 0; i < gravestonesB.length; i++){
        let obj = gravestonesB[i];
        obj.update();
        if(!obj.active){
          gravestonesB.splice(i, 1);
          i--;
        }
      }

      // Buttons
      for(let i = 0; i < buttomObjects.length; i++){
        let obj = buttomObjects[i];
        obj.update();
        if(!obj.active){
          buttomObjects.splice(i, 1);
          i--;
        }
      }

      // Object Drawing
      for(let i = 0; i < drawnableObjects.length; i++){
        let obj = drawnableObjects[i];
        obj.show();

        if(!obj.active){
          drawnableObjects.splice(i, 1);
          i--;
        }
      }



      // Text objects
      let arrLength = textObjects.length;
      for(let i = 0; i < arrLength; i++){
        let txt = textObjects[i];
        if(txt.active){
          txt.update();
          txt.show();
        } else {
          // Remove inactive objects
          textObjects.splice(i, 1);
          i--;
          arrLength--;
        }
      }


      // Particle System
      arrLength = particles.length;
      for(let i = 0; i < arrLength; i++){
        let part = particles[i];
        if(part.active){
          part.show();
          part.update();
        } else {
          // Remove inactive objects
          particles.splice(i, 1);
          i--;
          arrLength--;
        }
      }



      // Row/Section Creation
      newRowTimer += playerSpeed;

      // Slots between rows
      let slotsToRows = 3;
      let rowsPerSection = 6;
      let sectionSize = spr_Gravestone.height*gravScl*slotsToRows*rowsPerSection;

      // Creating Sections
      if(newRowTimer >= sectionSize){
        newRowTimer = newRowTimer - sectionSize;

        createRows(rowsPerSection, newRowTimer);
      }

      // View scrolling down stop
      if(playerB.vspd == 0){
        if(sectionNumber > sectionMax+1){
          playerB.vspd = -playerSpeed;
          playerSpeed = 0;
        }
      }




      /// GUI
      // Score
      ctx.font = "40px Fixedsys";
      ctx.textAlign = "end";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText("HIGHSCORE " + fixNumber(highscore, 8), width-80, 40);
      ctx.fillText(fixNumber(score, 8), width-80, 80);


      // Tolerance Meter
      let barHei = 10;
      let barX = 80;
      let barY = 50;
      let border = 10;
      let barWid = 240;

      let topY = barY - border;
      let bottomY = barY + border + barHei

      let perc = Math.min(((sectionNumber*sectionSize) + newRowTimer)/(sectionMax*sectionSize), 1);

      // Box
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeRect(barX - border, topY, barWid + border - 0, border + border + barHei - 0);

      // Bar
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(80, barY, barWid*perc, barHei);

      spr_Ghosty.draw(barX + barWid*perc, barY+(barHei/2), 0, 0, 2, 2, true);

      if(!playerB.deadTime > 20){
        endBonusScreen();
      }

    } else {
      endTimer -= timeAdd;

      // Ending Screen

      ctx.fillStyle = "rgb(200, 200, 255)";
      ctx.textAlign = "center";
      ctx.font = "Bold 80px Fixedsys";
      ctx.fillText("BONUS LEVEL REWARDS", width/2, height/2);
      ctx.font = "Bold 40px Fixedsys";

      let xx = (width/4);
      let yy = (height/1.5)+20;

      if(playerB.coinsB > 0){
        spr_Coin.drawFix(xx, yy, 0, 0, 4, 4, 0, 8, 8, 0, 0);
        ctx.fillText("x" + playerB.coinsB + " = " + (100*playerB.coinsB), xx + (8*4) + 10, yy);
        yy += (4*8) + 20;
      }

      if(playerB.finished){
        let sqrL = 8;
        ctx.fillStyle = "rgb(255, 255, 255)";
        for(let i = 0; i < 3; i++){
          for(let j = 0; j < 23; j++){
            if(((i + j) % 2) == 0){
              let xxx = xx + j*sqrL;
              let yyy = yy + i*sqrL;
              ctx.fillRect(xxx, yyy, sqrL, sqrL);
            }
          }
        }
        ctx.textAlign = "start";
        ctx.fillText(" = 2000!", xx + (24*sqrL), yy + 35);
        yy += (3*8) + 20;
      }

      if(playerRats > 0){
        spr_Rat.drawFix(xx, yy, 0, 0, 4, 4, 0, 0, 3.5, 0, 3.5);
        ctx.textAlign = "start";
        ctx.font = "Bold 40px Fixedsys";
        ctx.fillStyle = "rgb(200, 200, 255)";
        ctx.fillText("x500 = " + (playerRats*500), xx + (16*4) + 10, yy);
        score += playerRats*500;
        playerRats = 0;
      }


      if(endTimer <= 0){
        nextLevel();
      }
    }
  } else {

    // Loading Screen
    loadingTimer -= timeAdd;

    ctx.fillStyle = "rgb(200, 200, 255)";
    ctx.textAlign = "center";
    ctx.font = "Bold 80px Fixedsys";
    ctx.fillText("BONUS LEVEL", width/2, height/2);
  }
}
