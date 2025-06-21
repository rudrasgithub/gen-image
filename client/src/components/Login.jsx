import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
    const { setUser, setShowLogin, backendUrl, setToken } = useAppContext();

    const [state, setState] = useState('Login')

    const [fullname, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {

            if (state === 'Login') {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, {
                    email,
                    password
                })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, {
                    fullname,
                    email,
                    password
                })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className='fixed top-0 left-0 bottom-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form
                initial={{ opacity: 0.2, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                onSubmit={onSubmitHandler}
                className='relative bg-white p-10 rounded-xl text-slate-500'
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state === 'Login' ? 'Login' : 'Sign Up'}</h1>
                <p className='text-sm'>{state === 'Login' ? 'Welcome back! Please sign in to continue' : 'Please Sign up to continue'}</p>

                {state !== 'Login' && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img width={28} src={assets.profile_icon} alt='profile_icon' />
                    <input
                        className='outline-none text-sm'
                        type='text'
                        placeholder='Full Name'
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>}

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img width={17} src={assets.email_icon} alt='profile_icon' />
                    <input
                        className='outline-none text-sm'
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img width={12} src={assets.lock_icon} alt='profile_icon' />
                    <input
                        type='password'
                        className='outline-none text-sm px-2'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {state === 'Login' && <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forget password?</p>}
                <button
                    type='submit'
                    className={`bg-blue-600 w-full text-white py-2 rounded-full mt-4 cursor-pointer`}
                >{state === 'Login' ? 'Login' : 'Create account'}</button>

                {state === 'Login' && <p className='mt-5 text-center'>Don't have an account? <span onClick={() => setState('SignUp')} className='text-blue-600 cursor-pointer'>Sign Up</span></p>}
                {state !== 'Login' && <p className='mt-5 text-center'>Already have an account? <span onClick={() => setState('Login')} className='text-blue-600 cursor-pointer'>Login</span></p>}

                <img
                    onClick={() => setShowLogin(false)}
                    src={assets.cross_icon}
                    alt='cross_icon'
                    className='absolute top-5 right-5 cursor-pointer'
                />
            </motion.form>
        </div>
    )
}

export default Login