import { useContext, useState } from "react"
import { GameContext } from "../../context/GameContext"

const DisplayResult = () => {
    const {gameData, horseResults, selectedHorse, isCashedOut} = useContext(GameContext);
    const [gameDataSnap] = useState(gameData)
    const [horseResultsSnap] = useState(horseResults)
    const {isCrashed, betAmount, crashMultiplier} = gameDataSnap
    const standingHorses = horseResultsSnap.filter((el) => el.running) 
    const [isLastHorse] = useState(standingHorses.length === 1 && standingHorses[0].number === selectedHorse)

    return (
        <div
            className={
                `absolute z-[15] top-[16px] h-[90px] w-[74%] mx-[13%] bg-[100% 100%] bg-no-repeat rounded-[8px] p-[8px] font-[700]
                ${!isCashedOut ? 'bg-red' : (isLastHorse ? 'bg-transparent' : 'bg-blue bg-win')}`
            }
        >
            <div className={`border-[2px] border-b-[1px] border-solid border-white uppercase rounded-t-[8px] ${isCrashed ? 'text-yellow text-[24px] border-yellow' : 'text-white text-[18px]'}`}>
                {selectedHorse && !isCrashed && isCashedOut ? `${isLastHorse ? "Bonus Round" : ''} Horse No.${selectedHorse}` : 'You crashed' }
            </div>
            <div className={`border-[2px] border-solid border-white uppercase rounded-b-[8px] ${isCrashed ? 'text-white text-[18px] border-yellow' : (isLastHorse ? 'text-darkblue bg-yellow text-[24px]' : 'text-yellow text-[24px] ')}`}>
                {selectedHorse && !isCrashed && isCashedOut ? `You won ${(betAmount*crashMultiplier).toFixed(2)}` : `At ${gameData.crashMultiplier.toFixed(2)}X`}
            </div>
        </div>
    )
}

export default DisplayResult
