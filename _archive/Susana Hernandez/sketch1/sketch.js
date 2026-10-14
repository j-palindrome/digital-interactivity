let targetKey = "";
let startTime = 0;
let duration = 1000;

let colorNumber = 0;

// Audio
let soundA, soundB, soundC, soundD, soundL, soundS, soundSpace;
let osc;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }
) {
  if (p <= 0) return startLevel;
  if (p >= 1) return endLevel;

  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel;
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn);
  }

  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel;
    return (
      middleLevel +
      (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
    );
  }

  return middleLevel;
}

function setup() {
  createCanvas(400, 400);
  stroke(0);
  strokeWeight(10);
  colorMode(HSB, 360, 100, 100);

  angleMode(DEGREES);

  // Initialize p5.Oscillator for audio synthesis mastery
  osc = new p5.Oscillator("sine");
  osc.amp(0);

  background(350, 30, 100);

  // Load audio files safely using callbacks matching your file names
  loadSound("letterA.wav", (loadedSound) => { soundA = loadedSound; });
  loadSound("letterB.mp3", (loadedSound) => { soundB = loadedSound; });
  loadSound("letterC.wav", (loadedSound) => { soundC = loadedSound; });
  loadSound("letterD.wav", (loadedSound) => { soundD = loadedSound; });
  loadSound("letterL.wav", (loadedSound) => { soundL = loadedSound; });
  loadSound("letterS.wav", (loadedSound) => { soundS = loadedSound; });
  loadSound("spacebar.wav", (loadedSound) => { soundSpace = loadedSound; });
}

// Custom safe playSound wrapper
function playSound(soundObj) {
  if (soundObj && typeof soundObj.play === "function") {
    soundObj.stop(); // Stop any overlapping playback
    soundObj.play();
  }
}

// 2. draw() function loop
function draw() {
  if (colorNumber === 0) background(350, 30, 100);
  if (colorNumber === 1) background(350, 70, 100);
  if (colorNumber === 2) background(350, 100, 70);

  let currentProgress = progress();
  
  // Using frameCount subtly to drive a dynamic background anchor point or shift
  let pulse = sin(frameCount * 2) * 5;

  if (currentProgress >= 0 && currentProgress <= 1) {
    let animAlpha = envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.2,
      startLevel: 0,
      middleLevel: 100,
      endLevel: 0,
    });

    let animScale = envelope(currentProgress, {
      fadeIn: 0.3,
      fadeOut: 0.2,
      startLevel: 0.5,
      middleLevel: 1,
      endLevel: 0.8,
    });

    // A = Paw Print
    if (targetKey === "a" || targetKey === "A") {
      push();
      translate(200, 200);
      scale(animScale);
      translate(-200, -200);

      fill(0, 0, 0, animAlpha);
      noStroke();
      ellipse(200, 230, 80, 70);
      ellipse(155, 180, 30, 40);
      ellipse(180, 165, 30, 40);
      ellipse(220, 165, 30, 40);
      ellipse(245, 180, 30, 40);
      pop();
    }
    // S = Squiggly Line (uses beginShape, vertex, endShape)
    else if (targetKey === "s" || targetKey === "S") {
      stroke(0, 0, 0, animAlpha);
      strokeWeight(5);
      noFill();

      beginShape();
      vertex(50, 200);
      vertex(80, 170 + sin(currentProgress * 180) * 20);
      vertex(110, 230);
      vertex(140, 170 + sin(currentProgress * 180) * 20);
      vertex(170, 230);
      vertex(200, 170 + sin(currentProgress * 180) * 20);
      vertex(230, 230);
      vertex(260, 170 + sin(currentProgress * 180) * 20);
      vertex(290, 230);
      vertex(320, 200);
      endShape();
    }
    // L = Diagonal Line
    else if (targetKey === "l" || targetKey === "L") {
      stroke(0, 0, 0, animAlpha);
      strokeWeight(10);
      let drawLength = easeQuad(currentProgress);
      line(50, 50, 50 + 300 * drawLength, 50 + 300 * drawLength);
    } 
    // D = Smiley Face
    else if (targetKey === "d" || targetKey === "D") {
      push();
      translate(200, 200);
      scale(animScale);

      // Eyes
      fill(0, 0, 0, animAlpha);
      noStroke();
      ellipse(-40, -30, 25, 25);
      ellipse(40, -30, 25, 25);

      // Smile
      push();
      translate(0, 20);
      rotate(90); // 90 degrees
      textSize(90);
      textAlign(CENTER, CENTER);
      fill(0, 0, 0, animAlpha);
      text("D", 0, 5);
      pop();
      pop();
    }
    // C 
    else if (targetKey === "c" || targetKey === "C") {
      push();
      translate(200, 200);
      scale(animScale);
      translate(-200, -200);

      fill(120, 50, 100, animAlpha);
      stroke(0, 0, 0, animAlpha);
      strokeWeight(3);

      triangle(300, 180, 250, 260, 350, 260);
      

      strokeWeight(10);
      pop();
    }
    // B 
    else if (targetKey === "b" || targetKey === "B") {
      push();
      translate(200, 200);
      scale(animScale);
      translate(-200, -200);

      noFill();
      stroke(200, 80, 100, animAlpha);
      strokeWeight(4);

      bezier(50, 100, 100, 50, 150, 150, 200, 100);
      stroke(300, 80, 100, animAlpha);
      spline(200, 200, 250, 150, 300, 250, 350, 200);

      stroke(50, 80, 100, animAlpha);
      beginShape();
      vertex(100, 250);
      splineVertex(120, 300);
      splineVertex(180, 320);
      vertex(200, 280);
      endShape();
      pop();
    }
  }
}

function keyPressed() {
  // Ensure browser audio context starts properly on user interaction
  userStartAudio();

  // SPACEBAR = change theme color & play spacebar sound
  if (key === " ") {
    colorNumber = (colorNumber + 1) % 3;
    playSound(soundSpace);
  }

  // Trigger animations and play matching audio files
  if (key === "a" || key === "A") {
    targetKey = key;
    startTime = millis();
    playSound(soundA);
  } else if (key === "s" || key === "S") {
    targetKey = key;
    startTime = millis();
    playSound(soundS);
  } else if (key === "l" || key === "L") {
    targetKey = key;
    startTime = millis();
    playSound(soundL);
  } else if (key === "d" || key === "D") {
    targetKey = key;
    startTime = millis();
    playSound(soundD);
  } else if (key === "c" || key === "C") {
    targetKey = key;
    startTime = millis();
    playSound(soundC);
  } else if (key === "b" || key === "B") {
    targetKey = key;
    startTime = millis();
    playSound(soundB);
  }
}