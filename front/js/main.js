const points = document.querySelector("#points");
const title = document.querySelector("#title");
const background = document.querySelector("#game");
const cactus = document.querySelector("#cactus");
const dino = document.querySelector("#dino");
const bottom = document.querySelector("#bottom");
const hearts = document.querySelector("#life");
const btnMobile = document.querySelector("#btn-mobile");
const tableRank = document.getElementById("table-rank");
const inputNickname = document.querySelector("#nickname");
const btnNickname = document.querySelector("#btn-nickname");

let stateGame = false,
  isEndGame = false,
  position = 20,
  distance = 0,
  isJumping = false,
  nickname = "",
  isCreatingCactus = false;

function coverCenter(element) {
  element.style.backgroundSize = "cover";
  element.style.backgroundPosition = "center";
}

function countPoints() {
  // alterMode();
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
  let leftRigth = false;
  let alterMoveDino = setInterval(() => {
    if (isEndGame) {
      clearInterval(alterMoveDino);
    } else {
      if (stateGame == true && isEndGame == false) {
        if (leftRigth) {
          dino.src = "front/img/dino-move1.svg";
        } else {
          dino.src = "front/img/dino-move2.svg";
        }
        leftRigth = !leftRigth;
      }
    }
  }, 200);
}

function jump() {
  if (position != 20) return;
  isJumping = true;
  let timeJump = setInterval(() => {
    if (position >= 200) {
      clearInterval(timeJump);
      let returnJump = setInterval(() => {
        if (position <= 20) {
          isJumping = false;
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

function createCactus() {
  isCreatingCactus = true;
  const cacto = document.createElement("img");
  let cactoPosition = 1200,
    timeRandomCreateCacto = parseInt(Math.random() * 6000);
  timeRandomCreateCacto < 1600 ? (timeRandomCreateCacto = 1600) : null;
  if (isEndGame) {
    while (cactus.hasChildNodes()) {
      cactus.removeChild(cacto);
      return;
    }
  } else {
    cacto.classList.add("cacto");
    cacto.src = `front/img/cacto${randomCactus()}.svg`;
    cacto.style.left = cactoPosition + "px";
    cactus.appendChild(cacto);
    moveCacto(cacto, cactoPosition);
    setTimeout(createCactus, timeRandomCreateCacto);
  }
}

function randomCactus() {
  let num = parseInt(Math.random() * 9);
  console.log(num);
  return num;
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
    } else if (cactoPosition >= 80 && cactoPosition <= 160 && position <= 100) {
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
  }, 12);
}

function removeHeart() {
  if (hearts.firstElementChild == null) {
    endGame();
  } else {
    hearts.removeChild(hearts.firstElementChild);
  }
}

function insereRank(resultGame) {
  axios
    .post("https://game-api2022.herokuapp.com/api/Game", {
      Name: resultGame.Name,
      Score: resultGame.Score,
    })
    .then(() => {
      getPlayers();
    })
    .catch((error) => {
      alert(error);
    });
}

function getPlayers() {
  axios.get("https://game-api2022.herokuapp.com/api/Game").then((response) => {
    const players = response.data;
    setTable(players);
  });
}

function headerTable() {
  return `
    <tr>
      <th></th>
      <th>Nickname</th>
      <th>Pontos</th>
    </tr>`;
}

function setTable(players) {
  tableRank.innerHTML = headerTable();
  for (let i = 0; i < players.length; i++) {
    tableRank.innerHTML += `<tr>
      <td>${i + 1}</td>
      <td>${players[i].name}</td>
      <td>${players[i].score}</td>
    </tr>`;
  }
}

function clickBtnNickname() {
  nickname = inputNickname.value;
  btnNickname.innerHTML = "Alterar";

  if (nickname === "" || nickname.length < 3 || nickname.length > 12) {
    nickname = "";
    inputNickname.style.borderColor = "tomato";
    btnNickname.style.background = "tomato";
    inputNickname.innerHTML = nickname;
  } else {
    btnNickname.style.background = "yellowgreen";
    inputNickname.style.borderColor = "yellowgreen";
  }
}

function reset() {
  if (nickname != "") {
    const resultGame = {
      Name: nickname,
      Score: score,
    };
    insereRank(resultGame);
  }
  (stateGame = false),
    (isEndGame = false),
    (position = 20),
    (distance = 0),
    (isJumping = false),
    (isCreatingCactus = false);
  title.innerHTML = "Precione ENTER para começar!";
  points.innerHTML = "POINTS";
  btnMobile.innerHTML = "start";
  const heart = document.createElement("img");
  heart.classList.add("heart");
  heart.src = "front/img/heart-pixel.png";
  hearts.appendChild(heart);
  setInterval(() => {}, 100);
}

function endGame() {
  isEndGame = true;
  while (cactus.hasChildNodes()) {
    cactus.removeChild(cactus.firstChild);
  }
  background.style.animationDuration = "0s";
  bottom.style.animationDuration = "0s";
  title.innerHTML = "Precione ENTER para resetar!";
  btnMobile.innerHTML = "reset";
  dino.src = "front/img/dino.svg";
}

function keyPress() {
  let code = event.keyCode;

  if (code === 13 || event.target.id === "btn-mobile") {
    if (!stateGame && !isEndGame) {
      stateGame = true;
      countPoints();
      moveDino();
      if (!isCreatingCactus) {
        createCactus();
      }
      background.style.animationDuration = "10s";
      bottom.style.animationDuration = "4.8s";
      btnMobile.innerHTML = "jump";

      nickname === ""
        ? (title.innerHTML = `RUN DINO, RUN...`)
        : (title.innerHTML = `RUN ${nickname}, RUN...`);
    } else if (isEndGame) {
      reset();
    } else {
      jump();
    }
  }
}

getPlayers();
document.addEventListener("keypress", keyPress, false);
btnMobile.addEventListener("click", keyPress, false);
btnNickname.addEventListener("click", clickBtnNickname, false);
