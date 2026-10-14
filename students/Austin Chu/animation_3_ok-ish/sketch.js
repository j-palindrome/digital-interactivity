let mycolor
let rotatation
let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }
) {
  // inTime fades in (start -> middle), outTime fades out (middle -> end)
  if (p <= 0) return startLevel
  if (p >= 1) return endLevel
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn)
  }
  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel
    return (
      middleLevel +
      (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
    )
  }
  return middleLevel
}

function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress

    // Create a sine wave tone 
  osc = new p5.Oscillator('triangle');
  osc.freq(360); 
  
  // Set frequency to 440 Hz (Note A4)
  startTime = millis(); 
  osc.start(); 
  // Start generating sound [7] 
  osc.amp(0.7, 0.05); // Fade in 
  osc.amp(0.0, 0.9, 0.2); // Fade out over 0.8 seconds

  
  // do your SETUP functions here: play a sound for example, or setup your stroke(), strokeWeight(), etc.
  createCanvas(400, 400)

  let mycolor = fill('yellow');
}

function draw() {
  background('white');
  colorMode(HSL);
  angleMode(DEGREES);
  

  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) { 

    let y1 = envelope(currentProgress, {
          fadeIn: 0.3,
          fadeOut: 0.7,
          startLevel: -433*width/4000 - 20,
          middleLevel: -433*width/4000 - 10,
          endLevel: -433*width/4000
        }) 

        let y2 = envelope(currentProgress, {
          fadeIn: 0.3,
          fadeOut: 0.7,
          startLevel: -5*width/16 - 20,
          middleLevel: -5*width/16 - 10,
          endLevel: -5*width/16
        }) 

            let y3 = envelope(currentProgress, { 
          fadeIn: 0.3,
          fadeOut: 0.7,
          startLevel: -5*width/16 - 20,
          middleLevel: -5*width/16 - 10,
          endLevel: -433*width/4000
        }) 

    

  push();
  
  strokeWeight(1);
  stroke('orange');
  fill(mycolor);
  circle(width/2, height/2, width/4);
  pop();



  push();
  strokeWeight(0);
  angleMode(DEGREES);

  translate(width/2, height/2);

  fill('orange');

  for (i = 0; i < 361; i += 45) {
   triangle(-width/16, y1, 0, y2, width/16, y3);  

    rotate(i);
  }

  pop();

  
    
    
    
    /* point(
      width,
      height *
        
    ) // fade from 0-1 as animation progresses */
    
  }
}
