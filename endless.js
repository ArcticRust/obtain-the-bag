
class Player {
    constructor(xPos, yPos) { // Initial Coordinates
        this.xPos = xPos;
        this.yPos = yPos;
        this.xVel = 0;
        this.yVel = 0;
        this.xAccel = 0;
        this.yAccel = -.6; // gravity
        this.boxWidth = 60; //60
        this.boxHeight = 40;
        this.maxSpeed = 12;
        this.chargeDivider = 40;
        this.jumpVel = 13;
        this.incrementer = 0;
        this.lastFramePressed = false;
    }

    updatePos(timeDiff, AorDPressed, orbs, givenTime, currentStepTime) {
        let canvas = document.getElementById("usedCanvas").getContext("2d");
        canvas.beginPath();
        if (this.lastFramePressed)
            canvas.clearRect(this.xPos - 12, this.yPos - 16, this.boxWidth + 23, this.boxHeight / 4 + 2);
        this.lastFramePressed = AorDPressed;   
        canvas.clearRect(this.xPos - 2, this.yPos - 1, this.boxWidth + 3, this.boxHeight + 3);
        this.xVel += this.xAccel;
        this.xPos += this.xVel;
        this.yVel += this.yAccel
        this.yPos -= this.yVel;
        this.xAccel *= .93;
        if (this.xPos < 0) {
            this.xPos = 0;
            this.xAccel = 0;
            this.xVel = -this.xVel;
        }

        if (this.xPos > 1000 - this.boxWidth) {
            this.xPos = 1000 - this.boxWidth;
            this.xAccel = 0;
            this.xVel = -this.xVel;
        }

        if (this.yPos < 0) 
            this.yPos = 0;
        
        if (this.yPos > 500 - this.boxHeight)  
            this.yPos = 500 - this.boxHeight;

        this.incrementer += 1;
        if (this.incrementer % 2 == 0 && orbs.length != 0) {
            for (let i = 0; i < orbs.length; i++) {
                let orb = orbs[i];
                if (orb[0] < this.xPos + this.boxWidth && orb[0] + 40 > this.xPos && orb[1] > this.yPos - this.boxHeight && orb[1] - 40 < this.yPos) {
                    canvas.clearRect(orb[0] - 1, orb[1] - 1, 42, 42);
                    orbs.splice(i, 1);
                    i -= 1;
                }
            }
        }
        canvas.fillStyle = "red";
        canvas.rect(this.xPos, this.yPos, this.boxWidth, this.boxHeight);
        canvas.fill();
        canvas.stroke();
        this.timeBar(canvas, givenTime, currentStepTime);
        if (AorDPressed)
            this.createBar(canvas, timeDiff);
        if (this.incrementer % 20 == 0 && orbs.length != 0) {
            for (let i = 0; i < orbs.length; i++) {
                canvas.beginPath();
                canvas.arc(orbs[i][0] + 20, orbs[i][1] + 20, 20, 0, 2 * Math.PI);
                canvas.fillStyle = "blue";
                canvas.fill();
                canvas.stroke();
            }
        }
    }

    timeBar(canvas, givenTime, currentStepTime) {
        canvas.beginPath();
        canvas.clearRect(0, 0, 1000, 200);
        canvas.rect(50, 50, 900 - .9 * (Date.now() - givenTime) / currentStepTime, 40);
        canvas.fillStyle = "orange";
        canvas.fill();
        canvas.stroke();
    }

    createBar(canvas, timeDiff) {
        canvas.beginPath();
        canvas.rect(this.xPos - 10, this.yPos - 15, this.boxWidth + 20, this.boxHeight / 4);
        canvas.stroke();
        canvas.beginPath();
        canvas.fillStyle = "green";
        canvas.rect(this.xPos - 9, this.yPos - 14, Math.min(timeDiff / (this.maxSpeed * this.chargeDivider), 1) * (this.boxWidth + 18), (this.boxHeight / 4) - 2);
        canvas.fill();
        canvas.stroke();
    }

    release(key, dt) {
        dt /= this.chargeDivider;
        switch (key) {
            case "a":
            case "A":
                this.xVel = -Math.min(dt, this.maxSpeed);
                break;
            case "d":
            case "D":
                this.xVel = Math.min(dt, this.maxSpeed); 
                break;
        }

    }

    jump() {
        if (this.yPos >= 500 - this.boxHeight)
            this.yVel = this.jumpVel;
    }
}

let player = new Player(100, 100);
let JUMPPRESSED = false;
let BUTTONPRESSED = false;
let startTime = Date.now();
let levelTimer = Date.now();
let timeDiff = 0;
let AorDPressed = false;
let orbPositions = [];
let canvas = document.getElementById("usedCanvas").getContext("2d");
document.addEventListener("keypress", (event) => {
    if (!BUTTONPRESSED) {
        BUTTONPRESSED = true;
        switch (event.key) {
            case "a":
            case "A":
            case "D":
            case "d":
                AorDPressed = true;
                startTime = Date.now();
                break;
            case "s":
            case "S":
                player.xVel = 0;
        }
    }
    if (event.key == "w" || event.key == "W" && !JUMPPRESSED) {
        player.jump();
        JUMPPRESSED = true;
    }
}, false);

document.addEventListener("keyup", (event) => {
    if (BUTTONPRESSED) {
        BUTTONPRESSED = false;
        switch (event.key) {
            case "a":
            case "d":
            case "A":
            case "D":
                timeDiff = Date.now() - startTime;
                player.release(event.key, timeDiff);
                AorDPressed = false;
                break;
            case "w":
            case "W":
                JUMPPRESSED = false;
                break;
        }
    }
});



let currentStepTime = 5;
let updateInterval = setInterval(
    () => {
        document.getElementById("orbsLeft").innerHTML = "Orbs Left: " + orbPositions.length.toString();
        player.updatePos((Date.now() - startTime) * BUTTONPRESSED, AorDPressed, orbPositions, levelTimer, currentStepTime);
    }, 16);

let gameEnded = false;
let endTimeout;

startGame(0);

function startGame(currentStep) {
    document.getElementById("level").innerHTML = "Level: " + (currentStep + 1).toString();
    currentStepTime = currentStepTime * .97;
    for (let i = 0; i < Math.floor(currentStep + 3 / 2); i++) {
        spawnOrb();
    }
    endTimeout = setTimeout(() => endGame(currentStep), currentStepTime * 1000);
    levelTimer = Date.now();
}

function endGame(currentStep) {
    if (orbPositions.length != 0) {
        clearInterval(updateInterval);
        onGameEnd();
    } else {
        startGame(currentStep + 1);
    }
}

function spawnOrb() {
    let xPos = Math.random() * 800;
    let yPos = Math.random() * 140;
    let radius = 20;
    orbPositions.push([xPos - radius + 100, 500 - (yPos + 10) - radius]);
    canvas.beginPath();
    canvas.arc(xPos + 100, 500 - (yPos + 10), radius, 0, 2 * Math.PI);
    canvas.fillStyle = "blue";
    canvas.fill();
    canvas.stroke();
}

function onGameEnd() {
    clearInterval(updateInterval);
    canvas.beginPath();
    canvas.clearRect(0, 0, 10000, 10000);
    canvas.rect(0, 0, 1000, 500);
    canvas.fillStyle = "black";
    canvas.fill();
    canvas.stroke();
    window.location.replace("gameover.html");    
}
