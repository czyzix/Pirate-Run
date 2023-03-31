import { setupGround, updateGround } from "./ground.js";
import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js";
import { setupCactus, updateCactus, getCactusRects } from "./cactus.js";
import { setupCoin, updateCoin, getCoinRects, removeCoin } from "./coin.js";

const SPEED_SCALE_INCREASE = 0.00001;
const scoreElem = document.getElementById("score");
const highScoreElem = document.getElementById("highscore");
const bonusElem = document.getElementById("bonus");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const scoreboard = document.getElementById("scoreboard");
const scoreboardBtn = document.getElementById("scoreboard-btn");
const enterNicknameText = document.getElementById("nicknameEnterText");
const backStartScreenBtn = document.getElementById("back-start-screen-btn");
const nicknameBtn = document.getElementById("nickname-btn");
const nicknameInput = document.getElementById("nickname");
const tableScore1 = document.getElementById("first-points");
const tableScore2 = document.getElementById("second-points");
const tableScore3 = document.getElementById("third-points");
const tableNick1 = document.getElementById("first-nick");
const tableNick2 = document.getElementById("second-nick");
const tableNick3 = document.getElementById("third-nick");

let topPlayers = [
    {
        id: 1,
        nick: ".....",
        score: "000"
    },
    {
        id: 2,
        nick: ".....",
        score: "000"
    },
    {
        id: 3,
        nick: ".....",
        score: "000"
    }
]
let lastTime;
let speedScale;
let score;
let highScore = 0;
let secondScore = 0;
let thirdScore = 0;
let firstNick = topPlayers[0].nick;
let secondNick = topPlayers[1].nick;
let topPlayersLS;

function getTopPlayersFromLocalStorage() {
    topPlayersLS = JSON.parse(localStorage.getItem("topPlayers"));
    if (topPlayersLS != null) {updateScoreBoardAndScores()};
};

function updateScoreBoardAndScores() {
    highScore = Math.floor(topPlayersLS[0].score);
    highScoreElem.textContent = ("highScore: ") + Math.floor(highScore);
    secondScore = Math.floor(topPlayersLS[1].score)
    thirdScore = Math.floor(topPlayersLS[2].score)
    topPlayers[0].score = Math.floor(topPlayersLS[0].score)
    topPlayers[1].score = Math.floor(topPlayersLS[1].score)
    topPlayers[2].score = Math.floor(topPlayersLS[2].score)
    tableScore1.innerText = topPlayers[0].score
    tableScore2.innerText = topPlayers[1].score
    tableScore3.innerText = topPlayers[2].score
    topPlayers[0].nick = topPlayersLS[0].nick
    topPlayers[1].nick = topPlayersLS[1].nick
    topPlayers[2].nick = topPlayersLS[2].nick
    tableNick1.innerText = topPlayers[0].nick
    tableNick2.innerText = topPlayers[1].nick
    tableNick3.innerText = topPlayers[2].nick
}

getTopPlayersFromLocalStorage();

startBtn.addEventListener('click', handleStart, { once: true });
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

    if (checkLose()) return handleLose(), updateScores(delta);

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
        setTimeout(function () {
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
        startBtn.addEventListener('click', handleStart, { once: true });
        if (score < thirdScore) {
            startScreen.classList.remove("hidden");
        };
    }, 100); // to prevent accidentaly clicking space right after lose and starting the game accidentaly

};

function updateScores() {
    playerNickPosition();
    if (score > highScore) {
        thirdScore = secondScore;
        secondScore = highScore;
        highScore = score;
        highScoreElem.textContent = ("highScore: ") + Math.floor(highScore);
        topPlayers[0].score = highScore;
        tableScore1.innerText = Math.floor(topPlayers[0].score);
        topPlayers[1].score = secondScore;
        tableScore2.innerText = Math.floor(topPlayers[1].score);
        topPlayers[2].score = thirdScore;
        tableScore3.innerText = Math.floor(topPlayers[2].score);
    } else if (score > secondScore && score < highScore) {
        thirdScore = secondScore;
        secondScore = score;
        topPlayers[1].score = secondScore;
        tableScore2.innerText = Math.floor(topPlayers[1].score);
        topPlayers[2].score = thirdScore;
        tableScore3.innerText = Math.floor(topPlayers[2].score);
    } else if (score > thirdScore && score < secondScore) {
        thirdScore = score;
        topPlayers[2].score = thirdScore;
        tableScore3.innerText = Math.floor(topPlayers[2].score);
    }
};

