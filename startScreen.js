
function loadScreen(){
  // Loading Screen
  ctx.fillStyle = "rgb(200, 200, 255)";
  ctx.textAlign = "center";
  if(first){
    ctx.font = "80px Fixedsys";
    ctx.fillText("Mustache Dark Land", width/2, 100);
    ctx.drawImage(tutorialSheet, 17, 0, 17, 17, width - 450, (height/2)-70, 17*5, 17*5);
    ctx.drawImage(tutorialSheet, 0 , 0, 17, 17, width - 400 , (height/2)-60, 17*5, 17*5);
    ctx.textAlign = "start";
    ctx.font = "40px Fixedsys";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText("*Hide on the Gravestones", 300, (height/2)+10);
    ctx.drawImage(tutorialSheet, 0 , 0, 17, 17, width - 400 , (height/2)+100, 17*5, 17*5);
    ctx.drawImage(tutorialSheet, 34, 0, 17, 17, width - 390 , (height/2)+40, 17*3, 17*3);
    ctx.fillText("*Free the spirits", 300, (height/2)+140);
    ctx.textAlign = "center";
    ctx.font = "40px Fixedsys";
    ctx.fillText("Tap to start!", width/2, height - 100);

    if(click){
      if(allDataIsLoaded || checkCompleteImages()){
        createSprites();
        gameRestart();
        first = false;
        state = levelStep;
      }
    }

  } else {
    if(loadingTimer > 0){
      loadingTimer -= timeAdd;
      ctx.font = "Bold 80px Fixedsys";
      ctx.fillText("LEVEL " + level, width/2, height/2);
    } else {
      state = levelStep;
    }
  }
}
