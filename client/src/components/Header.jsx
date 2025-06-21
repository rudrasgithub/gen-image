import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
import { motion } from "motion/react"

const Header = () => {
    const navigate = useNavigate();
    const { user, setShowLogin } = useAppContext()

    const onClickHandler = async () => {
        if (user) {
            navigate('/result')
        } else {
            setShowLogin(true)
        }
    }

    return (
        <motion.div
            className='flex flex-col items-center justify-center text-center my-20'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <motion.div
                className='text-center text-stone-500 inline-flex items-center gap-2 bg-white border border-neutral-500 px-6 py-1 rounded-full'
                initial={{ opacity: 0.2, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
            >
                <p>Best text to image generator</p>
                <img src={assets.star_icon} alt='star_icon' />
            </motion.div>
            <motion.h1
                className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] text-center mx-auto mt-10'
            >
                Turn text to <span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 2 }}
                    className='text-blue-600'
                >image
                </span>
                , in seconds.
            </motion.h1>
            <motion.p
                className='text-center max-w-xl mx-auto mt-5'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and watch the magic happen.
            </motion.p>

            <motion.button
                onClick={onClickHandler}
                className='flex items-center cursor-pointer gap-2 rounded-full px-12 py-2.5 w-auto bg-black text-white mt-8 sm:text-lg'
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }}
            >
                Generate Images
                <img className='h-6' src={assets.star_group} alt='start_group' />
            </motion.button>

            <motion.div
                className='flex flex-wrap justify-center gap-3 mt-16'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                {Array(6).fill('').map((item, index) => (
                    <motion.img
                        whileHover={{ scale: 1.05, duration: 0.1 }}
                        key={index}
                        className='rounded cursor-pointer hover:scale-105 transition-all duration-300 max-sm:w-10'
                        alt='sample_img_1'
                        src={assets.sample_img_1}
                        width={70}
                    />
                ))}
            </motion.div>
            <motion.p
                className='text-neutral-600 mt-2'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                Generated images from imagify
            </motion.p>

        </motion.div>
    )
}

export default Header