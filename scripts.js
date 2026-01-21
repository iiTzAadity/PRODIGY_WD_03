/* Ha purna code script.js madhe paste kar */

const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let gameMode = "ai"; // Default mode

// Winning conditions checking
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6] // Diagonals
];

// Button clicks handle karne
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Game mode change handle karne
document.getElementById("gameMode").addEventListener("change", (e) => {
    gameMode = e.target.value;
    resetGame();
});

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== "" || !isGameActive) return;

    updateCell(clickedCell, clickedCellIndex, currentPlayer);
    checkResult();

    // AI la trigger karne
    if (isGameActive && gameMode === "ai" && currentPlayer === "X") {
        currentPlayer = "O";
        statusDisplay.innerText = "AI is thinking...";
        setTimeout(aiMove, 500); // 0.5 sec delay
    } else if (isGameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerText = `Player ${currentPlayer}'s Turn`;
    }
}

function updateCell(cell, index, player) {
    board[index] = player;
    cell.innerText = player;
    cell.classList.add(player.toLowerCase());
}

function aiMove() {
    let bestScore = -Infinity;
    let move;

    // Minimax algorithm logic
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move !== undefined) {
        let aiCell = document.querySelector(`[data-index='${move}']`);
        updateCell(aiCell, move, "O");
        checkResult();
        if (isGameActive) {
            currentPlayer = "X";
            statusDisplay.innerText = "Player X's Turn";
        }
    }
}

function minimax(newBoard, depth, isMaximizing) {
    let result = checkWinner(newBoard);
    if (result !== null) {
        return result === "O" ? 10 - depth : result === "X" ? depth - 10 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "O";
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "X";
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(currentBoard = board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
            return currentBoard[a];
        }
    }
    return currentBoard.includes("") ? null : "tie";
}

function checkResult() {
    let winner = checkWinner();
    if (winner) {
        isGameActive = false;
        if (winner === "tie") {
            statusDisplay.innerText = "It's a Draw! 🤖";
        } else {
            statusDisplay.innerText = winner === "X" ? "Player X Wins!" : "AI Wins! 😈";
        }
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    statusDisplay.innerText = "Player X's Turn";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("x", "o");
    });
}