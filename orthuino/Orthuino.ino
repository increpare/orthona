/*
Hello, World! example
June 11, 2015
Copyright (C) 2015 David Martinez
All rights reserved.
This code is the most basic barebones code for writing a program for Arduboy.

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.
*/

#include "Arduboy2.h"
#include "generatedbitmaps.h"
#include "entitynames.h"
#include "bitmaps.h"

#define var int

// make an instance of arduboy used for many functions
Arduboy2 arduboy;


// This function runs once in your game.
// use it for anything that needs to be set only once in your game.
void setup() {
  Serial.begin(9600);
  // initiate arduboy instance
  arduboy.boot();

  // here we set the framerate to 15, we do not need to run at
  // default 60 and it saves us battery life
  arduboy.setFrameRate(15);
  doRender();
}


int cursorx = 0;
int cursory = 0;

const int W=128;
const int H=64;
int i=0;

const int world_w=10;
const int world_h=5;
int worldContents[10][5] = {
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
  {-1,-1,-1,-1,-1},
};

int worldContents_Lines[10][5] = {
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
};

int worldContents_Shadows[10][5] = {
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
  {0,0,0,0,0},
};

const int world_off_x=5;
const int world_off_y=3;

const int tilesize=9;
const int linelength=3;

int state=0;

int wcx=world_w/2;
int wcy=world_h/2;

int ldx=0;
int ldy=0;

void drawNot(int x1, int x2, int y1, int y2){

}
void drawWorld(){

  if (state==2){
    var x1=world_off_x+(tilesize+linelength)*wcx+tilesize/2;
    var y1=world_off_y+(tilesize+linelength)*wcy+tilesize/2;
    var x2=x1+ldx*(tilesize+linelength);
    var y2=y1+ldy*(tilesize+linelength);
    arduboy.drawLine(x1,y1,x2,y2,1);
  }


  for (int i=0;i<world_w;i++){
    int px = world_off_x+(tilesize+linelength)*i;
    for (int j=0;j<world_h;j++){
      int v = worldContents_Lines[i][j];
      int s = worldContents_Shadows[i][j];
      if (v != 0){
        if (v&0b0001){
          var dx=1;
          var dy=0;
          var x1=world_off_x+(tilesize+linelength)*i+tilesize/2;
          var y1=world_off_y+(tilesize+linelength)*j+tilesize/2;
          var x2=x1+dx*(tilesize+linelength);
          var y2=y1+dy*(tilesize+linelength);
          arduboy.drawLine(x1,y1,x2,y2,1);
          drawNot(x1,y1,x2,y2);
        }
        if (v&0b0010){
          var dx=0;
          var dy=1;
          var x1=world_off_x+(tilesize+linelength)*i+tilesize/2;
          var y1=world_off_y+(tilesize+linelength)*j+tilesize/2;
          var x2=x1+dx*(tilesize+linelength);
          var y2=y1+dy*(tilesize+linelength);
          arduboy.drawLine(x1,y1,x2,y2,1);
        }
        if (v&0b0100){
          var dx=1;
          var dy=1;
          var x1=world_off_x+(tilesize+linelength)*i+tilesize/2;
          var y1=world_off_y+(tilesize+linelength)*j+tilesize/2;
          var x2=x1+dx*(tilesize+linelength);
          var y2=y1+dy*(tilesize+linelength);
          arduboy.drawLine(x1,y1,x2,y2,1);
        }
        if (v&0b1000){
          var dx=1;
          var dy=-1;
          var x1=world_off_x+(tilesize+linelength)*i+tilesize/2;
          var y1=world_off_y+(tilesize+linelength)*j+tilesize/2;
          var x2=x1+dx*(tilesize+linelength);
          var y2=y1+dy*(tilesize+linelength);
          arduboy.drawLine(x1,y1,x2,y2,1);
        }
      }      
    }
  }

  for (int i=0;i<world_w;i++){
    int px = world_off_x+(tilesize+linelength)*i;
    for (int j=0;j<world_h;j++){
      int t = worldContents[i][j];
      if (t>=0){
        int py = world_off_y+(tilesize+linelength)*j;
        arduboy.drawBitmap(px,py, tiles_m[t], 9,9, 0);
        arduboy.drawBitmap(px,py, tiles_fg[t], 8,8, 1);
      }      
    }
  }

  {
    int px = world_off_x+(tilesize+linelength)*wcx-1;
    int py = world_off_y+(tilesize+linelength)*wcy-1;
    arduboy.drawBitmap(px,py, state==2?linepointer:pointer, 11,11, 1);
  }
}

