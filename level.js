

function levelStep(){
  /// Sounds
  // Background Music

  // Simplificando pra uma variavel só
  // LevelState = 0 ; Jogando
  // LevelState = 1 ; Ganhou
  // LevelState = -1; Entrando
  // LevelState = 2; Perdeu
  if(!gameover && !won && !levelEntering){
    if(trackTimer < 0){
      let rand = Math.random();
      if(rand < 0.6){
        if(ghostTrack.readyState){
          ghostTrack.play();
          trackPlaying = ghostTrack;
          // Takes the duration of the audio and transforms it into miliseconds
          trackTimer = trackPlaying.duration*1000;
        }
      } else if (snd_deathTemptation.readyState){
        snd_deathTemptation.play();
        trackPlaying = snd_deathTemptation;
        // Takes the duration of the audio and transforms it into miliseconds
        trackTimer = trackPlaying.duration*1500;
      }
    }
    trackTimer -= timeAdd;
  }

  // Cricket noise
  // Every 10 seconds it's tried to play
  if(Math.floor(timeAcc/1000) % 20 == 0){
    let x = Math.random();
    if(x < 0.25){
      let ind = Math.floor(Math.random()*3);
      switch(ind){
        case 0:
          crickets1.play();
          break;

        case 1:
          crickets2.play();
          break;

        case 2:
          crickets3.play();
          break;
      }
    }
  }







  /// Input
  // Mouse Hovering Gravestones
  hoverGravestone = getHoverGravestone();

  if(hoverGravestone != -1){
    gravestones[hoverGravestone].highlight = true;
  }




  let arrLength;
  // Background tiles
  arrLength = backgroundTiles.length;

  for(let i = 0; i < arrLength; i++){
    backgroundTiles[i].show();
  }



  /// Objects Update Cycles

  // Button objects
  arrLength = buttomObjects.length;
  for(let i = 0; i < buttomObjects.length; i++){
    let btt = buttomObjects[i];
    if(btt.active){
      btt.update();
    } else {
      // Remove inactive objects
      buttomObjects.splice(i, 1);
      i--;
      arrLength--;
    }
  }


  // Player
  player.update();

  // Object Array Sequences Preparation
  arrLength = rats.length;

  for(let i = 0; i < arrLength; i++){
    let rat = rats[i];
    if(rat.active){
      rat.update();
    } else {
      // Remove inactive objects
      rats.splice(i, 1);
      i--;
      arrLength--;
    }
  }

  if(rats.length > 0){
    // Organizing Drawnable Objects by Depth
    drawnableObjects.sort(function (a,b){
      if(a.z > b.z) return 1;
      if(a.z < b.z) return -1;
      return 0;
    });
  }

  let drewPlayer = false;
  arrLength = drawnableObjects.length;

  for(let i = 0; i < arrLength; i++){
    let obj = drawnableObjects[i];

    if(obj.active){
      if(!drewPlayer){
        if(player.z < obj.z){
          player.show();
          drewPlayer = true;
        }
      }
      drawnableObjects[i].show();
    } else {
      drawnableObjects.splice(i, 1);
      i--;
      arrLength--;
    }
  }



  // Item objects
  arrLength = itemObjects.length;
  for(let i = 0; i < itemObjects.length; i++){
    let item = itemObjects[i];
    if(item.active){
      item.update();
    } else {
      // Remove inactive objects
      itemObjects.splice(i, 1);
      i--;
      arrLength--;
    }
  }

  // Flower Objects
  arrLength = flowers.length;
  for(let i = 0; i < arrLength; i++){
    let flower = flowers[i];
    if(flower.active){
      flower.update();
    } else {
      // Remove inactive objects
      flowers.splice(i, 1);
      i--;
      arrLength--;
    }
  }



  // Ghosty objects
  arrLength = ghostyObjects.length;
  for(let i = 0; i < arrLength; i++){
    let ghostyThing = ghostyObjects[i];
    if(ghostyThing.active){
      ghostyThing.update();
      ghostyThing.show();
    } else {
      // Remove inactive objects
      ghostyObjects.splice(i, 1);
      i--;
      arrLength--;
    }
  }

  // Death Update
  if(!levelLeaving && !levelEntering){
    death.update();
    death.show();
  }

  // Text objects
  arrLength = textObjects.length;
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



  // Rain
  rain.update();


  /// Timers And Game States
  // Adds time to the timeAcc counting variable
  if(!won && !gameover && !levelEntering){
    timeAcc += timeAdd;
  }


  // Time Up
  if(!won){
    invertTime = Math.floor(maxTime - (timeAcc/1000));
    if(invertTime < 1){
      player.alive = false;
      if(!timeUp){
        timeUp = true;
        warn.play();
      }
    }
  }

  // Game Wining Timer
  if(won){
    if(winTimer < 0){
      score += invertTime*15;
      if(score > highscore){
        highscore = score;
        newhighscore = true;
      }
      nextLevel();
    } else {
      if(winTimer <= 8000){

          if(invertTime > 0){
            invertTime--;
            score += 15;
            if(score > highscore){
              highscore = score;
              newhighscore = true;
            }
          }

          if(winTimer <= 6000){
            let invTime = 6000 - winTimer;
            let gTNum = Math.floor(invTime*(32/5600));
            let gNum = Math.min(gTNum, ghostys);

            if((gTNum <= ghostys) && invTime > ghostyCounter*175){
              ghostyCounter++;
              addPoints(200, -200 + (width/2) + Math.random()*400, -200 + (height/2) + Math.random()*400);
              if(blip.currentTime != 0){
                blip.pause();
                blip.currentTime = 0;
              }
              blip.play();
            }

            if(allSouls){
              if(!perfectPlayed){
                snd_perfect.play();

                perfectPlayed = true;
              }
              ctx.globalAlpha = (Math.sin(winTimer/200)+4)/5;
              ctx.fillStyle = "rgb(250, 250, 120)";
              ctx.font = "Bold 60px Fixedsys";
              ctx.textAlign = "center";
              ctx.fillText("PERFECT", width/2, height - 300);
              ctx.globalAlpha = 1;
            }

            let imgRow = 8;
            let imgScl = 3;
            let xWid = width/4;
            let xStart = (width/2) - (width/8);
            let xSpacing = (width/32)+6;

            let yStart = 60;
            let ySpacing = 16*imgScl + 10;

            for(let i = 0; i < gNum; i++){
              let xx = xStart + ((i % imgRow)*xSpacing);
              let yy = yStart + (Math.floor(i/imgRow)*ySpacing);

              ctx.drawImage(imgGhosty, 0, 0, 16, 16, xx, yy, 16*imgScl, 16*imgScl);
            }
          }
        }
        winTimer -= timeAdd;
        }

    }

  // Gameover Screen
  if(gameover){
    endTimer += timeAdd;
    if(endTimer > 1000){
      if(!deathMusic){
        deathMarch.play();
        deathMusic = true;
      }


      if(newhighscore){
        if(endTimer > 4000){
          ctx.font = "60px Fixedsys";
          ctx.fillStyle = "hsl(0, 9%, " + (80 + Math.sin(endTimer/300)*20) + "%)";
          ctx.fillText("NEW HIGHSCORE!", width/2, height - 100);
        }
      }

      if(endTimer > 5000){
        ctx.font = "40px Fixedsys";
        ctx.fillStyle = "hsl(0, 9%, " + (80 + Math.sin(endTimer/300)*20) + "%)";
        ctx.fillText("Touch or click to try again!", width/2, height - 20);
        if(click){
          gameRestart();
        }
      }
    }
  }








  /// GUI
  // Tolerance Meter
  let barHei = 10;
  let barX = 80;
  let barY = 50;
  let border = 10;
  let barWid = 240;

  let topY = barY - border;
  let bottomY = barY + border + barHei

  let tolPerc = Math.min(death.toleranceTimer, death.toleranceMax)/death.toleranceMax;
  let toleranceCap = Math.min(death.toleranceTimer, death.toleranceAbsMax);
  let tolExtraPerc = (Math.max(toleranceCap, death.toleranceMax)-death.toleranceMax)/(death.toleranceAbsMax-death.toleranceMax);

  // Lines
  ctx.strokeStyle = "rgb(0, 200, 0)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(152, topY);
  ctx.lineTo(152, bottomY);
  ctx.moveTo(240, topY);
  ctx.lineTo(240, bottomY);
  ctx.stroke();

  // Box
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeRect(barX - border, topY, barWid + border - 0, border + border + barHei - 0);

  // Bar
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(80, barY, 160*tolPerc, barHei);
  ctx.fillStyle = "rgb(255, 100, 0)";
  ctx.fillRect(240, barY, 80*tolExtraPerc, barHei);


  // Score
  ctx.font = "40px Fixedsys";
  ctx.textAlign = "end";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("HIGHSCORE " + fixNumber(highscore, 8), width-80, 40);
  ctx.fillText(fixNumber(score, 8), width-80, 80);

  // Time
  ctx.fillText("TIME " + fixNumber(invertTime, 3), width-80, 120);

  // Bar name
  ctx.textAlign = "start";
  ctx.fillText("EXPOSURE", barX + 30, barY - 20);

  // Speed Boost
  if(player.spdBoostTimer > 0){
    ctx.save();
    ctx.globalAlpha = Math.min(1, player.spdBoostTimer/150);
    ctx.drawImage(imgSpeedIcon, 0, 0, 16, 16, 64, 100, 16*4, 16*4);
    ctx.restore();
  }
}
