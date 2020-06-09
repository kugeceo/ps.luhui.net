/*
Noise flow field painter

Paints an image with strokes that are rotated by a flow field driven from noise.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
  https://www.openprocessing.org/sketch/472966

  */

  var canvas;
  var imgIndex = -1;
  var img;
  var frame;
  var uploadImg;
  var graphics;

  function preload() {
    img = loadImage("image/VanGog.jpg");
  }


  function p5LoadImage(dataURL){
    uploadImg = loadImage(dataURL);
    console.log(img);
    setTimeout(function(){
      setup();
    },100);
  }


  function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    frame = 0;
    clear();
  }



  function paint(pic){   
// Only seems to work inside draw..
pic.loadPixels();

if(pic.height > height-50 || pic.width > width-50){
  var sca = height/pic.height;
  scale(sca);
  translate(width/2-pic.width*sca/2, height/2-pic.height*sca/2);

}else{
  scale(1);
  translate(width/2-pic.width/2, height/2-pic.height/2);

}

// The smaller the stroke is the more the spawn count increases to capture more detail.
let count = map(frame, 0, options.drawTimes, 2, 80);

for (let i = 0; i < count; i++) {
  // Pick a random point on the image.
  let x = int(random(pic.width))
  let y = int(random(pic.height))
  
  // Convert coordinates to its index.
  let index = (y*pic.width+x)*4;

  // Get the pixel's color values.
  let r = pic.pixels[index];
  let g = pic.pixels[index+1];
  let b = pic.pixels[index+2];
  let a = pic.pixels[index+3];
  
  stroke(r, g, b, a);
  
  // Start with thick strokes and decrease over time.
  let sw = map(frame, 0, options.drawTimes, options.strokeWeight, 2);
  strokeWeight(sw);
  
  push();
  translate(x, y)
  
  // Rotate according to the noise field so there's a 'flow' to it.
  let n = noise(x*options.noiseScale, y*options.noiseScale);
  rotate(radians(map(n, 0, 1, -180, 180)));
  
  let lengthVariation = random(0.75, 1.25);
  if (a!=0) { 
    line(0, 0, options.strokeLength*lengthVariation, 0);
  }
  // Draw a highlight for more detail.
  stroke(min(r*3, 255), min(g*3, 255), min(b*3, 255), random(100));
  strokeWeight(sw*0.8);
  if (a!=0) { 
    line(0, -sw*0.15, options.strokeLength*lengthVariation, -sw*0.15);
  }
  pop();
}
}

function draw() {
  if (frame > options.drawTimes) {
    return;
  }

  if(type == "image"){
    paint(uploadImg);
  }else{
    paint(img);
  }

  frame++;
  frameRate(7);
}


function save(){
  saveFrames("image", "png", 1, 1);
}

