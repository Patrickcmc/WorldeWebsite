let currentGuess = '';
let row = 0;
let Guessed = false;
const wordLength = 5; 
    document.addEventListener('keydown', function (e) {
        if (Guessed === true || row >= 5) return;
        const key = e.key.toUpperCase();
        if (key.length === 1 && key >= 'A' && key <= 'Z' && currentGuess.length < wordLength) {
            currentGuess += key;
            updateGrid();
        } else if (key === 'BACKSPACE') {
            e.preventDefault();
            currentGuess = currentGuess.slice(0, -1);
            updateGrid();
        } else if (key === 'ENTER' && currentGuess.length === wordLength) {
            row = row + 1;
            e.preventDefault();
            sendGuess();
        } 
});

function updateGrid() {
    // Update your grid cells in the HTML based on currentGuess
    // For example, if you have 5 cells:
    for (let i = 0; i < wordLength; i++) {
        const cell = document.getElementById(`cell-${i+row*5}`);
        cell.textContent = currentGuess[i] || '';
    }
}

function sendGuess() {
    fetch('/check_guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guess: currentGuess })
    })
    .then(response => response.json())
    .then(data => {
    for (let i = 0; i < wordLength; i++) {
        const cell = document.getElementById(`cell-${i + (row - 1) * 5}`);
        const key = document.getElementById(`cell-${currentGuess[i]}`);
        const letter = currentGuess[i];

        if (data.correct_positions.includes(i)) {
            cell.style.backgroundColor = 'green';
            key.style.backgroundColor = 'green';
        } else if (data.in_word.includes(i)) {  
            cell.style.backgroundColor = 'orange';
            if (key.style.backgroundColor != 'green'){
                key.style.backgroundColor = 'orange';
            }
        } else {
            cell.style.backgroundColor = 'grey';        // make gray color darker
            key.style.backgroundColor = 'grey';
        }
        if (data.message.includes("Correct")) {
            Guessed = true;
        }
    }

    currentGuess = '';
    });
}
