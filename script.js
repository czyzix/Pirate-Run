import { setupGround, updateGround } from "./ground.js";
import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js";
import { setupCactus, updateCactus, getCactusRects } from "./cactus.js";
import { setupCoin, updateCoin, getCoinRects, removeCoin} from "./coin.js";

const SPEED_SCALE_INCREASE = 0.00001;

const scoreElem = document.getElementById("score");
const highscoreElem = document.getElementById("highscore");
const bonusElem = document.getElementById("bonus");
const worldElem = document.querySelector("[data-world]");

const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");

const scoreboard = document.getElementById("scoreboard");
const scoreboardBtn = document.getElementById("scoreboard-btn");
const enterNicknameText = document.getElementById("nicknameEnterText");
const backStartScreenBtn = document.getElementById("back-start-screen-btn");

const nicknameBtn = document.getElementById("nickname-btn");
const nicknameInput = document.getElementById("nickname");
const firstScoreTable = document.getElementById("first-points");
const secondScoreTable = document.getElementById("second-points");
const thirdScoreTable = document.getElementById("third-points");
const firstScoreNick = document.getElementById("first-nick");
const secondScoreNick = document.getElementById("second-nick");
const thirdScoreNick = document.getElementById("third-nick");

let lastTime; 
let speedScale;
let score;
let highscore = 0;
let secondscore = 0;
let thirdscore = 0;
let firstNick;
let secondNick;

startBtn.addEventListener('click', handleStart, {once:true});
scoreboardBtn.addEventListener('click', showScoreboard);
backStartScreenBtn.addEventListener('click', backToStartScreen);

function showScoreboard() {
    scoreboard.classList.remove('hidden');
    backStartScreenBtn.classList.remove('hidden');
    startScreen.classList.add('hidden');
};

function backToStartScreen() {
    scoreboard.classList.add('hidden');
    backStartScreenBtn.classList.add('hidden');
    startScreen.classList.remove('hidden');
};

// window.requestAnimationFrame(update) is called 3 times, because we want it to loop every time we can update screen.
// also we want the consistent movement no matter how slow or fast framerate is

function update(time) {
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    };
    const delta = time - lastTime; //time beetween updates

    updateGround(delta, speedScale);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateCoin(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);
    
    checkBonusCoin();

    if (checkLose()) return handleLose(), updateHighscore(delta);

    lastTime = time;
    window.requestAnimationFrame(update);
};

function handleStart() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupDino();
    setupCactus();
    setupCoin();

    if (window.matchMedia('(max-device-width: 415px)').matches) {
        speedScale = 1.5;
    };
    
    startScreen.classList.add("hidden");
    window.requestAnimationFrame(update);
};

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
};

function updateScore(delta) {
    score += delta * 0.01;
    scoreElem.textContent = ("score: ") + Math.floor(score);
};

function checkLose() {
    const dinoRect = getDinoRect();
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
};

function checkBonusCoin() {
    const dinoRect = getDinoRect();
    if (getCoinRects().some(rect => isCollision(rect, dinoRect))) {
        removeCoin();
        score = score + 100;
        bonusElem.classList.remove("hidden");
        setTimeout(function() {
            bonusElem.classList.add("hidden");
        }, 700);
    };
};

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right && 
        rect1.top < rect2.bottom && 
        rect1.right > rect2.left && 
        rect1.bottom > rect2.top
    );
};

function handleLose() {
    setDinoLose();
    setTimeout(() => {
        startBtn.addEventListener('click', handleStart, {once:true});
        if (score < thirdscore) {
            startScreen.classList.remove("hidden");
        };
    }, 100); // to prevent accidentaly clicking space right after lose and starting the game accidentaly
    
};

function updateHighscore() {
    playerNickPosition();
    if (score > highscore) {
        thirdscore = secondscore;
        secondscore = highscore;
        highscore = score;
        highscoreElem.textContent = ("highscore: ") + Math.floor(highscore);
        firstScoreTable.textContent = Math.floor(highscore);
        secondScoreTable.textContent = Math.floor(secondscore);
        thirdScoreTable.textContent = Math.floor(thirdscore);
    } else if (score > secondscore && score < highscore) {
        thirdscore = secondscore;
        secondscore = score;
        secondScoreTable.textContent = Math.floor(score);
        thirdScoreTable.textContent = Math.floor(thirdscore);
    } else if (score > thirdscore && score < secondscore) {
        thirdscore = score;
        thirdScoreTable.textContent = Math.floor(score);
    };
};

function playerNickPosition() {
    if (score > thirdscore) {
        setTimeout(function() {
            nicknameInput.classList.remove("hidden");
            nicknameBtn.classList.remove("hidden");
            scoreboard.classList.remove("hidden");
            enterNicknameText.classList.remove("hidden");
        }, 450);
        
        if (score > highscore) {
            secondNick = secondScoreNick.textContent;
            thirdScoreNick.textContent = secondNick;
            firstNick = firstScoreNick.textContent;
            secondScoreNick.textContent = firstNick;
            firstScoreNick.textContent = "???";
            firstScoreNick.classList.add("blink");
            document.getElementById('form').addEventListener('submit', firstPlayerNickInput);
        } else if (score > secondscore && score < highscore) {
            secondNick = secondScoreNick.textContent;
            thirdScoreNick.textContent = secondNick;
            secondScoreNick.textContent = "???";
            secondScoreNick.classList.add("blink");
            document.getElementById('form').addEventListener('submit', secondPlayerNickInput);
        } else if (score > thirdscore && score < secondscore) {
            thirdScoreNick.textContent = "???";
            thirdScoreNick.classList.add("blink");
            document.getElementById('form').addEventListener('submit', thirdPlayerNickInput);
        };
    };
};

function firstPlayerNickInput(ev) {
    ev.preventDefault();
    let playerNick = nicknameInput.value
    firstScoreNick.textContent = playerNick;
    nicknameInput.value = "";
    nicknameInput.classList.add("hidden");
    nicknameBtn.classList.add("hidden");
    enterNicknameText.classList.add("hidden");
    firstScoreNick.classList.remove("blink");
    scoreboard.classList.add("hidden");
    startScreen.classList.remove('hidden');
    document.getElementById('form').removeEventListener('submit', firstPlayerNickInput);
};

function secondPlayerNickInput(ev) {
    ev.preventDefault();
    let playerNick = nicknameInput.value
    secondScoreNick.textContent = playerNick;
    nicknameInput.value = "";
    nicknameInput.classList.add("hidden");
    nicknameBtn.classList.add("hidden");
    enterNicknameText.classList.add("hidden");
    secondScoreNick.classList.remove("blink");
    scoreboard.classList.add("hidden");
    startScreen.classList.remove('hidden');
    document.getElementById('form').removeEventListener('submit', secondPlayerNickInput);
};

function thirdPlayerNickInput(ev) {
    ev.preventDefault();
    let playerNick = nicknameInput.value
    thirdScoreNick.textContent = playerNick;
    nicknameInput.value = "";
    nicknameInput.classList.add("hidden");
    nicknameBtn.classList.add("hidden");
    enterNicknameText.classList.add("hidden");
    thirdScoreNick.classList.remove("blink");
    scoreboard.classList.add("hidden");
    startScreen.classList.remove('hidden');
    document.getElementById('form').removeEventListener('submit', thirdPlayerNickInput);
};

var max = 8

nicknameInput.addEventListener('keyup', function (event) {
    event.target.value = event.target.value.substring(0, max)
})