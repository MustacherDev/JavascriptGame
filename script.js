ctx.font = "40px Fixedsys";

gameRestart();

var state = loadScreen;

function step(){

  // Time elapsed
  endTime   = (new Date())-pauseTime;
  let time  = (endTime - startTime);
  startTime = new Date();
  pauseTime = 0;
  let timeRate = 1000/frameRate;

  animationTime += time;
  timeAdd += time;


  // Adjust Game Scale in the browser
  browserScaling();

  // Updates
  if(animationTime > timeRate){
    animationTime -= timeRate;

    // Background
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    // View
    view.update();

    // View Apply
    ctx.save();
    ctx.translate(view.x, view.y);

    // Game State
    state();

    ctx.restore();





    // Click detection
    if(click){
      click = false;
    }

    buttonClick = false;

    input.update();

    timeAdd = 0;
  }

  window.requestAnimationFrame(step);
}

function Click(){
  click = true;
}

window.requestAnimationFrame(step);