void drawPanel(){


  const int panelW = 9*5+2;
  const int panelH = 9*7+2;
  const int offX = W/2-panelW/2;
  int offY = H/2-panelH/2;

  if (cursory==6){
    offY--;
  }

  arduboy.drawFastVLine(offX-2,0,H,1);
  arduboy.drawFastVLine(offX-10,0,H,1);
  arduboy.drawFastVLine(offX+panelW+1,0,H,1);
  //arduboy.drawFastVLine(offX+panelW+1+8,0,H,1);

  for (int i=0;i<35;i++){
    int x = i%5;
    int y = i/5;
    int px = offX+x*9;
    int py = offY+y*9;
    if (x==cursorx){
      px++;
    } else if (x>cursorx){
      px+=2;
    }
    
    if (y==cursory){
      py++;
    } else if (y>cursory){
      py+=2;
    }

    arduboy.drawBitmap(px,py, tiles_fg[i], 8,8, 1);
  }

  arduboy.drawBitmap(offX+cursorx*9,offY+cursory*9,pointer,11,11,1);
  char* s = entityNames[cursorx+5*cursory];
  int len = strlen(s);
  int strheight = len*8;
  int stroffset=H/2-strheight/2;
  if (stroffset>3){
    stroffset=3;
  }
  for(int i=0;s[i]!=0;i++){
    arduboy.setCursor(offX-8, stroffset+8*i);
    arduboy.print(s[i]);
  }
}

const int ANY_BUTTON = LEFT_BUTTON+UP_BUTTON+DOWN_BUTTON+RIGHT_BUTTON+A_BUTTON+B_BUTTON;


void doRender(){
  
  // first we clear our screen to black
  arduboy.clear();

  if (state==0){
    drawWorld();
  } else if (state==1){
    drawPanel();
  } else {
    drawWorld();
  }

  arduboy.display();
}


void mainLogic(){  

  if (arduboy.justPressed(RIGHT_BUTTON)){
    if (wcx<world_w-1){
      wcx++;
    }
  }
  if (arduboy.justPressed(LEFT_BUTTON)){
    if (wcx>0){
      wcx--;
    }
  }
  if (arduboy.justPressed(DOWN_BUTTON)){
    if (wcy<world_h-1){
      wcy++;
    }
  }
  if (arduboy.justPressed(UP_BUTTON)){
    if (wcy>0){
      wcy--;
    }
  }

  if (arduboy.justPressed(B_BUTTON)){
    if (worldContents[wcx][wcy]==-1){
      state=1;
    } else {
      ldx=0;
      ldy=0;
      state=2;
    }
  }

  if (arduboy.pressed(A_BUTTON)){
    worldContents[wcx][wcy]=-1;
    //clear out lines touching the point as
  }

}

void iconSelectLogic(){
  if (arduboy.justPressed(RIGHT_BUTTON)){
    if (cursorx<4){
      cursorx++;
    }
  }
  if (arduboy.justPressed(LEFT_BUTTON)){
    if (cursorx>0){
      cursorx--;
    }
  }
  if (arduboy.justPressed(DOWN_BUTTON)){
    if (cursory<6){
      cursory++;
    }
  }
  if (arduboy.justPressed(UP_BUTTON)){
    if (cursory>0){
      cursory--;
    }
  }

  if (arduboy.justPressed(B_BUTTON)){
    worldContents[wcx][wcy]=cursorx+5*cursory;
    state=0;
  }
}

