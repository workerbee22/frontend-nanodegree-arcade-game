// **********************************************************************
// ENEMY CLASS - Enemies our player must avoid
//
// ENEMY CLASS CONSTRUCTOR
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// ENEMY UPDATE METHOD
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // Moves enemy along grid row, by actually incrementing x position from
    // its initial value. Y value of the row remains constant.
    // speed is an additional multiplier, so not all enemies move same rate
    this.x += this.speed * dt;
    // resets enemy back to start of row when hit right side of grid
    if (this.x >= rowToX(5)) {
        this.x = rowToX(0);
        this.speed = randomSpeed();
        // when reset start enemy on a diferrent row to allow >1 enemy on a row
        switch (this.y) {
            case colToY(1):
                this.y = colToY(2);
                break;
            case colToY(2):
                this.y = colToY(3);
                break;
            default:
                this.y = colToY(1);
        }
    }
    // dtect if a collision has occurred
    this.detectCollission();
};

// ENEMY RENDER METHOD
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // final render of sprite apply an offset to look correct fit ontop of background
    var verticalOffsetEnemy = 30;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - verticalOffsetEnemy);
};

// ENEMY COLLISSION DETECTION METHOD
// Detects enemy collission with player has occurred or not.
// If collission then take action.
Enemy.prototype.detectCollission = function() {
    // Detect collisions here rather than in engine.js seems more elegent
    // given all other update of enemies and player are also here
    var collDetectRangeHorizontal = 30;
    // if player and enemy on the same row
    if (this.y === player.y) {
        // and within horizontal distance of one another, then collission occurred and reset player
        if ((Math.round(this.x) <= player.x + collDetectRangeHorizontal) && (Math.round(this.x) >= player.x - collDetectRangeHorizontal)) {
            player.resetPlayer();
        }
    }
};

// **********************************************************************
// PLAYER CLASS
//
// PLAYER CLASS CONSTRUCTOR
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    // default is boy character
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
};

// PLAYER UPDATE METHOD
// Actually changes x and y positions from previous values based on keyboard
// input from arrow keys. Updates player location only if within bounds of the grid.
// If player wins by reaching row ZERO then take special action.
Player.prototype.update = function(key) {
    switch (key) {
        case 'up':
            if (this.y >= colToY(1)) {
                this.update(this.x, this.y -= colToY(1));
                // this.y -= colToY(1);
            }
            break;
        case 'down':
            if (this.y <= colToY(4)) {
                this.y += colToY(1);
            }
            break;
        case 'left':
            if (this.x >= rowToX(1)) {
                this.x -= rowToX(1);
            }
            break;
        case 'right':
            if (this.x <= rowToX(3)) {
                this.x += rowToX(1);
            }
            break;
        case 'c':
            this.switchPlayer();
            break;
    }
    // Call reset method if reched row 0 and player wins
    if (this.y === colToY(0)) {
        this.resetPlayer();
    }
};

// PLAYER RENDER METHOD
// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    // final render of sprite apply an offset to look correct fit ontop of background
    var verticalOffsetPlayer = 30;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - verticalOffsetPlayer);
};

// PLAYER HANDLEINPUT METHOD
// Required for game to take specific keyboard input and update based on that input
Player.prototype.handleInput = function(key) {
    // Attempt to update player location if input arrow keys
    // If special key input then take other actions besides moving player
    // If arrow keys call update to move player
    if (key === 'up' || key === 'down' || key === 'left' || key === 'right') {
        this.update(key);
    } else {
        // if other special keys then take case by case action
        switch (key) {
            // if c key then call switch player method to chnage character sprite
            case 'c':
                this.switchPlayer();
                break;
        }
    }
};

// PLAYER RESET METHOD
// Resets the player back to starting position
Player.prototype.resetPlayer = function() {
    this.y = colToY(5);
    this.x = rowToX(2);
};

// PLAYER SWITCHPLAYER METHOD
// Changes player character sprite by cycling through available sprites
// by setting the player object's sprite property
Player.prototype.switchPlayer = function() {
    switch (this.sprite) {
        case 'images/char-boy.png':
            this.sprite = 'images/char-cat-girl.png';
            break;
        case 'images/char-cat-girl.png':
            this.sprite = 'images/char-horn-girl.png';
            break;
        case 'images/char-horn-girl.png':
            this.sprite = 'images/char-pink-girl.png';
            break;
        case 'images/char-pink-girl.png':
            this.sprite = 'images/char-princess-girl.png';
            break;
        case 'images/char-princess-girl.png':
            this.sprite = 'images/char-boy.png';
            break;
    }
};

// **********************************************************************
// HELPER functions
// takes a row and returns the appropriate grid x coordinate
function rowToX(row) {
    var rowWidth = 101;
    var x = row * rowWidth;
    return x;
}
// takes a col and returns the appropriate grid y coordinate
function colToY(col) {
    var colWidth = 83;
    var y = col * colWidth;
    return y;
}
// generates a random speed at least at a minimum speed and returns that speed value
function randomSpeed() {
    var speed = Math.random() * 200;
    var minSpeed = 30;
    if (speed >= minSpeed) {
        return speed;
    } else {
        return minSpeed;
    }
}

// **********************************************************************
// CREATE OBJECT INSTANCES
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
var numEnemies = 3;
for (var i = 0; i < numEnemies; ++i) {
    allEnemies[i] = new Enemy(rowToX(0), colToY(i + 1), randomSpeed());
}

// Place the player object in a variable called player
var startRow = 5;
var startCol = 2;
var player = new Player(rowToX(startCol), colToY(startRow));

// **********************************************************************
// EVENT LISTENERS
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Event Listener detects keys and returns to the player object .handleInput method
// only 1 player object and returns only left, up, right, right or c
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
