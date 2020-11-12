//serial comm
let serial;
let portName = '/dev/cu.usbmodem141201';

// orientation variables:
// let heading = 0.0;
let pitch = 0.0;
// let roll = 0.0;
let xAcc = 0.0;
let zAcc = 0.0

//birds

let flock;
let birds = [];
let bird;

let noiseScale = 0.02;
let c1, c2;
let r1, g1, b1, r2, g2, b2;

let scene3mountain;
let mountr, mountg, mountb;

let scene3field;
let fieldr, fieldg, fieldb;

let scene3tree = [];
let tree1r, tree1g, tree1b, tree2r, tree2g, tree2b;

let trees = [];

//tree offset (not working yet)
let offsetx, offsety;

let a = 0;

function preload() {
  for (let i = 0; i < 4; i++) {
    birds[i] = loadImage('birds/bird' + i + '.png');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  serial = new p5.SerialPort();
  serial.on('open', startSerial);
  serial.on('data', serialEvent);
  serial.open(portName);

  //bird
  flock = new Flock();

  //tree
  for (let i = 0; i < 11; i++) {
    scene3tree = [color(0, 255, 0), color(0, 155, 0)];
    let x1 = width / 10 + i * 150 + random(-width / 10, width / 10);
    let y1 = height - height / 4 + random(0, 20);

    trees.push(new Tree(x1, y1, scene3tree[0], scene3tree[1]));
  }
}

function startSerial() {
  // console.log('serial port opened');
}

function serialEvent() {
  // read from port until new line:
  let message = serial.readStringUntil('\n');
  //console.log(message);
  if (message != null) {
    let list = split(trim(message), ',');
    if (list.length >= 3) {
      // convert list items to floats:
      pitch = float(list[0]);
      xAcc = float(list[1]);
      zAcc = float(list[2]);
      // console.log(pitch + ',' + xAcc + ',' + zAcc);
    }
  }
}

function draw() {
  // Gradient!
  if (pitch < 0) {
    r1 = map(pitch, -86, 0, 45, 180);
    g1 = map(pitch, -86, 0, 121, 102);
    b1 = map(pitch, -86, 0, 120, 10);
    r2 = map(pitch, -86, 0, 226, 0);
    g2 = map(pitch, -86, 0, 176, 102);
    b2 = map(pitch, -86, 0, 161, 153);
  } else {
    r1 = map(pitch, 0, 86, 180, 11);
    g1 = map(pitch, 0, 86, 102, 11);
    b1 = map(pitch, 0, 86, 10, 76);
    r2 = map(pitch, 0, 86, 0, 37);
    g2 = map(pitch, 0, 86, 102, 94);
    b2 = map(pitch, 0, 86, 153, 107);
  }
  c1 = color(r1, g1, b1);
  c2 = color(r2, g2, b2);
  drawGradient(0, 0, width, height, c1, c2, 1);
  // Scene colors
  mountr = map(pitch, -86, 0, 23, 20);
  mountg = map(pitch, -86, 0, 45, 20);
  mountb = map(pitch, -86, 0, 32, 22);
  fieldr = map(pitch, -86, 86, 106, 34);
  fieldg = map(pitch, -86, 86, 165, 51);
  fieldb = map(pitch, -86, 86, 106, 53);
  tree1r = map(pitch, -86, 86, 34, 20);
  tree1g = map(pitch, -86, 86, 94, 42);
  tree1b = map(pitch, -86, 86, 72, 40);
  tree2r = map(pitch, -86, 86, 58, 22);
  tree2g = map(pitch, -86, 86, 130, 55);
  tree2b = map(pitch, -86, 86, 106, 53);
  scene3mountain = color(mountr, mountg, mountb, a);
  scene3field = color(fieldr, fieldg, fieldb);
  scene3tree = [color(tree1r, tree1g, tree1b), color(tree2r, tree2g, tree2b)];
  //reassign tree colors
  for (let i = 0; i < trees.length; i++) {
    trees[i].leftCol = scene3tree[0];
    trees[i].rightCol = scene3tree[1];
  }

  drawMountain1();
  drawMountain2();
  //birds
  if (xAcc < -1.1 || zAcc > 1.8 || xAcc > 1.1){
    drawBird();
    }
  flock.run();
  drawMountain3();

  //field
  fill(scene3field);
  noStroke();
  bezier(width + width / 5, height, width / 2, height - 100, width / 10, height, -width / 2, height);

  // //snowglobe
  // noStroke();
  // fill(250,10);
  // ellipse(width/2, height/2, 480);

  //tree

  for (let i = 0; i < trees.length; i++) {
    trees[i].show();
    // console.log(trees[i].x);
  }
}

function drawGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function drawMountain1() {

  beginShape();
  let terrainSpeed = 0.00002;
  let terrainDetail = 0.005;

  for (let i = 0; i <= width; i++) {
    let t = (i * terrainDetail) + (millis() * terrainSpeed);
    let j = map(noise(t), 0, 1, 0, height / 2);
    scene3mountain.setAlpha(50);
    stroke(scene3mountain);
    line(i, j, i, height);
  }
  endShape();
}

function drawMountain2() {
  beginShape();
  var terrainSpeed = 0.00005;
  var terrainDetail = 0.006;

  for (var i = 0; i <= width; i++) {
    var t = ((i - width) * terrainDetail) + (millis() * terrainSpeed);
    var j = map(noise(t), 0, 1, 0, height);
    scene3mountain.setAlpha(180);
    stroke(scene3mountain);
    line(i, j, i, height);
  }
  endShape();
}

function drawMountain3() {

  beginShape();
  var terrainSpeed = 0.0001;
  var terrainDetail = 0.006;

  for (var i = 0; i <= width; i++) {
    var t = ((i + width) * terrainDetail) + (millis() * terrainSpeed);
    var j = map(noise(t), 0, 0.8, height, height / 2);
    scene3mountain.setAlpha(180);
    stroke(scene3mountain);
    line(i, j, i, height);
  }
  endShape();
}

//------- code for birds ---------//

function drawBird() {
  for (let i = 0; i < 10; i++) {
    let b = new Boid(0, height / 2);
    flock.addBoid(b);
  }
}

// Flock object, manages the array of all the boids
function Flock() {
  this.boids = []; // Initialize the array

}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y, img) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(0.2, 2), random(-0.5, 0));
  this.position = createVector(x, y);
  this.r = 8.0;
  this.bird = img;
  bird = random(birds);
  this.maxspeed = 8; // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids); // Separation
  let ali = this.align(boids); // Alignment
  let coh = this.cohesion(boids); // Cohesion
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
}

Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  let steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  return steer;
}

Boid.prototype.render = function() {
  // Draw birds
  let theta = this.velocity.heading() + radians(90);
  fill(0);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  image(bird, 10, 10, this.r * 2, -this.r * 2);
  pop();
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < desiredseparation)) {
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++; // Keep track of how many
    }
  }
  if (count > 0) {
    steer.div(count);
  }

  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum); // Steer towards the location
  }
}