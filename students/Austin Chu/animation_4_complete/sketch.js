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
  osc.freq(150); 
  
  // Set frequency to 440 Hz (Note A4)
  startTime = millis(); 
  osc.start(); 
  // Start generating sound [7] 
  osc.amp(0.5, 0.3,.05); // Fade in 
  osc.amp(0, 0.5, 0.1); // Fade out over 0.8 seconds
  
  // do your SETUP functions here: play a sound for example, or setup your stroke(), strokeWeight(), etc.
  createCanvas(400, 400)
}

function draw() {
  colorMode(HSL);
  //background('white');
  //background(0, 0, 25);

  
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) { 
    
    let value_background = envelope(currentProgress, {
          fadeIn: 0.2,
          fadeOut: 0.8,
          startLevel: 5,
          middleLevel: 35,
          endLevel: 5
        });

    background(0, 0, value_background);


  strokeWeight(0);

    /*let value1 = envelope(currentProgress, {
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
    circle((2*width)/5 - 50, height/2, value2);

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


    let value1 = envelope(currentProgress, {
          fadeIn: 0.3,
          fadeOut: 0.7,
          startLevel: 0,
          middleLevel: 5*width/10,
          endLevel: 0
        });

       let value2 = envelope(currentProgress, {
          fadeIn: 0.4,
          fadeOut: 0.6,
          startLevel: 0,
          middleLevel: 7*width/10,
          endLevel: 0
        });

       let value3 = envelope(currentProgress, {
          fadeIn: 0.5,
          fadeOut: 0.5,
          startLevel: 0,
          middleLevel: 8*width/10,
          endLevel: 0
        });

       let value4 = envelope(currentProgress, {
          fadeIn: 0.6,
          fadeOut: 0.4,
          startLevel: 0,
          middleLevel: 4*width/10,
          endLevel: 0
        });

    fill(218, 100, random(65, 85));
    rect(width/10 , height/10, value1, height/10);

    fill(0, 100, random(65, 85));
    rect(width/10 , 3*height/10, value2, height/10);

    fill(53, 100, random(65, 85));
    rect(width/10 , 5*height/10, value3, height/10);

    fill(268, 100, random(65, 85));
    rect(width/10 , 7*height/10, value4, height/10);


    
    
    /* point(
      width,
      height *
        
    ) // fade from 0-1 as animation progresses */
    
  }
 

}
