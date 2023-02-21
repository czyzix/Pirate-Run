export function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
    //getting css values, geting specific css property and convert it
};

export function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value);
};

export function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
    //getting new value, incrementing it and then setting it
};

export function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};