import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

interface GameContextType {
    gameData: GameDataType,
    selectedHorse: number |  null,
    currentBet: number,
    multiplierDisplay?: number,
    resetBtn?: boolean,
    timerDisplay: number,
    horseResults: {running: boolean, number: number}[],
    isReset: boolean,
    isCashedOut: boolean,
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
    crashMultiplier: number,
    betAmount: number,
    crashPosition: number,
    startTime?: number,
    balance: number,
    isCrashed: boolean,
    isNewGameSession: boolean,
}

const initialGameData: GameDataType = {
    isMoving: false,
    // currentPosition: 0,
    multiplier: 1,
    crashMultiplier: 0,
    betAmount: 0,
    crashPosition: 0,
    startTime: undefined,
    balance: 100,
    isCrashed: false,
    // Define a variable to track if a new game session has started
    isNewGameSession: false,
}

export const GameContext = createContext<GameContextType>({
    gameData: initialGameData,
    selectedHorse: null,
    currentBet: 1,
    timerDisplay: 0,
    isReset: false,
    isCashedOut: false,
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
    const [currentBet, setCurrentBet] = useState<number>(1);
    const [isCashedOut, setIsCashedOut] = useState(false);
    const [isBonus, setIsBonus] = useState(false);
    // const [currentPosition, setCurrentPosition] = useState<number>(0);
    let currentPosition = 0
    const [timerDisplay, setTimerDisplay] = useState<number>(0)
    const [multiplierDisplay, setMultiplierDisplay] = useState<number>()
    const [balanceDisplay, setBalanceDisplay] = useState<string>('')
    const [result, setResult] = useState<string>('')
    const [resetBtn, setResetBtn] = useState(false)
    const [outcome] = useState('');
    let timeoutId = useRef<any>(null);
    let animationFrameId = useRef<any>(null);
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
        if (!gameData.isMoving) {
            setSelectedHorse(number)
        }
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

        if (gameData.isMoving && gameData.startTime) {
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - gameData.startTime) / 1000;
            let bonus = 0;
            setTimerDisplay(elapsedTime);
  
            // Calculate RNG based on currentPosition
            const RNG = currentPosition
            console.log('RNG, currentPosition', RNG, currentPosition)

            // Calculate crash multiplier using the provided formula
            const E = 100; // Extreme value or limit
            console.log ("horseResults.filter((el) => {el.running}).length === 1 && !isBonus", horseResults.filter((el) => (el.running)))
            if (horseResults.filter((el) => (el.running)).length === 1 && !isBonus) {
                setIsBonus(true);
                bonus += 2;
                console.log('adding bonus', bonus)
            }
            const crashMultiplier = (((E * 100 - RNG) / (E - RNG)) / 100) + bonus;
            console.log('crashMultiplier', crashMultiplier)
            if (crashMultiplier > gameData.multiplier && !gameData.isCrashed) {
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
                const newPrev = [...horseResults]
                newPrev.find((el) => {
                    if (el.running === true){
                        el.running = false;
                        if (crashMultiplier > gameData.multiplier && !gameData.isCrashed) {
                            setGameData(prev => {
                                const newGameData = Object.assign({}, prev);
                                // newGameData.multiplier += crashMultiplier - 1;
                                newGameData.multiplier = crashMultiplier
                                newGameData.crashMultiplier = gameData.crashMultiplier === 0 ? crashMultiplier : gameData.crashMultiplier
                                newGameData.isCrashed = selectedHorse === el.number && !isCashedOut ? true : prev.isCrashed
                                newGameData.isNewGameSession = false // Reset isNewGameSession flag
                                newGameData.isMoving = false
                                setMultiplierDisplay(newGameData.multiplier); // Update multiplier display in real-time
                                return newGameData
                            });
                        }
                        return el
                    }
                })
                stopGame();
                setHorseResults(newPrev)
                currentPosition++
                return
            } else if (Math.random() <= crashChance && horseResults.filter(el => el.running === true).length > 1 && horseSafeCounter < 2) {
                console.log('horse fell')
                const newPrev = [...horseResults]
                newPrev.find((el) => {
                    if (el.running === true){
                        el.running = false;
                        if (!gameData.isCrashed) {
                            setGameData(prev => {
                                const newGameData = Object.assign({}, prev);
                                // newGameData.multiplier += crashMultiplier - 1;
                                newGameData.multiplier = crashMultiplier
                                newGameData.isCrashed = selectedHorse === el.number && !isCashedOut ? true : prev.isCrashed
                                newGameData.crashMultiplier = gameData.crashMultiplier === 0 && selectedHorse === el.number ? crashMultiplier : 0
                                setMultiplierDisplay(newGameData.multiplier); // Update multiplier display in real-time
                                return newGameData
                            });
                        }
                        return el
                    }
                })
                setHorseResults(newPrev)
                horseSafeCounter = 5
                if(gameData.isMoving){
                    timeoutId.current = setTimeout(
                    () => animationFrameId.current = requestAnimationFrame(moveDot),
                    700
                )}
            } else {
                console.log('run continues', multiplierDisplay, 'horseSafeCounter', horseSafeCounter)
                horseSafeCounter--
                if(gameData.isMoving){
                    timeoutId.current = setTimeout(
                    () => animationFrameId.current = requestAnimationFrame(moveDot),
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
        console.log('timeoutId.current, animationFrameId.current', timeoutId.current, animationFrameId.current)
        clearTimeout(timeoutId.current);
        cancelAnimationFrame(animationFrameId.current);

  
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
            const newGameData = Object.assign({}, initialGameData);
            newGameData.isMoving = false;
            newGameData.multiplier = 1;
            newGameData.betAmount = 1;
            newGameData.balance = prev.balance;
            newGameData.crashPosition = 0;
            return newGameData
        })
        setIsCashedOut(false);
        setSelectedHorse(null)
        setIsCashedOut(false)
        setIsBonus(false)
        setTimerDisplay(0)
        setMultiplierDisplay(1)
        setResetBtn(false)
        currentPosition = 0
        // Clear result message
        setResult('');
  
        // Get current player datas
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
        if (gameData.isMoving && !isCashedOut) { // Check if the game is in progress and not already cashed out
            setGameData(prev => {
                const newGameData = Object.assign({}, prev);
                // newGameData.isMoving = false;
                newGameData.crashMultiplier = gameData.multiplier
                newGameData.balance = gameData.balance + gameData.betAmount*gameData.multiplier
                //     const cashOutMultiplier = gameData.multiplier;
                return newGameData
            })
            setIsCashedOut(true);
            // stopGame(); // Stop the game immediately
            // resetGameAndUpdatePlayerData(); // Update player data after each game session
            console.log('Is Cashed Out:', isCashedOut);
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
            isCashedOut,
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
