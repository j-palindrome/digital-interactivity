let sound;
let button;

async function setup() {
  createCanvas(300,300);
  sound = await loadSound("birdchirp.wav",loaded);
  button = createButton("play");
  button.mousePressed(toggleStarted);
  background("lightgray");
}
 function loaded(){
 console.log("loaded");
  }

function toggleStarted() {
    if(!sound.isPlaying()) {
    sound.play();
    button.html("pause");
  } else {
    sound.pause();
    button.html("play"); 
  }
}
