/*************************************************************
 *  TIC‑TAC‑TOE  –  HUMAN (X) vs PERFECT COMPUTER (O)
 *  ───────────────────────────────────────────────────────────
 *  Lines tagged with  🔄 CHANGED  show what differs from, or
 *  completely replaces, your original script.
 *************************************************************/

/* ---------- DOM references (unchanged) ---------- */
const boxes      = document.querySelectorAll(".box");
const h1         = document.querySelector(".ws");
const winners    = document.querySelector(".winners");
const newbtn     = document.querySelector(".newbtn");
const resetbtn   = document.querySelector(".resetbtn");
const playerturn = document.querySelector(".playerturn");
let divsToHide = document.querySelectorAll(".main div:not(.winners)");
/* ---------- Winning patterns (unchanged) ---------- */
const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],   // rows
  [0,3,6], [1,4,7], [2,5,8],   // cols
  [0,4,8], [2,4,6]             // diags
];

/* ===========================================================
   🔄 CHANGED BLOCK #1 (NEW GAME‑STATE VARIABLES)
   – replaces your old `let turn = true;` and `let count = 0`
   =========================================================== */
const HUMAN   = "X";                 // player mark
const AI      = "O";                 // computer mark
let board     = Array(9).fill("");   // logical board
let movesMade = 0;                   // total moves so far
let gameOver  = false;               // flag to stop play

/* ---------- CLICK handler: HUMAN plays, AI replies ---------- */
/* 🔄 CHANGED BLOCK #2 (ENTIRE FOR‑EACH REWRITTEN) */
boxes.forEach((box, idx) => {
  box.addEventListener("click", () => {
    // ignore click if game finished or square already used
    if (gameOver || board[idx] !== "") return;

    placeMark(idx, HUMAN, "#1fada7");          // human = teal X
    if (endCheck(HUMAN)) return;               // human win/draw?

    playerturn.textContent = "Computer thinking…";
    setTimeout(() => {                         // tiny pause
      const aiIdx = bestMove();                // perfect move
      placeMark(aiIdx, AI, "#f57c1f");         // AI = orange O
      endCheck(AI);                            // AI win/draw?
    }, 300);
  });
});

/* ===========================================================
   🔄 CHANGED BLOCK #3 (NEW HELPER FUNCTIONS)
   – replaces `disabled()`, `checkwinner()`, `showwinner()`
   =========================================================== */

/*  Update both the logical board and the UI  */
function placeMark(i, mark, color) {
  board[i] = mark;
  boxes[i].innerText           = mark;
  boxes[i].style.color         = color;
  boxes[i].style.pointerEvents = "none";
  movesMade++;
}

/*  Check for win or draw, update headings, stop game if over  */
function endCheck(mark) {
  if (isWinner(board, mark)) {
    gameOver = true;
    winners.classList.remove("hide");
    h1.textContent = mark === HUMAN ? "You win! 🎉"
                                    : "Computer wins! 🤖";
    hideAllExceptWinners();
    playerturn.textContent = "";
    return true;
  }
  if (movesMade === 9) {            // all squares filled
    gameOver = true;
    winners.classList.remove("hide");
    h1.textContent = " Draw!🤝";
    hideAllExceptWinners();
    playerturn.textContent = "";
    return true;
  }
  playerturn.textContent = mark === HUMAN ? "Computer Turn (O)"
                                          : "Your Turn (X)";
  return false;
}

/*  True if `p` occupies any winning triplet  */
//  winPatterns.some(...)

// .some() checks if at least one winning pattern is true.

// 🔸 line.every(i => b[i] === p)

// .every() checks if all 3       positions in that line are filled with player p.
function isWinner(b, p) {
  return winPatterns.some(line => line.every(i => b[i] === p));
}

/* ===========================================================
   🔄 CHANGED BLOCK #4 (MINIMAX AI LOGIC – COMPLETELY NEW)
   =========================================================== */

/*  Choose the best square (0‑8) for the computer  */
function bestMove() {
  let bestScore = -Infinity, move;
  board.forEach((sq, i) => {
    if (sq === "") {
      board[i] = AI;
      const score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) { bestScore = score; move = i; }
    }
  });
  return move;
}

/*  Recursive perfect‑play search  */
function minimax(state, depth, isMax) {
  if (isWinner(state, AI))    return  10 - depth;
  if (isWinner(state, HUMAN)) return -10 + depth;
  if (state.every(s => s !== "")) return 0;  // draw

  if (isMax) {                              // AI's turn
    let best = -Infinity;
    state.forEach((sq, i) => {
      if (sq === "") {
        state[i] = AI;
        best = Math.max(best, minimax(state, depth + 1, false));
        state[i] = "";
      }
    });
    return best;
  } else {                                  // Human's turn
    let best = Infinity;
    state.forEach((sq, i) => {
      if (sq === "") {
        state[i] = HUMAN;
        best = Math.min(best, minimax(state, depth + 1, true));
        state[i] = "";
      }
    });
    return best;
  }
}

/* ===========================================================
   🔄 CHANGED BLOCK #5 (RESET / NEW GAME)
   – replaces two separate listeners with a shared resetGame()
   =========================================================== */
[newbtn, resetbtn].forEach(btn => btn.addEventListener("click", resetGame));

function resetGame() {
  board.fill("");
  boxes.forEach(b => {
    b.innerText           = "";
    b.style.pointerEvents = "auto";
  });
  movesMade = 0;
  gameOver  = false;
  playerturn.textContent = "Your Turn (X)";
  const xp = document.querySelector(".main");
  [...xp.children].forEach(child => {
    child.classList.remove("hide"); // ✅ show all again
  });
  winners.classList.add("hide");
}

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
