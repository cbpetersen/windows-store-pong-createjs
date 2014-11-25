var onePlayerButton;
var twoPlayerButton;
var twoPlayerButton2;
var logo;
var playersText;

function mainscreen() {
    stage.removeAllChildren();

    var image = new Image();
    image.src = "../images/joypad.png";

    onePlayerButton = new createjs.Bitmap(image);
    onePlayerButton.x = (width / 2) - 450;
    onePlayerButton.y = height / 2 - 75;

    twoPlayerButton = new createjs.Bitmap(image);
    twoPlayerButton.x = (width / 2) + 200;
    twoPlayerButton.y = height / 2 - 75;

    twoPlayerButton2 = new createjs.Bitmap(image);
    twoPlayerButton2.x = (width / 2) + 350;
    twoPlayerButton2.y = (height / 2) - 75;

    logo = new createjs.Text("PONG", "124px Arial", "#990000");
    logo.y = height * 0.05;
    logo.maxWidth = width / 2;
    logo.x = width / 2;
    logo.textAlign = "center";
    logo.Z = 1;

    playersText = new createjs.Text("Select players", "48px Arial", "#990000");
    playersText.y = height / 2;
    playersText.maxWidth = width / 2;
    playersText.x = width / 2;
    playersText.textAlign = "center";
    playersText.Z = 1;

    stage.addChild(onePlayerButton, twoPlayerButton, twoPlayerButton2, logo, playersText);
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addListener(menuLoop);

    onePlayerButton.onPress = function () {
        stage.removeAllChildren();
        stage.update();
        newGame(1);
    };

    twoPlayerButton.onPress = function() {
        stage.removeAllChildren();
        stage.update();
        newGame(2);
    };
    
    twoPlayerButton2.onPress = function () {
        stage.removeAllChildren();
        stage.update();
        newGame(2);
    };
    createjs.Tween.get(playersText, { loop: true, ignoreGlobalPause: true })
        .to({ alpha: 0.45 }, 2000, createjs.Ease.get(1))
        .to({ alpha: 1 }, 2000, createjs.Ease.get(1));

    stage.update();
}

function menuLoop() {
    stage.update();
}