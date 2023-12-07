
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

    onPress(event) {
        switch (event.key) {
            case "w":
                this.yVel = 13;
                break;
            case "d":
                this.xAccel += .4;
                break;
            case "a":
                this.xAccel -= .4;
                break;
        
        }
    }
}

let player = new Player(100, 100);
document.addEventListener("keydown", (event) => player.onPress(event), false);
setInterval(() => player.updatePos(), 16);