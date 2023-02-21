import { getCustomProperty, incrementCustomProperty, setCustomProperty, randomNumberBetween } from "./updateCustomProperty.js";

const SPEED = 0.05; // must be the same as the ground SPEED
let CACTUS_INTERVAL_MIN = 1000;
let CACTUS_INTERVAL_MAX = 2000;
const worldElem = document.querySelector("[data-world]");

let nextCactusTime;

export function setupCactus() {
    nextCactusTime = CACTUS_INTERVAL_MIN;
    document.querySelectorAll("[data-cactus]").forEach(cactus => {
        cactus.remove();
    });
};

export function updateCactus(delta, speedScale) {
    document.querySelectorAll("[data-cactus]").forEach(cactus => {
        incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1);
        if (getCustomProperty(cactus, "--left") <= -100) {
            cactus.remove()
        };
    });

    if (nextCactusTime <= 0) {
        createCactus();
        if (window.matchMedia('(max-device-width: 415px)').matches) {
            CACTUS_INTERVAL_MIN = 1500;
        };
        nextCactusTime = randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale;
    };
    nextCactusTime -= delta;
};

export function getCactusRects() {
    return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
        return cactus.getBoundingClientRect(); // getting hitbox of the cactus
    })
};

function createCactus() {
    const cactus = document.createElement("img");
    var cactusImages = ["imgs/cactus.png","imgs/cactus-2.png","imgs/cactus-3.png"];
    cactus.dataset.cactus = true;
    cactus.src = cactusImages[Math.floor(Math.random() * cactusImages.length)];
    cactus.classList.add("cactus");
    setCustomProperty(cactus, "--left", 100);
    worldElem.append(cactus);
};