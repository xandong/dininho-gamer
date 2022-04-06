const points = document.querySelector("#points");
const title = document.querySelector("#title");
const background = document.querySelector("#game");
const cactus = document.querySelector("#cactus");
const dino = document.querySelector("#dino");
const bottom = document.querySelector("#bottom");
const hearts = document.querySelector("#life");
const btnMobile = document.querySelector("#btn-mobile");

let stateGame = false,
  isEndGame = false,
  mode = false,
  position = 20,
  distance = 0,
  isJumping = false;

function coverCenter(element) {
  element.style.backgroundSize = "cover";
  element.style.backgroundPosition = "center";
}

function alterStateGame() {
  alterMode();
  stateGame = !stateGame;
  console.log("stateGame: " + stateGame);
  return stateGame;
}
function countPoints() {
  let count = setInterval(() => {
    if (isEndGame) {
      clearInterval(count);
    } else {
      distance += 1;
      points.innerHTML = `${distance}`;
    }
  }, 100);
}
function moveDino() {
  console.log("MOVENDO...");
  let leftRigth = false;
  let alterMoveDino = setInterval(() => {
    if (isEndGame) {
      clearInterval(alterMoveDino);
    } else {
      if (stateGame == true && isEndGame == false) {
        if (leftRigth) {
          dino.style.background = `url(../img/dino1.png)`;
        } else {
          dino.style.background = `url(../img/dino2.png)`;
        }
        leftRigth = !leftRigth;
        coverCenter(dino);
      }
    }
  }, 200);
}

function jump() {
  let timeJump = setInterval(() => {
    if (position >= 200) {
      isJumping = false;
      clearInterval(timeJump);
      let returnJump = setInterval(() => {
        if (position <= 20) {
          clearInterval(returnJump);
        } else {
          position -= 10;
          dino.style.bottom = position + "px";
        }
      }, 20);
    } else {
      isJumping = true;
      position += 10;
      dino.style.bottom = position + "px";
    }
  }, 20);
}
function randomCactus() {
  let num = parseInt(Math.random() * 12);
  return num;
}
function createCactus() {
  console.log(`status do jogo no create: ${isEndGame}`);
  const cacto = document.createElement("div");
  let cactoPosition = 1200,
    timeRandomCreateCacto = parseInt(Math.random() * 3000);
  timeRandomCreateCacto < 800 ? (timeRandomCreateCacto = 800) : null;
  if (isEndGame) {
    while (cactus.hasChildNodes()) {
      cactus.removeChild(cacto);
      return;
    }
  } else {
    cacto.classList.add("cacto");
    cacto.style.background = `url(../img/cacto${randomCactus()}.png)`;
    cacto.style.left = cactoPosition + "px";
    coverCenter(cacto);
    cactus.appendChild(cacto);
    moveCacto(cacto, cactoPosition);
    setTimeout(createCactus, timeRandomCreateCacto);
  }
}

function moveCacto(cacto, cactoPosition) {
  if (isEndGame) {
    clearInterval(cactoInverval);
  }
  let cactoInverval = setInterval(() => {
    cactoPosition -= 5;
    cacto.style.left = cactoPosition + "px";
    if (cactoPosition < -100) {
      clearInterval(cactoInverval);
      cactus.removeChild(cacto);
    } else if (cactoPosition >= 90 && cactoPosition <= 150 && position <= 100) {
      clearInterval(cactoInverval);
      if (cactus.hasChildNodes()) {
        cactus.removeChild(cacto);
      } else {
        endGame();
      }
      setTimeout(() => {
        removeHeart();
      }, 100);
    }
  }, 10);
}

function removeHeart() {
  if (hearts.firstElementChild == null) {
    endGame();
  } else {
    hearts.removeChild(hearts.firstElementChild);
  }
}

function alterMode() {
  let modeBg = setInterval(() => {
    if (isEndGame) {
      clearInterval(modeBg);
    } else {
      if (distance % 500 == 0 && distance != 0) {
        if (mode) {
          background.style.background = "url(../img/bg1-night.png)";
        } else {
          background.style.background = "url(../img/bg1.png)";
        }
        coverCenter(background);
        mode = !mode;
      }
    }
  }, 100);
}

function reset() {
  let nickname = prompt(
    "Deixe sua pontuação registrada no ranking! Qual seu nickname?"
  );
  if (nickname != null) {
    // insereRank(nickname, distance);
    console.log(`${nickname} fez ${distance} pontos!`);
  }
  (stateGame = false), (isEndGame = false), (position = 20), (distance = 0);
  title.innerHTML = "Precione enter/espaço para começar!";
  points.innerHTML = "POINTS";
  btnMobile.innerHTML = "start";
  const heart = document.createElement("img");
  heart.classList.add("heart");
  heart.src = "img/heart-pixel.png";
  hearts.appendChild(heart);
  console.log("Jogo resetado");
}

function endGame() {
  while (cactus.hasChildNodes()) {
    cactus.removeChild(cactus.firstChild);
  }
  isEndGame = true;
  background.style.animationDuration = "0s";
  bottom.style.animationDuration = "0s";
  title.innerHTML = "Precione enter/espaço para resetar!";
  btnMobile.innerHTML = "reset";
  dino.style.background = "url(../img/dino0.png)";
  coverCenter(dino);
}

function keyUp() {
  let code = event.keyCode;
  let codeStr = String.fromCharCode(code);
  // console.log("Code: " + event.keyCode + "; Tecla: " + codeStr);
  if (!stateGame) {
    alterStateGame();
    countPoints();
    moveDino();
    createCactus();
    title.innerHTML = "RUN DINO, RUN...";
    background.style.animationDuration = "10s";
    bottom.style.animationDuration = "4.8s";
    btnMobile.innerHTML = "jump";
  } else {
    if (code === 32 || code === 13 || event.target.id == "btn-mobile") {
      if (isEndGame) {
        reset();
      } else {
        if (position == 20 || event.target.id == "btn-mobile") {
          jump();
        }
      }
    } else if (code == 77 || code == 109) {
      endGame();
    }
  }
}

document.addEventListener("keypress", keyUp, false);
btnMobile.addEventListener("click", keyUp, false);
