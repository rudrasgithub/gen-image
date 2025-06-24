import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
    const navigate = useNavigate();
    const { user, setShowLogin, logout, credit } = useAppContext();

    return (
        <div className='flex items-center justify-between py-4'>
            <Link to={'/'}>
                <img
                    src={assets.logo}
                    alt='logo'
                    className='w-28 sm:32 lg:40'
                />
            </Link>
            <div>
                {user ? <div className='flex items-center gap-2 sm:gap-3'>
                    <button
                        onClick={() => navigate('/buy')}
                        className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'
                    >
                        <img
                            src={assets.credit_star}
                            alt='credit_star'
                            className='w-5'
                        />
                        <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits left: {credit}</p>
                    </button>
                    <p className='text-gray-600 max-sm:hidden pl-4 capitalize'>Hi, {user.name}</p>
                    <div className='relative group'>
                        <img
                            src={assets.profile_icon}
                            alt='profile_icon'
                            className='w-10 drop-shadow-2xl'
                        />
                        <div className='absolute top-0 right-0 hidden group-hover:block z-10 text-black rounded pt-12'>
                            <ul className='bg-white rounded-md p-2 m-0 text-sm list-none'>
                                <li onClick={async () => {
                                    await logout();
                                    navigate('/')
                                }} className='cursor-pointer px-2 py-1 pr-10'>Logout</li>
                            </ul>
                        </div>
                    </div>
                </div>
                    : <div className='flex items-center gap-2 sm:gap-5'>
                        <p className='cursor-pointer' onClick={() => navigate('/buy')}>Pricing</p>
                        <button
                            onClick={() => setShowLogin(true)}
                            className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full cursor-pointer'
                        >
                            Login
                        </button>
                    </div>
                }

            </div>

        </div>
    )
}

export default Navbar