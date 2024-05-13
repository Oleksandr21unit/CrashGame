import { useContext } from 'react'
import HorseIcon from './../../assets/icons/horseIcon.svg?react'
import HorseIcon2 from './../../assets/icons/horseIcon2.svg?react'
import HorseIcon3 from './../../assets/icons/horseIcon3.svg?react'
import HorseIcon4 from './../../assets/icons/horseIcon4.svg?react'
import { GameContext } from '../../context/GameContext'

const BottomUI = () => {
    const {gameData, currentBet, selectedHorse, resetBtn, resetBtnOnclick, handleSelectHorse, handleMinus, handlePlus, setCurrentBet, betBtnOnclick, cashOutBtnOnclick} = useContext(GameContext)
    const {isMoving, isNewGameSession} = gameData;

    console.log('isNewGameSession', isNewGameSession)
    return (
        <div
            className="min-h-[38vh] w-full wax-w-[100vw] border-t-[2px] border-solid border-red bg-lightblue pt-[8px] pb-[48px] px-[16px]"
        >
            <p className="uppercase text-center w-full font-[900] text-[14px]">Select your horse</p>

            <div className="flex justify-between items-center mt-[12px]">
                <div
                    className={`rounded-[8px] bg-white w-[75px] h-[75px] relative cursor-pointer ${selectedHorse === 1 ? 'border-[4px] border-solid border-green' : ''}`}
                    onClick={handleSelectHorse && handleSelectHorse(1)}
                >
                    <HorseIcon className='absolute bottom-0' width={selectedHorse === 1 ? '67px' : '75px'}/>
                    <div className='absolute bg-white rounded-[16px] w-[24px] h-[24px] drop-shadow-md top-[-10px] right-[-10px]'>
                        <p className='drop-shadow-md'>1</p>
                    </div>
                </div>
                <div
                    className={`rounded-[8px] bg-white w-[75px] h-[75px] relative cursor-pointer ${selectedHorse === 2 ? 'border-[4px] border-solid border-green' : ''}`}
                    onClick={handleSelectHorse && handleSelectHorse(2)}
                >
                    <HorseIcon2 className='absolute bottom-0' width={selectedHorse === 2 ? '67px' : '75px'}/>
                    <div className='absolute bg-white rounded-[16px] w-[24px] h-[24px] drop-shadow-md top-[-10px] right-[-10px]'>
                        <p className='drop-shadow-md'>2</p>
                    </div>
                </div>
                <div
                    className={`rounded-[8px] bg-white w-[75px] h-[75px] relative cursor-pointer ${selectedHorse === 3 ? 'border-[4px] border-solid border-green' : ''}`}
                    onClick={handleSelectHorse && handleSelectHorse(3)}
                >
                    <HorseIcon3 className='absolute bottom-0' width={selectedHorse === 3 ? '67px' : '75px'}/>
                    <div className='absolute bg-white rounded-[16px] w-[24px] h-[24px] drop-shadow-md top-[-10px] right-[-10px]'>
                        <p className='drop-shadow-md'>3</p>
                    </div>
                </div>
                <div
                    className={`rounded-[8px] bg-white w-[75px] h-[75px] relative cursor-pointer ${selectedHorse === 4 ? 'border-[4px] border-solid border-green' : ''}`}
                    onClick={handleSelectHorse && handleSelectHorse(4)}
                >
                    <HorseIcon4 className='absolute bottom-0' width={selectedHorse === 4 ? '67px' : '75px'}/>
                    <div className='absolute bg-white rounded-[16px] w-[24px] h-[24px] drop-shadow-md top-[-10px] right-[-10px]'>
                        <p className='drop-shadow-md'>4</p>
                    </div>
                </div>
            </div>

            <div className='bg-darkblue rounded-[8px] w-full flex justify-between items-center py-[6px] px-[20px] mt-[16px]'>
                <button onClick={handleMinus} className='w-[24px] h-[24px] text-center text-[20px] bg-white rounded-[16px] flex items-center justify-center'>
                    <p className='drop-shadow-lg'>-</p>
                </button>
                
                <div className='text-white font-[700] text-[24px]'>
                    {currentBet.toFixed(2)}
                </div>
                
                <button onClick={handlePlus} className='w-[24px] h-[24px] text-center text-[20px] bg-white rounded-[16px] flex items-center justify-center'>
                    <p className='drop-shadow-lg'>+</p>
                </button>
            </div>

            <div className='bg-darkblue rounded-[8px] w-full flex justify-between p-[6px] mt-[8px] flex flex-wrap gap-[4px]'>
                <div
                    className='w-full max-w-[49%] h-[24px] bg-white rounded-[4px] font-[700] text-[16px]'
                    onClick={() => setCurrentBet && setCurrentBet(prev => (prev === 1 ? 5 : prev + 5))}
                >
                    5.00
                </div>
                <div
                    className='w-full max-w-[49%] h-[24px] bg-white rounded-[4px] font-[700] text-[16px]'
                    onClick={() => setCurrentBet && setCurrentBet(prev => (prev === 1 ? 10 : prev + 10))}
                >
                    10.00
                </div>
                <div
                    className='w-full max-w-[49%] h-[24px] bg-white rounded-[4px] font-[700] text-[16px]'
                    onClick={() => setCurrentBet && setCurrentBet(prev => (prev === 1 ? 15 : prev + 15))}
                >
                    15.00
                </div>
                <div
                    className='w-full max-w-[49%] h-[24px] bg-white rounded-[4px] font-[700] text-[16px]'
                    onClick={() => setCurrentBet && setCurrentBet(prev => (prev === 1 ? 20 : prev + 20))}
                >
                    20.00
                </div>
            </div>

            <div className='bg-darkblue rounded-[8px] w-full flex justify-between p-[6px] mt-[8px] flex flex-wrap gap-[4px]'>
                {!isMoving && !resetBtn ? <button
                    onClick={betBtnOnclick}
                    className='bg-green text-darkblue uppercase w-full rounded-[4px] font-[700] text-[24px]'
                >
                    Bet
                </button>
                :
                    
                    (resetBtn ? 
                        <button
                            onClick={resetBtnOnclick}
                            className='bg-red text-white uppercase w-full rounded-[4px] font-[700] text-[24px] text-center'
                        >
                            Reset
                        </button>
                    :
                    <button
                        onClick={cashOutBtnOnclick}
                        className='bg-orange text-white uppercase w-full rounded-[4px] font-[700] text-[24px] text-center'
                    >
                        Cash Out
                    </button>
                    )
                    
                }
            </div>
        </div>
    )
}

export default BottomUI