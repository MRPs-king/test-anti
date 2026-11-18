const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const drawCountEl = document.getElementById("drawCount");

const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;
let scores = { X: 0, O: 0, draws: 0 };

function updateStatus(text, cls = "") {
    statusEl.textContent = text;
    statusEl.className = "status" + (cls ? " " + cls : "");
}

function updateScores() {
    scoreXEl.querySelector(".score-value").textContent = scores.X;
    scoreOEl.querySelector(".score-value").textContent = scores.O;
    drawCountEl.textContent = scores.draws;

    scoreXEl.classList.toggle("active-x", !gameOver && currentPlayer === "X");
    scoreOEl.classList.toggle("active-o", !gameOver && currentPlayer === "O");
}

function checkWinner() {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line };
        }
    }
    if (board.every(Boolean)) return { winner: "draw", line: null };
    return null;
}

function handleClick(e) {
    const cell = e.currentTarget;
    const index = Number(cell.dataset.index);

    if (gameOver || board[index]) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken", currentPlayer.toLowerCase(), "mark-pop");

    const result = checkWinner();
    if (result) {
        endGame(result);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus(`Player ${currentPlayer}'s turn`);
    updateScores();
}

function endGame({ winner, line }) {
    gameOver = true;

    if (winner === "draw") {
        scores.draws++;
        updateStatus("It's a draw!", "draw");
    } else {
        scores[winner]++;
        updateStatus(`Player ${winner} wins! 🎉`, "win");
        line.forEach((i) => cells[i].classList.add("win-cell"));
    }
    updateScores();
}

function resetBoard() {
    board = Array(9).fill(null);
    currentPlayer = "X";
    gameOver = false;

    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("taken", "x", "o", "mark-pop", "win-cell");
    });

    updateStatus("Player X's turn");
    updateScores();
}

cells.forEach((cell) => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", resetBoard);

resetScoreBtn.addEventListener("click", () => {
    scores = { X: 0, O: 0, draws: 0 };
    updateScores();
});

updateStatus("Player X's turn");
updateScores();
