import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015; //we can change JUMP_SPEED and GRAVITY how we like
const DINO_FRAME_COUNT = 2; //the count is 2 because there are two imgs for dino animation
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setupDino() {
    isJumping = false;
    dinoFrame = 0;
    currentFrameTime = 0;
    yVelocity = 0;
    setCustomProperty(dinoElem, "--bottom", 0);
    document.removeEventListener("keydown", onJump);
    document.addEventListener("keydown", onJump);
    document.removeEventListener("touchstart", onJump2);
    document.addEventListener("touchstart", onJump2);
};

export function updateDino(delta, speedScale) {
    handleRun(delta, speedScale);
    handleJump(delta);
};

export function getDinoRect() {
    return dinoElem.getBoundingClientRect(); // getting hitbox of the dino
};

export function setDinoLose() {
    dinoElem.src = `imgs/dino-lose.png`;
};

function handleRun(delta, speedScale) {
    if (isJumping) {
        dinoElem.src = `imgs/dino-stationary.png`;
        return;
    };

    if (currentFrameTime >= FRAME_TIME){
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT; //this line helps to loop dino animation values (0/1);
        dinoElem.src = `imgs/dino-run-${dinoFrame}.png`;
        currentFrameTime -= FRAME_TIME;
    };
    currentFrameTime += delta * speedScale;
};

function handleJump(delta) {
    if (!isJumping) return;

    incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)

    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
        setCustomProperty(dinoElem, "--bottom", 0); // 0 is the ground lvl so dino can't go below it
        isJumping = false;
    };

    yVelocity -= GRAVITY * delta; // we do that because we want it to scale with frame rate
};

function onJump(e) {
    if (e.code !== "Space" || isJumping) return;

    yVelocity = JUMP_SPEED;
    isJumping = true;
};

function onJump2(e) {
    if (isJumping) return;

    yVelocity = JUMP_SPEED;
    isJumping = true;
};