void lineDrawLogic(){
    if (arduboy.justPressed(LEFT_BUTTON)){
      if (ldx==-1){
        if (ldy!=0){
          ldy=0;
        } else {
          ldx=0;
        }
      } else {
        ldx=-1;
      }
    }
    if (arduboy.justPressed(UP_BUTTON)){
      if (ldy==-1){
        if (ldx!=0){
          ldx=0;
        } else {
          ldy=0;
        }
      } else {
        ldy=-1;
      }
    }
    if (arduboy.justPressed(RIGHT_BUTTON)){
      if (ldx==1){
        if (ldy!=0){
          ldy=0;
        } else {
          ldx=0;
        }
      } else {
        ldx=1;
      }
    }
    if (arduboy.justPressed(DOWN_BUTTON)){
      if (ldy==1){
        if (ldx!=0){
          ldx=0;
        } else {
          ldy=0;
        }
      } else {
        ldy=1;
      }
    }
    if (arduboy.justPressed(B_BUTTON)){
      int loffx=0;
      int loffy=0;   

      
      Serial.print("before : ");
      Serial.print(ldx);
      Serial.print(",");
      Serial.println(ldy);

      if (ldx==-1&&ldy==0){
        Serial.println("A");
        loffx=-1;
        ldx=1;
      }    
      if (ldx==0&&ldy==-1){
        Serial.println("B");
        loffy=-1;
        ldy=1;
      }    
      if (ldx==-1&&ldy==-1){
        Serial.println("C");
        loffx=-1;
        loffy=-1;
        ldx=1;
        ldy=1;
      }   
      if (ldx==-1&&ldy==1){
        Serial.println("D");
        loffx=1;
        loffy=-1;
        ldx=1;
        ldy=-1;
      }   

      Serial.print("after : ");
      Serial.print(ldx);
      Serial.print(",");
      Serial.println(ldy);

      var nx=wcx+loffx;
      var ny=wcy+loffy;
      if (ldx==1&&ldy==-1){
        const int m = 0b1000;
        if (worldContents_Lines[nx][ny]&m){
          if (worldContents_Shadows[nx][ny]&m==0){
            worldContents_Shadows[nx][ny]|=m;
          } else {
            worldContents_Lines[nx][ny]&=m; 
          }
        } else {
          worldContents_Lines[nx][ny]|=m;
          worldContents_Shadows[nx][ny]&=m;
        }
      } else if (ldx==1&&ldy==1){
        worldContents_Lines[nx][ny]|=0b0100;
      } else if (ldx==1){
        worldContents_Lines[nx][ny]|=0b0001;
      } else if (ldy==1){
        worldContents_Lines[nx][ny]|=0b0010;
      } else {
        worldContents_Lines[nx][ny]=0b0000;        
      }
      state=0;
    }
}

bool nothingHappened(){
  return !(
          arduboy.justPressed(UP_BUTTON) ||
          arduboy.justPressed(DOWN_BUTTON) ||
          arduboy.justPressed(LEFT_BUTTON) ||
          arduboy.justPressed(RIGHT_BUTTON) ||
          arduboy.justPressed(A_BUTTON) ||
          arduboy.justPressed(B_BUTTON) //||
          // arduboy.justReleased(UP_BUTTON) ||
          // arduboy.justReleased(DOWN_BUTTON) ||
          // arduboy.justReleased(LEFT_BUTTON) ||
          // arduboy.justReleased(RIGHT_BUTTON) ||
          // arduboy.justReleased(A_BUTTON) ||
          // arduboy.justReleased(B_BUTTON)
          );
}

// our main game loop, this runs once every cycle/frame.
// this is where our game logic goes.
void loop() {
  // pause render until it's time for the next frame
  if (!(arduboy.nextFrame()))
    return;

  arduboy.pollButtons();
  
  if (nothingHappened()){
    return;
  }

  if (state==0){
    mainLogic();
  } else if (state==1){
    iconSelectLogic();
  } else {
    lineDrawLogic();
  }
  doRender();
}

