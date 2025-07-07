let boxes = document.querySelectorAll(".box");
let turn = true;
let h1 = document.querySelector(".ws");
let winners = document.querySelector(".winners");
let newbtn = document.querySelector(".newbtn");
let resetbtn = document.querySelector(".resetbtn");
let playerturn=document.querySelector(".playerturn");
const winPatterns = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Column 1
  [1, 4, 7], // Column 2
  [2, 5, 8], // Column 3
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
];
const disabled = (box) => {
    box.style.pointerEvents = "none";
};
let count = 0;
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turn) {
      box.style.color="#1fada7";
      box.innerText = "X";
      turn = false;
      playerturn.innerText="Player 2 Turn(O)";
    } else {
      box.style.color="#f57c1f";
      box.innerText = "O";
      turn = true;
            playerturn.innerText="Player 1 Turn(X)";
    }
    disabled(box);
    count++;
    checkwinner();
    if (count == 9) {
      drawmatch();
    }
  });
});
console.log(count);
const drawmatch = () => {
  winners.classList.remove("hide");
  h1.innerText = `Play Better Next Time , Draw!`;
  hideAllExceptWinners();
  playerturn.classList.add("hide"); 
};
const checkwinner = () => {
  for (x of winPatterns) {
    let post1 = boxes[x[0]].innerText;
    let post2 = boxes[x[1]].innerText;
    let post3 = boxes[x[2]].innerText;
    if (post1 != "" && post2 != "" && post3 != "") {
      if (post1 == post2 && post2 == post3) {
        showwinner(post1);
        return;
      }
    }
  }
};

const showwinner = (post1) => {
  winners.classList.remove("hide");
  h1.innerText = `Congratulations , And The Winner Is  ${post1}`;
  hideAllExceptWinners();
  playerturn.classList.add("hide"); 
  boxes.forEach((box) => {
    box.style.pointerEvents = "none";
  });
};
newbtn.addEventListener("click", () => {
  winners.classList.add("hide");
  boxes.forEach((box) => {
    box.innerText = "";
    box.style.pointerEvents = "auto";
    playerturn.classList.remove("hide"); 
    playerturn.innerText="Player 1 Turn(X)";
    turn=true;
    count=0;
  });
    const xp = document.querySelector(".main");
  [...xp.children].forEach(child => {
    child.classList.remove("hide"); // ✅ show all again
  });
  winners.classList.add("hide");

});

resetbtn.addEventListener("click", () => {
  boxes.forEach((box) => {
    box.innerText = "";
    box.style.pointerEvents = "auto";
    playerturn.classList.remove("hide"); 
    playerturn.innerText="Player 1 Turn(X)";
    turn=true;    
    count=0;
  });
    const xp = document.querySelector(".main");
  [...xp.children].forEach(child => {
    child.classList.remove("hide"); // ✅ show all again
  });
  winners.classList.add("hide");

});

function hideAllExceptWinners() {
  const main = document.querySelector(".main");

  // Loop through all direct children of .main
  [...main.children].forEach(child => {
    // Only skip the .winners section
    if (!child.classList.contains("winners")) {
      child.classList.add("hide");
    }
  });
}