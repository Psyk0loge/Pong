export class Ball{
    constructor(){
        this.height = 25
        this.width = 25
        this.max_XPos = 750 - this.width
        this.max_YPos = 500 - this.height
        this.cu_XPos = Math.floor((this.max_XPos - this.width) / 2)
        this.cu_YPos = Math.floor((this.max_YPos - this.height) / 2)
        //Todo: here check that atleast one of them is 1
        this.movement_Y = this.getRandomNumber(1)
        this.movement_X = this.getRandomNumber(1)
        //Todo bring in velocity to speed things up
    }
    getRandomNumber(max){
        return Math.random() * max
    }

    getNewMovement(isWallHit){
        //Todo ich muss wissen was er trifft. also 
        if (isWallHit){
            this.movement_X = - this.movement_X
        }else{
            this.movement_Y = - this.movement_Y
        }
    }

    speedUpMovement(loopCount){
        if(loopCount % 1000 === 0){
            console.log("100 sind raus")
            this.movement_X = this.movement_X * 1.25
            this.movement_Y = this.movement_Y * 1.25
        }
    }
}

export class Paddel {
    constructor(fieldSize_x, fieldSize_y, first) {
        this.height = Math.floor(fieldSize_y / 5)
        this.width = Math.floor(fieldSize_x / 100)
        this.first = first
        //make dependant on first value
        if(first === true){
            this.XPos = this.width * 2
        }else{
            this.XPos = fieldSize_x - this.width * 3
        }
        this.YPos = Math.round((fieldSize_y - this.height) / 2)
        //Todo: dependant on second or first one
        this.movement_Y = 1
        this.max_YPos = 500 - this.height
    }
}