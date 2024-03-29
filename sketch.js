var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup,trashGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, trash1,trash2,trash3;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("dog1.png","dog2.png","dog3.png","dog4.png","dog5.png");
  trex_collided = loadAnimation("dog7.png");
  trex_standing = loadAnimation("dog6.png");
  groundImage = loadImage("background.png");
  
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("c5.png");
  obstacle2 = loadImage("c7.png");
  obstacle3 = loadImage("c11.png");
 
  trash1=loadImage("can.png")
  trash2=loadImage("polythen bag.png")
  trash3=loadImage("banana.png")

  restartImg = loadImage("reset.png")
  gameOverImg = loadImage("Game Over.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1400, 600);
  ground = createSprite(700,300,1400,600);
  ground.addImage("ground",groundImage);
  ground.scale = 2.2;
  
  trex = createSprite(50,300,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("standing",trex_standing);
  

  trex.scale = 0.5;
  
 

  
  gameOver = createSprite(700,300);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(700,500);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.3;
  restart.scale = 0.3;
  
  invisibleGround = createSprite(700,320,1400,50);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
trashGroup=createGroup();
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  //displaying score
  text("Score: "+ score,1000,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
  
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%15000 === 0){
       checkPointSound.play() 
    }
    
    if(keyDown("RIGHT_ARROW")){

      trex.x += 5;

      
    }
    if(keyWentDown('UP_ARROW')){
       
   trex.changeAnimation("standing", trex_standing)
    }

    if(keyWentUp("UP_ARROW")){

      trex.changeAnimation("running", trex_running)
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    
  //spawn the trash
    spawnTrash();
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
    if(trashGroup.isTouching(trex)){
      //trex.velocityY = -12;
      if(score>0 && score%15000 === 0){
        checkPointSound.play() 
     }
     
    
  }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
         trex.changeAnimation("collided", trex_collided);
         text(700,50)
         text("EVERYDAY A DOG IS GETTING KILLED BY ROAD ACCIDENTS")
        text("WE SHOULD MAKE A PLACE WHERE ALL THE ANIMALS ESPECIALLY THE STREET DOGS CAN LIVE ")
         text("DRIVE CAUTIOUSLY")
         text("AND DONT LITTER THE ROADS OR ELSE THE STREET ANIMALS CAN EAT THEM AND THEY WOULD DIE")
         
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    trashGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
    trashGroup.setVelocityXEach(0);   
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState=PLAY
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0

}


function spawnObstacles(){
 if (frameCount % 50 === 0){
   var obstacle = createSprite(50,1350,10,40);
   obstacle.x=Math.round(random(200,1270))
   obstacle.velocityY = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
     
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(1400,100,10,10);
    cloud.y=Math.round(random(50,150))
   cloud.velocityX = -3
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
function spawnTrash() {
  if (frameCount % 100 === 0){
   var trash = createSprite(1400,300,10,10);
   trash.y=Math.round(random(250,350))
   trash.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand1 = Math.round(random(1,3));
    switch(rand1) {
      case 1: trash.addImage(trash1);
      trash.scale = 0.1;
              break;
      case 2: trash.addImage(trash2);
      trash.scale = 0.2;
              break;
      case 3: trash.addImage(trash3);
      trash.scale = 0.1;
              break;
     
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    
   trash.lifetime =1400
   
   //add each obstacle to the group
    trashGroup.add(trash);
 }
}


