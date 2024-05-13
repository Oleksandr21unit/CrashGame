const dot = document.querySelector('.dot');
const cashOutBtn = document.getElementById('cash-out-btn');
const betInput = document.getElementById('bet-input');
const betBtn = document.getElementById('bet-btn');
const multiplierDisplay = document.getElementById('multiplier');
const result = document.getElementById('result');
const timerDisplay = document.getElementById('timer');
const balanceDisplay = document.getElementById('balance-display'); // Define balanceDisplay
const resetBtn = document.getElementById('reset-btn');
const resultDisplay = document.getElementById('results-list');
// Step 2: Store Player Data
const players = {};

let isMoving = false;
let currentPosition = 0;
let multiplier = 1;
let betAmount = 0;
let crashPosition = 0;
let startTime;
let balance = 5;
let isCashedOut = false;
// Define a variable to track if a new game session has started
let isNewGameSession = false;

function validateBetInput(amount) {
    return amount >= 0.1 && amount <= 100;
}

// Step 1: Generate a Unique Identifier
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function displayResult(bet, multiplier, winnings, outcome) {
    const li = document.createElement('li');
    let outcomeText;
    if (outcome === 'Cash Out!') {
        outcomeText = 'W'; // 'W' for cash out
    } else {
        outcomeText = 'L'; // 'L' for crash
        // If the outcome is a crash, set winnings to 0.00
        if (outcome === 'Crash') {
            winnings = 0.00;
        }
    }
    li.textContent = `Bet: ${bet.toFixed(2)} | Multiplier: ${multiplier.toFixed(2)}x | Winnings: ${winnings.toFixed(2)} | Outcome: ${outcomeText}`;
    resultDisplay.appendChild(li);
}

function displayLeaderboard() {
    // Sort players by biggest win (descending order)
    const sortedPlayers = Object.values(players).sort((a, b) => b.biggestWin - a.biggestWin);

    // Clear previous leaderboard entries
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    // Display player data on the leaderboard page
    sortedPlayers.forEach((player, index) => {
        const li = document.createElement('li');
        // Round the remaining balance and biggest win to two decimal places
        const roundedBalance = player.remainingBalance.toFixed(2);
        const roundedBiggestWin = player.biggestWin.toFixed(2);
        li.textContent = `${index + 1}. Username: ${player.username}, Games Played: ${player.gamesPlayed}, Remaining Balance: ${roundedBalance}, Biggest Win: ${roundedBiggestWin}`;
        leaderboardList.appendChild(li);
    });
}

function updatePlayerData(playerId, gamesPlayed, remainingBalance, biggestWin) {
    if (!players[playerId]) {
        players[playerId] = {
            username: `Player_${playerId}`,
            gamesPlayed: 0,
            remainingBalance: 0,
            biggestWin: 0,
        };
    }
    players[playerId].gamesPlayed = gamesPlayed; // Assign the parameter value directly
    players[playerId].remainingBalance = remainingBalance;
    players[playerId].biggestWin = Math.max(players[playerId].biggestWin, biggestWin);
}


// Example initialization (call this when the game starts)
const playerId = generateUniqueId();
players[playerId] = {
    username: `Player_${playerId}`,
    gamesPlayed: 0,
    remainingBalance: 0, // Change initial balance if needed
    biggestWin: 0,
};

// Step 5: Handle Multiple Sessions
updatePlayerData(playerId, 0, balance, 0); // Initialize player data
displayLeaderboard(); // Display leaderboard

// Reset dot position function
function resetDotPosition() {
    currentPosition = 0;
    dot.style.left = currentPosition + 'px';
    isMoving = false; // Reset isMoving to false
    isCashedOut = false; // Reset isCashedOut to false
    result.textContent = ''; // Clear the result message
    multiplier = 1; // Reset multiplier to 1
}

