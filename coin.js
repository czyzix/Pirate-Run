import { getCustomProperty, incrementCustomProperty, setCustomProperty, randomNumberBetween } from "./updateCustomProperty.js";

const SPEED = 0.05; // must be the same as the ground SPEED
let COIN_INTERVAL_MIN = 2000;
let COIN_INTERVAL_MAX = 9000;
const worldElem = document.querySelector("[data-world]");

let nextCoinTime;

export function setupCoin() {
    nextCoinTime = COIN_INTERVAL_MIN;
    document.querySelectorAll("[data-coin]").forEach(coin => {
        coin.remove();
    });
};

export function updateCoin(delta, speedScale) {
    document.querySelectorAll("[data-coin]").forEach(coin => {
        incrementCustomProperty(coin, "--left", delta * speedScale * SPEED * -1);
        if (getCustomProperty(coin, "--left") <= -100) {
            coin.remove()
        };
    });

    if (nextCoinTime <= 0) {
        createCoin();
        if (window.matchMedia('(max-device-width: 415px)').matches) {
            COIN_INTERVAL_MIN = 10500;
        };
        nextCoinTime = randomNumberBetween(COIN_INTERVAL_MIN, COIN_INTERVAL_MAX) / speedScale;
    };
    nextCoinTime -= delta;
};

export function getCoinRects() {
    return [...document.querySelectorAll("[data-coin]")].map(coin => {
        return coin.getBoundingClientRect(); // getting hitbox of the coin
    })
};

export function removeCoin() {
    document.querySelectorAll("[data-coin]").forEach(coin => {
        coin.remove()});
}

function createCoin() {
    const coin = document.createElement("img");
    coin.dataset.coin = true
    coin.src = `imgs/coin.png`
    coin.classList.add("coin")
    setCustomProperty(coin, "--left", 100)
    worldElem.append(coin)
};