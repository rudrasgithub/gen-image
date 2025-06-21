import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Result = () => {

  const { generateImage } = useAppContext();
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)

    const image = await generateImage(input);

    if (image) {
      setIsImageLoaded(true)
      setImage(image)
      toast.success('Image Generated')
    }
    setLoading(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className='flex flex-col max-h-[90vh] items-center'
    >
      <div>
        <div className='relative'>
          <img src={image} alt='' className='rounded max-w-sm' />
          <span className={`absolute left-0 bottom-0 bg-blue-500 h-1 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}></span>
        </div>
        {loading && <p>Loading...</p>}
      </div>
      {!isImageLoaded && <div className='border flex w-full max-w-xl rounded-full p-0.5 mt-10 text-sm bg-neutral-500 text-white'>
        <input
          type='text'
          className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20'
          placeholder='Describe what you want to generate'
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
        />
        <button type='submit' className='px-10 sm:px-16 py-3 rounded-full bg-zinc-900 cursor-pointer'>Generate</button>
      </div>}

      {isImageLoaded &&
        <div className='flex gap-2 flex-wrap justify-center text-sm mt-10 p-0.5'>
          <p onClick={() => setIsImageLoaded(!isImageLoaded)} className='bg-transparent border border-zinc-900 text-black cursor-pointer px-8 py-3 rounded-full'>Generate Another</p>
          <a
            href={image}
            download
            className='bg-zinc-900 px-10 py-3 text-white rounded-full'
          >Download</a>
        </div>}
    </motion.form>
  )
}

export default Result