// CONSTANTS

const game = document.querySelector('.game');
const doodle = document.querySelector('.doodle');
const lose = document.querySelector('.lose');
const platformWrapper = document.querySelector('.platform-wrapper');

const totalPlatform = 1000;
const gameWidth = 500;
const gameHeight = 600;
const doodleWidth = 70;
const doodleHeight = 100;
const platformWidth = 110;
const platformHeight = 30;
const platformGap = 230;
const gravity = 0.5;

// VARIABLES

let platformCoords = [];
let xPosition = 0;
let yPosition = 0;
let xSpeed = 0;
let ySpeed = 20;
let doodleScale = -1;
let animationFrame = 0;
let distanceToPlatform = platformGap * totalPlatform;
let platformArrHTML = [];

// LISTENERS

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        xSpeed = 10;
        doodleScale = 1;
    } else if (e.key === 'ArrowLeft') {
        xSpeed = -10;
        doodleScale = -1;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        xSpeed = 0;
    }
});

window.addEventListener('click', (e) => {
    if(e.target.classList.contains('btn')){
        startTheGame();
    }
})

// FUNCTIONS

startTheGame();

function startTheGame(){
    lose.classList.add('hide');
    platformWrapper.innerHTML = '';
    setPlatformCoords();
    getStartPoint();
    requestAnimationFrame(showGame);
}

function setPlatformCoords() {
    for (let i = 0; i <= totalPlatform; i++) {
        platformCoords[i] = Math.floor(Math.random() * (gameWidth - platformWidth));
        const platformHTML = document.createElement('div');
        platformHTML.className = 'platform';
        platformHTML.style.left = platformCoords[i] + 'px';
        platformHTML.style.top = i * platformGap + 'px';
        platformWrapper.appendChild(platformHTML);
    }
    platformArrHTML = document.querySelectorAll('.platform');
}

function getStartPoint() {
    game.scrollTop = game.scrollHeight;
    xPosition = platformCoords[totalPlatform];
    yPosition = totalPlatform * platformGap;
}

function showGame() {
    xPosition += xSpeed;
    yPosition -= ySpeed;
    ySpeed -= gravity;

    moveToOppositeSide();
    checkOnPlatform();
    scrollGame();
    makePlatformsTransparent();

    doodle.style.transform = `translate(${xPosition}px, ${yPosition - doodleHeight}px) scaleX(${doodleScale})`;
    animationFrame = requestAnimationFrame(showGame);
    checkLosing();
}

function checkOnPlatform() {
    const whichPlatform = Math.floor(yPosition / platformGap);
    const statement = xPosition < platformCoords[whichPlatform] + platformWidth &&
        xPosition + doodleWidth > platformCoords[whichPlatform] &&
        yPosition > whichPlatform * platformGap &&
        yPosition < (whichPlatform * platformGap) + platformHeight &&
        ySpeed < 0 &&
        !platformArrHTML[whichPlatform].classList.contains('transparent');

    if (statement) {
        ySpeed = 20;
        distanceToPlatform = whichPlatform * platformGap;
    }
}

function scrollGame() {
    if (yPosition < game.scrollTop + gameHeight / 2) {
        game.scrollTop = yPosition - gameHeight / 2;
    }
}

function moveToOppositeSide() {
    if (xPosition < -doodleWidth) {
        xPosition = gameWidth - doodleWidth / 2;
    } else if (xPosition > gameWidth) {
        xPosition = -doodleWidth / 2;
    }
}

function makePlatformsTransparent() {
    if (distanceToPlatform > game.scrollTop + gameHeight / 2){
        const whichPlatform = distanceToPlatform / platformGap;
        if (platformArrHTML[whichPlatform]){
            platformArrHTML[whichPlatform].classList.add('transparent');
        }
    }
}

function checkLosing(){
    if(yPosition > game.scrollTop + gameHeight * 1.5){
        cancelAnimationFrame(animationFrame);
        lose.classList.remove('hide');
        clearVariables();
    }
}

function clearVariables(){
    platformCoords = [];
    xPosition = 0;
    yPosition = 0;
    xSpeed = 0;
    ySpeed = 20;
    doodleScale = -1;
    animationFrame = 0;
    distanceToPlatform = platformGap * totalPlatform;
    platformArrHTML = [];
}