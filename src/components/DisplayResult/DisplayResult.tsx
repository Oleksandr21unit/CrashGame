import { useContext } from "react"
import { GameContext } from "../../context/GameContext"

const DisplayResult = () => {
    const {gameData, horseResults, selectedHorse} = useContext(GameContext);
    const {isCrashed, betAmount, multiplier} = gameData
    const lastHorse = selectedHorse === horseResults[3].number

    return (
        <div
            className={
                `absolute z-[5] top-[16px] h-[90px] w-[74%] mx-[13%] bg-[100% 100%] bg-no-repeat rounded-[8px] p-[8px] font-[700]
                ${isCrashed ? 'bg-red' : (lastHorse ? 'bg-transparent' : 'bg-blue bg-win')}`
            }
        >
            <div className={`border-[2px] border-b-[1px] border-solid border-white uppercase rounded-t-[8px] ${isCrashed ? 'text-yellow text-[24px] border-yellow' : 'text-white text-[18px]'}`}>
                {selectedHorse && !isCrashed ? `Horse No.${selectedHorse}` : 'You crashed' }
            </div>
            <div className={`border-[2px] border-solid border-white uppercase rounded-b-[8px] ${isCrashed ? 'text-white text-[18px] border-yellow' : 'text-yellow text-[24px]'}`}>
                {`You won ${(betAmount*multiplier).toFixed(2)}`}
            </div>
        </div>
    )
}

export default DisplayResult
