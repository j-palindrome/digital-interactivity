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
  osc = new p5.Oscillator('sine');
  osc.freq(650); 
  
  // Set frequency to 440 Hz (Note A4)
  startTime = millis(); 
  osc.start(); 
  // Start generating sound [7] 
  osc.amp(0.5, 0.9,.2); // Fade in 
  osc.amp(0, 0.5, 0.1); // Fade out over 0.8 seconds

  
  // do your SETUP functions here: play a sound for example, or setup your stroke(), strokeWeight(), etc.
  createCanvas(400, 400)
}

function draw() {
  colorMode(HSL);
  



  
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) { 

  background('white');
  strokeWeight(0);
  noFill();


    push();
    colorMode(HSL);
    strokeWeight(0);
    translate(width/2, height/2);


    let value1 = envelope(currentProgress, {
          fadeIn: 0.3,
          fadeOut: 0.7,
          startLevel: 0,
          middleLevel: width/2,
          endLevel: 0
        });

        let value2 = envelope(currentProgress, {
          fadeIn: 0.4,
          fadeOut: 0.6,
          startLevel: 0,
          middleLevel: width/3,
          endLevel: 0
        });

            let value3 = envelope(currentProgress, {
          fadeIn: 0.5,
          fadeOut: 0.5,
          startLevel: 0,
          middleLevel: width/4.5,
          endLevel: 0
        });
    
    fill(0, 100, 71);
    square(0, 0, value1);


    fill(208, 100, 71);
    square(-100, -100, value2);

    fill(49, 92, 61);
    square(30, -30, value3);

    pop();
  
    
    
    
    /* point(
      width,
      height *
        
    ) // fade from 0-1 as animation progresses */
    
  }
}
