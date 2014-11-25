var ball, paddle1, paddle2, top, buttom;
var stage;
var xDirection = -1;
var yDirection = 1;
var scoreboard;
var gameOverText;
var startGameText;
var playerOneScore = 0;
var playerTwoScore = 0;
var actualScore = 0;
var height = window.innerHeight;
var width = window.innerWidth;
var speed = 8;
var running = false;
var finished = false;
var pointsToWin = 5;
var players;

function newGame(_players) {
     players = _players;
    
    stage.removeAllChildren();
    stage.update();

    running = false;
    finished = false;

    ball = new createjs.Shape();
    ball.graphics.beginFill("White");
    ball.graphics.drawCircle(0, 0, 10);
    ball.width = 10;
    ball.height = 10;
    ball.x = width / 2;
    ball.y = height / 2;

    paddle2 = new createjs.Shape();
    paddle2.graphics.beginFill("White");
    paddle2.graphics.drawRect(0, 0, 20, 100);
    paddle2.width = 20;
    paddle2.height = 100;
    paddle2.x = width - (width * 0.05);
    paddle2.y = height / 2;

    paddle1 = new createjs.Shape();
    paddle1.graphics.beginFill("White");
    paddle1.graphics.drawRect(0, 0, 20, 100);
    paddle1.width = 20;
    paddle1.height = 100;
    paddle1.x = (width * 0.05);
    paddle1.y = paddle2.y;

    top = new createjs.Shape();
    top.graphics.beginFill("White");
    top.graphics.drawRect(0, 0, width, 20);
    top.width = width;
    top.height = 20;
    top.x = 0;
    top.y = -15;

    buttom = new createjs.Shape();
    buttom.graphics.beginFill("White");
    buttom.graphics.drawRect(0, 0, width, 20);
    buttom.width = width;
    buttom.height = 20;
    buttom.x = 0;
    buttom.y = height - 5;

    var text = playerOneScore + "      Pong      " + playerTwoScore;
    scoreboard = new createjs.Text(text, "24px Arial", "#990000");
    scoreboard.y = 30;
    scoreboard.maxWidth = 350;
    scoreboard.x = width / 2;
    scoreboard.textAlign = "center";

    startGameText = new createjs.Text("", "24px Arial", "#990000");
    startGameText.y = height / 1.8;
    startGameText.maxWidth = 350;
    startGameText.x = width / 2;
    startGameText.textAlign = "center";
    startGameText.Z = 1;
    
    gameOverText = new createjs.Text("", "48px Arial", "#990000");
    gameOverText.y = height / 2.2;
    gameOverText.maxWidth = 700;
    gameOverText.x = width / 2;
    gameOverText.textAlign = "center";
    gameOverText.Z = 1;

    stage.addChild(ball, paddle1, paddle2, scoreboard, top, buttom, gameOverText, startGameText);
    stage.update();
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addListener(gameLoop);

    paddle1.onPress = function(event) {
        event.onMouseMove = function(innerEvent) {
            paddle1.y = innerEvent.stageY;
        };
    };
    
    if (players > 1) {
        paddle2.onPress = function (event) {
            event.onMouseMove = function (innerEvent) {
                paddle2.y = innerEvent.stageY;
            };
        };
    }

    ball.onPress = function() {
        running = true;
        showStartGameText(false);
        if (finished) {
            newRound();
            showWinner(false);
            finished = false;
            playerOneScore = 0;
            playerTwoScore = 0;
        }
    };
    document.onkeydown = function(event) {
        if (event.keyCode === 32) { //space
            running = true;
            showStartGameText(false);
            if (finished) {
                mainscreen();
            }
        }
        if (event.keyCode === 38) { //up
            paddle2.y++;
        }
        if (event.keyCode === 40) { //down
            paddle2.y--;
        }
    };

    showStartGameText(true);
}

function cpuPlayerMovement() {
    if (paddle2.y < ball.y - (paddle2.height / 2)) {
        paddle2.y += 2;
    } 
    else if (paddle2.y > ball.y + (paddle2.height / 2)) {
        paddle2.y -= 2;
    }
}

function showWinner(show) {
    if (show) {
        finished = true;
        var winner = "Player one wins!";
        if (playerOneScore < playerTwoScore)
            winner = "Player two wins!";

        createjs.Tween.get(gameOverText, { override: true }).to({
            text: winner
        });
    }
    else {
        createjs.Tween.get(gameOverText, { override: true }).to({
            text: ""
        });
    }
}

function showStartGameText(show) {
    if (show) {
        createjs.Tween.get(startGameText, { override: true }).to({
            text: "Tap ball to start"
        });
    }
    else {
        createjs.Tween.get(startGameText, { override: true }).to({
            text: ""
        });
    }
}

function gameLoop() {
    if (running) {
        ball.x -= speed * xDirection;
        ball.y += 1 * yDirection;

        checkCollision();
        checkGoal();
        if (players === 1) {
            cpuPlayerMovement();
        }
    }
    stage.update();
}

function checkCollision() {
    updateScoreboard(playerOneScore, playerTwoScore);
    var paddleCollision = ndgmr.calculateIntersection(ball, paddle2) || ndgmr.calculateIntersection(ball, paddle1);
    if (paddleCollision !== null) {
        xDirection *= -1;
    }

    var borderCollission = ndgmr.calculateIntersection(ball, top) || ndgmr.calculateIntersection(ball, buttom);
    if (borderCollission !== null) {
        yDirection *= -1;
    }
}

function checkGoal() {
    if (ball.x < 0) {
        playerTwoScore++;
        if (playerTwoScore >= pointsToWin) {
            showWinner(true);
            running = false;
        }
        else {
            newRound();
        }
    }
    else if (ball.x > width) {
        playerOneScore++;
        if (playerOneScore >= pointsToWin) {
            showWinner(true);
            running = false;
        }
        else {
            newRound();
        }
    }
}

function newRound() {
    ball.x = width / 2;
    ball.y = height / 2;

    yDirection *= -1;
    xDirection *= -1;

    showStartGameText(true);
    running = false;
}

function updateScoreboard(one, two) {
    var points = (one + two) | 0;
    actualScore = points;
    createjs.Tween.get(window, { override: true })
            .to({ displayScore: actualScore }, 3000, createjs.Ease.quartOut)
            .onChange = function () {
                scoreboard.text = playerOneScore + "      Pong      " + playerTwoScore;
            };
}