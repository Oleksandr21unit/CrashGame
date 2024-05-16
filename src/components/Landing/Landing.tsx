import { useNavigate } from "react-router-dom"
import HRCGLogo from './../../assets/images/HRCGLogo.svg?react';

const Landing = () => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate('/play')
    }

    return (
        <div className="min-w-[100vw] min-h-[100dvh] bg-land bg-bottom bg-repeat-x flex flex-col items-center justify-center">
            <HRCGLogo />

            <button
                className="w-[90%] bg-red text-white uppercase rounded-[8px] py-[8px] mt-[140px]"
                onClick={onClick}
            >
                Play Now
            </button>
            <p className='text-red text-[12px]'>Terms and Conditions apply. You must be 21+ to play</p>
        </div>
    )
}

export default Landing
