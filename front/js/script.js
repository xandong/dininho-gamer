const background = document.querySelector(".background");
const dino = document.querySelector("#dino");
const distance = document.querySelector("#distance");
const title = document.querySelector("#title");
const hearts = document.querySelector("#life");
const path = document.querySelector("#path");
const cactus = document.querySelector("#cactus");

const MIN_POSITION = 20,
  MS_DEFAULT = 16.7,
  MAX_POSITION = 200,
  CURVA = 5;
let position = 20,
  isJumping = false,
  isDown = false,
  isStarting = false,
  auxDistance = 0;

function start() {
  if (isStarting === false) {
    title.innerHTML = "";
    isStarting = true;
    printDistance();
    alterDino();
    createCactus();
  } else {
  }
}
function keyDown() {
  // console.log(event.keyCode);
  if (endGame()) {
    // console.log(endGame());
    // console.log("Estou no restart");
    // const heart = document.createElement("div");
    // heart.classList.add("heart");
    // while (hearts.childElementCount != 3) {
    //   hearts.appendChild(heart);
    // }
    // endGame();
    return;
  } else {
    if (event.keyCode === 13) {
      title.innerHTML = "";
      background.style.animation = "sliderBackground 2000s infinite linear";
      path.style.animation = "sliderBackground 400s infinite linear";
      start();
    } else {
      if (event.keyCode === 32 || event.keyCode === 38) {
        if (isJumping == false) {
          jump();
        }
      }
      if (event.keyCode === 40) {
        if (isDown == false) {
          console.log("Boost down");
          returnFromJump(10);
        }
      }
    }
  }
}

function jump() {
  (isJumping = false), (isDown = false);
  if (position === 20) {
    isJumping = true;
    let intervalJump = setInterval(() => {
      if (position >= MAX_POSITION) {
        clearInterval(intervalJump);
        isJumping = false;
        returnFromJump();
        return;
      } else {
        alterH((position += 10));
      }
    }, MS_DEFAULT);
  }
}

function returnFromJump(second = MS_DEFAULT) {
  if (isJumping) {
    return;
  } else {
    let intervalReturn = setInterval(() => {
      if (position <= MIN_POSITION) {
        isJumping = false;
        clearInterval(intervalReturn);
      } else {
        if (position <= MAX_POSITION / 2) {
          isDown = true;
        }
        alterH((position -= 10));
      }
    }, second);
  }
}
function createCactus() {
  const cacto = document.createElement("div");
  let cactoPosition = 2000;
  let timeRandom = parseInt(Math.random() * 4000);
  timeRandom < 800 ? (timeRandom = 800) : null;

  if (endGame()) {
    return;
  } else {
    cacto.classList.add("cactus");
    cacto.style.background = `url("../img/cacto${randomCactus()}.png")`;
    cacto.style.left = cactoPosition + "px";
    cacto.style.backgroundSize = "cover";
    cacto.style.backgroundPosition = "center";
    cactus.appendChild(cacto);

    let cactoInterval = setInterval(() => {
      cactoPosition -= 3;
      cacto.style.left = cactoPosition + "px";
      if (cactoPosition < -100) {
        clearInterval(cactoInterval);
        cactus.removeChild(cacto);
      } else if (cactoPosition > 80 && cactoPosition < 130 && position < 100) {
        clearInterval(cactoInterval);
        cactus.removeChild(cacto);
        setTimeout(() => {
          removeHeart();
          removeHeart();
        }, 100);
        if (hearts.childElementCount === 0) {
          while (cactus.hasChildNodes) {
            cactus.removeChild(cacto);
          }
          endGame();
        }
      }
    }, 2);
    setTimeout(createCactus, timeRandom);
  }
}

function alterDino(second = 150) {
  isLeft = true;
  let alter = setInterval(() => {
    if (isJumping) {
      second = 300;
    } else {
      if (isLeft == true) {
        isLeft = !isLeft;
        dino.style.background = `url("../img/dino1-red.png")`;
        dino.style.backgroundSize = "cover";
      } else {
        isLeft = !isLeft;
        dino.style.background = `url("../img/dino2-red.png")`;
        dino.style.backgroundSize = "cover";
      }
    }
    if (endGame()) {
      clearInterval(alter);
      dino.style.background = `url("../img/dino0-red.png")`;
      dino.style.backgroundSize = "cover";
    }
  }, second);
}

function randomCactus() {
  let num = parseInt(Math.random() * 12);
  return num;
}

function alterH(position) {
  dino.style.bottom = `${position}px`;
}

function printDistance() {
  let distanciaPercorrida = setInterval(() => {
    auxDistance += 1;
    distance.innerHTML = auxDistance;
    if (endGame()) {
      clearInterval(distanciaPercorrida);
    }
    if (auxDistance === 1000) {
      background.style.background = "url(../img/bg1-night.png)";
      background.style.backgroundPosition = "center";
      background.style.backgroundSize = "cover";
      background.style.backgroundRepeat = "repeat-x";
    }
  }, 100);
}
function removeHeart() {
  hearts.removeChild(hearts.firstChild);
}
function endGame() {
  if (hearts.childElementCount === 0) {
    title.innerHTML = `END GAME - ${distance.innerHTML} POINTS<br><h2 text-align="center </h2>">F5 to RESTART`;
    background.style.animation = "";
    path.style.animation = "";
    return true;
  }
  return false;
}
document.addEventListener("keydown", keyDown);
