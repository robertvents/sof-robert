let firstNameInput, lastNameInput, dobInput, courseSelect, paymentSelect, submitButton;
let swpsBall, youBall;
let swpsDir = 1; 
let youDir = -1; 
let rotationSpeed = 0.05; 
let video; 
let filterOn = false;
let pixelationLevel = 10;
let glitchOn = false;
let Font; 
let myFont;


function preload() {
  myFont = loadFont('CoreSansC.ttf');
  smallFont = loadFont('Montreal.ttf');
}


function setup() {
  createCanvas(500, 700); 
  background(240);
  textFont(smallFont);
  fullscreen(true);
  
    // Dodaj załadowany font jako niestandardowy font w CSS
  let fontFace = new FontFace('CustomFont', `url(CoreSansC.ttf)`);
  document.fonts.add(fontFace);
  let fontFace2 = new FontFace('TextFont', `url(Montreal.ttf)`);
  document.fonts.add(fontFace2);
 

  video = createCapture(VIDEO);
  video.size(150, 200);
  video.hide(); 

  textSize(20);
  textAlign(CENTER);
  text("SWPS University Registration Form", 0, 40);

  textSize(14);
  textAlign(LEFT);
  let formX = width / 2 - 180; 
  let formY = 200; 
  
  // Ustaw styl dla tego elementu HTML
  /*fontFace.load().then(() => {
    submitButton.style('font-family','CustomFont');
    firstNameInput.style('font-family','CustomFont');
    //button.style('font-weight', 'bold'); // Opcjonalnie dodaj pogrubienie
  });*/
  
  
  
  createElement('heading', 'First Name:').position(formX, formY).style('font-family', 'CustomFont');
  firstNameInput = createInput('').position(formX, formY + 20).size(360, 20).style('font-family', 'TextFont');
  createElement('heading', 'Last Name:').position(formX, formY + 60).style('font-family', 'CustomFont');
  lastNameInput = createInput('').position(formX, formY + 80).size(360, 20).style('font-family', 'TextFont');
  createElement('heading', 'Date of Birth:').position(formX, formY + 120).style('font-family', 'CustomFont');
  dobInput = createInput('', 'date').position(formX, formY + 140).size(360, 20).style('font-family', 'TextFont');
  createElement('heading', 'Course:').position(formX, formY + 180).style('font-family', 'CustomFont');
  courseSelect = createSelect().position(formX, formY + 200).size(360, 20).style('font-family', 'TextFont');
  courseSelect.option('Communication Design');
  courseSelect.option('Product Design');
  courseSelect.option('English Track');
  courseSelect.changed(handleCourseChange);
  createElement('heading', 'Payment Scheme:').position(formX, formY + 240).style('font-family', 'CustomFont');
  paymentSelect = createSelect().position(formX, formY + 260).size(360, 20).style('font-family', 'TextFont');
  paymentSelect.option('Monthly');
  paymentSelect.option('Semester');
  paymentSelect.option('Yearly');
  submitButton = createButton('Submit').position(formX, formY + 300).size(360, 30).style('font-family', 'CustomFont');
   
  submitButton.style('background-color', 'rgb(62,84,140)');
  submitButton.style('color', 'white');
  submitButton.mouseOver(applyFilter);
  submitButton.mouseOut(removeFilter);
  submitButton.mousePressed(submitForm);

  swpsBall = new Ball(width / 3, height - 75, "SWPS", color(0), color(255)); 
  youBall = new Ball(2 * width / 3, height - 75, "YOU", color(255), color(0)); 
}

function draw() {
  background(240);

  if (filterOn) {
    applyPixelation();
  } else {
    image(video, width - 220, 20, 200, 150);
  }

  swpsDir = swpsBall.update(swpsDir);
  swpsBall.display();
  swpsBall.rotate(rotationSpeed * swpsDir);

  youDir = youBall.update(youDir);
  youBall.display();
  youBall.rotate(rotationSpeed * youDir);

  if (swpsBall.intersects(youBall)) {
    swpsBall.label = "US";
    youBall.label = "US";
  } else {
    swpsBall.label = "SWPS";
    youBall.label = "YOU";
  }

  if (glitchOn) {
    applyGlitchEffect();
  }
}

