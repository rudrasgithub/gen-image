import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='flex items-center justify-between gap-4 py-3 mt-20'>
            <img src={assets.logo} alt="logo" width={150} />
            <p className='flex-1 text-gray-500 pl-4 text-sm border-gray-400 border-l max-sm:hidden'>Copyright @rudra.dev | All right reserved.</p>
            <div className='flex gap-2.5'>
                <img className="cursor-pointer" src={assets.facebook_icon} alt="facebook_icon" width={35} />
                <img className="cursor-pointer" src={assets.instagram_icon} alt="instagram_icon" width={35} />
            </div>
        </div>
    )
}

export default Footer