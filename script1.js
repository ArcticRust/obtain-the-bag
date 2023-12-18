
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
        this.maxSpeed = 12;
        this.chargeDivider = 40;
        this.jumpVel = 13;
        this.incrementer = 0;
    }

    updatePos(timeDiff, AorDPressed, orbs) {
        let canvas = document.getElementById("usedCanvas").getContext("2d");
        canvas.beginPath();
        canvas.clearRect(this.xPos - 12, this.yPos - 16, this.boxWidth + 23, this.boxHeight / 4 + 2);
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
        if (this.incrementer % 10 == 0 && orbs.length != 0) {
            for (let i = 0; i < orbs.length; i++) {
                let orb = orbs[i];
                if (true) {
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
        if (AorDPressed)
            this.createBar(canvas, timeDiff);
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
                this.xVel = -Math.min(dt, this.maxSpeed);
                break;
            case "d":
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
let timeDiff = 0;
let AorDPressed = false;
let orbPositions = [];
let canvas = document.getElementById("usedCanvas").getContext("2d");
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

    if (event.key == "c") {
        console.log(orbPositions);
        console.log(player.xPos);
        console.log(player.yPos);
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

setInterval(() => player.updatePos((Date.now() - startTime) * BUTTONPRESSED, AorDPressed, orbPositions), 16);
setInterval(() => spawnOrb(), 2000);

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