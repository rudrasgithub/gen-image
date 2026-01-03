import React from 'react'
import { assets, plans } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

const BuyCredit = () => {

  const { user, getBackendUrl, token, setShowLogin, loadCreditData } = useAppContext()

  const navigate = useNavigate()

  const initPay = async (order) => {
    const backendUrl = getBackendUrl();
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verify-razor`, response, {
            headers: { token }
          })

          if (data.success) {
            loadCreditData()
            navigate('/')
            toast.success(`${data.credits} ${data.message}`)
          }
        } catch (err) {
          toast.error(err.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true)
      }

      const backendUrl = getBackendUrl();
      const { data } = await axios.post(`${backendUrl}/api/user/pay-razor`, { planId }, {
        headers: { token }
      })

      if (data.success) {
        initPay(data.order)
      }

    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <motion.div
      className='flex justify-center text-center'
      initial={{ opacity: 0.2, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className='text-center min-h-[80vh] pt-14 mb-10'>
        <h1 className='font-medium text-3xl mb-6 sm:mb-10'>Choose the plan</h1>
        <div className='flex flex-wrap gap-6 text-left'>
          {plans.map((item, index) => (
            <div className='flex flex-col rounded-lg bg-white hover:scale-105 transition-all duration-500 px-8 py-12 text-gray-600 drop-shadow-sm' key={index}>
              <img src={assets.logo_icon} width={40} alt='' />
              <p className='font-semibold mt-3 mb-1'>{item.id}</p>
              <p className='text-sm'>{item.desc}</p>
              <p className='mt-6'><span className='text-3xl font-medium'>${item.price}</span> / {item.credits} credits</p>
              <button onClick={() => paymentRazorpay(item.id)} className='text-white w-full bg-gray-800 mt-8 text-sm rounded-md py-2.5 min-w-52 cursor-pointer'>{user ? 'Purchase' : 'Get Started'}</button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default BuyCredit