import RaceTrack from './../../assets/images/raceTrack.png'
import Horse1 from './../../assets/images/horses/Horse1.svg?react'
import Horse2 from './../../assets/images/horses/Horse2.svg?react'
import Horse3 from './../../assets/images/horses/Horse3.svg?react'
import Horse4 from './../../assets/images/horses/Horse4.svg?react'
import HorseCrash from './../../assets/images/HorseCrash.svg'
import { GameContext } from '../../context/GameContext'
import { useContext, useEffect, useState } from 'react'
import './animation.css'

const PlayField = () => {
    const {gameData, horseResults} = useContext(GameContext);
    const {isMoving} = gameData
    const [animationRunning, setAnmationRunning] = useState(false)
    // const [horsesLeft, setHorsesLeft] = useState(4);

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
        console.log('horse results!!', horseResults)
        const runningHorses = horseResults.filter((el)=> el.running)
        if(horseResults.length){
            horseResults.forEach((el, index) => {
                if (!el.running && (horseResults[index+1]?.running || index === 3)) {
                    const horse = document.getElementById(`horse-${el.number}`)
                    const crash = document.getElementById(`horse_crash-${el.number}`)
                    if (horse && crash) {
                        horse.style.animation = 'fall 6s linear'
                        crash.style.display = 'flex',
                        crash.style.left = horse.style.left
                        crash.style.animation = 'fall_effect 6s linear'
                        setTimeout(() => {
                            horse.style.visibility = 'hidden',
                            crash.style.display = 'none'
                        }, 3000)
                    }
                    // if (runningHorses.length) {
                    //     runningHorses.forEach((el, index) => {
                    //         if (el.running) {
                    //            const horse = document.getElementById(`horse-${el.number}`)
                   
                    //            if (horse){
                    //             //    setTimeout(() => {
                    //                 horse.style.left = runningHorses.length > 1 ? `${(60/runningHorses.length)*(index+1)}%` : '50%'
                    //             //    }, 3000)
                    //            }
                    //        }
                    //     })
                    // }
                }
            })
        }
    }, [horseResults])

    const StartAnimation = () => {
        if (!animationRunning) {
            setAnmationRunning(true)
            const background = document.getElementById("playfield-background");
            const horse4 = document.getElementById('horse-4');
            const horse3 = document.getElementById('horse-3');
            const horse2 = document.getElementById('horse-2');
            const horse1 = document.getElementById('horse-1');

            if (background && horse4 && horse3 && horse2 && horse1) {
                background.style.animation = 'slide 10s ease-in infinite'
                horse4.style.animation = 'shake 3s ease-in-out infinite'
                horse3.style.animation = 'shake 3s ease-in-out infinite'
                horse2.style.animation = 'shake 3s ease-in-out infinite'
                horse1.style.animation = 'shake 3s ease-in-out infinite'
                setTimeout(() => {
                    background.style.animation = 'slide 8s linear infinite'
                    // if (horse4 && horse3 && horse2 && horse1){
                    // }
                }, 10000)
            }
        }
    }

    const StopAnimation = () => {
        const background = document.getElementById("playfield-background");

        if (background) {
            // background.style.animation = 'slide 10s ease-in infinite'
            setAnmationRunning(false);
            const background = document.getElementById("playfield-background");
            const horse4 = document.getElementById('horse-4');
            const horse3 = document.getElementById('horse-3');
            const horse2 = document.getElementById('horse-2');
            const horse1 = document.getElementById('horse-1');

            if (background) {
                background.style.animation = 'slide 5s ease-out';
            }
            if (horse1){
                horse1.style.animation = 'none';
            }
            if (horse2){
                horse2.style.animation = 'none';
            }
            if (horse3){
                horse3.style.animation = 'none';
            }
            if (horse4) {
                horse4.style.animation = 'none';
            }
        }
    }

    return (
        <div
            style={{
                backgroundImage: `url(${RaceTrack})`,
                backgroundPositionX: '470px',
                zIndex: 10,
                // animation: 'slide 15s ease-in-out infinite',
            }}
            className='h-[60%] w-full relative'
            id="playfield-background"
        >
            {/*  */}
            <Horse4
                className='absolute bottom-[60%] sm:bottom-[68%] drop-shadow-lg'
                id='horse-4'
                style={{
                    left: !animationRunning ? '60px' : '15px',
                    transition: 'left 6s ease-in-out'
                }}
            />
            <div
                className='absolute bottom-[60%] sm:bottom-[68%] w-[182px] h-[154px] flex items-center justify-center'
                style={{
                    backgroundImage: `url(${HorseCrash})`,
                    display: 'none'
                }}
                id='horse_crash-4'
            >
                <p className='uppercase font-[700] text-[18px] max-w-[120px] mt-[28px] mr-[14px]'>Horse 4 fell</p>
                {/* <HorseCrash 
                    className='drop-shadow-lg'
                /> */}
            </div>
            <Horse3
                className='absolute bottom-[40%] sm:bottom-[48%] drop-shadow-lg'
                id='horse-3'
                style={{
                    left: !animationRunning ? '45px' : '45%',
                    transition: 'left 6s ease-in-out'
                }}
            />
            <div
                className='absolute bottom-[40%] sm:bottom-[48%] w-[182px] h-[154px] flex items-center justify-center'
                style={{
                    backgroundImage: `url(${HorseCrash})`,
                    display: 'none'
                }}
                id='horse_crash-3'
            >
                <p className='uppercase font-[700] text-[18px] max-w-[120px] mt-[28px] mr-[14px]'>Horse 3 fell</p>
                {/* <HorseCrash 
                    className='drop-shadow-lg'
                /> */}
            </div>
            <Horse2
                className='absolute bottom-[20%] sm:bottom-[28%] drop-shadow-lg'
                id='horse-2'
                style={{
                    left: !animationRunning ? '30px' : '60%',
                    transition: 'left 6s ease-in-out'
                }}
            />
            <div
                className='absolute bottom-[20%] sm:bottom-[28%] w-[182px] h-[154px] flex items-center justify-center'
                style={{
                    backgroundImage: `url(${HorseCrash})`,
                    display: 'none',
                }}
                id='horse_crash-2'
            >
                <p className='uppercase font-[700] text-[18px] max-w-[120px] mt-[28px] mr-[14px]'>Horse 2 fell</p>
                {/* <HorseCrash 
                    className='drop-shadow-lg'
                /> */}
            </div>
            <Horse1
                className='absolute bottom-[0] sm:bottom-[8%] drop-shadow-lg'
                id='horse-1'
                style={{
                    left: !animationRunning ? '15px' : '25%',
                    transition: 'left 6s ease-in-out'
                }}
            />
            <div
                className='absolute bottom-[0] sm:bottom-[8%] w-[182px] h-[154px] flex items-center justify-center'
                style={{
                    backgroundImage: `url(${HorseCrash})`,
                    display: 'none'
                }}
                id='horse_crash-1'
            >
                <p className='uppercase font-[700] text-[18px] max-w-[120px] mt-[28px] mr-[14px]'>Horse 1 fell</p>
                {/* <HorseCrash 
                    className='drop-shadow-lg'
                /> */}
            </div>

            {/*  */}
        </div>
    )
}

export default PlayField