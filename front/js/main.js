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
  mode = false,
  position = 20,
  distance = 0,
  isJumping = false,
  nickname = "";

function coverCenter(element) {
  element.style.backgroundSize = "cover";
  element.style.backgroundPosition = "center";
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
  }, 30);
}

function createCactus() {
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
        try {
          cactus.removeChild(cacto);
        } catch (error) {
          console.log(error);
        }
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

// function alterMode() {
//   let modeBg = setInterval(() => {
//     if (isEndGame) {
//       clearInterval(modeBg);
//     } else {
//       if (distance % 500 == 0 && distance != 0) {
//         if (mode) {
//           background.style.background = "url(../img/bg1-night.png)";
//         } else {
//           background.style.background = "url(../img/bg1.png)";
//         }
//         coverCenter(background);
//         mode = !mode;
//       }
//     }
//   }, 100);
// }

function insereRank(resultGame) {
  axios
    .post("https://game-api2022.herokuapp.com/api/Game", {
      Name: resultGame.Name,
      Score: resultGame.Score,
    })
    .then(() => {
      getPlayers();
      alert("Pontuação registrada com sucesso!");
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

  if (nickname == "" || nickname.length < 3 || nickname.length > 12) {
    nickname = "";
    inputNickname.style.borderColor = "tomato";
    btnNickname.style.background = "tomato";
    inputNickname.innerHTML = nickname;
    return false;
  } else {
    btnNickname.style.background = "yellowgreen";
    inputNickname.style.borderColor = "yellowgreen";
    return true;
  }
}

function reset() {
  let score = distance;
  (stateGame = false), (isEndGame = false), (position = 20), (distance = 0);
  title.innerHTML = "Precione ENTER para começar!";
  points.innerHTML = "POINTS";
  btnMobile.innerHTML = "start";
  const heart = document.createElement("img");
  heart.classList.add("heart");
  heart.src = "front/img/heart-pixel.png";
  hearts.appendChild(heart);

  if (clickBtnNickname()) {
    const resultGame = {
      Name: nickname,
      Score: score,
    };
    insereRank(resultGame);
  }
}

function endGame() {
  while (cactus.hasChildNodes()) {
    cactus.removeChild(cactus.firstChild);
  }
  isEndGame = true;
  background.style.animationDuration = "0s";
  bottom.style.animationDuration = "0s";
  title.innerHTML = "Precione ENTER para resetar!";
  btnMobile.innerHTML = "reset";
  dino.src = "front/img/dino.svg";
}

function keyPress() {
  let code = event.keyCode;
  // let codeStr = String.fromCharCode(code);
  // console.log("Code: " + event.keyCode + "; Tecla: " + codeStr);
  if (code === 32 || code === 13 || event.target.id == "btn-mobile") {
    if (!stateGame) {
      stateGame = true;
      // alterMode();
      countPoints();
      moveDino();
      createCactus();

      title.innerHTML = "RUN ";
      if (nickname != "") {
        title.innerHTML += `${nickname}`;
      } else {
        title.innerHTML += "DINO";
      }
      title.innerHTML += ", RUN...";
      background.style.animationDuration = "10s";
      bottom.style.animationDuration = "4.8s";
      btnMobile.innerHTML = "jump";
    }
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

getPlayers();
document.addEventListener("keypress", keyPress, false);
btnMobile.addEventListener("click", keyPress, false);
btnNickname.addEventListener("click", clickBtnNickname, false);