function moveDot() {
    if (isMoving) {
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;
        timerDisplay.textContent = `Time: ${elapsedTime.toFixed(1)}s`;

        currentPosition += 1;
        dot.style.left = currentPosition + 'px';

        // Calculate RNG based on currentPosition
        const RNG = currentPosition;

        // Calculate crash multiplier using the provided formula
        const E = 100; // Extreme value or limit
        const crashMultiplier = ((E * 100 - RNG) / (E - RNG)) / 100;

        multiplier = crashMultiplier;
        multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`; // Update multiplier display in real-time

        if (currentPosition >= window.innerWidth - 10 || currentPosition >= crashPosition) {
            stopGame();
        } else {
            requestAnimationFrame(moveDot);
        }
    }
}


function startGame() {
    // Set isNewGameSession to true when a new game session starts
    isNewGameSession = true;

    isMoving = true;
    startTime = new Date().getTime();
    
    // Generate a random crash position within the valid range (1 to 99)
    crashPosition = Math.floor(Math.random() * 99) + 1;
    
    console.log(`Crash position assigned to dot: ${crashPosition}px`); // Add this console log

    moveDot();
}

// Update balance display
function updateBalanceDisplay() {
    balanceDisplay.textContent = `Balance: ${balance.toFixed(2)} credits`;
}

function displayResult(bet, multiplier, winnings, outcome) {
    const li = document.createElement('li');
    let outcomeText;
    if (outcome === 'Cash Out!') {
        outcomeText = 'W'; // 'W' for win
    } else {
        outcomeText = 'L'; // 'L' for loss
    }
    li.textContent = `Bet: ${bet.toFixed(2)} | Multiplier: ${multiplier.toFixed(2)}x | Winnings: ${winnings.toFixed(2)} | Outcome: ${outcomeText}`;
    resultDisplay.appendChild(li);
}

function stopGame() {
    isMoving = false;
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;
    timerDisplay.textContent = `Time: ${elapsedTime.toFixed(1)}s`;

    const tolerance = 5; // Adjust this value as needed
    const validBetAmount = Math.max(betAmount, 0);

    const crashMultiplier = parseFloat(((100 * 100 - crashPosition) / (100 - crashPosition) / 100).toFixed(2));
    multiplierDisplay.textContent = `Multiplier: ${crashMultiplier.toFixed(2)}x`;

    if (crashPosition < 1 || crashPosition >= 100) {
        console.log('Invalid crash position:', crashPosition);
        return;
    }

    if (crashMultiplier <= 0) {
        console.log('Invalid crash multiplier:', crashMultiplier);
        return;
    }

    let outcomeText;
    let validPayout = 0; // Initialize validPayout variable

    if (isCashedOut) {
        // Handle cash-out scenario
    
        // Calculate the multiplier at the time of cashing out
        const cashOutMultiplier = multiplier;
    
        // Calculate the valid payout based on the cash-out multiplier
        validPayout = validBetAmount * cashOutMultiplier;
    
        // Subtract the bet amount from the balance
        balance -= validBetAmount;
    
        // Add the valid payout (winnings) to the balance
        balance += validPayout;
    
        // Update the balance display to reflect the updated balance
        balanceDisplay.textContent = `Balance: ${balance.toFixed(2)} credits`;
    
        // Set outcome text to 'Cash Out!'
        outcomeText = 'Cash Out!';
    
        // Display the result message indicating cash out details
        result.textContent = `You cashed out at position ${currentPosition}px. You won ${validPayout.toFixed(2)} credits. Current balance: ${balance.toFixed(2)} credits!`;
    
        // Log cash out position, multiplier, bet amount, and output
        console.log(`Cash Out Position: ${currentPosition}px`);
        console.log(`Multiplier: ${cashOutMultiplier.toFixed(2)}`);
        console.log(`Bet Amount: ${validBetAmount}`);
        console.log(`Output: You won ${validPayout.toFixed(2)} credits. Current balance: ${balance.toFixed(2)} credits!`);
    
        // Call displayResult() to update the results section
        displayResult(validBetAmount, cashOutMultiplier, validPayout, outcomeText); // Pass validPayout as winnings

    
        // Update balance display
        updateBalanceDisplay();
    
        // Show reset button
        resetBtn.style.display = 'block'; // Show reset button
    } else {
        // Handle crash scenario
    
        // Subtract the bet amount from the balance
        balance -= validBetAmount;
    
        outcomeText = 'Crash'; // Set outcome to 'Crash'
        result.textContent = `You crashed at position ${currentPosition}px. You lost ${validBetAmount} credits. Current balance: ${balance.toFixed(2)} credits.`;
    
        // Log crash position, multiplier, bet amount, and output
        console.log(`Crash Position: ${currentPosition}px`);
        console.log(`Multiplier: ${crashMultiplier.toFixed(2)}`);
        console.log(`Bet Amount: ${validBetAmount}`);
        console.log(`Output: You lost ${validBetAmount} credits. Current balance: ${balance.toFixed(2)} credits.`);
    
        // Call displayResult() to update the results section
        displayResult(validBetAmount, crashMultiplier, 0, outcomeText); // Pass 0 as winnings for crash scenario
    
        // Update balance display
        updateBalanceDisplay();
    
        // Show reset button
        resetBtn.style.display = 'block'; // Show reset button
    }
}



// Function to reset the game and update player data
function resetGameAndUpdatePlayerData() {
    // Reset game state variables
    isMoving = false;
    isCashedOut = false;
    currentPosition = 0;
    multiplier = 1;
    betAmount = 0;
    crashPosition = 0;

    // Clear result message
    result.textContent = '';

    // Get current player data
    const currentPlayerData = players[playerId];

    // Increment games played count only if a new game session has started
    if (isNewGameSession) {
        const updatedGamesPlayed = currentPlayerData.gamesPlayed + 1;
        const updatedBalance = balance;
        const updatedBiggestWin = Math.max(currentPlayerData.biggestWin, balance - currentPlayerData.remainingBalance);
        updatePlayerData(playerId, updatedGamesPlayed, updatedBalance, updatedBiggestWin);

        // Update UI elements
        balanceDisplay.textContent = `Balance: ${updatedBalance.toFixed(2)} credits`;
        displayLeaderboard(); // Update leaderboard
    }

    // Inside resetGameAndUpdatePlayerData() function
    console.log('Before resetting isNewGameSession:', isNewGameSession);
    isNewGameSession = false; // Reset isNewGameSession flag
    console.log('After resetting isNewGameSession:', isNewGameSession);


    // Reset UI elements
    multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;
    timerDisplay.textContent = 'Time: 0s';
    dot.style.left = '0px';
    betBtn.disabled = false; // Enable bet button
    cashOutBtn.disabled = false;
    resetBtn.style.display = 'none';
}

// Function to remove and reattach the resetGameAndUpdatePlayerDataOnce event listener
function resetGameAndUpdatePlayerDataOnce() {
    // Remove event listener temporarily
    resetBtn.removeEventListener('click', resetGameAndUpdatePlayerDataOnce);

    // Call the resetGameAndUpdatePlayerData function
    resetGameAndUpdatePlayerData();

    // Reattach event listener
    resetBtn.addEventListener('click', resetGameAndUpdatePlayerDataOnce);
}

// Bet Button event listener
betBtn.addEventListener('click', () => {
    if (!isMoving) { // Check if the game is not in progress
        const inputAmount = parseFloat(betInput.value);
        if (!isNaN(inputAmount) && validateBetInput(inputAmount)) {
            if (inputAmount > balance) {
                alert('Insufficient credits. Please enter a bet amount within your balance.');
            } else {
                betAmount = inputAmount;
                startGame(); // Start the game when a valid bet is placed
                // Disable the bet button until the game is reset
                betBtn.disabled = true;
            }
        } else {
            alert('Please enter a valid bet between 0.1 and 100 credits.');
        }
    } else {
        alert('Please wait for the current game to finish or reset before placing a new bet.');
    }
});


cashOutBtn.addEventListener('click', () => {
    if (isMoving && !isCashedOut) { // Check if the game is in progress and not already cashed out
        isCashedOut = true;
        stopGame(); // Stop the game immediately
        resetGameAndUpdatePlayerData(); // Update player data after each game session
        console.log('Is Cashed Out:', isCashedOut);
    }
});


// Event listener for reset button
resetBtn.addEventListener('click', () => {
    resetGameAndUpdatePlayerData();
});
