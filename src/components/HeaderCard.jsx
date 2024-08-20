import React from 'react'
import logo from '../assets/logo.png'


const HeaderCard = () => {
  return (
    <header className='flex p-5 justify-between'>
      <h1 className='title text-3xl font-bold flex gap-2'>
        <img src={logo} alt="Logo" className='h-8 w-8'/>
        Stock Grid
      </h1>
      <h2 className='text-xl mt-1'>Made with ❤️ by Kavin Kumar</h2>
    </header>
  )
}

export default HeaderCard;