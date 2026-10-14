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
  osc = new p5.Oscillator('sawtooth');
  osc.freq(800); 
  
  // Set frequency to 440 Hz (Note A4)
  startTime = millis(); 
  osc.start(); 
  // Start generating sound [7] 
  osc.amp(0.5, 0.3,.2); // Fade in 
  osc.amp(0, 0.6, 0.1); // Fade out over 0.8 seconds

  
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

    
  /*
    let value1 = envelope(currentProgress, {
          fadeIn: 0.2,
          fadeOut: 0.8,
          startLevel: 0,
          middleLevel: 60,
          endLevel: 0
        });
    fill('gold');
    circle(width/5 - 50, height/2, value1);

  let value2 = envelope(currentProgress, {
          fadeIn: 0.3,
          fadeOut: 0.7,
          startLevel: 0,
          middleLevel: 70,
          endLevel: 0
        });

    fill(4, 88, 67);
    circle(2*width/5 - 50, height/2, value2);

  let value3 = envelope(currentProgress, {
          fadeIn: 0.4,
          fadeOut: 0.6,
          startLevel: 0,
          middleLevel: 80,
          endLevel: 0
        });

    fill(201, 88, 67);
    circle((3*width)/5 - 50, height/2, value3);


  let value4 = envelope(currentProgress, {
          fadeIn: 0.5,
          fadeOut: 0.5,
          startLevel: 0,
          middleLevel: 90,
          endLevel: 0
        });

    fill(99, 59, 71);
    circle((4*width)/5 - 50, height/2, value4);


  let value5 = envelope(currentProgress, {
          fadeIn: 0.6,
          fadeOut: 0.4,
          startLevel: 0,
          middleLevel: 100,
          endLevel: 0
        });
    fill('purple');
    circle(width - 50, height/2, value5);
*/
    push();
    colorMode(HSL);
    strokeWeight(0);
    translate(width/2, height/2);


    let value1 = envelope(currentProgress, {
          fadeIn: 0.5,
          fadeOut: 0.5,
          startLevel: 100,
          middleLevel: 0,
          endLevel: -100
        });

        let value2 = envelope(currentProgress, {
          fadeIn: 0.5,
          fadeOut: 0.5,
          startLevel: 80,
          middleLevel: 0,
          endLevel: -80
        });

            let value3 = envelope(currentProgress, {
          fadeIn: 0.5,
          fadeOut: 0.5,
          startLevel: 64,
          middleLevel: 0,
          endLevel: -64
        });
    
    
    fill(134, 100, 31);
    triangle(value1, -75, 0, 50, 100, -75);


    fill(198, 100, 75);
    triangle(value2, -60, 0, 40, 80, -60);

    fill(33, 100, 71);
    triangle(value3, -48, 0, 32, 64, -48);

    pop();
  
    
    
    
    /* point(
      width,
      height *
        
    ) // fade from 0-1 as animation progresses */
    
  }
}
