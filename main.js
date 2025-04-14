import {Ball, Paddel} from './ball.js'

console.log("Starting")
const cuPressedKey = {'key':''}
let gameRunning = false;
//set games fps:
let game_fps = 60
let miliseconds = 1000
const frametime = miliseconds / game_fps

const canvas = document.getElementById("spielfeld");
let fieldSize_X = canvas.width
let fieldSize_y = canvas.height
const ctx = canvas.getContext("2d");

// initialise playfieldobjects
let playBall = new Ball()
let paddel1 = new Paddel(fieldSize_X, fieldSize_y, true )
let paddel2 = new Paddel(fieldSize_X, fieldSize_y, false)
let player_paddels = [paddel1, paddel2]
let loopCount = 0
let player1_score = 0
let player2_score = 0
const player1_score_element = document.getElementById("scorePlayer1")
const player2_score_element = document.getElementById("scorePlayer2")
let speed_display = document.getElementById("speed")
speed_display.textContent = "0"
player1_score_element.textContent = player1_score
player2_score_element.textContent = player2_score
let cuGameMode = ""
let isAiEnabled = false

const gameMenu = document.getElementById("centeredRowContainer")

let startMultiplayer = document.getElementById("multiPlayer")
startMultiplayer.addEventListener("click", setPlayMode)

let startAI = document.getElementById("singlePlayer")
startAI.addEventListener("click", setPlayMode)

function setPlayMode(event){
    const gameMode = event.target
    const gameModId = event.target.id
    if(cuGameMode !== gameModId){
        //reset score
        player1_score = 0
        player1_score_element.textContent = player1_score
        player2_score = 0
        player2_score_element.textContent = player2_score
    }
    if(event.target === startAI){
        isAiEnabled = true
    }else{
        isAiEnabled = false
    }
    startGame()
}

function startGame(){
    gameRunning = true
    playBall = new Ball()
    paddel1 = new Paddel(fieldSize_X, fieldSize_y, true )
    paddel2 = new Paddel(fieldSize_X, fieldSize_y, false)
    player_paddels = [paddel1, paddel2]
    gameMenu.style.display = 'none'
    gameLoop(Date.now())
}

function gameLoop(lastexecuted){
    if(gameRunning){
        ctx.clearRect(0, 0, fieldSize_X, fieldSize_y )
        let now = Date.now()
        if(now - lastexecuted < frametime){
            requestAnimationFrame(gameLoop)
        }
        movePaddels()
        moveBall() 
        drawBall(playBall)
        drawPaddels()
        loopCount += 1
        playBall.speedUpMovement(loopCount)
        speed_display.textContent = Number(Math.abs(playBall.movement_X) * Math.abs(playBall.movement_Y)).toFixed(3)
        if(isAiEnabled){
            aiMove()
        }
        requestAnimationFrame(gameLoop)
    }
}

function aiMove() {
    //Todo: here let the ai do sth acccording to its coordinates
    let paddelMidPos = player_paddels[0].YPos + (player_paddels[0].height / 2)
    let ballMid = playBall.cu_YPos + (playBall.height / 2)
    //suggestion from chatgpt, my version is below
    let diff = ballMid - paddelMidPos
    player_paddels[0].movement_Y = Math.sign(diff) * Math.min(5, Math.abs(diff) * 0.2)
    //my old code:
    // if(paddelMidPos - ballMid < 0){
    //     // document.dispatchEvent(new KeyboardEvent('keydown', {'key':'s'} ));
    //     player_paddels[0].movement_Y = 5
    // }else{
    //     // document.dispatchEvent(new KeyboardEvent('keydown', {'key':'w'} ));
    //     player_paddels[0].movement_Y = -5
    // }
}

document.addEventListener("keydown", (event) => {
    console.log(event)
    if(event.key == "i"){
        console.log("i")
    }
    if (event.key == "ArrowDown") {
        player_paddels[1].movement_Y = 5
        console.log("down")
    }
    if (event.key == "ArrowUp") {
        player_paddels[1].movement_Y = -5  
    }
    if (event.key == "s") {
        player_paddels[0].movement_Y = 5
        console.log("down")
    }
    if (event.key == "w") {
        player_paddels[0].movement_Y = -5  
    }
})

