let pg,img,pgnoise,pgGradient;
var noiseScale = 1000;
var red,green,blue,c,value;
var w, h;
var loc;
let myCanvas;
var num;
var n ;
var posX;
var randomX = [];

function setup(){
  w = windowWidth;
  h = windowHeight;

  if(options.Type == 'PNG' || options.Type == 'JPG'){
    myCanvas = createCanvas(w,h);
  }else if(options.Type == 'SVG'){
    myCanvas = createCanvas(w, h, SVG);
  }
  
  pg = createGraphics(w,h);

  myCanvas.class("myCanvas");
  pg.class("graphic");



  

  pgnoise = createGraphics(w,h);
  pixelDensity(1);
  for(var i = 0; i < 60000; i++){
     var noiseColor = hexToRgb(options.NoiseColor);
    pgnoise.stroke(noiseColor.r,noiseColor.g,noiseColor.b,random(options.NoiseAlpha));
    pgnoise.point(random(w),random(h));
  }


  n = 5;

  pgGradient = createGraphics(w,n*int(options.WaveY));
  for(var i = n/2*int(options.WaveY); i< n*int(options.WaveY);i++){
    var alpha= map(i, n/2*int(options.WaveY), n*int(options.WaveY),0,280);
    var bgColor = hexToRgb(options.BgColor);
    pgGradient.stroke(bgColor.r, bgColor.g, bgColor.b,alpha);
    pgGradient.line(-10,i,w+10,i);
  }

  for(var i = 0 ; i < h/(int(options.WaveY))+2;i++){
    randomX[i] = random(-options.Offset,options.Offset);
  }
}


function p5LoadImage(dataURL){
  img = loadImage(dataURL);
}



function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


function draw(){
  pixelDensity(1);
  if(options.Type == 'JPG'){
    for(var y = 0; y < h; y+=int(options.WaveY)){
      fill(options.BgColor);
      noStroke();
      rect(-20,y,width+60,int(options.WaveY));
    }
  }else if(options.Type == 'PNG'){
    background(0,0,0,0);
  }else if(options.Type == 'SVG'){
    background(0,0,0,0);
  }

  pg.background(0);
  pg.fill(255);
  pg.stroke(255);
  var n = map(w,300,2000,0,170);
  pg.textSize(int(options.textSize+n));
  pg.strokeWeight(options.textWeight); 


  if(type == "image"){
    push();
    pg.imageMode(CENTER);
    pg.image(img,w/2, h/2);
    pop();
  }else if(type ="text") {
    pg.textAlign(CENTER,CENTER);
    pg.text(options.Text,w/2,h/2);
    rectMode(CORNER);
  }
  smooth();
  push();
  drawLine(); 
  pop();

  if(options.Noise == true){
    image(pgnoise,0,0);  
  }
}



function drawLine(){
  pg.loadPixels();
  pg.pixelDensity(pixelDensity());


  for(var y = 0; y < pg.height; y+=int(options.WaveY)){
    if(options.StrokeMode == 'SolidColor'){
      stroke(options.Stroke1);
    }else if(options.StrokeMode == 'Gradient'){
      var percent = norm(y, 0, pg.height);
      var between = lerpColor(color(options.Stroke1), color(options.Stroke2), percent);
      stroke(between);
    }

    beginShape();
    for(var x = -50 ; x < pg.width+100; x+=int(options.WaveX)){
      loc = (x + y *pg.width)*4;
      var angle = noise(y/1000, x/10000, x)*TWO_PI*0.001;

      red =  pg.pixels[loc];
      green =  pg.pixels[loc+1];
      blue = pg.pixels[loc+2];
      c = color(red, green, blue);
      value = brightness(c);

      strokeWeight(options.StrokeWeight);

      if(options.FillMode == 'SolidColor'){
        fill(options.Fill1);
      }else if(options.FillMode == 'Gradient2'){
        fill(options.Fill1);
      }else if(options.FillMode == 'Gradient1'){
        var percent = norm(y, pg.height*0.3, pg.height*0.6);
        var between = lerpColor(color(options.Fill1), color(options.Fill2), percent);
        fill(between);
      }else{
        noFill();
      }

      posX = x+randomX[y/int(options.WaveY)];

      if(value > options.Brightness){
        var speed = map(options.Speed,0,10,200,1)
        if(options.Smooth == true){
          curveVertex(posX, y+sin((frameCount/(speed)+x/20+y/50))*options.Height-options.Height*2);
        }else if(options.Smooth == false){
          vertex(posX, y+sin((frameCount/(speed)+x/20+y/50))*options.Height-20);
        }
      }else{
        vertex(posX, y); 
      }
    }
    endShape();


    if(options.FillMode != 'None'){
      strokeWeight(options.StrokeWeight);
      if(options.StrokeMode == 'SolidColor'){
        stroke(options.Stroke1);
      }else{
        var percent = norm(y, 0, pg.height);
        var between = lerpColor(color(options.Stroke1), color(options.Stroke2), percent);
        stroke(between);
      } 
      fill(options.BgColor);
      rect(-20,y,width+60,int(options.WaveY));
    }else{
      strokeWeight(options.StrokeWeight);
      noFill();
    }

    if(options.FillMode == 'Gradient2'){
      image(pgGradient,0,y-n*int(options.WaveY));
    }

  }
  pg.updatePixels();
}
