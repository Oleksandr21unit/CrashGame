import SidebarIcon from './../../assets/icons/SidebarIcon.svg?react';
import HorseIcon from './../../assets/icons/HorseIconHeader.svg?react';
import AccountIcon from './../../assets/icons/AccountIcon.svg?react';
import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';

const Header = () => {
    const {gameData} = useContext(GameContext)
    const {balance} = gameData
    
    return (
        <div className="h-[8vh] border-b-[2px] border-solid border-red flex items-end justify-between py-[8px] px-[16px] bg-lightblueBg">
            <SidebarIcon />

            <div className='flex items-center gap-[16px]'>
                <HorseIcon />
                <p className='uppercase font-[700] text-[18px]'>Horse Racing</p>
            </div>

            <div className='flex items-center gap-[8px]'>
                <p className='font-[400] text-[14px]'>${balance}</p>
                <AccountIcon />
            </div>
        </div>
    )
}

export default Header