document.addEventListener("keyup", (event)=>{
    if (event.key == "ArrowDown") {
        player_paddels[1].movement_Y = 0
        console.log("down")
    }
    if (event.key == "ArrowUp") {
        player_paddels[1].movement_Y = 0 
    }
    if (event.key == "s") {
        player_paddels[0].movement_Y = 0
        console.log("down")
    }
    if (event.key == "w") {
        player_paddels[0].movement_Y = 0 
    }
})

function endGame(){
    gameRunning = false
    gameMenu.style.display = 'flex'
}

function getBallNewXPos(){
    console.log(playBall.movement_X)
    let result = parseFloat(playBall.cu_XPos) + parseFloat(playBall.movement_X);
    console.log(playBall.cu_XPos + ' + ' + playBall.movement_X + ' = ' + result)
    return result
}
function getBallNewYPos(){
    console.log(playBall.movement_Y)
    let result = parseFloat(playBall.cu_YPos) + parseFloat(playBall.movement_Y);
    return result
}
function inXRange(ballX, paddel){
    return ballX > paddel.XPos && ballX < paddel.XPos + paddel.width
}
function inYRange(next_playBlock_Y_Pos, playBall, paddel){
    return next_playBlock_Y_Pos + playBall.height >= paddel.YPos && next_playBlock_Y_Pos <= paddel.YPos + paddel.height

}
function getNextBallX(paddel,next_playBlock_X_Pos, playBall){
    return paddel.first ? next_playBlock_X_Pos : next_playBlock_X_Pos + playBall.width
}

function moveBall() {
    let next_playBlock_X_Pos = getBallNewXPos()
    let next_playBlock_Y_Pos = getBallNewYPos()

    //check if game is lost
    if( next_playBlock_X_Pos > playBall.max_XPos || next_playBlock_X_Pos + playBall.movement_X < 0){
        //one player has won a point
        endGame()
        if(next_playBlock_X_Pos > playBall.max_XPos){
            player1_score += 1
            player1_score_element.textContent = player1_score
        }else{
            player2_score += 1
            player2_score_element.textContent = player2_score
        }
    }

    //check if ball hits paddel
    for(const paddel of player_paddels){
        //check if gameEnd because of ball in paddel
        let ballX = getNextBallX(paddel,next_playBlock_X_Pos, playBall)

        let isInXRange = inXRange(ballX, paddel)
        let isInYRange = inYRange(next_playBlock_Y_Pos, playBall, paddel)

        if(isInXRange && isInYRange){
            playBall.getNewMovement(true)
            while(inXRange(ballX, paddel) && inYRange(next_playBlock_Y_Pos, playBall, paddel)){
                playBall.cu_XPos = next_playBlock_X_Pos
                next_playBlock_X_Pos = getBallNewXPos()
                console.log(next_playBlock_X_Pos)
                ballX = getNextBallX(paddel, next_playBlock_X_Pos, playBall)
            }
        }
    }

    //change direction if ceiling or ground 
    if( next_playBlock_Y_Pos > playBall.max_YPos || next_playBlock_Y_Pos < 0){
        playBall.getNewMovement(false)
        next_playBlock_X_Pos = getBallNewXPos()
        next_playBlock_Y_Pos = getBallNewYPos()       
    }

    //set ball to new position after eventually having updated the next position before
    playBall.cu_YPos = next_playBlock_Y_Pos
    playBall.cu_XPos = next_playBlock_X_Pos
}

function movePaddels() {
    //Loop through array of paddels and exceute their latest movements
    for (let paddel of player_paddels){
        //check movement
        let nextYPosition = paddel.YPos + paddel.movement_Y
        if(nextYPosition < paddel.max_YPos && nextYPosition > 0){
            //todo: maybe directly redraw it
            paddel.YPos = nextYPosition
        }
    }
}

function drawBall(playBall){
    ctx.beginPath();
    ctx.rect(playBall.cu_XPos, playBall.cu_YPos, playBall.height,playBall.width);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
}

function drawPaddels(){
    ctx.beginPath();
    for (const paddel of player_paddels){
        console.log(paddel)
        console.log(paddel.XPos, paddel.YPos, paddel.width, paddel.height);
        //check movement
        ctx.rect(paddel.XPos, paddel.YPos, paddel.width, paddel.height);
        ctx.fillStyle = "#000000";
        ctx.fill();
    }
    ctx.closePath();
}