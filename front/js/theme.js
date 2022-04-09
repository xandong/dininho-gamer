const theme = document.querySelector("#theme");
const stateMode = document.querySelector("#state-theme");

let mode = false;

function click() {
  if (!mode) {
    mode = true;
    document.body.style.color = "whitesmoke";
    document.body.style.background = "black";

    theme.style.justifyContent = "end";
    theme.style.background = "whitesmoke";
    stateMode.style.background = "rebeccapurple";
  } else {
    mode = false;
    document.body.style.color = "black";
    document.body.style.background = "whitesmoke";

    theme.style.justifyContent = "start";
    theme.style.background = "#3A026A";
    stateMode.style.background = "whitesmoke";
  }
}

theme.addEventListener("click", click, false);