function applyFilter() {
  filterOn = true;
}

function removeFilter() {
  filterOn = false;
}

function applyPixelation() {
  video.loadPixels();
  for (let y = 0; y < video.height; y += pixelationLevel) {
    for (let x = 0; x < video.width; x += pixelationLevel) {
      let i = 4 * (y * video.width + x);
      let r = video.pixels[i];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];

      for (let dy = 0; dy < pixelationLevel; dy++) {
        for (let dx = 0; dx < pixelationLevel; dx++) {
          let j = 4 * ((y + dy) * video.width + (x + dx));
          video.pixels[j] = r;
          video.pixels[j + 1] = g;
          video.pixels[j + 2] = b;
        }
      }
    }
  }
  video.updatePixels();
  image(video, width - 220, 20, 200, 150);
}

function handleCourseChange() {
  if (courseSelect.value() === 'English Track') {
    glitchOn = true;
  } else {
    glitchOn = false;
  }
}

function applyGlitchEffect() {
  loadPixels();
  let d = pixelDensity();
  let totalPixels = 4 * (width * d) * (height * d);
  let glitchAmount = 0.1; 
  
  for (let i = 0; i < totalPixels; i += 4) {
    if (random() < glitchAmount) {
      let offset = int(random(-10, 10)) * 4; // Random offset for glitch effect
      let newIndex = i + offset;
      if (newIndex >= 0 && newIndex < totalPixels) {
        pixels[newIndex] = pixels[i];
        pixels[newIndex + 1] = pixels[i + 1];
        pixels[newIndex + 2] = pixels[i + 2];
        pixels[newIndex + 3] = pixels[i + 3];
      }
    }
  }
  
  for (let i = 0; i < 50; i++) { 
    let xOffset = int(random(width));
    let yOffset = int(random(height));
    let w = int(random(10, 50)); // Width of the glitch block
    let h = int(random(50, 100)); // Height of the glitch block
    let xShift = int(random(-10, 10));
    let yShift = int(random(-10, 10));

    for (let y = yOffset; y < yOffset + h && y < height; y++) {
      for (let x = xOffset; x < xOffset + w && x < width; x++) {
        let index = 4 * (y * width + x);
        let newIndex = 4 * ((y + yShift) * width + (x + xShift));
        if (newIndex >= 0 && newIndex < pixels.length) {
          pixels[newIndex] = pixels[index];
          pixels[newIndex + 1] = pixels[index + 1];
          pixels[newIndex + 2] = pixels[index + 2];
          pixels[newIndex + 3] = pixels[index + 3];
        }
      }
    }
  }
  
  updatePixels();
}

function submitForm() {
  let firstName = firstNameInput.value();
  let lastName = lastNameInput.value();
  let dob = dobInput.value();
  let course = courseSelect.value();
  let payment = paymentSelect.value();

  console.log(`First Name: ${firstName}`);
  console.log(`Last Name: ${lastName}`);
  console.log(`Date of Birth: ${dob}`);
  console.log(`Course: ${course}`);
  console.log(`Payment Scheme: ${payment}`);
  window.open("https://lotapola.github.io/peclass/","_self");
}

class Ball {
  constructor(x, y, label, col, textColor) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.color = col;
    this.textColor = textColor;
    this.radius = 60;
    this.angle = 0;
  }

  update(direction) {
    this.x += direction * 1.5;

    if (this.x <= this.radius || this.x >= width - this.radius) {
      direction *= -1;
    }
    return direction;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    noStroke();
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    fill(this.textColor);
    textSize(25);
    textAlign(CENTER, CENTER);
    text(this.label, 0, 0);
    pop();
  }

  rotate(speed) {
    this.angle += speed;
  }

  intersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return (d < this.radius + other.radius);
  }
}
