import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface GameContextType {
    gameData: any,
    selectedHorse: number |  null,
    currentBet: number,
    multiplierDisplay?: number,
    resetBtn?: boolean,
    timerDisplay: number,
    horseResults: {running: boolean, number: number}[],
    isReset: boolean
    resetGameAndUpdatePlayerData?: () => void,
    setCurrentBet?: React.Dispatch<React.SetStateAction<number>>,
    handleSelectHorse?: (number: number) => () => void,
    handleMinus?: () => void,
    handlePlus?: () => void,
    setGameData?: React.Dispatch<React.SetStateAction<GameDataType>>,
    betBtnOnclick?: () => void,
    cashOutBtnOnclick?: () => void,
    resetBtnOnclick?: () => void,
}

interface GameDataType {
    isMoving: boolean,
    // currentPosition: number,
    multiplier: number,
    betAmount: number,
    crashPosition: number,
    startTime?: number,
    balance: number,
    isCashedOut: boolean,
    isCrashed: boolean,
    isNewGameSession: boolean,
}

const initialGameData: GameDataType = {
    isMoving: false,
    // currentPosition: 0,
    multiplier: 1,
    betAmount: 0,
    crashPosition: 0,
    startTime: undefined,
    balance: 100,
    isCashedOut: false,
    isCrashed: false,
    // Define a variable to track if a new game session has started
    isNewGameSession: false,
}

export const GameContext = createContext<GameContextType>({
    gameData: undefined,
    selectedHorse: null,
    currentBet: 1,
    timerDisplay: 0,
    isReset: false,
    horseResults: [{running: true, number: 1}, {running: true, number: 2}, {running: true, number: 3}, {running: true, number: 4}],
});

const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray
};

