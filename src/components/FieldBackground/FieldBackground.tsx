import Vector from './../../assets/images/sky/Vector.png';
import Vector1 from './../../assets/images/sky/Vector-1.png';
import Vector2 from './../../assets/images/sky/Vector-2.png';
import Vector3 from './../../assets/images/sky/Vector-3.png';
import { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../context/GameContext';
import DisplayResult from '../DisplayResult';
import StarBonusIcon from './../../assets/icons/starBonusIcon.svg?react';
import "./animation.css";

const FieldBackground = () => {
    const {gameData, multiplierDisplay, selectedHorse, horseResults, isCashedOut} = useContext(GameContext);
    const {isMoving, isNewGameSession, isCrashed} = gameData
    const [animationRunning, setAnmationRunning] = useState(false)
    const [isReadyMessage, setIsReadyMessage] = useState(false)
    const [multiplierValue, setMultiplierValue] = useState(multiplierDisplay);
    const [isDisplayResult, setIsDisplayResult] = useState<boolean | null>(null)
    // const lastHorse = horseResults[3].number === selectedHorse
    
    useEffect(() => {
        const display = document.getElementById("multiplierValue");
        if (display && multiplierValue && multiplierDisplay && multiplierDisplay !== multiplierValue) {
            animateValue(display, multiplierValue, multiplierDisplay, 700);
        }
        setMultiplierValue(multiplierDisplay)
    }, [multiplierDisplay])


    useEffect(() => {
        if (isMoving && !animationRunning) {
            console.log('StartAnimation')
            StartAnimation()
        } else if (!isMoving && animationRunning) {
            console.log('StopAnimation', StopAnimation)
            StopAnimation()
        }
    }, [isMoving])

    useEffect(() => {
        if (horseResults.filter((el) => el.running).length === 1) {
            bonusAnimation();
        }
    }, [horseResults])

    useEffect(() => {
        if (isDisplayResult === null && (isCashedOut || isCrashed)) {
            setIsDisplayResult(true);
            setTimeout(() => {
                setIsDisplayResult(false)
            }, 6000)
        }
    }, [isCashedOut, isCrashed])

    const animateValue = (obj: HTMLElement, start:number, end:number, duration: number) => {
        let startTimestamp: DOMHighResTimeStamp | null = null;
        const step = (timestamp: DOMHighResTimeStamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          obj.innerHTML = `${(progress * (end - start) + start).toFixed(2)}X`;
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
    }

    const bonusAnimation = () => {
        const starBonus = document.getElementById('starBonus');
        const result = document.getElementById('multiplierValue');
        if (starBonus && result) {
            starBonus.style.animation = 'bonus 3s ease-out'
            starBonus.style.visibility = 'visible';
            setTimeout(() => {
                result.style.color = '#FEC700';
                starBonus.style.visibility = 'hidden';
            }, 3000)
        }
    }

    const StartAnimation = () => {
        setIsReadyMessage(true)
        setTimeout(() => {
            setIsReadyMessage(false)
            setAnmationRunning(true)
        }, 3000)
        const fieldBg1 = document.getElementById("field-bg-1");
        const fieldBg2 = document.getElementById("field-bg-2");
        const fieldBg3 = document.getElementById("field-bg-3");
        const fieldBg4 = document.getElementById("field-bg-4");

        if (fieldBg1 && fieldBg2 && fieldBg3 && fieldBg4) {
            // fieldBg1.style.animation = 'slide 15s ease-in infinite'
            fieldBg4.style.animation = 'slide 11s ease-in infinite'
            fieldBg3.style.animation = 'slide 16s ease-in infinite'
            fieldBg2.style.animation = 'slide 21s ease-in infinite'
            // background.style.animation = 'slide 15s ease-in infinite'
            setTimeout(() => {
                fieldBg4.style.animation = 'slide 10s linear infinite'
            }, 11000)
            setTimeout(() => {
                fieldBg3.style.animation = 'slide 15s linear infinite'
            }, 16000)
            setTimeout(() => {
                fieldBg2.style.animation = 'slide 20s linear infinite'
            }, 21000)
        }
    }

    const StopAnimation = () => {
        const fieldBg1 = document.getElementById("field-bg-1");
        const fieldBg2 = document.getElementById("field-bg-2");
        const fieldBg3 = document.getElementById("field-bg-3");
        const fieldBg4 = document.getElementById("field-bg-4");

        if (fieldBg1 && fieldBg2 && fieldBg3 && fieldBg4) {
            setAnmationRunning(false);
            fieldBg1.style.animation = 'slide 9s ease-out';
            fieldBg2.style.animation = 'slide 7s ease-out';
            fieldBg3.style.animation = 'slide 5s ease-out';
            fieldBg4.style.animation = 'slide 3s ease-out';
        }
    }

    return (
        <div className='relative h-[40%] overflow-hidden'>

            {!isNewGameSession && !(isCashedOut || isCrashed) ?
                <div className='absolute z-[5] top-[16px] h-[62px] w-[80%] mx-[10%] flex items-center justify-center bg-whiteOpaque rounded-[16px]'>
                    {!isReadyMessage ?
                        <p className='uppercase font-[700] text-[25px]'>
                            {selectedHorse ? `Horse No.${selectedHorse} selected` : 'Select your horse'}
                        </p>
                        :
                        <p className='uppercase font-[700] text-[25px]'>
                            Ready, steady, go!
                        </p>
                    }
                </div>
                :
                <div className='z-[10] absolute top-[16px] w-full flex justify-center'>
                    <p
                        className='w-full z-[10] absolute top-[16px] w-full text-center text-darkblue uppercase font-[800] text-[48px]'
                        id='multiplierValue'
                        >
                        {multiplierValue && multiplierValue.toFixed(2)}X
                    </p>
                    <StarBonusIcon
                        id='starBonus'
                        style={{
                            visibility: 'hidden',
                        }}
                    />
                </div>
            }

            {(isCashedOut || isCrashed) && isDisplayResult &&
                <DisplayResult />
            }

            <div
                style={{backgroundImage: `url(${Vector3})`, backgroundPosition: 0}}
                className='absolute z-[3] min-h-[66px] bottom-[0px] min-w-[1300px] left-[0px]'
                id="field-bg-4"
            />
            <div
                style={{backgroundImage: `url(${Vector2})`}}
                className='absolute z-[2] min-h-[57px] bottom-[25%] min-w-[1300px] left-[0px]'
                id="field-bg-3"
            />
            <div
                style={{backgroundImage: `url(${Vector1})`}}
                className='absolute z-[1] min-h-[70px] bottom-[35%] min-w-[1300px] left-[0px]'
                id="field-bg-2"
            />
            <img
                src={Vector}
                className='absolute h-full min-h-[106px] min-w-[1300px] left-[0px]'
                id="field-bg-1"
            />
        </div>
    )
}

export default FieldBackground