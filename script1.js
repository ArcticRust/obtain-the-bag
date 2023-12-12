
class Player {
    constructor(xPos, yPos) { // Initial Coordinates
        this.xPos = xPos;
        this.yPos = yPos;
        this.xVel = 0;
        this.yVel = 0;
        this.xAccel = 0;
        this.yAccel = -.6; // gravity
        this.boxWidth = 60;
        this.boxHeight = 40;
        this.maxSpeed = 15;
        this.chargeDivider = 25;
    }

    updatePos(timeDiff, AorDPressed) {
        let canvas = document.getElementById("usedCanvas").getContext("2d");
        canvas.beginPath();
        canvas.clearRect(0, 0, 1000, 500);
        canvas.stroke();
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

        canvas.beginPath();
        canvas.fillStyle = "red";
        canvas.rect(this.xPos, this.yPos, this.boxWidth, this.boxHeight);
        canvas.fill();
        canvas.stroke();
        if (AorDPressed)
            this.createBar(canvas, timeDiff);
    }

    createBar(canvas, timeDiff) {
        canvas.beginPath();
        canvas.rect(this.xPos - 10, this.yPos - 15, this.boxWidth + 20, this.boxHeight / 4);
        canvas.stroke();
        canvas.beginPath();
        canvas.fillStyle = "green";
        canvas.rect(this.xPos - 9, this.yPos - 14, Math.min(timeDiff / (this.maxSpeed * 30), 1) * (this.boxWidth + 18), (this.boxHeight / 4) - 2);
        canvas.fill();
        canvas.stroke();
    }

    release(key, dt) {
        dt /= this.chargeDivider;
        switch (key) {
            case "a":
                this.xVel = -Math.min(dt, this.maxSpeed);
                break;
            case "d":
                this.xVel = Math.min(dt, this.maxSpeed); 
                break;
        }

    }

    jump() {
        if (this.yPos >= 500 - this.boxHeight)
            this.yVel = 12;
    }
}

let player = new Player(100, 100);
let JUMPPRESSED = false;
let BUTTONPRESSED = false;
let startTime = Date.now();
let timeDiff = 0;
let AorDPressed = false;
document.addEventListener("keypress", (event) => {
    if (!BUTTONPRESSED) {
        BUTTONPRESSED = true;
        switch (event.key) {
            case "a":
            case "d":
                AorDPressed = true;
                startTime = Date.now();
                break;
            case "s":
                player.xVel = 0;
        }
    }
    if (event.key == "w" && !JUMPPRESSED) {
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
                timeDiff = Date.now() - startTime;
                player.release(event.key, timeDiff);
                AorDPressed = false;
                break;
            case "w":
                JUMPPRESSED = false;
                break;
        }
    }
});
setInterval(() => player.updatePos((Date.now() - startTime) * BUTTONPRESSED, AorDPressed), 16);