export const GameContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameData, setGameData] = useState<GameDataType>(initialGameData);
    const [selectedHorse, setSelectedHorse] = useState<number | null>(null)
    const [horseResults, setHorseResults] = useState(shuffleArray([{running: true, number: 1}, {running: true, number: 2}, {running: true, number: 3}, {running: true, number: 4}]))
    const [currentBet, setCurrentBet] = useState<number>(1)
    // const [currentPosition, setCurrentPosition] = useState<number>(0);
    let currentPosition = 0
    const [timerDisplay, setTimerDisplay] = useState<number>(0)
    const [multiplierDisplay, setMultiplierDisplay] = useState<number>()
    const [balanceDisplay, setBalanceDisplay] = useState<string>('')
    const [result, setResult] = useState<string>('')
    const [resetBtn, setResetBtn] = useState(false)
    const [outcome] = useState('');
    const players: any = {};
    let horseSafeCounter = 10;
    let isReset = false;

    console.log('timerDisplay', timerDisplay, `\n`, 'balanceDisplay', balanceDisplay, `\n`, 'result', result, `\n`, 'outcome', outcome)

    useEffect(() => {
        if (gameData.isNewGameSession && gameData.isMoving) {
            console.log('calling movedot')
            moveDot();
        }
        console.log('useEffect gameData,', gameData)
    }, [gameData.isMoving])

    const handleSelectHorse = (number:number) => () => {
        setSelectedHorse(number)
    }

    const handleMinus = () => {
        console.log('handle minus')
        if (currentBet > 0 && currentBet <= 1) {
            setCurrentBet(0)
        } else if (currentBet > 1) {setCurrentBet(prev => prev - 1)}
    }

    const handlePlus = () => {
        console.log('handle plus')
        setCurrentBet(prev => prev + 1)
    }
    // 
    function validateBetInput(amount: number) {
        return amount >= 0.1 && amount <= 100;
    }
  
    // Step 1: Generate a Unique Identifier
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
  
    function updatePlayerData(playerId: string, gamesPlayed: number, remainingBalance: number, biggestWin: number) {
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
    updatePlayerData(playerId, 0, gameData.balance, 0); // Initialize player data

    function moveDot() {

        if (gameData.isMoving && gameData.startTime && !gameData.isCashedOut) {
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - gameData.startTime) / 1000;
            setTimerDisplay(elapsedTime);
  
            // Calculate RNG based on currentPosition
            const RNG = currentPosition
            console.log('RNG, currentPosition', RNG, currentPosition)

            // Calculate crash multiplier using the provided formula
            const E = 100; // Extreme value or limit
            const crashMultiplier = ((E * 100 - RNG) / (E - RNG)) / 100;
            console.log('crashMultiplier', crashMultiplier)
            if (crashMultiplier > gameData.multiplier && !gameData.isCashedOut && !gameData.isCrashed) {
                setGameData(prev => {
                    const newGameData = Object.assign({}, prev);
                    // newGameData.multiplier += crashMultiplier - 1;
                    newGameData.multiplier = crashMultiplier
                    setMultiplierDisplay(newGameData.multiplier); // Update multiplier display in real-time
                    return newGameData
                });

            }
            currentPosition++
            // setCurrentPosition(prev => {
            //     const newPosition = prev + 1
                
            //     return newPosition
            // });

            const crashChance = 1-(100/crashMultiplier)/100
            // crashMultiplier - 1
            console.log('crash chance: ', crashChance)

            if (Math.random() <= crashChance && horseResults.filter(el => el.running === true).length === 1 && horseSafeCounter < 2) { 
                console.log('crashed!, out of horses — ', horseResults)
                stopGame();
                const newPrev = [...horseResults]
                newPrev.find((el) => {
                    if (el.running === true){
                        el.running = false;
                        if (crashMultiplier > gameData.multiplier && !gameData.isCashedOut && !gameData.isCrashed) {
                            setGameData(prev => {
                                const newGameData = Object.assign({}, prev);
                                // newGameData.multiplier += crashMultiplier - 1;
                                newGameData.multiplier = crashMultiplier
                                newGameData.isCrashed = selectedHorse === el.number
                                newGameData.isMoving = false
                                setMultiplierDisplay(newGameData.multiplier); // Update multiplier display in real-time
                                return newGameData
                            });
                        }
                        return el
                    }
                })
                setHorseResults(newPrev)
                currentPosition++
                return
            } else if (Math.random() <= crashChance && horseResults.filter(el => el.running === true).length > 1 && horseSafeCounter < 2) {
                console.log('horse fell')
                const newPrev = [...horseResults]
                newPrev.find((el) => {
                    if (el.running === true){
                        el.running = false;
                        if (!gameData.isCashedOut && !gameData.isCrashed) {
                            setGameData(prev => {
                                const newGameData = Object.assign({}, prev);
                                // newGameData.multiplier += crashMultiplier - 1;
                                newGameData.multiplier = crashMultiplier
                                newGameData.isCrashed = selectedHorse === el.number
                                setMultiplierDisplay(newGameData.multiplier); // Update multiplier display in real-time
                                return newGameData
                            });
                        }
                        return el
                    }
                })
                setHorseResults(newPrev)
                horseSafeCounter = 5
                if (crashMultiplier > gameData.multiplier && !gameData.isCashedOut && !gameData.isCrashed) {
                    setGameData(prev => {
                        const newGameData = Object.assign({}, prev);
                        // newGameData.multiplier += crashMultiplier - 1;
                        newGameData.multiplier = crashMultiplier
                        setMultiplierDisplay(newGameData.multiplier); // Update multiplier display in real-time
                        return newGameData
                    });
                }
                if(gameData.isMoving){setTimeout(
                    () => requestAnimationFrame(moveDot),
                    700
                )}
            } else {
                console.log('run continues', multiplierDisplay, 'horseSafeCounter', horseSafeCounter)
                horseSafeCounter--
                if(gameData.isMoving){setTimeout(
                    () => requestAnimationFrame(moveDot),
                    700
                )}
            }
        }
    }
  
  
    const startGame = () => {
        isReset = false
        setGameData(prev => {
            const newGameData = Object.assign({}, prev);
            // Set isNewGameSession to true when a new game session starts
            newGameData.isNewGameSession = true;
            newGameData.isMoving = true;
            newGameData.startTime = new Date().getTime();
            // Generate a random crash position within the valid range (1 to 99)
            newGameData.crashPosition = Math.floor(Math.random() * 99) + 1;
            // Subtract the bet amount from the balance
            newGameData.balance = gameData.balance - (Math.max(currentBet, 0));

            console.log('inside set', newGameData)
            console.log(`Crash position assigned to dot: ${newGameData.crashPosition}px`); // Add this console log

            return newGameData
        });
        
                
        moveDot();
    }
  
    // Update balance display
    function updateBalanceDisplay() {
        setBalanceDisplay(`Balance: ${gameData.balance.toFixed(2)} credits`);
    }

    function stopGame() {
        const currentTime = new Date().getTime();
        const elapsedTime = gameData.startTime ? (currentTime - gameData.startTime) / 1000 : 0;
        setTimerDisplay(elapsedTime);
  
        // const tolerance = 5; // Adjust this value as needed
        // const validBetAmount = Math.max(currentBet, 0);
  
        const crashMultiplier = gameData.multiplier
        //  parseFloat(((100 * 100 - gameData.crashPosition) / (100 - gameData.crashPosition) / 100).toFixed(2)); // ??
        setMultiplierDisplay(crashMultiplier);
  
        if (gameData.crashPosition < 1 || gameData.crashPosition >= 100) {
            console.log('Invalid crash position:', gameData.crashPosition);
            return;
        }
  
        if (crashMultiplier <= 0) {
            console.log('Invalid crash multiplier:', crashMultiplier);
            return;
        }
  
        // let outcomeText;
        // let validPayout = 0; // Initialize validPayout variable
  
        // if (gameData.isCashedOut) {
        //     // Handle cash-out scenario
        
        //     // Calculate the multiplier at the time of cashing out
        //     const cashOutMultiplier = gameData.multiplier;
        
        //     // Calculate the valid payout based on the cash-out multiplier
        //     validPayout = validBetAmount * cashOutMultiplier;
        
        //     setGameData({
        //         ...gameData,
        //         // Add the valid payout (winnings) to the balance
        //         balance: gameData.balance + validPayout,
                
        //     })
        
        //     // Update the balance display to reflect the updated balance
        //     setBalanceDisplay(`Balance: ${gameData.balance.toFixed(2)} credits`);
        
        //     // Set outcome text to 'Cash Out!'
        //     outcomeText = 'Cash Out!';
        
        //     // Display the result message indicating cash out details
        //     setResult(`You cashed out at position ${currentPosition}px. You won ${validPayout.toFixed(2)} credits. Current balance: ${gameData.balance.toFixed(2)} credits!`);
        
        //     // Log cash out position, multiplier, bet amount, and output
        //     console.log(`Cash Out Position: ${currentPosition}px`);
        //     console.log(`Multiplier: ${cashOutMultiplier.toFixed(2)}`);
        //     // console.log(`Bet Amount: ${validBetAmount}`);
        //     console.log(`Output: You won ${validPayout.toFixed(2)} credits. Current balance: ${gameData.balance.toFixed(2)} credits!`);
        
        //     // Call displayResult() to update the results section
        //     // displayResult(validBetAmount, cashOutMultiplier, validPayout, outcomeText); // Pass validPayout as winnings
  
        
        //     // Update balance display
        //     updateBalanceDisplay();
        
        //     // Show reset button
        //     setResetBtn(true); // Show reset button
        // } else {
        //     // Handle crash scenario
        
        //     // Subtract the bet amount from the balance
        //     // balance -= validBetAmount;
        
        //     outcomeText = 'Crash'; // Set outcome to 'Crash'
        //     setResult(`You crashed at position ${currentPosition}px. You lost ${validBetAmount} credits. Current balance: ${gameData.balance.toFixed(2)} credits.`);
        
        //     // Log crash position, multiplier, bet amount, and output
        //     console.log(`Crash Position: ${currentPosition}px`);
        //     console.log(`Multiplier: ${gameData.multiplier.toFixed(2)}`);
        //     console.log(`Bet Amount: ${validBetAmount}`);
        //     console.log(`Output: You lost ${validBetAmount} credits. Current balance: ${gameData.balance.toFixed(2)} credits.`);
        
        //     // Call displayResult() to update the results section
        //     // displayResult(validBetAmount, crashMultiplier, 0, outcomeText); // Pass 0 as winnings for crash scenario
        
        //     // Update balance display
        //     updateBalanceDisplay();
        
        //     // Show reset button
        //     setResetBtn(true); // Show reset button
        // }
        // Update balance display
        updateBalanceDisplay();
    
        // Show reset button
        setResetBtn(true); // Show reset button
        // setOutcome(outcomeText);
    }
  
    const resetHorses = () => {
        console.log('RESET HORSES')
        setHorseResults(shuffleArray([{running: true, number: 1}, {running: true, number: 2}, {running: true, number: 3}, {running: true, number: 4}]))
        const horse4 = document.getElementById('horse-4');
        const horse3 = document.getElementById('horse-3');
        const horse2 = document.getElementById('horse-2');
        const horse1 = document.getElementById('horse-1');
        if (horse4 && horse3 && horse2 && horse1) {
            horse4.style.left = '60px';
            horse3.style.left = '45px';
            horse2.style.left = '30px';
            horse1.style.left = '15px';
            setTimeout(() => {
                horse4.style.visibility = 'visible';
                horse3.style.visibility = 'visible';
                horse2.style.visibility = 'visible';
                horse1.style.visibility = 'visible';
            }, 3000)
        }
    }
  
    // Function to reset the game and update player data
    function resetGameAndUpdatePlayerData() {
        isReset = true

        resetHorses()
        // Reset game state variables
        setGameData(prev => 
        {
            const newGameData = Object.assign({}, prev);
            newGameData.isMoving = false;
            newGameData.isCashedOut = false;
            newGameData.multiplier = 1;
            newGameData.betAmount = 1;
            newGameData.crashPosition = 0;
            return newGameData
        })
        currentPosition = 0
        // Clear result message
        setResult('');
  
        // Get current player data
        const currentPlayerData = players[playerId];
  
        // Increment games played count only if a new game session has started
        if (gameData.isNewGameSession) {
            const updatedGamesPlayed = currentPlayerData.gamesPlayed + 1;
            const updatedBalance = gameData.balance;
            const updatedBiggestWin = Math.max(currentPlayerData.biggestWin, gameData.balance - currentPlayerData.remainingBalance);
            updatePlayerData(playerId, updatedGamesPlayed, updatedBalance, updatedBiggestWin);
  
            // Update UI elements
            setBalanceDisplay(`Balance: ${updatedBalance.toFixed(2)} credits`);
            // displayLeaderboard(); // Update leaderboard
        }
  
        // Inside resetGameAndUpdatePlayerData() function
        console.log('Before resetting isNewGameSession:', gameData.isNewGameSession);
        setGameData(prev => {
            const newGameData = Object.assign({}, prev);
            newGameData.isNewGameSession = false;
            return newGameData
        }) // Reset isNewGameSession flag
        console.log('After resetting isNewGameSession:', gameData.isNewGameSession);
  
  
        // Reset UI elements
        setMultiplierDisplay(gameData.multiplier);
        setTimerDisplay(0);
        // reset move style
        // dot.style.left = '0px';
        // betBtn.disabled = false; // Enable bet button
        // cashOutBtn.disabled = false;
        setResetBtn(false);
    }

    const betBtnOnclick = () => {
        if (!gameData.isMoving) { // Check if the game is not in progress

            // const inputAmount = parseFloat(betInput);
            if (!isNaN(currentBet) && validateBetInput(currentBet)) {
                if (currentBet > gameData.balance) {
                    alert('Insufficient credits. Please enter a bet amount within your balance.');
                } else {
                    setGameData(prev => {
                        const newGameData = Object.assign({}, prev);
                        newGameData.betAmount = currentBet;
                        return newGameData
                    });
                    startGame(); // Start the game when a valid bet is placed
                    // Disable the bet button until the game is reset
                    // betBtn.disabled = true;
                }
            } else {
                alert('Please enter a valid bet between 0.1 and 100 credits.');
            }
        } else {
            alert('Please wait for the current game to finish or reset before placing a new bet.');
        }
    }
  
    const cashOutBtnOnclick = () => {
        if (gameData.isMoving && !gameData.isCashedOut) { // Check if the game is in progress and not already cashed out
            setGameData(prev => {
                const newGameData = Object.assign({}, prev);
                newGameData.isMoving = false;
                newGameData.isCashedOut = true;
                return newGameData
            })
            stopGame(); // Stop the game immediately
            // resetGameAndUpdatePlayerData(); // Update player data after each game session
            console.log('Is Cashed Out:', gameData.isCashedOut);
        }
    };
  
    // onClick for reset button
    const resetBtnOnclick = () => {
        resetGameAndUpdatePlayerData();
    };

    // 

    return (
        <GameContext.Provider value={{
            gameData,
            selectedHorse,
            currentBet,
            multiplierDisplay,
            resetBtn,
            timerDisplay,
            horseResults,
            isReset,
            resetGameAndUpdatePlayerData,
            setCurrentBet,
            handleSelectHorse,
            handleMinus,
            handlePlus,
            setGameData,
            betBtnOnclick,
            cashOutBtnOnclick,
            resetBtnOnclick, 
        }}>
            {children}
        </GameContext.Provider>
        )
};

export const usePlayer = (): GameContextType => useContext(GameContext);
