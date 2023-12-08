
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
    }

    updatePos() {
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
            this.xVel = 0;
        }

        if (this.xPos > 1000 - this.boxWidth) {
            this.xPos = 1000 - this.boxWidth;
            this.xAccel = 0;
            this.xVel = 0;
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
    }

    release(key, dt) {
        switch (key) {
            case "a":
                this.xVel = -dt;
                break;
            case "d":
                this.xVel = dt; 
                break;
        }

    }

    jump() {
        this.yVel = 10;
    }
}

let player = new Player(100, 100);
let JUMPPRESSED = false;
let BUTTONPRESSED = false;
let startTimeA = Date.now();
let startTimeD = Date.now();
let timeDiff = 0;
document.addEventListener("keypress", (event) => {
    if (!BUTTONPRESSED) {
        BUTTONPRESSED = true;
        switch (event.key) {
            case "a":
                startTimeA = Date.now();
                break;
            case "d":
                startTimeD = Date.now();
                break;
        }
    }
    console.log(event.key);
    console.log(JUMPPRESSED);
    if (event.key = "w" && !JUMPPRESSED) {
        console.log("HUH?");
        player.jump();
        JUMPPRESSED = true;
    }
}, false);

document.addEventListener("keyup", (event) => {
    BUTTONPRESSED = false;
    switch (event.key) {
        case "a":
            timeDiff = Date.now() - startTimeA;
            player.release(event.key, timeDiff / 50);
            break;
        case "d":
            timeDiff = Date.now() - startTimeD;
            player.release(event.key, timeDiff / 50);
            break;
        case "w":
            JUMPPRESSED = false;
            break;
    }
});
setInterval(() => player.updatePos(), 16);