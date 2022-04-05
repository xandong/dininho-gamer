const modeMain = document.querySelector("#mode");
const stateMode = document.querySelector("#state-mode");

let mode = false;

function click() {
  console.log("CLICOU");
  if (!mode) {
    mode = true;
    document.body.style.color = "whitesmoke";
    document.body.style.background = "black";

    modeMain.style.justifyContent = "end";
    modeMain.style.background = "whitesmoke";
    stateMode.style.background = "rebeccapurple";
  } else {
    mode = false;
    document.body.style.color = "black";
    document.body.style.background = "whitesmoke";

    modeMain.style.justifyContent = "start";
    modeMain.style.background = "#3A026A";
    stateMode.style.background = "whitesmoke";
  }
}

modeMain.addEventListener("click", click, false);
