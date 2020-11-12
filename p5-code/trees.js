class Tree{
  constructor(x1, y1, leftColor, rightColor){
    //   let x1 = width/10 + i * 150 ;
    // let y1 = height - height/4;
    
    this.x = x1;
    this.y = y1;
    this.leftCol = leftColor;
    this.rightCol = rightColor;
  }

  show(){
    fill(this.leftCol);//left half
    noStroke();
    beginShape();
    vertex(this.x, this.y);
    vertex(this.x-10, this.y+30);
    vertex(this.x-5, this.y+30);
    vertex(this.x-15, this.y+60);
    vertex(this.x-10, this.y+60);
    vertex(this.x-20, this.y+100);
    vertex(this.x, this.y+100);
    endShape();

    fill(this.rightCol);//right half
    noStroke();
    beginShape();
    vertex(this.x, this.y);
    vertex(this.x+10, this.y+30);
    vertex(this.x+5, this.y+30);
    vertex(this.x+15, this.y+60);
    vertex(this.x+10, this.y+60);
    vertex(this.x+20, this.y+100);
    vertex(this.x, this.y+100);
    endShape();
    fill(25,18,8);
    rectMode (CENTER);
    rect(this.x,this.y+115,8,30);
    
  }
}