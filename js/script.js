// CONSTANTS

const game = document.querySelector('.game');
const doodle = document.querySelector('.doodle');
const lose = document.querySelector('.lose');
const platformWrapper = document.querySelector('.platform-wrapper');
const score = document.querySelector('.score');
const cardScore = document.querySelector('.card-score');

const totalPlatform = 1000;
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;
const doodleWidth = 70;
const doodleHeight = 100;
const platformWidth = 110;
const platformHeight = 30;
const gravity = 0.5;

// VARIABLES

let platformGap = 0;
let platformCoords = [];
let xPosition = 0;
let yPosition = 0;
let xSpeed = 0;
let ySpeed = 20;
let doodleScale = -1;
let animationFrame = 0;
let distanceToPlatform = platformGap * totalPlatform;
let platformArrHTML = [];
let gameScore = 0;
let initialScrollTop = 0;

score.innerText = gameScore;

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

setGameSize();
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
    initialScrollTop = game.scrollTop;
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
    setGameScore();

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
    if(yPosition > game.scrollTop + gameHeight + doodleHeight){
        cancelAnimationFrame(animationFrame);
        cardScore.innerText = `Your score: ${score.innerText}`;
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
    gameScore = 0;
}

function setGameSize(){
    if(gameWidth > 1000){
        platformGap = 60;
    } else if(gameWidth > 500 && gameWidth < 1000){
        platformGap = 100;
    } else {
        platformGap = 200;
    }
}

function setGameScore(){
    score.innerText = Math.floor((initialScrollTop - game.scrollTop) / 10);
}