function playerNickPosition() {
    if (score > thirdScore) {
        setTimeout(function () {
            nicknameInput.classList.remove("hidden");
            nicknameBtn.classList.remove("hidden");
            scoreboard.classList.remove("hidden");
            enterNicknameText.classList.remove("hidden");
        }, 450);

        if (score > highScore) {
            secondNick = topPlayers[1].nick;
            topPlayers[2].nick = secondNick
            tableNick3.innerText = secondNick;
            firstNick = topPlayers[0].nick;
            topPlayers[1].nick = firstNick;
            tableNick2.innerText = firstNick;
            tableNick1.innerText = "???";
            tableNick1.classList.add("blink");
            document.getElementById('form').addEventListener('submit', firstPlayerNickInput);
        } else if (score > secondScore && score < highScore) {
            secondNick = topPlayers[1].nick;
            topPlayers[2].nick = secondNick
            tableNick3.innerText = secondNick;
            tableNick2.textContent = "???";
            tableNick2.classList.add("blink");
            document.getElementById('form').addEventListener('submit', secondPlayerNickInput);
        } else if (score > thirdScore && score < secondScore) {
            tableNick3.textContent = "???";
            tableNick3.classList.add("blink");
            document.getElementById('form').addEventListener('submit', thirdPlayerNickInput);
        }
    };
};

function firstPlayerNickInput(ev) {
    ev.preventDefault();
    let playerNick = nicknameInput.value;
    topPlayers[0].nick = playerNick;
    tableNick1.innerText = topPlayers[0].nick

    nicknameInput.value = "";
    nicknameInput.classList.add("hidden");
    nicknameBtn.classList.add("hidden");
    enterNicknameText.classList.add("hidden");
    tableNick1.classList.remove("blink");
    scoreboard.classList.add("hidden");
    startScreen.classList.remove('hidden');
    document.getElementById('form').removeEventListener('submit', firstPlayerNickInput, setTopPlayersToLocalStorage());
}

function secondPlayerNickInput(ev) {
    ev.preventDefault();
    let playerNick = nicknameInput.value;
    topPlayers[1].nick = playerNick;
    tableNick2.innerText = topPlayers[1].nick;

    nicknameInput.value = "";
    nicknameInput.classList.add("hidden");
    nicknameBtn.classList.add("hidden");
    enterNicknameText.classList.add("hidden");
    tableNick2.classList.remove("blink");
    scoreboard.classList.add("hidden");
    startScreen.classList.remove('hidden');
    document.getElementById('form').removeEventListener('submit', secondPlayerNickInput, setTopPlayersToLocalStorage());
}

function thirdPlayerNickInput(ev) {
    ev.preventDefault();
    let playerNick = nicknameInput.value;
    topPlayers[2].nick = playerNick;
    tableNick3.innerText = topPlayers[2].nick;

    nicknameInput.value = "";
    nicknameInput.classList.add("hidden");
    nicknameBtn.classList.add("hidden");
    enterNicknameText.classList.add("hidden");
    tableNick3.classList.remove("blink");
    scoreboard.classList.add("hidden");
    startScreen.classList.remove('hidden');
    document.getElementById('form').removeEventListener('submit', thirdPlayerNickInput, setTopPlayersToLocalStorage());
};

let max = 8

nicknameInput.addEventListener('keyup', function (event) {
    event.target.value = event.target.value.substring(0, max)
})

function setTopPlayersToLocalStorage() {
    localStorage.setItem("topPlayers", JSON.stringify(topPlayers))
}

